import { useState } from "react";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import { auth } from "../../services/firebaseConfig";
import { useFetchData } from "../../hooks/useFetchData";
import { toast } from "sonner";
import ProfileModal from "./ProfileModal";
import MediaModal from "../MediaModal";
import handleEditData from "../../hooks/handleEditData";
import SwitchButton from "../../components/ReusableComponents/SwitchButton";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import handleErrorMessage from "../../helper/handleErrorMessage";
import useViewMedia from "../../hooks/useViewMedia";
import Modal from "../../components/ReusableComponents/Modal";
import { InputField } from "../../components/ReusableComponents/InputField";
import SystemSettings from "./SystemSettings";
import useSystemState from "./useSystemState";
import ProfileSettings from "./ProfileSettings";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();
  const { isModalOpen, currentMedia, openModal, closeModal } = useViewMedia();
  const { systemState,loading, setLoading } = useSystemState();
  const {systemData} = useFetchSystemData();
  const user = auth.currentUser;
  const { data: admin } = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user?.uid);
  const [adminData, setAdminData] = useState({
    image: "",
    prevImage: "",
    fullname: "",
    imageFile: null,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Handle edit profile
  const handleEditProfile = () => {
    setShowProfileModal(!showProfileModal);
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

  if(loading){
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
            <ProfileSettings
              currentAdminDetails={currentAdminDetails}
              openModal={openModal}
              handleEditProfile={handleEditProfile}
              user={user}
            />
            {/**System container */}
            <SystemSettings
              loading={loading}
              setLoading={setLoading}
              openModal={openModal}
            />

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

            <section className="border-b py-2 space-y-1">
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                Delete Account
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <section className="flex lg:p-8">
                <button
                  className={`text-red-700 bg-gray-100 border border-gray-300 rounded-md py-1 px-4 hover:bg-red-700 hover:text-white`}
                  onClick={() => navigate("/deletion-account")}
                >
                  Delete my account
                </button>
              </section>
            </section>
          </div>

          {showProfileModal && (
            <ProfileModal
              handleEditProfile={handleEditProfile}
              currentAdminDetails={currentAdminDetails}
              adminData={adminData}
              setAdminData={setAdminData}
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
                    For security purposes, please enter your password to save
                    the changes
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
