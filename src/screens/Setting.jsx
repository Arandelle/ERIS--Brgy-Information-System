import { useEffect, useState } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import icons from "../assets/icons/Icons";
import { auth, database, storage } from "../services/firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useFetchData } from "../hooks/useFetchData";
import { update, ref } from "firebase/database";
import { toast } from "sonner";
import { useFetchSystemData } from "../hooks/useFetchSystemData";
import ButtonStyle from "../components/ReusableComponents/Button";
import ProfileModal from "./ProfileModal";
import useImageView from "../hooks/useImageView";
import ViewImage from "./ViewImage";

const Setting = () => {
  const {isModalOpen, currentImage, openModal, closeModal} = useImageView();
  const { systemData, loading, error, setLoading } = useFetchSystemData();
  const [systemState, setSystemState] = useState({
    originalTitle: "",
    title: "",
    previewImage: "",
    originalImageUrl: "",
    tanzaLogoUrl: "",
    tanzaLogoPreview: "",
    logoImageFile: null,
    tanzaLogoImageFile: null,
    isModified: false,
  });
  const [adminData, setAdminData] = useState({
    image: "",
    prevImage: "",
    fullname: "",
    imageFile: null,
  });

  const user = auth.currentUser;
  const { data: admin } = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user.uid);
  const [showProfileModal, setShowProfileModal] = useState(false);

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
      } else if (type === "tanzaLogo") {
        setSystemState((prevState) => ({
          ...prevState,
          tanzaLogoImageFile: file,
          tanzaLogoPreview: URL.createObjectURL(file),
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

  // Set the system data to the state
  useEffect(() => {
    if (systemData) {
      console.log("System Data Image URL:", systemData.imageUrl);
      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemData.title,
        title: systemData.title,
        originalImageUrl: systemData.imageUrl,
        previewImage: systemData.imageUrl,
        tanzaLogoPreview: systemData.tanzaLogoPreview,
        tanzaLogoUrl: systemData.tanzaLogoUrl,
        isModified: false,
      }));
    }
  }, [systemData]);

  // Check if the system data has been modified
  useEffect(() => {
    const { title, logoImageFile, tanzaLogoImageFile } = systemState;
    if (
      title !== systemState.originalTitle || logoImageFile || tanzaLogoImageFile
    ) {
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
    const systemRef = ref(database, "systemData");

    // Upload the image to the storage
    try {
      let imageUrl = systemState.originalImageUrl; // retain the existing image url
      let tanzaLogoUrl = systemState.tanzaLogoUrl;

      // Upload the new image if it exists
      if (systemState.logoImageFile) {
        try {
          const imageRef = storageRef(
            storage,
            `system-images/${Date.now()}_${systemState.logoImageFile.name}`
          );
        
          await uploadBytes(imageRef, systemState.logoImageFile);
          imageUrl = await getDownloadURL(imageRef);

          // Delete old image if exists
          if (systemState.originalImageUrl) {
            try {
              const oldImageRef = storageRef(
                storage,
                systemState.originalImageUrl
              );
              await deleteObject(oldImageRef);
              console.log("Old image deleted: ", systemState.originalImageUrl);
            } catch (deleteError) {
              console.warn("Error deleting old image:", deleteError);
              // Not a critical error, so we continue
            }
          }
        } catch (error) {
          console.error("Detailed upload error:", error);
          toast.error(`Error uploading new image: ${error.message}`);
          setLoading(false);
          return;
        }
      }
    
      if (systemState.tanzaLogoImageFile) {
        try {
          const tanzaLogoRef = storageRef(
            storage,
            `system-images/${Date.now()}_${systemState.tanzaLogoImageFile.name}`
          );

          await uploadBytes(tanzaLogoRef, systemState.tanzaLogoImageFile);
          tanzaLogoUrl = await getDownloadURL(tanzaLogoRef);

          // Delete old image if exists
          if (systemState.tanzaLogoUrl) {
            try {
              const oldTanzaLogoRef = storageRef(
                storage,
                systemState.tanzaLogoUrl
              );
              await deleteObject(oldTanzaLogoRef);
              console.log("Old image deleted: ", systemState.tanzaLogoUrl);
            } catch (deleteError) {
              console.warn("Error deleting old image:", deleteError);
              // Not a critical error, so we continue
            }
          }
        } catch (error) {
          console.error("Detailed upload error:", error);
          toast.error(`Error uploading new image: ${error.message}`);
          setLoading(false);
          return;
        }
      }

      const updatedData = { title: systemState.title, imageUrl, tanzaLogoUrl };
      await update(systemRef, updatedData);
      console.log("Data updated in database: ", updatedData);

      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemState.title,
        originalImageUrl: imageUrl,
        previewImage: imageUrl,
        tanzaLogoUrl: tanzaLogoUrl,
        tanzaLogoPreview: tanzaLogoUrl,
        isModified: false,
      }));
      setLoading(false);
      toast.success("Update successfully");
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <HeaderAndSideBar
        content={
          <div className="flex items-center justify-center h-svh">
            loading...
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
                    src={currentAdminDetails?.imageUrl}
                    className="w-16 h-16 lg:w-28 lg:h-28 rounded-full cursor-pointer"
                    loading="lazy"
                    onClick={() => openModal(currentAdminDetails.imageUrl)}
                  />
                  <div className="flex flex-col flex-grow">
                    <p className="font-medium text-sm lg:text-lg dark:text-gray-200">
                      {currentAdminDetails?.fullname}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {user.email}
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
                  <LabelStyle label={"Barangay"}/>
                 <div className="flex-1 basis-1/2">
                    <select className="rounded-lg shadow-sm border-2 border-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-700 text-sm">
                      <option>Bagtas</option>
                    </select>
                 </div>
                </div>
              </div>

              {/**Logo */}
              <div className="flex flex-row items-center">
                <div className="flex-1 basis-1/2">
                  <img
                    src={systemState.previewImage || systemState.originalImageUrl}
                    alt="System"
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
                    Upload Photo for Bagtas Logo
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "logo")}
                    />
                  </label>
               </div>
              </div>

              <div className="flex flex-row items-center">
               <div className="flex-1 basis-1/2">
                  <img
                    src={systemState.tanzaLogoPreview || systemState.tanzaLogoUrl}
                    alt="System"
                    className="w-24 lg:w-40 rounded-full cursor-pointer"
                    loading="lazy"
                    onClick={() => openModal(systemState.tanzaLogoUrl)}
                  />
               </div>
              <div className="flex-1 basis-1/2">
                  <label
                    htmlFor="file-upload-tanza"
                    className="bg-gray-100 dark:text-gray-200 dark:bg-gray-700 font-medium text-sm whitespace-nowrap p-2 border rounded-lg cursor-pointer"
                  >
                    Upload Photo for Tanza logo
                    <input
                      id="file-upload-tanza"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "tanzaLogo")}
                    />
                  </label>
              </div>
              </div>
            </div>
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
            <ViewImage 
              currentImage={currentImage}
              closeModal={closeModal}
            />
          )}
        </div>
      }
    />
  );
};

export default Setting;
