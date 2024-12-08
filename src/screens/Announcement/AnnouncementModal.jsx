import icons from "../../assets/icons/Icons";
import InputReusable from "../../components/ReusableComponents/InputReusable";
import ButtonStyle from "../../components/ReusableComponents/Button";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";

const AnnouncementModal = (
 { handleModal,
  handleEditAnnouncement,
  handleImageChange,
  handleAddAnnouncement,
  selectedId,
  title,
  setTitle,
  links,
  setLinks,
  description,
  setDescription,
  isEdit
}
) => {
  return (
    <div className="fixed flex items-center justify-center inset-0 z-50">
      <div
        className="fixed h-full w-full bg-gray-600 bg-opacity-50"
        onClick={handleModal}
      ></div>
      <div className="relative bg-white  shadow-md">
      <div className="flex flex-row items-center justify-between">
          
          <h3 className="ml-4 text-gray-600">
                {isEdit ? "Edit" : "Add new"} Announcement
              </h3>
            <button
              type="button"
              onClick={handleModal}
              className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-gray-900 text-sm w-7 h-7 md:w-8 md:h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
            >
              <icons.close fontSize="small" />
              <span className="sr-only">Close modal</span>
            </button>
  
          </div>
        <div className="w-full flex flex-col pt-4 space-y-4 p-4">
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
          <div className="flex flex-row">
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
  );
};

export default AnnouncementModal;
