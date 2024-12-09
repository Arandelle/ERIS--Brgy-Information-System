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

const Activities = () => {
  const { data: activity, setData: setActivity } = useFetchData("announcement");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
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
    setTitle("");
    setDescription("");
    setLinks("");
    setImage("");
    setPrevImage("");
    setIsEdit(false); // Indicating that we are adding a new announcement
    setSelectedId(""); // Clear any selected id
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 5 * 1024 * 1024
    ) {
      setImage(file);
      setPrevImage(URL.createObjectURL(file));
    } else {
      toast.error(
        "Invalid file type or size. Please try to upload an image under 5mb"
      );
    }
  };

  const handleAddAnnouncement = async () => {
    const announcementData = {
      title,
      description,
      links,
      image,
    };

    await handleAddData(announcementData, "announcement");

    setTitle("");
    setDescription("");
    setLinks("");
    setDate("");
    setImage("");
    setModal(false);
  };

  const handleEditClick = (announcement) => {
    setModal(true);
    setTitle(announcement.title);
    setDescription(announcement.description);
    setLinks(announcement.links);
    setImage("");
    setPrevImage(announcement.imageUrl);
    setIsEdit(true);
    setSelectedId(announcement.id);
    setShowDetails(false);
  };

  const handleEditAnnouncement = async (id) => {
    const announcementData = {
      title,
      description,
      links,
      image,
    };
    await handleEditData(id, announcementData, "announcement");
    setTitle("");
    setDescription("");
    setLinks("");
    setImage("");
    setModal(false);
  };

  const handleDeleteClick = (id) => {
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
    } catch (error) {
      // If deletion fails, restore the item to the list
      setActivity((prevActivity) => [...prevActivity, itemToDelete]);
      toast.error("Failed to delete item");
    }
    setIsDelete(false);
  };

  const renderRow = (announcement) => {
    return (
      <>
        <td className="px-6 py-4">
          <img
            src={announcement.imageUrl}
            alt="image"
            className="h-12 w-12 rounded-full"
          />
        </td>
        <td className="px-6 py-4 max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
          {announcement.title}
        </td>
        <td className="px-6 py-4 max-w-32 whitespace-nowrap overflow-hidden text-ellipsis">
          {formatDateWithTime(announcement.date)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
          {announcement.description}
        </td>
        <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
          {getTimeDifference(announcement.timestamp)}
        </td>
        <td>
          <div className="flex px-2 space-x-2 flex-row items-center justify-evenly">
            <IconButton
              icon={icons.view}
              color={"blue"}
              bgColor={"bg-blue-100"}
              onClick={() => {
                setShowDetails(!showDetails);
                setSelectedId(announcement.id);
              }}
              tooltip={"View"}
              fontSize={"small"}
            />
            <IconButton
              icon={icons.edit}
              color={"green"}
              bgColor={"bg-green-100"}
              onClick={() => handleEditClick(announcement)}
              tooltip={"Edit"}
              fontSize={"small"}
            />
            <IconButton
              icon={icons.delete}
              color={"red"}
              bgColor={"bg-red-100"}
              onClick={() => handleDeleteClick(announcement.id)}
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
            label={"Emergency Announcement"}
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
                title,
                setTitle,
                prevImage,
                links,
                setLinks,
                description,
                setDescription,
                isEdit,
              }}
            />
          )}
          {isDelete && (
            <QuestionModal
              toggleModal={() => setIsDelete(!isDelete)}
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
              closeButton={() => setShowDetails(!showDetails)}
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
