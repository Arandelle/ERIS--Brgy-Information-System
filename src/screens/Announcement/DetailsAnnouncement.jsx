import { useState } from "react";
import Modal from "../../components/ReusableComponents/Modal";
import { useFetchData } from "../../hooks/useFetchData";
import ButtonStyle from "../../components/ReusableComponents/Button";
import icons from "../../assets/icons/Icons";
import { getTimeDifference } from "../../helper/TimeDiff";
import MediaModal from "../MediaModal";
import { formatDateWithTime } from "../../helper/FormatDate";
import useViewMedia from "../../hooks/useViewMedia";

const DetailsAnnouncement = ({
  closeButton,
  selectedId,
  handleEditClick,
  handleDeleteClick,
}) => {
  const { isModalOpen, currentMedia,mediaType, openModal, closeModal } = useViewMedia();
  const { data: activity } = useFetchData("announcement");
  const announcementDetails = activity.find(
    (announcement) => announcement.id === selectedId
  );

  const DetailRow = ({ label, value, isLink, isImage }) => {
  const [showMore, setShowMore] = useState(false);
  const maxLength = 150; // max characters to show before truncating

  const toggleShowMore = () => setShowMore((prev) => !prev);

  return (
    <div className="flex flex-col max-w-lg dark:text-gray-300 mb-3">
      <p className="font-semibold">{label}:</p>
      {isLink ? (
        value ? (
          <a className="text-blue-500" href={value} target="_blank" rel="noopener noreferrer">
            {value} <icons.view />
          </a>
        ) : (
          <p>---</p>
        )
      ) : isImage ? (
        <p
          className="cursor-pointer bg-gray-100 p-2 rounded-md shadow-md dark:text-gray-800"
          onClick={() => openModal(announcementDetails?.fileUrl, announcementDetails?.fileType)}
        >
          {`${announcementDetails?.title}`}
        </p>
      ) : (
        <>
          <p className="whitespace-pre-wrap">
            {showMore || value?.length <= maxLength
              ? value
              : `${value?.slice(0, maxLength)}...`}
          </p>
          {value?.length > maxLength && (
            <button
              onClick={toggleShowMore}
              className="text-sm text-blue-600 hover:underline w-fit"
            >
              {showMore ? "See less" : "See more"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

  return (
    <>
      <Modal closeButton={closeButton} title={"Emergency Awareness Details"}>
        <DetailRow
          label={announcementDetails?.fileType === "image" ? "Image" : "Video"}
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
        <DetailRow label={announcementDetails?.links ? "Link: " : "No available link"} value={announcementDetails?.links} isLink />
  
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
        <MediaModal 
          currentMedia={currentMedia}
          mediaType={mediaType}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default DetailsAnnouncement;
