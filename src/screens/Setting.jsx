import { useState } from "react";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import Logo from "../assets/images/logo.png"
import Iconbutton from "../components/ReusableComponents/IconButton"
import icons from "../assets/icons/Icons";
import { auth } from "../services/firebaseConfig";
import { useFetchData } from "../hooks/useFetchData";

const Setting = () => {
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState("");
  const user = auth.currentUser;
  const {data: admin} = useFetchData("admins");
  const currentAdminDetails = admin.find((admin) => admin.id === user.uid);

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
                      {currentAdminDetails?.firstname} {currentAdminDetails?.lastname}
                    </p>
                    <p className="text-gray-500 text-sm">
                     {user.email}
                    </p>
                  </div>
                </div>
                <button className="bg-gray-100 font-medium text-sm border py-1 px-2 rounded-md flex flex-row space-x-4 items-center">
                  Edit Profile
                  <Iconbutton icon={icons.edit} color={"gray"} fontSize={"small"} />
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
                <div className="flex flex-row items-center justify-between w-3/4">
                  <p className="font-medium text-gray-800 text-lg">
                    Title
                  </p>
                  <input
                    type="text"
                    disabled
                    value={"Bagtas"}
                    className="rounded-lg shadow-sm border-2 border-gray-200 bg-gray-200 text-gray-800 text-sm"
                  />
                  <button className="bg-gray-100 font-medium text-sm py-1 px-2 border rounded-lg flex flex-row items-center">
                  Edit Title
                  <Iconbutton icon={icons.edit} color={"gray"} fontSize={"small"} />
                  </button>
                </div>
                <div className="flex flex-row items-center justify-between w-3/4">
                  <p className="font-medium text-gray-800 text-lg">
                    Barangay
                  </p>
                  <select className="rounded-lg shadow-sm border-2 border-gray-200 text-sm">
                    <option>Bagtas</option>
                  </select>
                  <p className="none p-2"></p>
                </div>
              </div>

              <div className="flex flex-row items-center  w-3/4">
                <img src={Logo} className="w-40 rounded-full" />
                <button className="bg-gray-100 font-medium text-sm p-2 border rounded-lg">
                  Upload Photo
                </button>
              </div>
            </div>

            {/**Save button */}
            <div className="py-4 place-self-end">
              <button className="bg-blue-500 py-2 px-4 rounded-md text-sm text-white">Save update</button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Setting;
