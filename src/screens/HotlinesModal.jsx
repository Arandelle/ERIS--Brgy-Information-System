import Modal from "../components/ReusableComponents/Modal";
import {InputField, TextArea } from "../components/ReusableComponents/InputField";

const HotlinesModal = ({ handleHotlinesModal }) => {
  return (
    <Modal
      closeButton={handleHotlinesModal}
      title={"Hotlines"}
      children={
        <div className="flex flex-col space-y-4">
          <InputField type="text" placeholder="Name"/>
          <InputField type="text" placeholder="Contact" />
         <TextArea 
          placeholder={"Description"}
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
