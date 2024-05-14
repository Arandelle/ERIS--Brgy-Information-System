import React, { useState } from "react";
import { SidebarData } from "./SidebarData";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

function Sidebar({ isOpen, toggleSidebar }) {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleMenuItemClick = (val) => {
    if (!val.items) {
      window.location.pathname = val.link;
    } else {
      setOpenSubMenu(openSubMenu === val.title ? null : val.title);
    }
  };

  const handleSubMenuClick = (link) => {
    window.location.pathname = link;
  };

  return (
    <div className={`flex fixed inset-0 z-50 ${isOpen ? "md:hidden md:w-1/6 md:relative" : "hidden"}
    ${!isOpen ? "md:flex md:relative" : ""}`}>
    <div className="bg-black bg-opacity-25 w-full md:relative md:w-0"></div> {/* This is the overlay */}
    <div className="absolute md:relative left-0 w-4/5 md:w-60 bg-white h-full shadow-lg ">
      <div className="flex justify-end p-2 dark:bg-gray-700">
        <button onClick={toggleSidebar} className="md:hidden text-gray-600 hover:text-gray-800  dark:text-white dark:hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <ul className="flex flex-col space-y-3 space-x-3 text-lg md:text-sm font-medium h-screen text-gray-500 dark:text-white dark:bg-gray-700">
        <h1 className="text-base text-center font-bold text-gray-700 text-nowrap dark:bg-gray-7 00 dark:text-white">
          Admin Panel
        </h1>
        {SidebarData.map((val, key) => (
          <li
            key={key}
            className={`${
              !val.items || openSubMenu !== val.title
                ? "hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                : "cursor-pointer"
            }`}
            onClick={() => handleMenuItemClick(val)}
          > 
            <div className="flex items-center px-4 py-3 w-full">
              <div className="mr-2">{val.icon}</div>
              <div className="flex-grow">{val.title}</div>
              {val.items && (
                <ArrowRightIcon
                  className={`transition-transform ${
                    openSubMenu === val.title ? "rotate-90" : "rotate-0"
                  }`}
                />
              )}
            </div>
            {val.items && openSubMenu === val.title && (
              <ul className="bg-gray-300 m-0 left-0 dark:bg-gray-500 ">
                {val.items.map((subVal, subKey) => (
                  <li
                    key={subKey}
                    className="text-lg md:text-sm pl-6 py-2 dark:hover:bg-gray-100 hover:bg-gray-400 hover:text-gray-800 cursor-pointer"
                    onClick={() => handleSubMenuClick(subVal.link)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2">{subVal.icon}</div>
                      <div>{subVal.title}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>

  );
}

export default Sidebar;
