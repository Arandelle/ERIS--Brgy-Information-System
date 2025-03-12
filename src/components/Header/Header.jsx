import React, { useState, useEffect } from "react";
import Notification from "../../screens/Notification";
import CustomTheme from "../../hooks/useTheme";
import Profile from "./ProfileMenu";
import SearchInput from "./SearchInput";
import { Tooltip } from "@mui/material";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import icons from "../../assets/icons/Icons";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSideBar, isOpen }) => {
  const navigate = useNavigate();
  const {systemData} = useFetchSystemData();

  const [system, setSystem] = useState(() => {
    const stored = localStorage.getItem("system");
    return stored ? JSON.parse(stored) : {};
  });

  const [theme, toggleTheme] = CustomTheme();
  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);

  const handleResize = () => {
    setIsMdScreen(window.innerWidth >= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // store the system data to localstorage to cache the data
  useEffect(() => {
    if(systemData){
      const {fileUrl, title} = systemData;
      const updatedSystem = {logo: fileUrl, title};
      setSystem(updatedSystem);
      localStorage.setItem("system", JSON.stringify(updatedSystem));
    }
  }, [systemData]);

  return (
    <div className="sticky top-0 z-50 px-4 lg:px-6 w-full py-2.5 border-b border-t border-gray-300 dark:border-gray-600 dark:bg-gray-800 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <Tooltip
            title={
              <span className="text-sm">
                Toggle Sidebar
              </span>
            }
            placement="right"
            arrow
          >
            <div>
              <button
                onClick={toggleSideBar}
                className="p-2 mr-3 text-gray-800 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 1h14M1 6h14M1 11h7"
                  />
                </svg>
              </button>
            </div>
          </Tooltip>
            <a
              // href="https://eris-brgy-information-system.vercel.app/dashboard"
              onClick={() => navigate("/dashboard")}
              className="flex mr-4 cursor-pointer"
            > 
            {system ? (
              <img
                src={system.logo}
                className="mr-3 h-10 lg:h-12 p-0 hidden md:block"
                alt="Your Logo"
              />
            ) : (
              <div className="w-10 h-10 lg:h-12 bg-gray-300 animate-pulse rounded"></div>
            )}
              <span className="self-center text-md lg:text-lg font-semibold text-gray-800 dark:text-gray-300">
               {system?.title}
              </span>
            </a>
        </div>
        <div className="items-center inline-flex">
          {/* Search Button */}
          <Tooltip
            title={<span className="text-sm">Enter keyword</span>}
            placement="bottom"
            arrow
          >
            <button
              type="button"
              onClick={toggleSideBar}
              class="md:hidden ml-0 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2"
            >
              <icons.search />
              <span class="sr-only">Search</span>
            </button>

            <SearchInput toggleSidebar={toggleSideBar} />
            
          </Tooltip>
          {/* Theme button */}
          <Tooltip
            title={
              <span className="text-sm">
                Switch to
                {theme === "light" ? (
                  <span className="text-primary-500"> DARK </span>
                ) : (
                  <span className="text-yellow-300"> LIGHT </span>
                )}
                mode
              </span>
            }
            arrow
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                onClick={toggleTheme}
                type="checkbox"
                checked={theme === "dark"}
                className="sr-only peer"
              />
              <span className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-400 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                {theme === "light" ? (
                  <icons.moon />
                ) : (
                  <icons.sun />
                )}
              </span>
            </label>
          </Tooltip>
          <Notification />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
