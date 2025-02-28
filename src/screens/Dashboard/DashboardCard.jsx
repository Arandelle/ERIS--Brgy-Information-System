import { Tooltip } from "@mui/material";

export const DashboardCard = ({
    title,
    value,
    img,
    onClick,
    onOptionChange,
    selectedOption,
    counts,
    hasOption,
  }) => {
    // Calculate percentage change based on selected period
    const getPercentageChange = () => {
      if (!counts) return 0;
  
      if (!hasOption) {
        const currentValue = counts.current || 0;
        const previousValue = counts.previous || 0;
  
        // If values are the same, return 0%
        if (currentValue === previousValue) {
          return 0;
        }
  
        if (previousValue === 0) {
          return currentValue > 0 ? 100 : 0;
        }
  
        return (((currentValue - previousValue) / previousValue) * 100).toFixed(
          1
        );
      }
  
      if (!hasOption && !counts) return 0;
  
      // Get the appropriate values based on the selected period
      let currentValue = 0;
      let previousValue = 0;
  
      // Match current with previous periods
      switch (selectedOption) {
        case "daily":
          currentValue = counts.daily;
          previousValue = counts.previousDay;
          break;
        case "previousDay":
          currentValue = counts.previousDay;
          previousValue = counts.daily; // Compare with current day
          break;
        case "weekly":
          currentValue = counts.weekly;
          previousValue = counts.previousWeek;
          break;
        case "previousWeek":
          currentValue = counts.previousWeek;
          previousValue = counts.weekly; // Compare with current week
          break;
        case "monthly":
          currentValue = counts.monthly;
          previousValue = counts.previousMonth;
          break;
        case "previousMonth":
          currentValue = counts.previousMonth;
          previousValue = counts.monthly; // Compare with current month
          break;
        default:
          return 0;
      }
  
      // If values are the same, return 0%
      if (currentValue === previousValue) {
        return 0;
      }
  
      if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
      }
  
      return (((currentValue - previousValue) / previousValue) * 100).toFixed(1);
    };
  
    const percentage = getPercentageChange();
    const isIncrease = percentage > 0;
  
    // Get the display value based on the selected period
    const getDisplayValue = () => {
      if (!hasOption) return counts ? counts.current : value;
  
      switch (selectedOption) {
        case "daily":
          return counts.daily;
        case "previousDay":
          return counts.previousDay;
        case "weekly":
          return counts.weekly;
        case "previousWeek":
          return counts.previousWeek;
        case "monthly":
          return counts.monthly;
        case "previousMonth":
          return counts.previousMonth;
        default:
          return value;
      }
    };
  
    const tooltipTitle = () => {
      switch (selectedOption) {
        case "daily":
          return "Compared to yesterday";
        case "previousDay":
          return "Compared to today";
        case "weekly":
          return "Compared to last week";
        case "previousWeek":
          return "Compared to this week";
        case "monthly":
          return "Compared to last month";
        case "previousMonth":
          return "Compared to this month";
        default:
          return "Compared to yesterday's data";
      }
    };
  
    const titleToolTip = tooltipTitle();
    const displayValue = getDisplayValue();
  
    return (
      <div className="relative">
        <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-md rounded-md p-4 w-full mb-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-wrap whitespace-normal w-20 font-bold uppercase text-gray-600 dark:text-gray-400">
              {title}
            </p>
            {hasOption && (
              <select
                id="select"
                value={selectedOption}
                onChange={(e) => onOptionChange(e.target.value)}
                className="text-sm dark:bg-gray-800 dark:text-gray-400 font-semibold text-gray-500 cursor-pointer border-b-1 border-t-0 border-x-0 focus:ring-0"
              >
                <option value="daily">Today</option>
                <option value="previousDay">Yesterday</option>
                <option value="weekly">This week</option>
                <option value="previousWeek">Last Week</option>
                <option value="monthly">This month</option>
                <option value="previousMonth">Last month</option>
              </select>
            )}
          </div>
  
          <div className="flex items-center pt-4 px-2">
            <div className="w-full hidden md:block">
              <img
                src={img}
                alt="Icon"
                onClick={onClick}
                className="h-20 w-20 cursor-pointer"
              />
            </div>
  
            <div
              className={`flex flex-row md:flex-col justify-between w-full
            ${
              hasOption || title === "Today's Emergency"
                ? "items-end"
                : "items-center"
            }`}
            >
              <p
                onClick={onClick}
                className="text-2xl cursor-pointer text-center font-bold text-primary-500 dark:text-primary-400"
              >
                {displayValue}
              </p>
              <p
                className={`text-lg md:text-sm font-semibold cursor-pointer ${
                  title === "Total Responses"
                    ? isIncrease
                      ? "text-green-500"
                      : "text-red-500"
                    : title === "Today's Emergency"
                    ? isIncrease
                      ? "text-red-500"
                      : "text-green-500"
                    : ""
                }`}
              >
                <Tooltip title={titleToolTip} placement="top" arrow>
                  {title === "Total Responses" ||
                  title === "Today's Emergency" ? (
                    percentage !== 0 ? (
                      `${Math.abs(percentage)}% ${isIncrease ? "↑" : "↓"}`
                    ) : (
                      "0%"
                    )
                  ) : (
                    <span className="invisible">extra space</span>
                  )}
                </Tooltip>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };