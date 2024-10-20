import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import InputReusable from "../../components/ReusableComponents/InputReusable";
import BtnReusable from "../../components/ReusableComponents/Button";
import HeadSide from "../../components/ReusableComponents/HeaderSidebar";
import {
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  get,
  update,
} from "firebase/database";
import { database, storage } from "../../services/firebaseConfig";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import Table from "../../components/Table";
import { formatDateWithTime } from "../../helper/FormatDate";
import { getTimeDifference } from "../../helper/TimeDiff";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";
import Toolbar from "../../components/ToolBar";
import icons from "../../assets/icons/Icons";
import IconButton from "../../components/ReusableComponents/IconButton";
import ButtonStyle from "../../components/ReusableComponents/Button";

const Activities = () => {
  const [activity, setActivity] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const announcementRef = ref(database, `announcement`);
    const unsubscribe = onValue(announcementRef, (snapshot) => {
      try {
        const announcementData = snapshot.val();
        const announcementList = Object.keys(announcementData).map((key) => ({
          id: key,
          ...announcementData[key],
        }));
        setActivity(announcementList);
      } catch (error) {
        console.log("Error: ", error);
      }
    });

    return () => unsubscribe();
  }, []);

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
    if (!title || !description) {
      toast.info("Please complete the form");
      return;
    }
    let imageUrl = "";

    if (image) {
      const imageFile = image;
      const imageRef = storageRef(
        storage,
        `announcement-images/${imageFile.name}`
      );

      try {
        // upload image to firabase storage
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error uploading image: ", error);
        toast.error(`Error uploading image: ${error}`);
        return;
      }
    }

    const addAnnouncement = {
      title,
      description,
      imageUrl,
      date: new Date().toISOString(),
      isEdited: false,
      timestamp: serverTimestamp(), // Add a timestamp
    };

    const announcementRef = ref(database, `announcement`);

    try {
      await push(announcementRef, addAnnouncement);
      toast.success("Submmited successfully!");
    } catch (error) {
      console.error("Error :", error);
    }

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

  const handleDelete = async (id) => {
    // Reference to the announcement in the Realtime Database
    const announcementRef = ref(database, `announcement/${id}`);

    try {
      if (id) {
        // First, fetch the announcement data to get the image path
        const snapshot = await get(announcementRef);
        if (snapshot.exists()) {
          const announcementData = snapshot.val();

          // Assuming the image path is stored under announcementData.imageUrl
          const imagePath = announcementData.imageUrl;

          // Remove the announcement from Realtime Database
          await remove(announcementRef);

          // If there is an image associated with the announcement, remove it from Firebase Storage
          if (imagePath) {
            const imageRef = storageRef(storage, imagePath); // Reference to the image in Firebase Storage
            await deleteObject(imageRef); // Delete the image from Firebase Storage
          }

          toast.success("Announcement and image successfully removed");
        }
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  const handleEditClick = (announcement) => {
    setModal(true);
    setTitle(announcement.title);
    setDescription(announcement.description);
    setImage("");
    setIsEdit(true);
    setSelectedId(announcement.id);
  };

  const handleEditAnnouncement = async (id) => {
    if (!title || !description) {
      toast.info("Please complete the form");
      return;
    }

    const announcementRef = ref(database, `announcement/${id}`);

    try {
      // Fetch  existing announcement data
      const snapshot = await get(announcementRef);

      if (snapshot.exists()) {
        const announcementData = snapshot.val();
        let imageUrl = announcementData.imageUrl; // retain the existing image url

        //check if new image is selected
        if (image) {
          const imageFile = image;
          const imageRef = storageRef(
            storage,
            `announcement-images/${imageFile.name}`
          );

          //upload the new image
          try {
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);

            if (announcementData.imageUrl) {
              const oldImageRef = storageRef(
                storage,
                announcementData.imageUrl
              );
              await deleteObject(oldImageRef);
            }
          } catch (error) {
            toast.error(`Error uploading new image: ${error}`);
            return;
          }
        }

        const updatedAnnouncement = {
          title,
          description,
          imageUrl,
          isEdited: true,
          timestamp: serverTimestamp(),
        };

        await update(announcementRef, updatedAnnouncement);

        toast.success("Announcement update successfully");

        setTitle("");
        setDescription("");
        setImage("");
        setModal(false);
      } else {
        toast.error("Announcement not found");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
    }
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
              onClick={() => handleDelete(announcement.id)}
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
