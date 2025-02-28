import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapContent from "../Maps/MapContent";
import population from "../../assets/images/population.svg";
import Events from "../../assets/images/events.svg";
import emergency from "../../assets/images/emergency.svg";
import navigator from "../../assets/images/direction.svg";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import DateToday from "../../helper/DateToday";
import { useFetchData } from "../../hooks/useFetchData";
import Heatmap from "../Maps/Heatmap";
import EmergencyBarChart from "../EmergencyBarChart";
import CertificateList from "../Certification/CertificateList";
import { DashboardCard } from "./DashboardCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: emergencyData } = useFetchData("emergencyRequest");
  const { data: clearanceData } = useFetchData("requestClearance");
  const [selectedOption, setSelectedOption] = useState("monthly");

  const onGoing = emergencyData.filter((item) => item.status === "on-going");
  const pending = clearanceData.filter((item) => item.status === "pending");

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
    <HeaderAndSideBar
      content={
        <>
          <DateToday />

          <div className="grid sm:grid-cols-1 gap-0 md:grid-cols-2 md:gap-4 md:w-max-40 xl:grid-cols-4 md:my-3 text-wrap space-y-2 md:space-y-0">
            <DashboardCard
              title="Total Responses"
              value={counts[selectedOption]}
              img={population}
              onClick={() => handleNavigate("/records")}
              selectedOption={selectedOption}
              onOptionChange={handleOptionChange}
              counts={counts}
              hasOption={true}
            />
            <DashboardCard
              title="Today's Emergency"
              value={counts.awaitingResponse.current}
              img={emergency}
              onClick={() => handleNavigate("/maps")}
              hasOption={false}
              counts={counts.awaitingResponse}
            />
            <DashboardCard
              title="On-Going Emergency"
              value={onGoing.length}
              img={navigator}
              onClick={() => handleNavigate("/maps")}
              hasOption={false}
            />
            <DashboardCard
              title="Total Certification"
              value={pending.length}
              img={Events}
              onClick={() => handleNavigate("/certification")}
              hasOption={false}
            />
          </div>

          <div className="grid gap-3 md:gap-4 lg:grid-cols-4 lg:grid-rows-12 my-4 ">
            <>
              <div className="col-span-4 lg:col-span-3 row-span-5 bg-white rounded-md">
                <EmergencyBarChart />
              </div> 
              <div className="col-span-4 lg:col-span-1 row-span-5">
                <CertificateList pending={pending}/>
              </div>
              <div className="h-svh lg:h-full col-span-4 row-span-7">
              <Heatmap/>
            </div>
            </>
          </div>
        </>
      }
    />
  );
};

export default Dashboard;
