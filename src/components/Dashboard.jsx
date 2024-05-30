import React, { useState, useEffect } from "react";
import MapContent from "./Maps/MapContent";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Toggle } from "../hooks/Toggle";
import { useLocation } from "react-router-dom";
import Skeleton, { Spinner } from "./Skeleton";
import NewsList from "./Events/NewsList";
import population from "../assets/population.svg";
import registered from "../assets/registered.svg";
import events from "../assets/events.svg";
import emergency from "../assets/emergency.svg";

const DashboardCard = ({ title, value, img }) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2 md:gap-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mb-3 md:mb-0">
        <div className="hidden md:block">
          <img src={img} alt="Empty Image" className="h-20 w-28" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-end text-end">
          <div className="flex justify-between w-full md:flex-col md:w-auto">
            <p className=" text-xs font-thin uppercase dark:text-white">
              {title}
            </p>
            <p className=" text-2xl font-bold dark:text-green-500">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ setAuth }) => {
  const { isOpen, toggleDropdown } = Toggle();
  setAuth(false);
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message);
  const [loading, setLoading] = useState(true);

  const [news, setNews] = useState(() => {
    // Retrieve news data from localStorage, or an empty array if it doesn't exist
    const storedNews = localStorage.getItem("news");
    return storedNews ? JSON.parse(storedNews) : [];
  });

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex flex-col w-full">
      <Header toggleSideBar={toggleDropdown} />
      {message && (
        <div className="flex justify-center items-center">
          <div
            className="flex absolute z-50 justify-center items-center p-2 mb-4 mt-4 text-sm text-blue-500 rounded-lg bg-blue-200 dark:bg-gray-600 dark:text-green-500"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            {message}
          </div>
        </div>
      )}
      <div className="flex w-full">
        <div className="fixed z-50">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        </div>
        <div
          className={`w-full ${
            isOpen ? "ml-0" : "md:ml-60"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 lg:grid-cols-4 my-3 mx-3 text-nowrap">
            <DashboardCard
              title="Total Residents"
              value={loading ? <Spinner setLoading={setLoading} /> : "1000"}
              img={population}
            />
            <DashboardCard
              title="Today's Registered"
              value={loading ? <Spinner setLoading={setLoading} /> : "50"}
              img={registered}
            />
            <DashboardCard
              title="Events"
              value={loading ? <Spinner setLoading={setLoading} /> : "10"}
              img={events}
            />
            <DashboardCard
              title="Emergency"
              value={loading ? <Spinner setLoading={setLoading} /> : "5"}
              img={emergency}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 w-full ">
            {loading ? (
              <div className="col-span-3 mx-3">
                <Skeleton setLoading={setLoading} />
              </div>
            ) : (
              <div className="col-span-3">
                <MapContent />
              </div>
            )}
            <div className="mr-3 ml-2">
              <NewsList news={news} setNews={setNews} setMessage={setMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
