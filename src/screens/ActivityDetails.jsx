import { formatDate } from "../helper/FormatDate";
import ButtonStyle from "../components/ReusableComponents/Button";
import icons from "../assets/icons/Icons";

const ActivityDetails = ({
  handleCloseDetailModal,
  handleAddEventModal,
  toggleDeleteModal,
  selectedEvent,
}) => {
  return (
    <div className="flex fixed items-center justify-center inset-0 z-50">
      <div
        className="fixed items-center justify-center h-full w-full bg-gray-600 bg-opacity-50"
        onClick={handleCloseDetailModal}
      ></div>
      <div className="relative space-y-4 p-5 w-1/3 bg-white rounded-md shadow-md">
        <button
          type="button"
          onClick={handleCloseDetailModal}
          className="text-gray-400 bg-transparent absolute top-0 right-0 hover:bg-red-400 hover:text-gray-900 text-sm w-7 h-7 md:w-8 md:h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="popup-modal"
        >
          <icons.close fontSize="small" />
          <span className="sr-only">Close modal</span>
        </button>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full border-2 border-blue-500 p-0.5">
            <img
              src={selectedEvent?.image}
              alt="Event"
              className="rounded-full h-24 w-24"
            />
          </div>
         <div>
              <p className="font-bold text-center">{selectedEvent?.title}</p>
              <p className="text-gray-500 text-center">{formatDate(selectedEvent?.start)} - {formatDate(selectedEvent?.end)}</p>
         </div>
        </div>

       <div className="space-y-2">
            <div className="flex flex-row">
                <p className="w-1/3 text-gray-500">Location: </p>
                <p className="flex-1 font-bold">{selectedEvent?.location}</p>
            </div>
            <div className="flex flex-row">
                <p className="w-1/3 text-gray-500">Organizer: </p>
                <p className="flex-1 font-bold">{selectedEvent?.organizer}</p>
            </div>
            <div className="flex flex-row">
                <p className="w-1/3 text-gray-500">Details: </p>
                <p className="flex-1 font-bold"> {selectedEvent?.details}</p>
            </div> 
       </div>

        <div className="flex justify-around p-2">
          <ButtonStyle
            label="Edit Event"
            icon={icons.edit}
            color={"green"}
            fontSize={"small"}
            onClick={() => {
              handleAddEventModal(selectedEvent);
            }}
          />
          <ButtonStyle
            icon={icons.delete}
            fontSize={"small"}
            label={"Delete Event"}
            color={"red"}
            onClick={() => {toggleDeleteModal(selectedEvent.id);
            handleCloseDetailModal()}}
          />
        </div>

      </div>
    </div>
  );
};

export default ActivityDetails;
