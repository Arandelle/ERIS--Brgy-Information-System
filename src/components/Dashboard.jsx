import React from "react";
import MapContent from "./Maps/MapContent"
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Toggle } from "../hooks/Toggle";

const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 md:p-6 w-full mb-4 md:mb-0">
      <h3 className="text-md md:text-lg xxs:text-center md:text-left font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-2xl xxs:text-center md:text-left md:text-2xl font-bold text-gray-900 mt-1 dark:text-white">
        {value}
      </p>
    </div>
  );
};

const Dashboard = ({setAuth}) => {
  const { isOpen, toggleDropdown } = Toggle();
  setAuth(false)
  
  return (
    <div className="flex flex-col w-full">
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex w-full">
      <div className={`fixed w-60 overflow-x-hidden transition-all duration-300 ease-in-out z-50`}>
              <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />  
            </div>
            <div className={`w-full ${!isOpen ? 'ml-60' : ''} transition-all duration-300 ease-in-out`}>
          <div className="grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 lg:grid-cols-4 my-4 mx-4">
            <DashboardCard title="Population" value="10,000" />
            <DashboardCard title="Emergency" value="5,000" />
            <DashboardCard title="Reports" value="10,000" />
            <DashboardCard title="Certificates" value="5,000" />
          </div>
          <div className="relative w-full mb-2 px-4">
            <a
              href="#"
              className="block w-full p-6 md:h-52 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Noteworthy technology acquisitions 2021
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Here are the biggest enterprise technology acquisitions of 2021 so
                far, in reverse chronological order.
              </p>
            </a>
            <MapContent />
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
