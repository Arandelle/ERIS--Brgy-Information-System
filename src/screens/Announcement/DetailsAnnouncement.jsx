import Modal from "../../components/ReusableComponents/Modal";
import { useFetchData } from "../../hooks/useFetchData";
import ButtonStyle from "../../components/ReusableComponents/Button";
import icons from "../../assets/icons/Icons";
import { getTimeDifference } from "../../helper/TimeDiff";
import useImageView from "../../hooks/useImageView";
import ViewImage from "../ViewImage";
import { formatDateWithTime } from "../../helper/FormatDate";

const DetailsAnnouncement = ({
  closeButton,
  selectedId,
  handleEditClick,
  handleDeleteClick,
}) => {
  const { isModalOpen, currentImage, openModal, closeModal } = useImageView();
  const { data: activity } = useFetchData("announcement");
  const announcementDetails = activity.find(
    (announcement) => announcement.id === selectedId
  );

  const DetailRow = ({ label, value, isLink, isImage }) => {
    return (
      <div className="flex flex-row max-w-lg">
        <p className="flex-1 basis-1/4">{label}: </p>

        {isLink ? (
          <a className="flex-1 basis-3/4 text-blue-500" href={value}>
            {announcementDetails?.title} <icons.view />
          </a>
        ) : isImage ? (
          <p
            className="flex-1 basis-3/4 cursor-pointer bg-gray-100 p-2 rounded-md shadow-md"
            onClick={() => openModal(announcementDetails?.imageUrl)}
          >
            {`${announcementDetails?.title}.jpg`}
          </p>
        ) : (
          <p className="flex-1 basis-3/4">{value}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <Modal closeButton={closeButton} title={"Post Details"}>
        <DetailRow
          label={"Image"}
          value={announcementDetails?.description}
          isImage
        />
        <DetailRow
          label={"Description"}
          value={announcementDetails?.description}
        />
        <DetailRow
          label={"Date"}
          value={formatDateWithTime(announcementDetails?.date)}
        />
        <DetailRow label={"Links"} value={announcementDetails?.links} isLink />
  
        <DetailRow
          label={"Last Edit"}
          value={getTimeDifference(announcementDetails?.timestamp)}
        />
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
      {isModalOpen && (
        <ViewImage 
          currentImage={currentImage}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default DetailsAnnouncement;
