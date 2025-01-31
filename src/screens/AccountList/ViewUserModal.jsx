import Modal from "../../components/ReusableComponents/Modal";
import {formatDateWithTime } from "../../helper/FormatDate";
import ViewImage from "../ViewImage";
import useImageView from "../../hooks/useImageView";

const ViewUserModal = ({ userToViewInfo,handleCloseViewUser }) => {
  const {isModalOpen,openModal, closeModal} = useImageView();
  const {fullname, age, gender, address, email,mobileNum, customId, createdAt, profileComplete} = userToViewInfo;
  const FetchDataStyle = ({label, data}) => {
    return (
      <div className="flex flex-row dark:text-gray-300">
        <p className="flex-1 basis-1/3">{label} : </p>
        <p className="flex-1 basis-2/3 font-semibold">{data}</p>
      </div>
    );
  };

  return (
    <Modal
      closeButton={handleCloseViewUser}
      title={"User Profile"}
      children={
        <>
          <div className="border-b-2 py-4 max-w-lg md:w-[32rem]">
            <div className="space-x-4 flex flex-row items-center ">
             <div className="rounded-full border-2 border-gray-500"> 
             <img src={userToViewInfo.img} className="rounded-full h-24 w-24 cursor-pointer"
              onClick={() => openModal(userToViewInfo.img)}
             />
             </div>
               <div>
                  <p className="font-bold text-lg dark:text-gray-200">{fullname || "User's full name"}</p>
                  <p className="text-sm font-thin text-gray-500 dark:text-gray-400">{email || "User's email"}</p>
                  <p className="text-xs font-thin text-gray-500 dark:text-gray-400">{customId || "user's id"}</p>
               </div>
            </div>
          </div>
          <div>
          <FetchDataStyle label="Phone number" data={mobileNum || "user's phone number"} />
          <FetchDataStyle label="Address" data={address || "user's address"} />
          <FetchDataStyle label="Age" data={age || "user's age"} />
          <FetchDataStyle label="Gender" data={gender || "user's gender"} />
          <FetchDataStyle label="Created on" data={formatDateWithTime(createdAt)} />
          {profileComplete && (
            <p className="text-red-500">Not yet completed</p>
          )}
          </div>
          <div className="place-self-end"><button className="px-4 py-2 rounded-md bg-blue-600 text-white" onClick={handleCloseViewUser}>Ok</button></div>
        
        {isModalOpen && (
          <ViewImage currentImage={userToViewInfo.img} closeModal={closeModal} />
        )}

        </>
      }
    />
  );
};

export default ViewUserModal;
