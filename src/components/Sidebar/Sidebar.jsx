import React, { useState } from "react";
import { Data } from "./SidebarData";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, toggleSideBar }) {
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
    <div className={`${isOpen ? "hidden" : "relative"}`}>
    <ul className="flex flex-col space-y-2 text-sm font-medium bg-white h-screen shadow-sm text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
      <h1 className="text-base pt-4 text-center font-bold text-gray-700 text-nowrap">
        Admin Panel
      </h1>
      {Data.map((val, key) => (
        <li
          key={key}
          className={`${
            !val.items || openSubMenu !== val.title
              ? "hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" : "cursor-pointer"
          }`}
          onClick={() => handleMenuItemClick(val)}
        >
          <div className="flex items-center px-4 py-3">
            <div className="mr-2">{val.icon}</div>
            {val.items ? (
              <div>{val.title}</div>
            ) : (
              <Link to={val.link}>{val.title}</Link>
            )}
            {val.items && (
              <ArrowRightIcon
                className={`ml-auto transition-transform ${
                  openSubMenu === val.title ? "rotate-90" : "rotate-0"
                }`}
              />
            )}
          </div>
          {val.items && openSubMenu === val.title && (
            <ul className="bg-gray-300 m-0 left-0">
              {val.items.map((subVal, subKey) => (
                <li
                  key={subKey}
                  className="text-sm px-4 py-2 hover:bg-gray-400 hover:text-gray-800 cursor-pointer"
                  onClick={() => handleSubMenuClick(subVal.link)}
                >
                  <div className="flex items-center text-nowrap">
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
  
  );
}

export default Sidebar;