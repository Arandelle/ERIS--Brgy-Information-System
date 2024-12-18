import React, { useEffect, useState } from "react";
import Modal from "../components/ReusableComponents/Modal";
import { InputField } from "../components/ReusableComponents/InputField";
import handleEditData from "../hooks/handleEditData";
import { toast } from "sonner";
import { auth } from "../services/firebaseConfig";
import icons from "../assets/icons/Icons";

const ProfileModal = ({
  handleEditProfile,
  currentAdminDetails,
  adminData,
  setAdminData,
  handleImageChange,
  setLoading,
}) => {
  const user = auth.currentUser;

  useEffect(() => {
    if (currentAdminDetails) {
      setAdminData({
        ...adminData,
        fullname: currentAdminDetails.fullname,
      });
    }
  }, [currentAdminDetails]);

  const hanldeUpdateProfile = async (id) => {
    const updatedData = {
      ...adminData,
      imageUrl: adminData.prevImage
    };
    await handleEditData(id, updatedData, "admins");
    setAdminData({});
    handleEditProfile();
    setLoading(false);
  };

  return (
    <Modal
      closeButton={handleEditProfile}
      title={"Edit your profile"}
      children={
        <div className="space-y-4 lg:max-w-lg">
          <div className="flex flex-col items-center lg:flex-row space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex relative shrink-0">
              <img
                src={adminData.prevImage || currentAdminDetails.imageUrl}
                className="h-32 w-32 rounded-full self-center"
              />
              <label
                htmlFor="profile-upload"
                className="absolute p-1 rounded-full bottom-2 right-2 bg-white cursor-pointer"
              >
                <icons.edit fontSize="small" className=" text-green-500" />
                <input
                  id="profile-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "profile")}
                />
              </label>
            </div>
            <div className="space-y-4">
              <InputField
                value={adminData.fullname}
                placeholder={"Your fullname"}
                onChange={(e) =>
                  setAdminData({
                    ...adminData,
                    fullname: e.target.value,
                  })
                }
              />
              <input
                className={`px-4 py-2 text-sm text-gray-500 border-gray-300 rounded-md bg-gray-200 dark:placeholder:text-gray-200 dark:text-gray-400 dark:bg-gray-800 w-full`}
                type="text"
                value={currentAdminDetails.email}
                disabled="true"
              />
              <InputField placeholder={"Password"} />
            </div>
          </div>
          <button
            className="bg-green-500 w-full py-2 text-white text-sm rounded-md"
            onClick={() => hanldeUpdateProfile(user.uid)}
          >
            Update Profile
          </button>
        </div>
      }
    />
  );
};

export default ProfileModal;
