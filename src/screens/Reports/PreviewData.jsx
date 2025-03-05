import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useFetchData } from "../../hooks/useFetchData";
import { formatDate } from "../../helper/FormatDate";
import {capitalizeFirstLetter} from "../../helper/CapitalizeFirstLetter"

// Table component for displaying filtered data
export const EmergencyTable = ({ data, dataType }) => {
  const { data: responders } = useFetchData("responders");

  const emergencySummary = dataType === "Emergency Summary";

  const ThStyle = ({ labels }) => {
    return (
      <tr className="bg-gray-100">
        {labels.length > 0 &&
          labels.map((label) => (
            <th key={label} className="py-2 px-4 border-b text-left">
              {label}
            </th>
          ))}
      </tr>
    );
  };

  const TdStyle = ({ items }) => {
    return (
      items.length > 0 &&
      items.map((item) => (
        <td key={item} className="py-2 px-4 border-b text-sm">
          {item ? capitalizeFirstLetter(item.toString()) :"N/A"}
        </td>
      ))
    );
  };

  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        {emergencySummary ? (
          <ThStyle
            labels={["ID", "Type", "Location", "Responder", "Logs", "Date"]}
          />
        ) : (
          <ThStyle
            labels={[
              "ID",
              "Email",
              "Fullname",
              "Gender",
              "Age",
              "Address",
              "Phone",
            ]}
          />
        )}
      </thead>
      <tbody>
        {data.map((data, index) => {
          const responderDetails = responders?.find(
            (responder) => responder.id === data?.responderId
          );
          const {
            emergencyId,
            emergencyType,
            location: { geoCodeLocation } = {},
            messageLog,
            timestamp,
            customId,
            fullname,
            email,
            age,
            gender,
            address,
            mobileNum,
          } = data;
          return emergencySummary ? (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <TdStyle
                items={[
                  emergencyId,
                  emergencyType,
                  geoCodeLocation,
                  responderDetails?.fullname,
                  messageLog,
                  formatDate(timestamp),
                ]}
              />
            </tr>
          ) : (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <TdStyle
                items={[
                  customId,
                  email,
                  fullname,
                  age,
                  gender,
                  address,
                  mobileNum,
                ]}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// Chart component for data visualization by days
export const EmergencyChart = ({ data, dataType }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available for chart</div>;
  }

  const emergencySummary = dataType === "Emergency Summary";

  // Process data for the chart (count by day)
  const processChartData = () => {
    // Group emergencies by date
    const dailyCounts = {};

    data.forEach((item) => {
      if (!item.timestamp) return;

      // Format date as YYYY-MM-DD
      const date = new Date(item.timestamp);
      const dateStr = date.toISOString().split("T")[0];

      // Count emergencies per day
      if (dailyCounts[dateStr]) {
        dailyCounts[dateStr]++;
      } else {
        dailyCounts[dateStr] = 1;
      }
    });

    // Convert to array format for Recharts
    const chartData = Object.keys(dailyCounts).map((date) => {
      // Format the date for display (e.g., "Mar 4")
      const displayDate = new Date(date);
      const formattedDate = `${displayDate.toLocaleString("default", {
        month: "short",
      })} ${displayDate.getDate()}`;

      return {
        date: date, // Original date for sorting
        displayDate: formattedDate, // Formatted date for display
        count: dailyCounts[date],
      };
    });

    // Sort by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };

  const chartData = processChartData();

  return (
    <div className="w-full" style={{ height: "300px" }}>
    {emergencySummary ? (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="displayDate" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} emergencies`, "Count"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="count"
            name={emergencySummary ? "Emergency Count" : "Users count" } 
            fill="#4f46e5"
            barSize={40}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="displayDate" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} users`, "Count"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            name="Users Count"
            stroke="#4f46e5" 
            strokeWidth={3} 
            dot={{ r: 5 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    )}
    </div>
  );
};
