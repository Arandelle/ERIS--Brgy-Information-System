import { useEffect, useState } from "react";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import Iconbutton from "../components/ReusableComponents/IconButton";
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

const Setting = () => {
  const { systemData, loading, error, setLoading } = useFetchSystemData();
  const [systemState, setSystemState] = useState({
    originalTitle: "",
    title: "",
    previewImage: "",
    originalImageUrl: "",
    newImageFile: null,
    isModified: false,
  });

  const user = auth.currentUser;
  const { data: admin } = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user.uid);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      setSystemState((prevState) => ({
        ...prevState,
        newImageFile: file,
        previewImage: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Invalid file type or size. Please upload an image under 5MB.");
    }
  };

  const handleTitleChange = (e) => {
    const { value } = e.target;
    setSystemState((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  useEffect(() => {
    if (systemData) {
      console.log("System Data Image URL:", systemData.imageUrl);
      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemData.title,
        title: systemData.title,
        originalImageUrl: systemData.imageUrl,
        previewImage: systemData.imageUrl,
        isModified: false,
      }));
    }
  }, [systemData]);

  
  useEffect(() => {
    const hasChanges =
      systemState.title !== systemState.originalTitle ||
      systemState.previewImage !== systemState.originalImageUrl;
    setSystemState((prevState) => ({
      ...prevState,
      isModified: hasChanges,
    }));
  }, [
    systemState.title,
    systemState.previewImage,
    systemState.originalTitle,
    systemState.originalImageUrl,
  ]);

  const handleUpdateData = async () => {
    setLoading(true);
    const systemRef = ref(database, "systemData");
  
    try {
      let imageUrl = systemState.originalImageUrl; // retain the existing image url
  
      if (systemState.newImageFile) {
        try {
          console.log("New Image File Details:", {
            name: systemState.newImageFile.name,
            type: systemState.newImageFile.type,
            size: systemState.newImageFile.size
          });
      
          const imageRef = storageRef(
            storage,
            `system-images/${Date.now()}_${systemState.newImageFile.name}`
          );
      
          // Validate file before upload
          if (!systemState.newImageFile.type.startsWith('image/')) {
            toast.error("Invalid file type. Please upload an image.");
            setLoading(false);
            return;
          }
      
          if (systemState.newImageFile.size > 5 * 1024 * 1024) {
            toast.error("File is too large. Maximum size is 5MB.");
            setLoading(false);
            return;
          }
      
          console.log("Uploading new image: ", systemState.newImageFile.name);
          await uploadBytes(imageRef, systemState.newImageFile);
          imageUrl = await getDownloadURL(imageRef);
          console.log("New image uploaded, URL: ", imageUrl);
      
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
  
      const updatedData = { title: systemState.title, imageUrl };
      await update(systemRef, updatedData);
      console.log("Data updated in database: ", updatedData);
  
      setSystemState((prevState) => ({
        ...prevState,
        originalTitle: systemState.title,
        originalImageUrl: imageUrl,
        previewImage: imageUrl,
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

  if (error) {
    return (
      <HeaderAndSideBar
        content={
          <div className="flex items-center justify-center h-svh">
            Error: {error.message}
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
              <p className="font-medium text-lg dark:text-gray-200">Profile Settings</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Real-time information of your account
              </p>
            </div>
            {/**Profile Container */}
            <div className="px-1 py-6 border-b flex flex-col lg:flex-row lg:justify-between">
              <div className="flex flex-col lg:flex-row space-y-4 items-start lg:items-center lg:justify-between w-3/4">
                <div className="flex flex-row justify-start items-center space-x-4">
                  <div className="border-4 border-gray-300 rounded-full flex-shrink-0">
                    <img
                      src={currentAdminDetails?.img}
                      className="w-16 h-16 lg:w-28 lg:h-28 rounded-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <p className="font-medium text-sm lg:text-lg dark:text-gray-200">
                      {currentAdminDetails?.firstname}{" "}
                      {currentAdminDetails?.lastname}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <button className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 font-medium text-sm border py-1 px-2 rounded-md flex flex-row space-x-4 items-center">
                  Edit Profile
                  <Iconbutton
                    icon={icons.edit}
                    color={"gray"}
                    fontSize={"small"}
                  />
                </button>
              </div>
            </div>
          {/**System container */}
            <div className="border-b py-2 space-y-1">
              <p className="font-medium text-lg dark:text-gray-200">System Settings</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Manage your system information
              </p>
              <div className="space-y-3 py-6 px-0 lg:px-8">
                <div className="flex flex-row items-center space-x-4 justify-between w-1/2">
                  <p className="font-medium text-gray-800 text-md lg:text-lg dark:text-gray-200">Title</p>
                  <input
                    type="text"
                    value={systemState.title}
                    onChange={handleTitleChange}
                    maxLength={10}
                    className="rounded-lg shadow-sm border-2 border-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-700 text-sm"
                  />
                </div>
                <div className="flex flex-row items-center space-x-4 justify-between w-1/2">
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-md lg:text-lg">Barangay</p>
                  <select className="rounded-lg shadow-sm border-2 border-gray-200 dark:bg-gray-700 dark:text-gray-200 text-sm">
                    <option>Bagtas</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-row items-center w-3/4">
                <img
                  src={systemState.previewImage || systemState.originalImageUrl}
                  alt="System"
                  className="w-24 lg:w-40 rounded-full"
                  loading="lazy"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gray-100 dark:text-gray-200 dark:bg-gray-700 font-medium text-sm whitespace-nowrap p-2 border rounded-lg cursor-pointer"
                >
                  Upload Photo
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
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
        </div>
      }
    />
  );
};

export default Setting;
