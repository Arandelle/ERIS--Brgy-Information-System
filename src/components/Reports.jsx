import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Toggle } from "../hooks/Toggle";

const Reports = () => {
  const { isOpen, toggleDropdown } = Toggle();
  return (
    <div className="flex flex-col w-full">
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div
          className={`w-screen p-4 dark:bg-gray-800 dark:text-white rounded-md mx-6 my-5 md:mx-8 md:my-5 ${
            isOpen ? "ml-10" : "md:ml-64"
          }`}
        >
            <h1 className="dark:text-white">This is Reports</h1>
          <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
            <input
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600"
              type="date"
              placeholder="Event Title"
            />
            <input
              className="w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:bg-gray-600"
              type="date"
              placeholder="Start Date"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
