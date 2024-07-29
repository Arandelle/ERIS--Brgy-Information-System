import React, { useState, useEffect } from "react";
import Notification from "./Notification/Notification";
import CustomTheme from "../../hooks/useTheme";
import Profile from "./Admin/ProfileAdmin";
import logo from "../../assets/logo.png";
import SearchInput from "./SearchInput";
import { Tooltip } from "@mui/material";

const Header = ({ toggleSideBar, isOpen }) => {
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

  return (
    <div className="sticky top-0 z-50 px-4 lg:px-6 w-full py-2.5 border-b border-t border-gray-300 dark:border-gray-600 dark:bg-gray-800 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <Tooltip
            title={
              <span className="text-sm">
                {isMdScreen
                  ? isOpen
                    ? "Open Sidebar"
                    : "Close Sidebar"
                  : isOpen
                  ? "Close Sidebar"
                  : "Open Sidebar"}
              </span>
            }
            placement="right"
            arrow
          >
            <div>
              <button
                onClick={toggleSideBar}
                id="toggleSidebar"
                aria-expanded="true"
                aria-controls="sidebar"
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
              href="https://eris-brgy-information-system.vercel.app/dashboard"
              className="flex mr-4"
            >
              <img
                src={logo}
                className="mr-3 h-10 lg:h-12 p-0"
                alt="FlowBite Logo"
              />
              <span className="self-center text-lg lg:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Bagtas
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
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
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
              {/* <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div> */}
              <span className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-400 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                {theme === "light" ? (
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
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
