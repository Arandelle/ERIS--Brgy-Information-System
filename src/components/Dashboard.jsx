  import React from "react";
  import Map from "./Map";

  const DashboardCard = ({ title, value }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full md:w-full lg:w-full mb-4 md:mb-0">
        <h3 className="text-md md:text-lg font-semibold text-gray-800">
          {title}
        </h3>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">
          {value}
        </p>
      </div>
    );
  };

  const Dashboard = ({ showSidebar }) => {
    const dashboardClasses = showSidebar
      ? "grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 lg:grid-cols-4 my-4 mx-4 hidden"
      : "grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 lg:grid-cols-4 my-4 mx-4";

    return (
      <div className="flex flex-col w-screen">
        <div className={dashboardClasses}>
          <DashboardCard title="Population" value="10,000" />
          <DashboardCard title="Emergency" value="5,000" />
          <DashboardCard title="Reports" value="10,000" />
          <DashboardCard title="Certificates" value="5,000" />
        </div>
        <div className="relative w-full mb-2 px-4">
          <a
            href="#"
            className="block w-full p-6 md:h-52 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Noteworthy technology acquisitions 2021
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
          </a> 
          <Map /> 
        </div>
      </div>
    );
  };

  export default Dashboard;
