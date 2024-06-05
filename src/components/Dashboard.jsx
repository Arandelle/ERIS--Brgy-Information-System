import React, { useState } from "react";
import MapContent from "./Maps/MapContent";
import Skeleton, { Spinner } from "./ReusableComponents/Skeleton";
import ActivitiesList from "./Events/ActivitiesList";
import population from "../assets/population.svg";
import registered from "../assets/registered.svg";
import Events from "../assets/events.svg";
import emergency from "../assets/emergency.svg";
import HeadSide from "./ReusableComponents/HeaderSidebar";
import DateToday from "./Admin/DateToday";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

const DashboardCard = ({ title, value, img }) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2 md:gap-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mb-3 md:mb-0">
        <div className="hidden md:block">
          <img src={img} alt="Empty Image" className="h-20 w-28" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-end text-end">
          <div className="flex justify-between items-center md:items-end w-full md:flex-col md:w-auto">
            <p className=" text-xs text-ellipsis font-bold uppercase text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className=" text-2xl font-bold text-primary-500 dark:text-primary-400">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ setAuth }) => {
  setAuth(false);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState(() => {
    // Retrieve news data from localStorage, or an empty array if it doesn't exist
    const storedNews = localStorage.getItem("news");
    return storedNews ? JSON.parse(storedNews) : [];
  });
  const [events, setEvents] = useState(() => {
    // Retrieve news data from localStorage, or an empty array if it doesn't exist
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  //   // Retrieve the array from localStorage
  // const storedData = localStorage.getItem('yourKey');
  // // Parse the JSON string into an array
  // const dataArray = JSON.parse(storedData);
  // // Get the length of the array
  // const arrayLength = dataArray.length;

  return (
    <HeadSide
      child={
        <>
          <DateToday />

          <div className="grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 lg:grid-cols-4 md:my-3 mx-3 text-wrap">
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
              value={
                loading ? <Spinner setLoading={setLoading} /> : events.length
              }
              img={Events}
            />
            <DashboardCard
              title="Emergency"
              value={loading ? <Spinner setLoading={setLoading} /> : "5"}
              img={emergency}
            />
          </div>
          <div className="grid relative grid-cols-1 gap-3 md:gap-4 md:w-max-40 lg:grid-cols-4 mx-3 text-wrap">
              <>
                <div className="order-3 lg:order-1 col-span-1 lg:col-span-3">
                  <MapContent />
                </div>
                <div className="order-2 md:order-2 col-span-1">
                  <div className="bg-white w-full border-t-4 border-t-orange-500 dark:border-t-orange-400 px-4 flex flex-row items-center py-6 mb-2 rounded-lg dark:bg-gray-800">
                    <ThunderstormIcon style={{ color: "#FF5733" }} />
                    <div className="flex flex-col ml-3 text-gray-700 dark:text-gray-100 text-md text-nowrap">
                      26.5°C Bagtas Tanza, Cavite
                      <span className="font-thin text-sm text-gray-600 dark:text-gray-200">
                        It's a rainy day, bring your umbrella
                      </span>
                    </div>
                  </div>
                  <ActivitiesList news={news} setNews={setNews} />
                </div>
              </>          
          </div>
        </>
      }
    />
  );
};

export default Dashboard;
