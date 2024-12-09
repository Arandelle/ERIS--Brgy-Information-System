import Modal from "../components/ReusableComponents/Modal";
import InputReusable from "../components/ReusableComponents/InputReusable";

const HotlinesModal = ({ handleHotlinesModal }) => {
  return (
    <Modal
      closeButton={handleHotlinesModal}
      title={"Hotlines"}
      children={
        <div className="flex flex-col space-y-4">
          <InputReusable type="text" placeholder="Name" />
          <InputReusable type="text" placeholder="Contact" />
          <textarea
            className={`text-sm md:text-lg border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400 focus:border-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600
        }`}
            placeholder="Description"
          />
          {/**Buttons */}
          <div className="flex items-center space-x-2 self-end">
            <button
              type="button"
              className={`text-sm text-white py-2 px-4 rounded-md bg-blue-500`}
            >
              Save
            </button>

            <button
              type="button"
              className="text-sm text-gray-500 py-2 px-4 border border-gray-400 rounded-md"
              onClick={handleHotlinesModal}
            >
              Cancel
            </button>
          </div>
        </div>
      }
    />
  );
};

export default HotlinesModal;
