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

const DashboardCard = ({
  title,
  value,
  img,
  onClick,
  onOptionChange,
  selectedOption,
  counts,
  hasOption,
}) => {
  // Calculate percentage change based on selected period
  const getPercentageChange = () => {
    if (!counts) return 0;

    if (!hasOption) {
      const currentValue = counts.current || 0;
      const previousValue = counts.previous || 0;

      if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
      }

      return (((currentValue - previousValue) / previousValue) * 100).toFixed(
        1
      );
    }

    if (!hasOption && !counts) return 0;

    const now = new Date();
    const currentValue = counts[selectedOption];
    let previousValue = 0;

    switch (selectedOption) {
      case "daily":
        // Compare with yesterday's count
        previousValue = counts.previousDay || 0;
        break;
      case "weekly":
        // Compare with previous week's count
        previousValue = counts.previousWeek || 0;
        break;
      case "monthly":
        // Compare with previous month's count
        previousValue = counts.previousMonth || 0;
        break;
      default:
        return 0;
    }

    // Avoid division by zero
    if (previousValue === 0) {
      return currentValue > 0 ? 100 : 0;
    }

    return (((currentValue - previousValue) / previousValue) * 100).toFixed(1);
  };

  const percentage = getPercentageChange();
  const isIncrease = percentage > 0;
  const displayValue = hasOption
    ? counts[selectedOption]
    : counts
    ? counts.current
    : value;

  return (
    <div className="relative">
      <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-md rounded-md p-4 w-full mb-3 md:mb-0">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
            {title}
          </p>
          {hasOption && (
            <select
              id="select"
              value={selectedOption}
              onChange={(e) => onOptionChange(e.target.value)}
              className="text-sm font-semibold text-gray-500 cursor-pointer border-b-1 border-t-0 border-x-0 focus:ring-0"
            >
              <option value="daily">Today</option>
              <option value="weekly">This week</option>
              <option value="monthly">This month</option>
            </select>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="w-full hidden md:block">
            <img
              src={img}
              alt="Icon"
              onClick={onClick}
              className="h-16 w-16 cursor-pointer"
            />
          </div>

          <div className="flex flex-row md:flex-col justify-between w-full items-center md:items-end">
            <p
              onClick={onClick}
              className="text-2xl cursor-pointer text-center font-bold text-primary-500 dark:text-primary-400"
            >
              {displayValue}
            </p>
            <p
              className={`text-lg md:text-sm font-semibold text-nowrap ${
                title === "Total Responded"
                  ? isIncrease
                    ? "text-green-500" // Resolved increase (good)
                    : "text-red-500" // Resolved decrease (bad)
                  : title === "Emergency"
                  ? isIncrease
                    ? "text-red-500" // Awaiting increase (bad)
                    : "text-green-500" // Awaiting decrease (good)
                  : ""
              }`}
            >
              {(title === "Total Responded" || title === "Emergency") &&
                (percentage !== 0
                  ? `${Math.abs(percentage)}% ${isIncrease ? "↑" : "↓"}`
                  : "0%")}
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
  const [selectedOption, setSelectedOption] = useState("monthly");

  const activities = [...events, ...announcement];

  const calculateCounts = (emergencyData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return emergencyData.reduce(
      (counts, emergency) => {
        const emergencyDate = new Date(emergency.timestamp);
        const isResolved = emergency.status === "resolved";

        // total emergencies counts regardless of status
        if (emergencyDate >= today) {
          counts.awaitingResponse.current++;
        } else if (emergencyDate >= yesterday && emergencyDate < today) {
          counts.awaitingResponse.previous++;
        }

        if (isResolved) {
          // Daily resolved counts
          if (emergencyDate >= today) {
            counts.daily++;
          } else if (emergencyDate >= yesterday && emergencyDate < today) {
            counts.previousDay++;
          }

          // Weekly resolved counts
          if (emergencyDate >= thisWeekStart) {
            counts.weekly++;
          } else if (
            emergencyDate >= lastWeekStart &&
            emergencyDate < thisWeekStart
          ) {
            counts.previousWeek++;
          }

          // Monthly resolved counts
          if (emergencyDate >= thisMonthStart) {
            counts.monthly++;
          } else if (
            emergencyDate >= lastMonthStart &&
            emergencyDate < thisMonthStart
          ) {
            counts.previousMonth++;
          }
        }

        return counts;
      },
      {
        awaitingResponse: {
          current: 0, // Today's awaiting
          previous: 0, // Yesterday's awaiting
        },
        daily: 0,
        previousDay: 0,
        weekly: 0,
        previousWeek: 0,
        monthly: 0,
        previousMonth: 0,
      }
    );
  };

  const counts = calculateCounts(emergencyData);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };
  const now = new Date();
  
  return (
    <HeadSide
      child={
        <>
          <DateToday />

          <div className="grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 xl:grid-cols-4 md:my-3 text-wrap space-y-2 md:space-y-0">
            <DashboardCard
              title="Total Responded"
              value={
                loading ? (
                  <Spinner setLoading={setLoading} />
                ) : (
                  counts[selectedOption]
                )
              }
              img={population}
              onClick={() => handleNavigate("/records")}
              selectedOption={selectedOption}
              onOptionChange={handleOptionChange}
              counts={counts}
              hasOption={true}
            />
            <DashboardCard
              title="Today's Register"
              value={loading ? <Spinner setLoading={setLoading} /> : 0}
              img={registered}
              onClick={() => handleNavigate("/accounts/users")}
              hasOption={false}
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
              hasOption={false}
            />
            <DashboardCard
              title="Emergency"
              value={
                loading ? (
                  <Spinner setLoading={setLoading} />
                ) : (
                  counts.awaitingResponse.current
                )
              }
              img={emergency}
              onClick={() => handleNavigate("/maps")}
              hasOption={false}
              counts={counts.awaitingResponse}
            />
          </div>
          <div className="grid relative grid-cols-1 gap-3 md:gap-4 md:w-max-40 lg:grid-cols-4">
            <>
              <div className="order-3 lg:order-1 col-span-1 lg:col-span-3 row-span-5">
                <MapContent isFullscreen={false} />
              </div>
              <div className="my-2 md:my-0 order-2 md:order-2 col-span-1">
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
