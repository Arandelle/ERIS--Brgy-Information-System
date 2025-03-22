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
import AnnouncementModal from "./AnnouncementModal";
import QuestionModal from "../../components/ReusableComponents/AskCard";
import DetailsAnnouncement from "./DetailsAnnouncement";
import usePagination from "../../hooks/usePagination";
import useFilteredData from "../../components/SearchQuery";
import MediaModal from "../MediaModal";
import { auth } from "../../services/firebaseConfig";
import useSearchParam from "../../hooks/useSearchParam";
import useViewMedia from "../../hooks/useViewMedia";
import logAuditTrail from "../../hooks/useAuditTrail";

const Activities = () => {
  const { data: activity, setData: setActivity } = useFetchData("announcement");
  const { searhParams, setSearchParams } = useSearchParam();
  const admin = auth.currentUser;
  const { isModalOpen, currentMedia,mediaType, openModal, closeModal } = useViewMedia();
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

  const searchField = ["title", "description", "links"];

  const filteredData = useFilteredData(activity, searchQuery, searchField);

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
    setPostDetails({});
    setPrevImage("");
    setIsEdit(false); // Indicating that we are adding a new announcement
    setSelectedId(""); // Clear any selected id
    setSearchParams(!modal ? "newAnnouncement" : {}); // clear the url params
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const fileSizeLimit = file.type.startsWith("image/")
      ? 5 * 1024 * 1024
      : 25 * 1024 * 1024;
    if (file.size > fileSizeLimit) {
      toast.warning("File size exceeds the limit.");
      return;
    }
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setPostDetails({
        ...postDetails,
        file: file,
        fileType: file.type.startsWith("image/") ? "image" : "video",
      });
      setPrevImage(URL.createObjectURL(file));
    } else {
      toast.error(
        "Invalid file type or size. Please try to upload an image under 5mb"
      );
    }
  };

  const handleAddAnnouncement = async () => {
    const postData = {
      ...postDetails,
      userId: admin.uid,
    };

    await handleAddData(postData, "announcement");
    await logAuditTrail("Post awareness");
    setPostDetails({});
    setModal(false);
  };

  const handleEditClick = (post) => {
    setSearchParams({ "edit/uid": post.id });
    setModal(true);
    setPostDetails({
      ...postDetails,
      title: post.title,
      description: post.description,
      links: post.links || "",
      fileType: post.fileType || "image"
    });
    setPrevImage(post.fileUrl);
    setIsEdit(true);
    setSelectedId(post.id);
    setShowDetails(false);
  };

  const handleEditAnnouncement = async (id) => {
    const postData = {
      ...postDetails,
      userId: admin.uid,
    };
    await handleEditData(id, postData, "announcement");
    await logAuditTrail("Edit a posted awareness");
    setPostDetails({});
    setModal(false);
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
      await handleDeleteData(selectedId, "announcement");
      await logAuditTrail("Deleted a posted awareness")
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
          <Table
            headers={headerData}
            data={currentItems}
            renderRow={renderRow}
            emptyMessage="No announcement found"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            data={filteredData}
          />
          {modal && (
            <AnnouncementModal
              handleModal={handleModal}
              handleEditAnnouncement={handleEditAnnouncement}
              handleImageChange={handleImageChange}
              handleAddAnnouncement={handleAddAnnouncement}
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
            <MediaModal currentMedia={currentMedia} mediaType={mediaType} closeModal={closeModal} />
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
            <DetailsAnnouncement
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
