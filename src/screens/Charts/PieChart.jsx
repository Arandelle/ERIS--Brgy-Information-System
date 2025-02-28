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

  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return;

    const emergencyMap = new Map();

    emergencyRequest.forEach((request) => {
      if (request.emergencyType) {
        emergencyMap.set(
          request.emergencyType,
          (emergencyMap.get(request.emergencyType) || 0) + 1
        );
      }
    });

    const formattedData = Array.from(emergencyMap, ([name, value]) => ({
      name,
      value,
    }));

    setEmergencyData(formattedData);
  }, [emergencyRequest]);

  const colors = ["#3388df", "#ff7300", "#34d399", "#facc15", "#ec4899", "#6366f1", "#f87171"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-4">
      <h3 className="text-center text-gray-600 dark:text-gray-400 font-medium">
        Emergency Type Distribution
      </h3>
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
