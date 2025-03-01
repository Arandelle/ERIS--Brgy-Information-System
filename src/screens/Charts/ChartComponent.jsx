import React from "react";
import { Area, AreaChart, Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ChartComponent = ({
  data,
  availableYears,
  selectedYear,
  setSelectedYear,
  dataKey,
  type,
}) => {

  const barColors = [
    "#3388df",
    "#ff7300",
    "#34d399",
    "#facc15",
    "#ec4899",
    "#6366f1",
    "#f87171",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-4">
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
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
        {dataKey === "account" ? "Total User Accounts" : "Total Emergency Requests"}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
      {type === "bar" ? (
        <BarChart data={data}>
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
          <Bar dataKey={"account"} barSize={40} radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={barColors[index % barColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <AreaChart data={data}>
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
            <Area type="monotone" dataKey={dataKey} stroke="#3388df" fill="#3388df" />
          </AreaChart>
      )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
