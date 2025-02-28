import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFetchData } from "../../hooks/useFetchData";

const EmergencyPieChart = () => {
  const { data: emergencyRequest } = useFetchData("emergencyRequest");
  const [emergencyData, setEmergencyData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;

    // Extract unique years from requests
    const years = [
      ...new Set(emergencyRequest.map((req) => new Date(req.timestamp).getFullYear())),
    ].sort((a, b) => b - a);

    setAvailableYears(years);

  }, [emergencyRequest]);

  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;

    const emergencyMap = new Map();

    emergencyRequest.forEach((request) => {
      if (request.emergencyType && request.timestamp) {
        const year = new Date(request.timestamp).getFullYear();

        if (year === selectedYear) {
          emergencyMap.set(
            request.emergencyType,
            (emergencyMap.get(request.emergencyType) || 0) + 1
          );
        }
      }
    });

    const formattedData = Array.from(emergencyMap, ([name, value]) => ({
      name,
      value,
    }));

    setEmergencyData(formattedData);
  }, [emergencyRequest, selectedYear]);

  const colors = ["#3388df", "#ff7300", "#34d399", "#facc15", "#ec4899", "#6366f1", "#f87171"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-4 h-full shadow-md">
      <div className="flex flex-row items-center justify-center space-x-4 mb-4">
        {availableYears.length > 0 && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded cursor-pointer dark:bg-gray-700 dark:text-gray-200"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
        <h3 className="text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
          Emergency Type Distribution ({selectedYear})
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={emergencyData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {emergencyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#2d3748",
              color: "#fff",
              borderRadius: "5px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmergencyPieChart;
