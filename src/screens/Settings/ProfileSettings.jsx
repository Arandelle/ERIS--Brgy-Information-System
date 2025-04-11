import React from 'react';
import ButtonStyle from '../../components/ReusableComponents/Button';
import icons from '../../assets/icons/Icons';

const ProfileSettings = ({currentAdminDetails,openModal, handleEditProfile, user}) => {

  return (
    <div className="px-1 py-6 border-b flex flex-col lg:flex-row lg:justify-between">
    <div className="flex flex-col lg:flex-row space-y-4 items-start lg:items-center lg:justify-between w-3/4">
      <div className="flex-1 basis-1/2 flex flex-row justify-start items-center space-x-4">
        <img
          src={currentAdminDetails?.fileUrl}
          className="w-16 h-16 lg:w-28 lg:h-28 rounded-full cursor-pointer"
          loading="lazy"
          onClick={() => openModal(currentAdminDetails.fileUrl)}
        />
        <div className="flex flex-col flex-grow">
          <p className="font-medium text-sm lg:text-lg dark:text-gray-200">
            {currentAdminDetails?.fullname}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {user?.email}
          </p>
        </div>
      </div>
      <div className="flex-1 ">
        <ButtonStyle
          icon={icons.edit}
          color={"gray"}
          fontSize={"small"}
          label={"Edit Profile"}
          onClick={handleEditProfile}
        />
      </div>
    </div>
  </div>
  )
}

export default ProfileSettings
