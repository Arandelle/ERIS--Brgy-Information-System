import { useEffect, useState } from "react";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Iconbutton from "../components/ReusableComponents/IconButton";
import icons from "../assets/icons/Icons";
import { auth, database, storage } from "../services/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useFetchData } from "../hooks/useFetchData";
import { get, ref, update } from "firebase/database";
import { toast } from "sonner";

const Setting = () => {
  const [systemState, setSystemState] = useState({
    originalTitle: "",
    newTitle: "",
    previewImage: "",
    originalImageUrl: "",
    newImageFile: null,
    isModified: false,
  });
  const [loading, setLoading] = useState(true)

  const user = auth.currentUser;
  const { data: admin } = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user.uid);

  const handleImageChange = (e) => {
    const file = e.target.file[0];
    if(file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024){
      setSystemState((prevState) => ({
        ...prevState,
        newImageFile: file,
        previewImage: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Invalid file type or size. Please upload an image under 5mb.");
    }
  }

  const handleTitleChange = (e) => {
    const {value} = e.target;
    setSystemState((prevState) => ({
      ...prevState,
      newTitle: value
    }))
  };

  useEffect(() => {
    const fetchSystemData = async () => {
      const systemRef = ref(database, "systemData");
      try{
        const snapshot = await get(systemRef);
        if(snapshot.exists()){
          const systemData = snapshot.val();
          setSystemState((prevState) =>({
            ...prevState,
            originalTitle: systemData.newTitle,
            newTitle: systemData.newTitle,
            originalImageUrl: systemData.imageUrl,
            previewImage: systemData.imageUrl,
            isModified: false,
          }));
          setLoading(false)
        }
      }catch(error){
        toast.error(`Error ${error}`)
      }
    };
    fetchSystemData();
  }, [])

  useEffect(() => {
    const hasChanges = systemState.newTitle !== systemState.originalTitle || systemState.previewImage !== systemState.originalImageUrl;
    setSystemState((prevState) => ({
      ...prevState,
      isModified: hasChanges
    }));
  }, [systemState.newTitle, systemState.previewImage, systemState.originalTitle, systemState.originalImageUrl]);

  const handleUpdateData = async () => {
    setLoading(true);
    const systemRef = ref(database, "systemData");
    try {
      const snapshot = await get(systemRef);
      if (snapshot.exists()) {
        const systemData = snapshot.val();
        let imageUrl = systemData.imageUrl; // retain the existing image url

        if (systemState.newImageFile) {
          const imageRef = storageRef(storage, `system-images/${newImageFile.name}`);
          try {
            await uploadBytes(imageRef, newImageFile);
            imageUrl = await getDownloadURL(imageRef);

            if (systemData.imageUrl) {
              const oldImageRef = storageRef(storage, systemData.imageUrl);
              await deleteObject(oldImageRef);
            }
          } catch (error) {
            toast.error(`Error uploading new image: ${error}`);
            return;
          }
        }

        const updatedData = { newTitle: systemState.newTitle, imageUrl };
        await update(systemRef, updatedData);
        setSystemState((prevState) => ({
          ...prevState,
          originalTitle: systemState.newTitle,
          originalImageUrl: imageUrl,
          previewImage: imageUrl,
          isModified: false
        }));
        setLoading(false);
        toast.success("Update successfully");
      } else {
        toast.error("Not found");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
    }
  };

  if (loading) {
    return <HeadSide child={
      <div className="flex items-center justify-center h-svh">
        loading...
      </div>
    } />
  }

  return (
    <HeadSide
      child={
        <div className="">
          <div className="bg-white h-svh p-4 rounded shadow-sm">
            <div className="border-b py-2 space-y-1">
              <p className="font-medium text-lg">Profile Settings</p>
              <p className="text-gray-500 text-sm">
                Real-time information of your account
              </p>
            </div>
            <div className="px-4 py-6 border-b">
              <div className="flex items-center justify-between w-3/4">
                <div className="flex items-center space-x-4">
                  <div className="border-4 border-gray-300 rounded-full">
                    <img
                      src={currentAdminDetails?.img}
                      className="w-28 h-28 rounded-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-lg">
                      {currentAdminDetails?.firstname}{" "}
                      {currentAdminDetails?.lastname}
                    </p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                <button className="bg-gray-100 font-medium text-sm border py-1 px-2 rounded-md flex flex-row space-x-4 items-center">
                  Edit Profile
                  <Iconbutton
                    icon={icons.edit}
                    color={"gray"}
                    fontSize={"small"}
                  />
                </button>
              </div>
            </div>
            <div className="border-b py-2 space-y-1">
              <p className="font-medium text-lg">System Settings</p>
              <p className="text-gray-500 text-sm">
                Manage your system information
              </p>
              <div className="space-y-3 py-6 px-8">
                <div className="flex flex-row items-center justify-between w-1/2">
                  <p className="font-medium text-gray-800 text-lg">Title</p>
                  <input
                    type="text"
                    value={systemState.newTitle}
                    onChange={handleTitleChange}
                    className="rounded-lg shadow-sm border-2 border-gray-200 text-gray-800 text-sm"
                  />
                </div>
                <div className="flex flex-row items-center justify-between w-1/2">
                  <p className="font-medium text-gray-800 text-lg">Barangay</p>
                  <select className="rounded-lg shadow-sm border-2 border-gray-200 text-sm">
                    <option>Bagtas</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-row items-center w-3/4">
                <img src={systemState.previewImage || systemState.originalImageUrl} className="w-40 rounded-full" loading="lazy" />
                <label
                  htmlFor="file-upload"
                  className="bg-gray-100 font-medium text-sm whitespace-nowrap p-2 border rounded-lg cursor-pointer"
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
