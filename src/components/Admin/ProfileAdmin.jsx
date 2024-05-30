import { Toggle } from "../../hooks/Toggle";
import { AdminData, AdminSettings } from "./AdminData";
import { useState } from "react";
import Logout from "../ReusableComponents/QuestionModal";
import { PopoverHover } from "../Popover";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isAuthenticated, setAuth] = useState(false);
  const { isOpen, toggleDropdown } = Toggle();
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth(false);
    navigate("/");
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
            <PopoverHover content={`${isOpen ? "Close" : "Open"} Profile`}>
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="user photo"
              />
            </PopoverHover>
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
                className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
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
      {showLogout && (<Logout toggleModal={() => setShowLogout(false)} question="Are you do you want to Logout?" yesText="Logout" onConfirm={handleLogout}/> )}  
    </div>
  );
};
export default Profile;
