import ChartComponent from "./ChartComponent";
import useChartData from "./useChartData";

const EmergencyAreaChart = () => {
  const {chartData, availableYears, selectedYear,setSelectedYear} = useChartData("emergencyRequest", "requests");
  return (
    <ChartComponent 
      data={chartData}
      availableYears={availableYears}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      dataKey="requests"
      type="area"
    />
  );
};

export default EmergencyAreaChart;
