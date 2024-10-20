import { useState } from "react";
import { toast } from "sonner";
import InputReusable from "../../components/ReusableComponents/InputReusable";
import HeadSide from "../../components/ReusableComponents/HeaderSidebar";
import Table from "../../components/Table";
import { formatDateWithTime } from "../../helper/FormatDate";
import { getTimeDifference } from "../../helper/TimeDiff";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";
import Toolbar from "../../components/ToolBar";
import icons from "../../assets/icons/Icons";
import IconButton from "../../components/ReusableComponents/IconButton";
import ButtonStyle from "../../components/ReusableComponents/Button";
import Pagination from "../../components/Pagination";
import useFetchActivity from "../../hooks/useFetchActivity";
import handleAddData from "../../hooks/handleAddData";
import handleDeleteData from "../../hooks/handleDeleteData";
import handleEditData from "../../hooks/handleEditData";

const Activities = () => {
  const {activity} = useFetchActivity("announcement")
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const handleModal = (isEditMode = false) => {
    setModal(!modal);

    if (!isEditMode) {
      setTitle("");
      setDescription("");
      setImage("");
      setIsEdit(false); // Indicating that we are adding a new announcement
      setSelectedId(""); // Clear any selected id
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
    }
  };

  const handleAddAnnouncement = async () => {

    const announcementData = {
      title,
      description,
      image,
    }

    await handleAddData(announcementData, "announcement");

    setTitle("");
    setDescription("");
    setDate("");
    setImage("");
    setModal(false);
  };

  const headerData = [
    "File",
    "Title",
    "Date",
    "Description",
    "Last Post/Edit",
    "Action",
  ];

  const handleEditClick = (announcement) => {
    setModal(true);
    setTitle(announcement.title);
    setDescription(announcement.description);
    setImage("");
    setIsEdit(true);
    setSelectedId(announcement.id);
  };

  const handleEditAnnouncement = async (id) => {
    const announcementData = {
      title,
      description,
      image,
    }
      await handleEditData(id,"announcement", announcementData);
       setTitle("");
        setDescription("");
        setImage("");
        setModal(false);
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
              icon={icons.delete}
              color={"red"}
              bgColor={"bg-red-100"}
              onClick={() => handleDeleteData(announcement.id, "announcement")}
              tooltip={"Delete"}
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
              icon={icons.view}
              color={"blue"}
              bgColor={"bg-blue-100"}
              onClick={() => toast.info("This is view")}
              tooltip={"View"}
              fontSize={"small"}
            />
          </div>
        </td>
      </>
    );
  };

  return (
    <HeadSide
      child={
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
          />
          <Table
            headers={headerData}
            data={activity}
            renderRow={renderRow}
            emptyMessage="No announcement found"
          />
          <Pagination />

          {modal && (
            <div className="fixed flex items-center justify-center inset-0 z-50">
              <div
                className="fixed h-full w-full bg-gray-600 bg-opacity-50"
                onClick={handleModal}
              ></div>
              <div className="relative p-5 bg-white rounded-md shadow-md">
                <button
                  type="button"
                  onClick={handleModal}
                  className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-7 h-7 md:w-8 md:h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                >
                  <icons.close fontSize="small" />
                  <span className="sr-only">Close modal</span>
                </button>

                <div className="w-full flex flex-col pt-4 space-y-2">
                  <h3 className=" text-gray-600 text-center pb-2">
                    Add new announcement
                  </h3>
                  <InputReusable
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setTitle(capitalizeFirstLetter(title))}
                    className={"w-full"}
                  />
                  <textarea
                    className={`border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600
            }`}
                    value={description}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() =>
                      setDescription(capitalizeFirstLetter(description))
                    }
                  />
                  <div className="flex flex-row py-2">
                    <InputReusable type="file" onChange={handleImageChange} />
                    <p className="flex items-center">
                      <ButtonStyle
                        label={"Submit"}
                        color={"blue"}
                        onClick={
                          isEdit
                            ? () => handleEditAnnouncement(selectedId)
                            : handleAddAnnouncement
                        }
                        icon={icons.publish}
                        fontSize={"small"}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  );
};

export default Activities;
