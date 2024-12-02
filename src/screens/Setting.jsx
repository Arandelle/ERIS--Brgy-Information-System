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
  const [originalTitle, setOriginalTitle] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [isModified, setIsModified] = useState(false);

  const user = auth.currentUser;
  const { data: admin } = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user.uid);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Invalid file type or size. Please upload an image under 5MB.");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    const fetchSystemData = async () => {
      const systemRef = ref(database, "systemData");
      try {
        const snapshot = await get(systemRef);
        if (snapshot.exists()) {
          const systemValue = snapshot.val();
          setOriginalTitle(systemValue.title);
          setTitle(systemValue.title);
          setOriginalImage(systemValue.imageUrl);
          setPreview(systemValue.imageUrl);
          setIsModified(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSystemData();
  }, []);

  useEffect(() => {
    // Compare current values to original values to determine if modified
    const hasChanges =
      title !== originalTitle || (preview !== originalImage && image);
    setIsModified(hasChanges);
  }, [title, preview, originalTitle, originalImage, image]);

  const handleUpdateData = async () => {
    const systemRef = ref(database, "systemData");
    try {
      const snapshot = await get(systemRef);

      if (snapshot.exists()) {
        const announcementData = snapshot.val();
        let imageUrl = announcementData.imageUrl; // retain the existing image url

        // Check if a new image is selected
        if (image) {
          const imageFile = image;
          const imageRef = storageRef(storage, `system-images/${imageFile.name}`);

          // Upload the new image
          try {
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);

            if (announcementData.imageUrl) {
              const oldImageRef = storageRef(storage, announcementData.imageUrl);
              await deleteObject(oldImageRef);
            }
          } catch (error) {
            toast.error(`Error uploading new image: ${error}`);
            return;
          }
        }

        const updatedData = {
          title,
          imageUrl,
        };
        await update(systemRef, updatedData);

        // Reset original values and isModified
        setOriginalTitle(title);
        setOriginalImage(imageUrl);
        setPreview(imageUrl);
        setImage("");
        setIsModified(false);

        toast.success("Update successfully");
      } else {
        toast.error("Not found");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
    }
  };

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
            {/* Profile Settings */}
            <div className="px-4 py-6 border-b">
              <div className="flex items-center justify-between w-3/4">
                <div className="flex items-center space-x-4">
                  <div className="border-4 border-gray-300 rounded-full">
                    <img
                      src={currentAdminDetails?.img}
                      className="w-28 h-28 rounded-full"
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
            {/* System Settings */}
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
                    value={title}
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
                <img src={preview || originalImage} className="w-40 rounded-full" />
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

            {/* Save button */}
            <div className="py-4 place-self-end">
              <button
                className={`py-2 px-4 rounded-md text-sm text-white ${
                  isModified ? "bg-blue-500" : "bg-gray-500"
                }`}
                disabled={!isModified}
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
