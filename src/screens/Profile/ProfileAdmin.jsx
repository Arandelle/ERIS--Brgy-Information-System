import { AdminData, AdminSettings } from "../../data/AdminData";
import { useState } from "react";
import Logout from "../../components/ReusableComponents/AskCard"
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {auth} from "../../services/firebaseConfig"

const Profile = () => {

  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => {
          setIsOpen(!isOpen);
  };
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await signOut(auth);
        console.log("Logout")
        navigate("/");
    } catch (error) {
        console.error("Logout error:", error);
        // Optionally, show an error message to the user
    }
};

  const handleMenuItemClick = (adminVal) => {
    window.location.pathname = adminVal.link;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded="false"
        data-dropdown-toggle="dropdown"
      >
        <span className="sr-only">Open user menu</span>
        <Tooltip title={<span className="text-sm">{`${isOpen ? "Close" : "Open"} Profile`}</span>} arrow>
          <img
            className="w-8 h-8 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="user photo"
          />
        </Tooltip>
      </button>
      {isOpen && (
        <div
          className="fixed z-10 right-0 mt-4 w-56 bg-white rounded-md shadow-md divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600"
          id="dropdown"
        >
          {AdminData.map((admin, key) => (
            <div key={key} className="py-3 px-4">
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                {admin.name}
              </span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                {admin.email}
              </span>
            </div>
          ))}

          <ul
            className="py-1 text-gray-500 dark:text-gray-400"
            aria-labelledby="dropdown"
          >
            {AdminSettings.map((adminVal, key) => (
              <li
                key={key}
                href="#"
                className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                onClick={() => handleMenuItemClick(adminVal)}
              >
                {adminVal.title}
              </li>
          ))}
          </ul>
            <ul
            className="py-1 text-gray-500 dark:text-gray-400"
            aria-labelledby="dropdown"
          >
            <li>
              <a
                href="#"
                className="block py-2 px-4 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-600"
                onClick={setShowLogout}
              >
                Sign out
              </a>
            </li>
          </ul>
        </div>
      )}
      {showLogout && (
        <Logout
          toggleModal={() => setShowLogout(false)}
          question="Are you do you want to Logout?"
          yesText="Logout"
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};
export default Profile;
