import { useState } from "react";
import { toast } from "sonner";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import Table from "../../components/Table";
import { formatDateWithTime } from "../../helper/FormatDate";
import { getTimeDifference } from "../../helper/TimeDiff";
import Toolbar from "../../components/ToolBar";
import icons from "../../assets/icons/Icons";
import IconButton from "../../components/ReusableComponents/IconButton";
import ButtonStyle from "../../components/ReusableComponents/Button";
import Pagination from "../../components/Pagination";
import { useFetchData } from "../../hooks/useFetchData";
import handleAddData from "../../hooks/handleAddData";
import handleDeleteData from "../../hooks/handleDeleteData";
import handleEditData from "../../hooks/handleEditData";
import AwarenessModal from "./AwarenessModal";
import QuestionModal from "../../components/ReusableComponents/AskCard";
import AwarenessDetails from "./AwarenessDetails";
import usePagination from "../../hooks/usePagination";
import useFilteredData from "../../hooks/useFilteredData";
import MediaModal from "../MediaModal";
import { auth } from "../../services/firebaseConfig";
import useSearchParam from "../../hooks/useSearchParam";
import useViewMedia from "../../hooks/useViewMedia";
import logAuditTrail from "../../hooks/useAuditTrail";
import { generateUniqueBarangayID } from "../../helper/generateID";
import useDebounce from "../../hooks/useDebounce";
import RenderDebounceLoading from "../../components/ReusableComponents/RenderDebounceLoading";

