import icons from "../../assets/icons/Icons";
import {
  TextArea,
  InputField,
} from "../../components/ReusableComponents/InputField";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";
import Modal from "../../components/ReusableComponents/Modal";
import { useEffect, useState } from "react";

const AnnouncementModal = ({
  handleModal,
  handleEditAnnouncement,
  handleImageChange,
  handleAddAnnouncement,
  selectedId,
  postDetails,
  setPostDetails,
  prevImage,
  isEdit,
}) => {
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    const {title, description} = postDetails;
    const completeData = title && description;
    setIsComplete(completeData);
  }, [postDetails.title, postDetails.description]);

  console.log("preview", prevImage)

  return (
    <Modal
      closeButton={handleModal}
      title={`${isEdit ? "Edit" : "Create new"} Announcement`}
      children={
        <div className="flex flex-col space-y-4 max-w-lg">
           <p className="text-sm text-gray-600 dark:text-gray-300 italic">Post accurate emergency response tips to ensure community safety and preparedness. Post awareness updates and news regularly to keep everyone informed about potential hazards and safety protocols.</p>
          <InputField
            type="text"
            placeholder="Title"
            value={postDetails.title}
            onChange={(e) => setPostDetails({...postDetails, title: e.target.value})}
            onBlur={() => setPostDetails({...postDetails, title: capitalizeFirstLetter(postDetails.title)})}
            className={"w-full"}
          />
          <TextArea
            value={postDetails.description}
            placeholder={"Description"}
            onChange={(e) => setPostDetails({...postDetails, description: e.target.value})}
            onBlur={() => setPostDetails({...postDetails, description: capitalizeFirstLetter(postDetails.description)})}
          />

          <label className="text-gray-500 dark:text-gray-300 text-sm">Links (optional)</label>
          <InputField
            type="text"
            placeholder="Links"
            value={postDetails.links}
            onChange={(e) => setPostDetails({...postDetails, links: e.target.value})}
            onBlur={() => setPostDetails({...postDetails, links: postDetails.links.toLowerCase()})}
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
                    Upload Media
                  </p>
                </div>

                <InputField
                  type="file"
                  className={"hidden"}
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-center p-2 rounded-md w-full">
                {/**Preview Image */}
                <label className="cursor-pointer">
                {prevImage && postDetails.fileType === "image" && (
                  <img src={prevImage} className="h-24 md:h-40" />
                )}

                {prevImage && postDetails.fileType === "video" && (
                  <>
                 <label className="cursor-pointer">
                 <p className="bg-green-500 text-white p-2 text-center rounded-md">Upload new media</p>
                    <InputField
                      type="file"
                      className={"hidden"}
                      onChange={handleImageChange}
                    />
                 </label>
                    <video controls width={500} className="mt-2">
                      <source src={prevImage}/>
                    </video>
                  </>
                )}
                  
                  <InputField
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
                className={`text-sm text-white py-2 px-4 rounded-md ${!isComplete ? "bg-gray-500 cursor-not-allowed" :
                  isEdit ? "bg-green-500" : "bg-blue-500"
                }`}
                onClick={
                  isEdit
                    ? () => handleEditAnnouncement(selectedId)
                    : handleAddAnnouncement
                }
                disabled={!isComplete}
              >
                Save
              </button>

              <button
                type="button"
                className="text-sm text-gray-500 dark:text-gray-300 py-2 px-4 border border-gray-400 rounded-md"
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
