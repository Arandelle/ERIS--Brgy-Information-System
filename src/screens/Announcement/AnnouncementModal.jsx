import icons from "../../assets/icons/Icons";
import InputReusable from "../../components/ReusableComponents/InputReusable";
import ButtonStyle from "../../components/ReusableComponents/Button";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";
import Modal from "../../components/ReusableComponents/Modal";
import { useState } from "react";

const AnnouncementModal = ({
  handleModal,
  handleEditAnnouncement,
  handleImageChange,
  handleAddAnnouncement,
  selectedId,
  title,
  setTitle,
  prevImage,
  links,
  setLinks,
  description,
  setDescription,
  isEdit,
}) => {
  return (
    <Modal
      closeButton={handleModal}
      children={
        <div className="w-full flex flex-col pt-4 space-y-4">
          <h2 className="text-center text-lg font-extrabold text-gray-700">
            {`${isEdit ? "Edit" : "Create new"}`} Announcement
          </h2>
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
            onBlur={() => setDescription(capitalizeFirstLetter(description))}
          />
          <p className="text-gray-500">Links (optional)</p>
          <InputReusable
            type="text"
            placeholder="Links"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            onBlur={() => setLinks(links.toLowerCase())}
            className={"w-full text-blue-400"}
          />
          <div className="flex flex-col space-y-4">
            <label className={`cursor-pointer flex item-center justify-center p-3 rounded-md border-2 border-dashed ${isEdit ? "border-green-500" : "border-blue-500"}`}>
              <p className={`font-bold text-sm ${isEdit ? "text-green-500" : "text-blue-500"}`}> Upload Photo</p>
              <InputReusable
                type="file"
                className={"hidden"}
                onChange={handleImageChange}
              />
            </label>
            {prevImage && (
              <div className="flex items-center justify-center p-2 rounded-md w-full">
              <img src={prevImage} className="h-40"/>
           </div>
            )}
            <p className="flex items-center">
              <ButtonStyle
                label={`${
                  isEdit ? "Update Announcement" : "Create Announcement"
                }`}
                color={`${isEdit ? "green" : "blue"}`}
                onClick={
                  isEdit
                    ? () => handleEditAnnouncement(selectedId)
                    : handleAddAnnouncement
                }
                icon={icons.publish}
                fontSize={"medium"}
              />
            </p>
          </div>
        </div>
      }
    />
  );
};

export default AnnouncementModal;
