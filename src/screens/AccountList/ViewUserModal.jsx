import Modal from "../../components/ReusableComponents/Modal";
import { formatDateWithTime } from "../../helper/FormatDate";
import MediaModal from "../MediaModal";
import useViewMedia from "../../hooks/useViewMedia";
import icons from "../../assets/icons/Icons";

const ViewUserModal = ({ userToViewInfo, handleCloseViewUser }) => {
  const { isModalOpen, openModal, closeModal } = useViewMedia();
  const {
    fullname,
    age,
    gender,
    address,
    email,
    mobileNum,
    customId,
    createdAt,
    profileComplete,
    anonymized,
    anonymizedAt,
    deletionReason
  } = userToViewInfo;
  const FetchDataStyle = ({ label, data }) => {
    return (
      <div className="flex flex-row dark:text-gray-300">
        <p className="flex-1 basis-1/3">{label} : </p>
        <p className="flex-1 basis-2/3 font-semibold">{data}</p>
      </div>
    );
  };

  const displayValue = (value, isAnonymized = false) => {
    return value && !isAnonymized ? value : isAnonymized ? "Anonymized" : "----";
  };

  const FallbackImage = icons.anonymous;

  return (
    <Modal
      closeButton={handleCloseViewUser}
      title={"User Profile"}
      children={
        <>
          <div className="border-b-2 py-4 max-w-lg md:w-[32rem]">
            <div className="space-x-4 flex flex-row items-center ">
              <div className="rounded-full border-2 border-gray-500">
                {!anonymized ? (
                  <img
                    src={userToViewInfo.fileUrl || userToViewInfo.img}
                    className="rounded-full h-24 w-24 cursor-pointer"
                    onClick={() =>
                      openModal(userToViewInfo.fileUrl || userToViewInfo.img)
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100">
                      <FallbackImage style={{ fontSize: '48px', color: '#333' }} />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-lg dark:text-gray-200">
                  {displayValue(fullname, anonymized)}
                </p>
                <p className="text-sm font-thin text-gray-500 dark:text-gray-400">
                  {email || "User's email"}
                </p>
                <p className="text-xs font-thin text-gray-500 dark:text-gray-400">
                  {customId || "user's id"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <FetchDataStyle
              label="Phone number"
              data={displayValue(mobileNum, anonymized)}
            />
            <FetchDataStyle
              label="Address"
              data={displayValue(address, anonymized)}
            />
            <FetchDataStyle label="Age" data={displayValue(age, anonymized)} />
            <FetchDataStyle
              label="Gender"
              data={displayValue(gender, anonymized)}
            />
            <FetchDataStyle
              label="Created on"
              data={formatDateWithTime(createdAt)}
            />
            {anonymized && (
              <>
                <FetchDataStyle
                label="Deleted On"
                data={formatDateWithTime(anonymizedAt)}
              />
               <FetchDataStyle
                label="Reason"
                data={deletionReason}
              />
              </>
            )}
            {profileComplete && (
              <p className="text-red-500">Not yet completed</p>
            )}
          </div>
          <div className="place-self-end">
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
              onClick={handleCloseViewUser}
            >
              Ok
            </button>
          </div>

          {isModalOpen && (
            <MediaModal
              currentMedia={userToViewInfo.img}
              closeModal={closeModal}
            />
          )}
        </>
      }
    />
  );
};

export default ViewUserModal;
