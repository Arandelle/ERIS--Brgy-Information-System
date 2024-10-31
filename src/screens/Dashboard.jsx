import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapContent from "./Maps/MapContent";
import { Spinner } from "../components/ReusableComponents/Skeleton";
import population from "../assets/images/population.svg";
import registered from "../assets/images/registered.svg";
import Events from "../assets/images/events.svg";
import emergency from "../assets/images/emergency.svg";
import HeadSide from "../components/ReusableComponents/HeaderSidebar";
import DateToday from "../helper/DateToday";
import { useFetchData } from "../hooks/useFetchData";
import icons from "../assets/icons/Icons";

const DashboardCard = ({ title, value, img, onClick }) => {
  const lastValue = 10;
  const percentage = lastValue * value;
  const isIncrease = value > lastValue;

  return (
    <div className="relative">
      <div className="flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-md p-4 w-full mb-3 md:mb-0">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <select className="text-sm text-gray-500 cursor-pointer rounded-md p-1 border-none focus:ring-0">
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="w-full hidden md:block">
            <img src={img} alt="Icon" className="h-16 w-16" />
          </div>

          <div className="flex flex-row md:flex-col justify-between w-full items-center md:items-end">
            <p className="text-2xl text-center font-bold text-primary-500 dark:text-primary-400">
              {value}
            </p>
            <p
              className={`text-lg md:text-sm font-semibold text-nowrap ${
                isIncrease ? "text-red-500" : "text-green-500"
              }`}
            >
              {isIncrease ? `${percentage}% ↑` : `${percentage}% ↓`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { data: users } = useFetchData("users");
  const { data: emergencyData } = useFetchData("emergencyRequest");
  const { data: events } = useFetchData("events");
  const { data: announcement } = useFetchData("announcement");

  const activities = [...events, ...announcement];

  const { awaitingResponseCount, resolvedCount } = emergencyData.reduce(
    (counts, emergency) => {
      if (emergency.status === "awaiting response")
        counts.awaitingResponseCount++;
      if (emergency.status === "resolved") counts.resolvedCount++;
      return counts;
    },
    { awaitingResponseCount: 0, resolvedCount: 0 }
  );

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <HeadSide
      child={
        <>
          <DateToday />

          <div className="grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 lg:grid-cols-4 md:my-3 text-wrap cursor-pointer">
            <DashboardCard
              title="Total Responded"
              value={
                loading ? <Spinner setLoading={setLoading} /> : resolvedCount
              }
              img={population}
              onClick={() => handleNavigate("/records")}
            />
            <DashboardCard
              title="Today's Registered"
              value={loading ? <Spinner setLoading={setLoading} /> : 0}
              img={registered}
              onClick={() => handleNavigate("/accounts/users")}
            />
            <DashboardCard
              title="Total Announcement"
              value={
                loading ? (
                  <Spinner setLoading={setLoading} />
                ) : (
                  activities.length
                )
              }
              img={Events}
              onClick={() => handleNavigate("/announcement")}
            />
            <DashboardCard
              title="Emergency"
              value={
                loading ? (
                  <Spinner setLoading={setLoading} />
                ) : (
                  awaitingResponseCount
                )
              }
              img={emergency}
              onClick={() => handleNavigate("/maps")}
            />
          </div>
          <div className="grid relative grid-cols-1 gap-3 md:gap-4 md:w-max-40 lg:grid-cols-4">
            <>
              <div className="order-3 lg:order-1 col-span-1 lg:col-span-3 row-span-5">
                <MapContent isFullscreen={false} />
              </div>
              <div className="order-2 md:order-2 col-span-1">
                <div className="bg-white w-full border-t-4 border-t-orange-500 dark:border-t-orange-400 px-4 flex flex-row items-center py-6 mb-2 shadow-md rounded-md dark:bg-gray-800">
                  <icons.thunder style={{ color: "#FF5733" }} />
                  <div className="flex flex-col ml-3 text-gray-700 dark:text-gray-100 text-md">
                    26.5°C Bagtas Tanza, Cavite
                    <span className="font-thin text-sm text-gray-600 dark:text-gray-200">
                      It's a rainy day, bring your umbrella
                    </span>
                  </div>
                </div>
              </div>
            </>
          </div>
        </>
      }
    />
  );
};

export default Dashboard;
