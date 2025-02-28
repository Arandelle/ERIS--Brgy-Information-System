import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useFetchData } from "../../hooks/useFetchData";
import { useEffect, useState } from "react";

const EmergencyBarChart = () => {
  const { data: users } = useFetchData("users");
  const [userData, setUserData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!users || users.length === 0) return;

    const userMap = new Map();
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // e.g., March = 2

    users.forEach((user) => {
      if (user.timestamp) {
        const date = new Date(user.timestamp);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();

        // Filter by selected year
        if (year === selectedYear) {
          userMap.set(month, (userMap.get(month) || 0) + 1);
        }
      }
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    // If current year, show only available months (up to the current month)
    const filteredMonths =
      selectedYear === currentYear
        ? months.slice(0, currentMonthIndex + 1)
        : months;

    const formattedData = filteredMonths.map((month) => ({
      name: month,
      account: userMap.get(month) || 0,
    }));

    setUserData(formattedData);
  }, [users, selectedYear]);

  const barColors = ["#3388df", "#ff7300", "#34d399", "#facc15", "#ec4899", "#6366f1", "#f87171"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-4">
      <div className="flex flex-row items-center justify-center space-x-4 mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded cursor-pointer dark:bg-gray-700 dark:text-gray-200"
        >
          {[
            ...new Set(
              users.map((req) => new Date(req.timestamp).getFullYear())
            ),
          ]
            .sort((a, b) => b - a)
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          Total User Accounts
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={userData}>
          <XAxis dataKey="name" stroke="#3388df" />
          <YAxis stroke="#3388df" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2d3748",
              color: "#fff",
              borderRadius: "5px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Bar dataKey={"account"} barSize={40} radius={[4,4,0,0]}>
            {userData.map((entry,index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmergencyBarChart;
