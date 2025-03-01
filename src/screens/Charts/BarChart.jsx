import ChartComponent from "./ChartComponent";
import useChartData from "./useChartData";

const EmergencyBarChart = () => {
  const {chartData, availableYears, selectedYear, setSelectedYear} = useChartData("users", "account");

  return (
   <ChartComponent 
    data={chartData}
    availableYears={availableYears}
    selectedYear={selectedYear}
    setSelectedYear={setSelectedYear}
    dataKey="account"
    type="bar"
   />
  );
};

export default EmergencyBarChart;
