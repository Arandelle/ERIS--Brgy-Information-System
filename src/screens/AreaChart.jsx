import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFetchData } from "../hooks/useFetchData";

const EmergencyAreaChart = () => {
  const { data: emergencyRequest } = useFetchData("emergencyRequest");
  const [emergencyData, setEmergencyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // defaul to current year

  useEffect(() => {
    if (!emergencyRequest && emergencyRequest.leng === 0) return;

    const emergencyMap = new Map();
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // march = 02

    emergencyRequest.forEach((request) => {
      if (request.timestamp) {
        const date = new Date(request.timestamp);
        const month = date.toLocaleString('default', { month: "short" }); //ex: "Jan", "Feb", etc
        const year = date.getFullYear();

        // filter based on selected year
        if (year === selectedYear) {
          emergencyMap.set(month, (emergencyMap.get(month) || 0) + 1);
        }
      }
    });

    // Filter month based on selected year
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
    const filteredMonths =
      selectedYear === currentYear
        ? months.slice(0, currentMonthIndex + 1)
        : months;

    const formattedData = filteredMonths.map((month) => ({
      name: month,
      requests: emergencyMap.get(month) || 0,
    }));

    setEmergencyData(formattedData);
  }, [emergencyRequest, selectedYear]);

  return (
    <div>
      <div className="flex flex-row items-center justify-center p-4 space-x-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border-none rounded cursor-pointer"
        >
          {[
            ...new Set(
              emergencyRequest.map((req) =>
                new Date(req.timestamp).getFullYear()
              )
            ),
          ]
            .sort((a, b) => b - a)
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
        <p>Total Emergency Request</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={emergencyData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="requests"
            stroke="#3388df"
            fill="#3388df"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmergencyAreaChart;
