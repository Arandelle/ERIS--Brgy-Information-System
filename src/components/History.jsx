import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Toggle } from "../hooks/Toggle";

function History() {
  const { isOpen, toggleDropdown } = Toggle();

  return (
    <div className="flex flex-col w-full">
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isOpen ? "ml-0" : "md:ml-60"
          }`}
        >
          <div className="mx-3 my-3">
              <h1 className="dark:text-white">This is History</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
