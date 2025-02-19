import React, { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar";

const HeaderAndSideBar = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex-1 flex-col flex">
      <Header toggleSideBar={toggleDropdown} isOpen={isOpen} />
      <div className="flex">
        <div className="fixed z-50 lg:z-0">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div
          className={`w-full transition-all duration-300 ${
            isOpen ? "ml-0" : "md:ml-60"
          }`}
        >
          <div className="p-2 overflow-x-auto">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAndSideBar;