const Activities = () => {
  const { data: activity, setData: setActivity } = useFetchData("awareness");
  const { searchParams, setSearchParams } = useSearchParam();
  const admin = auth.currentUser;
  const { isModalOpen, currentMedia, mediaType, openModal, closeModal } =
    useViewMedia();
  const [postDetails, setPostDetails] = useState({
    title: "",
    description: "",
    links: "",
    date: "",
    file: null,
    fileType: null,
  });
  const [prevImage, setPrevImage] = useState("");
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const {debounceValue, debounceLoading} = useDebounce(searchQuery, 500); // delay for search output
  const searchField = ["title", "description", "links"];

  const filteredData = useFilteredData(activity, debounceValue, searchField);

  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
  } = usePagination(filteredData);

  const headerData = [
    "File",
    "Title",
    "Date",
    "Description",
    "Last Post/Edit",
    "Action",
  ];

  const handleModal = () => {
    setModal(!modal);

    // Properly reset postDetails to initial state
    setPostDetails({
      title: "",
      description: "",
      links: "",
      date: "",
      file: null,
      fileType: null,
    });

    setPrevImage("");
    setIsEdit(false);
    setSelectedId("");
    setSearchParams(!modal ? "new_awareness" : {});
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Validate file type first
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  
  if (!isImage && !isVideo) {
    toast.error("Invalid file type. Please upload an image or video.");
    return;
  }

  // Check file size based on type
  const fileSizeLimit = isImage ? 5 * 1024 * 1024 : 25 * 1024 * 1024;
  if (file.size > fileSizeLimit) {
    const limitText = isImage ? "5MB" : "25MB";
    toast.warning(`File size exceeds the ${limitText} limit.`);
    return;
  }

  // Update postDetails with new file
  setPostDetails({
    ...postDetails,
    file: file,
    fileType: isImage ? "image" : "video",
  });
  
  setPrevImage(URL.createObjectURL(file));
};

  const handleAddAwareness = async () => {
    setLoading(true);
    try {
      const customId = await generateUniqueBarangayID("awareness");
      const postData = {
        ...postDetails,
        userId: admin.uid,
        customId,
      };

      const newDocId = await handleAddData(postData, "awareness"); // get the new Id

      if (newDocId) {
        await logAuditTrail("Post awareness", newDocId);
      }

      setPostDetails({});
      setModal(false);
    } catch (error) {
      toast.warning(`Failed to post awareness ${error}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setSearchParams({ "edit/uid": post.id });
    setModal(true);

    // Don't spread postDetails - create a fresh object
    setPostDetails({
      title: post.title,
      description: post.description,
      links: post.links || "",
      date: post.date || "",
      file: null, // Explicitly set to null
      fileType: post.fileType || null, // Don't default to "image" if there's no file
    });

    // Set preview image to existing image URL or empty string
    setPrevImage(post.fileUrl || "");
    setIsEdit(true);
    setSelectedId(post.id);
    setShowDetails(false);
  };

  const handleEditAwareness = async (id) => {
    setLoading(true);
    try {
      const postData = {
        ...postDetails,
        userId: admin.uid,
      };
      await handleEditData(id, postData, "awareness");
      await logAuditTrail("Edit a posted awareness", id);
      setPostDetails({});
      setModal(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSearchParams({ delete: id });
    setSelectedId(id);
    setIsDelete(!isDelete);
    setShowDetails(false);
  };

  const handleConfirmDelete = async () => {
    const itemToDelete = activity.find((item) => item.id === selectedId);

    // Optimistically remove the item from local state
    setActivity((prevActivity) =>
      prevActivity.filter((item) => item.id !== selectedId)
    );

    try {
      await handleDeleteData(selectedId, "awareness");
      await logAuditTrail("Deleted a posted awareness", selectedId);
    } catch (error) {
      // If deletion fails, restore the item to the list
      setActivity((prevActivity) => [...prevActivity, itemToDelete]);
      toast.error("Failed to delete item");
    }
    setIsDelete(false);
  };

  const TableData = ({ data }) => {
    return (
      <td className="px-6 py-4 max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
        {data}
      </td>
    );
  };

  const renderRow = (post) => {
    return (
      <>
        <td className="px-6 py-4 flex">
          <div className="flex-shrink-0">
            {post.fileType === "image" && (
              <img
                src={post.fileUrl}
                alt="image"
                className="h-8 w-8 md:h-12 md:w-12 rounded-full cursor-pointer"
                onClick={() => {
                  openModal(post.fileUrl, "image");
                }}
              />
            )}
            {post.fileType === "video" && (
              <div
                className="relative h-8 w-8 md:h-12 md:w-12 cursor-pointer"
                onClick={() => openModal(post.fileUrl, "video")}
              >
                <video
                  src={post.fileUrl}
                  className="h-full w-full object-cover rounded-full"
                  poster="https://via.placeholder.com/150" // Use a placeholder or extract a frame
                  muted
                ></video>

                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-800"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </td>
        <TableData data={post.title} />
        <TableData data={formatDateWithTime(post.date)} />
        <TableData data={post.description} />
        <TableData data={getTimeDifference(post.timestamp)} />
        <td>
          <div className="flex px-2 space-x-4 flex-row items-center justify-center">
            <IconButton
              icon={icons.view}
              color={"blue"}
              onClick={() => {
                setShowDetails(!showDetails);
                setSelectedId(post.id);
                setSearchParams({ "Details/uid": post.id });
              }}
              tooltip={"View"}
              fontSize={"small"}
            />
            <IconButton
              icon={icons.edit}
              color={"green"}
              onClick={() => handleEditClick(post)}
              tooltip={"Edit"}
              fontSize={"small"}
            />
            <IconButton
              icon={icons.delete}
              color={"red"}
              onClick={() => handleDeleteClick(post.id)}
              tooltip={"Delete"}
              fontSize={"small"}
            />
          </div>
        </td>
      </>
    );
  };

  if (loading) {
    return (
      <HeaderAndSideBar
        content={
          <div className="flex items-center text-gray-500 justify-center h-svh">
            Loading please wait...
          </div>
        }
      />
    );
  }
  return (
    <HeaderAndSideBar
      content={
        <>
          <Toolbar
            buttons={
              <>
                <ButtonStyle
                  label="Add new"
                  color="gray"
                  icon={icons.addCircle}
                  fontSize="small"
                  onClick={handleModal}
                />
              </>
            }
            label={"Emergency Awareness"}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {/** show the loading when searching */}
           {debounceLoading ? (
            <RenderDebounceLoading />
          ) : (
            <Table
            headers={headerData}
            data={currentItems}
            renderRow={renderRow}
            emptyMessage={`No post awareness found`}
          />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData}
          />
          {modal && (
            <AwarenessModal
              handleModal={handleModal}
              handleEditAwareness={handleEditAwareness}
              handleImageChange={handleImageChange}
              handleAddAwareness={handleAddAwareness}
              {...{
                selectedId,
                postDetails,
                setPostDetails,
                prevImage,
                isEdit,
              }}
            />
          )}

          {isModalOpen && (
            <MediaModal
              currentMedia={currentMedia}
              mediaType={mediaType}
              closeModal={closeModal}
            />
          )}

          {isDelete && (
            <QuestionModal
              toggleModal={() => {
                setIsDelete(!isDelete), setSearchParams({});
              }}
              question={
                <span>
                  Do you want to delete
                  <span className="text-primary-500 text-bold">
                    {" "}
                    {activity.find((item) => item.id === selectedId)?.title}
                  </span>{" "}
                  ?{" "}
                </span>
              }
              confirmText={"Delete"}
              onConfirm={handleConfirmDelete}
            />
          )}
          {showDetails && (
            <AwarenessDetails
              closeButton={() => {
                setShowDetails(!showDetails), setSearchParams({});
              }}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              selectedId={selectedId}
            />
          )}
        </>
      }
    />
  );
};

export default Activities;
