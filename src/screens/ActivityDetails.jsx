import { formatDate } from "../helper/FormatDate";
import ButtonStyle from "../components/ReusableComponents/Button";
import icons from "../assets/icons/Icons";
import Modal from "../components/ReusableComponents/Modal";
import { getTimeDifference } from "../helper/TimeDiff";

const ActivityDetails = ({
  handleCloseDetailModal,
  handleAddEventModal,
  toggleDeleteModal,
  selectedEvent,
}) => {
  return (
    <Modal closeButton={handleCloseDetailModal}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full border-2 border-blue-500 p-0.5">
          <img
            src={selectedEvent?.image}
            alt="Event"
            className="rounded-full h-20 w-20 lg:h-24 lg:w-24"
          />
        </div>
        <div className="text-sm md:text-md">
          <p className="font-bold text-center">{selectedEvent?.title}</p>
          <p className="text-gray-500 text-center">
            {formatDate(selectedEvent?.start)} -{" "}
            {formatDate(selectedEvent?.end)}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm md:text-md">
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
        <div className="flex flex-row">
          <p className="w-1/3 text-gray-500">Last Edit: </p>
          <p className="flex-1 font-bold"> {getTimeDifference(selectedEvent?.timestamp)}</p>
        </div>
      </div>

      <div className="space-x-4">
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
          onClick={() => {
            toggleDeleteModal(selectedEvent.id);
            handleCloseDetailModal();
          }}
        />
      </div>
    </Modal>
  );
};

export default ActivityDetails;
