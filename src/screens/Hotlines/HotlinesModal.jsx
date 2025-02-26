import Modal from "../../components/ReusableComponents/Modal";
import {
  InputField,
  TextArea,
} from "../../components/ReusableComponents/InputField";
import { useEffect, useState } from "react";

const HotlinesModal = ({
  handleHotlinesModal,
  handleAddHotlines,
  handleUpdateHotlines,
  isEdit,
  selectedId,
  hotlineState,
  setHotlinesState,
}) => {

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const {organization, name, contact, email, description} = hotlineState;
    const completeData = organization && name && (contact || email) && description;
    setIsComplete(completeData);
  }, [hotlineState.category, hotlineState.organization, hotlineState.name, hotlineState.contact, hotlineState.email, hotlineState.description]);

  return (
    <Modal
      closeButton={handleHotlinesModal}
      title={"Hotlines Number and Contact"}
      children={
        <div className="flex flex-col space-y-4 max-w-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300 italic">Regularly review and update contact information to ensure its accuracy.
        Ensure that any personal information added complies with relevant privacy policies and regulations.</p>
        <select className="w-full text-gray-600 p-2 border border-gray-300 rounded-md cursor-pointer"
        value={hotlineState.category}
        onChange={(e) => setHotlinesState(prev => ({...prev, category: e.target.value}))}
        >
          <option value="" disabled>Select Category</option>
          <option value="fire">Fire</option>
          <option value="medical">Medical</option>
          <option value="crime">Crime</option>
          <option value="natural disaster">Natural Disaster</option>
          <option value="other">Other</option>
        </select>
         <InputField
            type="text"
            placeholder="Organizations"
            value={hotlineState.organization}
            onChange={(e) => setHotlinesState(prev => ({...prev, organization: e.target.value}))}
          />
          <InputField
            type="text"
            placeholder="Name"
            value={hotlineState.name}
            onChange={(e) => setHotlinesState(prev => ({...prev, name: e.target.value}))}
          />
          <InputField type="number" placeholder="Contact" 
            value={hotlineState.contact}
            onChange={(e) => setHotlinesState(prev => ({...prev, contact: e.target.value}))}
          />
          <InputField type="email" placeholder="Email (Optional)  " 
            value={hotlineState.email}
            onChange={(e) => setHotlinesState(prev => ({...prev, email: e.target.value}))}
          />
          <TextArea placeholder={"Description"} value={hotlineState.description}
            onChange={(e) => setHotlinesState(prev => ({...prev, description: e.target.value}))}
          />
          {/**Buttons */}
          <div className="flex items-center space-x-2 self-end">
            <button
              type="button"
              className={`text-sm text-white py-2 px-4 rounded-md ${!isComplete ? "bg-gray-500 cursor-not-allowed" : isEdit ?  "bg-green-500" : "bg-blue-500" }`}
              onClick={isEdit ? () => handleUpdateHotlines(selectedId) : handleAddHotlines}
              disabled={!isComplete}
            >
              Save
            </button>

            <button
              type="button"
              className="text-sm text-gray-500 dark:text-gray-300 py-2 px-4 border border-gray-400 rounded-md"
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
