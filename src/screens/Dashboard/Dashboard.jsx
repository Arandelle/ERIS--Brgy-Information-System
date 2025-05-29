import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapContent from "../Maps/MapContent";
import population from "../../assets/images/population.svg";
import Events from "../../assets/images/events.svg";
import emergency from "../../assets/images/emergency.svg";
import navigator from "../../assets/images/direction.svg";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import DateToday from "../../helper/DateToday";
import { useFetchData } from "../../hooks/useFetchData";
import MainMap from "../Maps/MainMap";
import EmergencyAreaChart from "../Charts/AreaChart";
import CertificateList from "../Certification/CertificateList";
import { DashboardCard } from "./DashboardCard";
import  BarChart  from "../Charts/BarChart";
import  PieChart  from "../Charts/PieChart";
import ChatSystem from "../ChatSystem";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: emergencyData } = useFetchData("emergencyRequest");
  const { data: clearanceData } = useFetchData("requestClearance");
  const [selectedOption, setSelectedOption] = useState("monthly");
  const [maximize, setMaximize] = useState(false);

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
          counts.pending.current++;
        } else if (emergencyDate >= yesterday && emergencyDate < today) {
          counts.pending.previous++;
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
        pending: {
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

  useEffect(() => {
    if(maximize){
      navigate("/maps");
    } 
  },[maximize]);

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
              value={counts.pending.current}
              img={emergency}
              onClick={() => handleNavigate("/maps")}
              hasOption={false}
              counts={counts.pending}
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

          <div className="grid gap-3 md:gap-4 lg:grid-cols-4 lg:grid-rows-8 my-4 ">
            <>
              <div className="col-span-4 lg:col-span-3 row-span-4">
                <EmergencyAreaChart />
              </div>
              <div className="col-span-4 lg:col-span-1 row-span-4">
                <CertificateList pending={pending}/>
              </div>
              <div className="col-span-4 lg:col-span-2 row-span-4">
                <BarChart />
              </div> 
              <div className="col-span-4 lg:col-span-2 row-span-4">
                <PieChart />
              </div> 

              <ChatSystem />
            </>
          </div>
          <div className="h-svh">
              <MainMap maximize={maximize} setMaximize={setMaximize}/>
          </div>

        </>
      }
    />
  );
};

export default Dashboard;
