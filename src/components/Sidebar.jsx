import React, { useState } from "react";
import { useSidebarData } from "../data/useSidebarData";
import SearchInput from "./Header/SearchInput";
import icons from "../assets/icons/Icons";
import { useNavigate } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleMenuItemClick = (val) => {
    if (!val.items) {
      navigate(val.link)
      // window.location.pathname = val.link;
    } else {
      setOpenSubMenu(openSubMenu === val.title ? null : val.title);
    }
  };

  const handleSubMenuClick = (link) => {
    navigate(link)
    // window.location.pathname = link;
  };

  return (
    <div className={`flex fixed inset-0 z-0 flex-1 ${isOpen ? "md:hidden md:w-1/6 md:relative" : "hidden"}
    ${!isOpen ? "md:flex md:relative" : ""}`}>
    <div className="bg-black bg-opacity-25 w-full md:relative md:w-0" onClick={toggleSidebar} ></div> {/* This is the overlay */}
    <div className="flex flex-col absolute md:relative w-4/5 md:w-60 shadow-lg px-3 h-screen bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      
      <div className="px-3 overflow-auto flex-grow">
        <ul className=" space-y-2">
          <div className="text-center space-y-2 sticky top-0 z-50">
            <button type="button" 
            onClick={toggleSidebar} 
            className="md:hidden text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Close menu</span>
            </button>
            <h2 className="text-basetext-center font-semi-bold uppercase text-gray-500 border-b border-gray-100 dark:border-gray-600 py-3 text-nowrap  dark:text-gray-400">
              Admin Panel
            </h2>
            <div className={`relative ${isOpen ? "block" : "hidden"}`}>
              <SearchInput isOpen={isOpen} className={`relative ${isOpen ? "block" : "hidden"}`}/>
            </div>
          </div>
  
          {useSidebarData.map((val, key) => (
            <li
              key={key}
              className={`${
                !val.items || openSubMenu !== val.title
                  ? "flex items-center p-2 text-base font-normal rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-l-4 hover:border-l-primary-500 group cursor-pointer"
                  : "text-gray-900 dark:text-white p-2 cursor-pointer"
              }`}
              onClick={() => handleMenuItemClick(val)}
            > 
              <div className="flex items-center px-4 py-1 w-full">
                <div className="mr-2">{val.icon}</div>
                <div className="flex-grow ml-3 text-wrap">{val.title}</div>
                {val.items && (
                  <icons.arrowDropDown
                    className={`transition-transform ${
                      openSubMenu === val.title ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </div>
              {val.items && openSubMenu === val.title && (
                <ul className="py-2 space-y-2">
                  {val.items.map((subVal, subKey) => (
                    <li
                      key={subKey}
                      className="flex items-center p-2 pl-12 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleSubMenuClick(subVal.link)}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex-grow ml-3 text-gray-600 dark:text-gray-300">{subVal.title}</div>
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
  </div>

  );
}

export default Sidebar;
