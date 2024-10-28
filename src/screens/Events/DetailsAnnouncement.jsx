import Modal from "../../components/ReusableComponents/Modal";
import { useFetchData } from "../../hooks/useFetchData";
import { formatDateWithTime } from "../../helper/FormatDate";
import ButtonStyle from "../../components/ReusableComponents/Button";
import icons from "../../assets/icons/Icons";
import { getTimeDifference } from "../../helper/TimeDiff";

const DetailsAnnouncement = ({ closeButton, selectedId, handleEditClick, handleDeleteClick }) => {
  const {data: activity} = useFetchData("announcement");
  const announcementDetails = activity.find(
    (announcement) => announcement.id === selectedId
  );
  return (
    <Modal closeButton={closeButton}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full border-2 border-blue-500 p-0.5">
          <img
            src={announcementDetails?.imageUrl}
            alt="Event"
            className="rounded-full h-20 w-20 lg:h-24 lg:w-24"
          />
        </div>
        <div className="text-sm md:text-md">
          <p className="font-bold text-center">{announcementDetails?.title}</p>
          <p className="text-gray-500 text-center">
            {formatDateWithTime(announcementDetails?.date)}
          </p>
        </div>
      </div>

      <div className="flex flex-row">
        <p className="w-1/3 text-gray-500">Description: </p>
        <p className="flex-1 font-bold">{announcementDetails?.description}</p>
      </div>
      <div className="flex flex-row">
        <p className="w-1/3 text-gray-500">Last Edit: </p>
        <p className="flex-1 font-bold">{getTimeDifference(announcementDetails?.timestamp)}</p>
      </div>

      <div className="space-x-4">
        <ButtonStyle
          label="Edit Post"
          icon={icons.edit}
          color={"green"}
          fontSize={"small"}
          onClick={() => {
            handleEditClick(announcementDetails);
          }}
        />
        <ButtonStyle
          icon={icons.delete}
          fontSize={"small"}
          label={"Delete Post"}
          color={"red"}
          onClick={() => {
            handleDeleteClick(announcementDetails.id);
          }}
        />
      </div>
    </Modal>
  );
};

export default DetailsAnnouncement;
