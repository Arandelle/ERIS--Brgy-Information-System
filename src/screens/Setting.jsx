import { useEffect, useState } from "react";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Logo from "../assets/images/logo.png";
import Iconbutton from "../components/ReusableComponents/IconButton";
import icons from "../assets/icons/Icons";
import { auth } from "../services/firebaseConfig";
import { useFetchData } from "../hooks/useFetchData";

const Setting = () => {
  const [title, setTitle] = useState("Bagtas");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [isModified, setIsModified] = useState(false);
  const user = auth.currentUser;
  const { data: admin } = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user.uid);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setIsModified(true);
    } else {
      toast.error("Invalid file type or size. Please upload an image under 5MB.");
    }
    
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsModified(true);
  };

  useEffect(() => {
    setIsModified(title !== "Bagtas" || preview !== "");
  }, [title, preview]);


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
            {/**Profile Settings */}
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
            {/**System Settings */}
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

              <div className="flex flex-row items-center  w-3/4">
                <img src={preview || Logo} className="w-40 rounded-full" />
                <label
                  for="file-upload"
                  class="bg-gray-100 font-medium text-sm whitespace-nowrap p-2 border rounded-lg cursor-pointer"
                >
                  Upload Photo
                  <input id="file-upload" type="file" class="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            {/**Save button */}
            <div className="py-4 place-self-end">
              <button className={`py-2 px-4 rounded-md text-sm text-white ${isModified ? "bg-blue-500" : "bg-gray-500"}`}
              disabled={!isModified}>
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
