import React, {useState, useEffect} from "react";
import { useFetchData } from "../../hooks/useFetchData";

const useChartData = (
    endpoint, 
    dataKey
) => {
  const { data } = useFetchData(endpoint);
  const [ chartData, setChartData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Extract unique years from requests
    const years = [
      ...new Set(data.map((req) => new Date(req.timestamp).getFullYear())),
    ].sort((a, b) => b - a);

    setAvailableYears(years);

  }, [data]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const dataMap = new Map();
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // e.g., March = 2

    data.forEach((item) => {
      if (item.timestamp) {
        const date = new Date(item.timestamp);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();

        // Filter by selected year
        if (year === selectedYear) {
          dataMap.set(month, (dataMap.get(month) || 0) + 1);
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
      [dataKey]: dataMap.get(month) || 0,
    }));

    setChartData(formattedData);
  }, [data, selectedYear]);

  return {
    chartData,
    availableYears,
    selectedYear,
    setSelectedYear,
  };
};

export default useChartData;
