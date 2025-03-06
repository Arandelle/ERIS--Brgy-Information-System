import React, { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar";

const HeaderAndSideBar = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Header toggleSideBar={toggleDropdown} isOpen={isOpen} />
      <div className="flex h-full">
        {/* Sidebar with independent scrolling */}
        <div className="z-50 md:z-0">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        
        {/* Main content with independent scrolling */}
        <div className="w-full h-full overflow-y-auto z-40">
          <div className="p-2">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAndSideBar;
