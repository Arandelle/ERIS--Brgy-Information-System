import React from "react";
import MyCalendar from "./MyCalendar";

  const DashboardCard = ({ title, value }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 sm:w-60">
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
    );
  };

  const Dashboard = () => {
    return (
      <div className="grid justify-start my-4 mx-4">
        <div className="grid grid-cols-4 gap-4">
          <DashboardCard title="Population" value="10,000" />
          <DashboardCard title="Emergency" value="5,000" />
          <DashboardCard title="Reports" value="10,000" />
          <DashboardCard title="Certificates" value="5,000" />
        </div>
        <MyCalendar/>
      </div>
    );
  };

  export default Dashboard;
