import { useEffect, useState } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import icons from "../assets/icons/Icons";
import { auth } from "../services/firebaseConfig";
import { useFetchData } from "../hooks/useFetchData";
import { toast } from "sonner";
import ButtonStyle from "../components/ReusableComponents/Button";
import ProfileModal from "./ProfileModal";
import MediaModal from "./MediaModal";
import handleEditData from "../hooks/handleEditData";
import SwitchButton from "../components/ReusableComponents/SwitchButton";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import handleErrorMessage from "../helper/handleErrorMessage";
import useViewMedia from "../hooks/useViewMedia";
import { useFetchSystemData } from "../hooks/useFetchSystemData";
import Modal from "../components/ReusableComponents/Modal";
import { InputField } from "../components/ReusableComponents/InputField";

const Setting = () => {
  const { isModalOpen, currentMedia, openModal, closeModal } = useViewMedia();
  const user = auth.currentUser;
  const { systemData, loading, setLoading } = useFetchSystemData();
  const { data: admin } = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user?.uid);
  const [systemState, setSystemState] = useState({
    originalTitle: "",
    title: "",
    previewImage: "",
    originalImageUrl: "",
    logoImageFile: null,
    isModified: false,
    isOtpEnabled: true,
  });
  const [adminData, setAdminData] = useState({
    image: "",
    prevImage: "",
    fullname: "",
    imageFile: null,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // render the systemState the systemData's data under the details
  useEffect(() => {
    if (systemData) {
      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemData.title || "",
        title: systemData.title,
        originalImageUrl: systemData.fileUrl,
        previewImage: systemData.fileUrl,
        isModified: false,
        isOtpEnabled: systemData.isOtpEnabled,
      }));
    }
  }, [systemData]);

  // Handle edit profile
  const handleEditProfile = () => {
    setShowProfileModal(!showProfileModal);
  };

  // Handle image change
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 5 * 1024 * 1024
    ) {
      if (type === "logo") {
        setSystemState((prevState) => ({
          ...prevState,
          logoImageFile: file,
          previewImage: URL.createObjectURL(file),
        }));
      } else if (type === "profile") {
        setAdminData({
          ...adminData,
          imageFile: file,
          prevImage: URL.createObjectURL(file),
        });
      }
    } else {
      toast.error(
        "Invalid file type or size. Please upload an image under 5MB."
      );
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    const { value } = e.target;
    setSystemState((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  // Check if the system data has been modified
  useEffect(() => {
    const { title, logoImageFile } = systemState;
    if (title !== systemState.originalTitle || logoImageFile) {
      setSystemState((prevState) => ({
        ...prevState,
        isModified: true,
      }));
    } else {
      setSystemState((prevState) => ({
        ...prevState,
        isModified: false,
      }));
    }
  }, [systemState]);

  // Update the system data
  const handleUpdateData = async () => {
    setLoading(true);

    // Upload the image to the storage
    try {
      let imageUrl = systemState.originalImageUrl; // retain the existing image url

      const updatedData = {
        title: systemState.title,
        file: systemState.logoImageFile,
        fileType: "image",
      };
      await handleEditData("details", updatedData, "systemData");
      console.log("Data updated in database: ", updatedData);

      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemState.title,
        originalImageUrl: imageUrl,
        previewImage: imageUrl,
        isModified: false,
      }));
      setLoading(false);
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
      setLoading(false);
    }
  };

  const handleOtpEnable = async () => {
    try {
      if (systemData.isOtpEnabled) {
        setShowPasswordModal(true);
      } else {
        const newSystemData = {
          ...systemData,
          isOtpEnabled: true,
        };
        await handleEditData("details", newSystemData, "systemData");
      }
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleOtpEnableConfirm = async () => {
    try {
      if (!password) {
        toast.warning("Password is required before proceeding");
        return;
      }
      // reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      const newSytemData = {
        ...systemData,
        isOtpEnabled: false,
      };
      await handleEditData("details", newSytemData, "systemData");
      setShowPasswordModal(false);
      setPassword("");
      return;
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  if (loading) {
    return (
      <HeaderAndSideBar
        content={
          <div className="flex items-center text-gray-500 justify-center h-svh">
            Loading please wait...
          </div>
        }
      />
    );
  }

  const LabelStyle = ({ label }) => {
    return (
      <p className="flex-1 basis-1/2 font-medium text-gray-800 text-md lg:text-lg dark:text-gray-200">
        {label}
      </p>
    );
  };

  return (
    <HeaderAndSideBar
      content={
        <div className="h-full">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
            <div className="border-b py-2 space-y-1">
              <p className="font-medium text-lg dark:text-gray-200">
                Profile Settings
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Real-time information of your account
              </p>
            </div>
            {/**Profile Container */}
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
            {/**System container */}
            <div className="border-b py-2 space-y-1">
              <p className="font-medium text-lg dark:text-gray-200">
                System Settings
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Manage your system information
              </p>
              <div className="space-y-3 py-6 px-0 lg:px-8">
                <div className="flex flex-row items-center">
                  <LabelStyle label={"Title"} />
                  <div className="flex-1 basis-1/2">
                    <input
                      type="text"
                      value={systemState.title}
                      onChange={handleTitleChange}
                      maxLength={10}
                      className="rounded-lg shadow-sm border-2 border-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-700 text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <LabelStyle label={"Barangay"} />
                  <div className="flex-1 basis-1/2">
                    <select className="rounded-lg shadow-sm border-2 cursor-pointer border-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-700 text-sm">
                      <option>Bagtas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/**Logo */}
              <section className="flex flex-row items-center">
                <div className="flex-1 basis-1/2">
                  <img
                    src={
                      systemState.previewImage || systemState.originalImageUrl
                    }
                    alt="System Logo"
                    className="w-24 lg:w-40 rounded-full cursor-pointer"
                    loading="lazy"
                    onClick={() => openModal(systemState.previewImage)}
                  />
                </div>
                <div className="flex-1 basis-1/2">
                  <label
                    htmlFor="file-upload"
                    className=" bg-gray-100 dark:text-gray-200 dark:bg-gray-700 font-medium text-sm whitespace-nowrap p-2 border rounded-lg cursor-pointer"
                  >
                    Upload Logo
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "logo")}
                    />
                  </label>
                </div>
              </section>
              {/**Save Button */}
              <div className="py-4 place-self-end">
                <button
                  className={`py-2 px-4 rounded-md text-sm text-white ${
                    systemState.isModified ? "bg-blue-500" : "bg-gray-500"
                  }`}
                  disabled={!systemState.isModified}
                  onClick={handleUpdateData}
                >
                  Save update
                </button>
              </div>
            </div>

            <section className="border-b py-2 space-y-1">
              <p className="font-medium text-lg dark:text-gray-200">
                Authentication
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Manage your system authentication
              </p>
              <section className="flex flex-row items-center lg:p-8">
                <div
                  className={`flex-1 basis-1/2 font-bold ${
                    systemState.isOtpEnabled ? "text-blue-800" : "text-gray-500"
                  }`}
                >
                  Allow OTP Login
                </div>
                <div className="flex-1 basis-1/2" disabled>
                  <SwitchButton
                    onChange={() => handleOtpEnable()}
                    isOtpEnabled={systemState.isOtpEnabled}
                  />
                </div>
              </section>
            </section>
          </div>

          {showProfileModal && (
            <ProfileModal
              handleEditProfile={handleEditProfile}
              currentAdminDetails={currentAdminDetails}
              adminData={adminData}
              setAdminData={setAdminData}
              handleImageChange={handleImageChange}
              setLoading={setLoading}
            />
          )}

          {isModalOpen && (
            <MediaModal currentMedia={currentMedia} closeModal={closeModal} />
          )}

          {showPasswordModal && (
            <Modal
              title="Enter your password"
              closeButton={() => setShowPasswordModal(false)}
              children={
                <div className="max-w-2xl space-y-6">
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                   For security purposes, please enter your password to save the changes
                  </p>

                  <div className="flex flex-col space-y-4">
                   <div className="space-y-2">
                      <label className="text-gray-600">Password: </label>
                      <InputField
                        type="password"
                        placeholder={"Enter your password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                      />
                   </div>
                    <button
                      type="submit"
                      className="bg-blue-500 py-2 rounded-md text-white font-bold text-sm w-full"
                      onClick={handleOtpEnableConfirm}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              }
            />
          )}
        </div>
      }
    />
  );
};

export default Setting;
