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
      title={`${isEdit ? "Edit" : "Create new"} Announcement`}
      children={
        <div className="w-full flex flex-col space-y-4">
          <InputReusable
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTitle(capitalizeFirstLetter(title))}
            className={"w-full"}
          />
          <textarea
            className={`text-sm md:text-lg border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600
        }`}
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setDescription(capitalizeFirstLetter(description))}
          />
          <p className="text-gray-500 text-sm md:text-lg">Links (optional)</p>
          <InputReusable
            type="text"
            placeholder="Links"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            onBlur={() => setLinks(links.toLowerCase())}
            className={"w-full text-blue-400"}
          />
          {/**Upload Photo */}
          <div className="flex flex-col space-y-4">
            {!prevImage ? (
              <label
                className={`cursor-pointer flex item-center justify-center p-6 md:p-9 rounded-md border-2 border-dashed ${
                  isEdit ? "border-green-500" : "border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <icons.addPhoto
                    fontSize="large"
                    className={`${isEdit ? "text-green-500" : "text-gray-500"}`}
                  />
                  <p
                    className={`font-bold text-sm ${
                      isEdit ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    Upload Photo
                  </p>
                </div>

                <InputReusable
                  type="file"
                  className={"hidden"}
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-center p-2 rounded-md w-full">
                {/**Preview Image */}
                <label className="cursor-pointer">
                  <img src={prevImage} className="h-24 md:h-40" />
                  <InputReusable
                    type="file"
                    className={"hidden"}
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
            {/**Buttons */}
            <div className="flex items-center space-x-2 self-end">

              <button
                type="button"
                className={`text-sm text-white py-2 px-4 rounded-md ${isEdit ? "bg-green-500" : "bg-blue-500"}`}
                onClick={
                  isEdit
                    ? () => handleEditAnnouncement(selectedId)
                    : handleAddAnnouncement
                }
              >
                Save
              </button>

              <button
                type="button"
                className="text-sm text-gray-500 py-2 px-4 border border-gray-400 rounded-md"
                onClick={handleModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default AnnouncementModal;
