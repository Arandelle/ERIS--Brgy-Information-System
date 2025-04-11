import React from 'react';

const UsersInsights = ({ filteredData, generateData }) => {
  // Calculate insights based on filtered user data
  const getInsights = () => {
    if (!filteredData || filteredData.length === 0) {
      return {
        totalUsers: 0,
        averageNewUsersPerDay: 0,
        daysDiff: 0,
        trend: "neutral",
        mostCommonLocation: "N/A",
        peakRegistrationTimes: "N/A",
        comparisonToAverage: 0
      };
    }

    // Total users
    const totalUsers = filteredData.length;

    // Calculate date range
    let startDate = generateData.startDate ? new Date(generateData.startDate) : null;
    let endDate = generateData.endDate ? new Date(generateData.endDate) : null;

    if (!startDate && filteredData.length > 0) {
      startDate = new Date(Math.min(...filteredData.map(user => new Date(user.timestamp))));
    }

    if (!endDate && filteredData.length > 0) {
      endDate = new Date(Math.max(...filteredData.map(user => new Date(user.timestamp))));
    }

    // Calculate days in range - ensure minimum of 1 day
    const daysDiff = startDate && endDate ? 
      Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))) : 1;

    // Average new users per day (keep as precise number)
    const averageNewUsersPerDay = totalUsers / daysDiff;

    // Determine trend (similar logic to emergency insights)
    let trend = "neutral";
    if (filteredData.length >= 2) {
      const dateGroups = {};
      filteredData.forEach(user => {
        const date = new Date(user.timestamp).toISOString().split('T')[0];
        dateGroups[date] = (dateGroups[date] || 0) + 1;
      });

      const sortedDates = Object.keys(dateGroups).sort();
      if (sortedDates.length >= 2) {
        const midpoint = Math.floor(sortedDates.length / 2);
        const firstHalfAvg = sortedDates.slice(0, midpoint).reduce((sum, date) => sum + dateGroups[date], 0) / midpoint;
        const secondHalfAvg = sortedDates.slice(midpoint).reduce((sum, date) => sum + dateGroups[date], 0) / (sortedDates.length - midpoint);

        if (secondHalfAvg > firstHalfAvg * 1.1) trend = "increasing";
        else if (secondHalfAvg < firstHalfAvg * 0.9) trend = "decreasing";
      }
    }

    // Most common registration location
    const locationCounts = {};
    filteredData.forEach(user => {
      if (user.location && user.location.geoCodeLocation) {
        locationCounts[user.location.geoCodeLocation] = (locationCounts[user.location.geoCodeLocation] || 0) + 1;
      }
    });

    let mostCommonLocation = "N/A";
    let maxLocationCount = 0;
    Object.entries(locationCounts).forEach(([location, count]) => {
      if (count > maxLocationCount) {
        mostCommonLocation = location;
        maxLocationCount = count;
      }
    });

    // Determine peak registration times
    const hourCounts = Array(24).fill(0);
    filteredData.forEach(user => {
      if (user.timestamp) {
        const hour = new Date(user.timestamp).getHours();
        hourCounts[hour]++;
      }
    });

    const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
    const peakTimeStart = maxHour;
    const peakTimeEnd = (maxHour + 1) % 24;
    const peakRegistrationTimes = `${peakTimeStart}:00-${peakTimeEnd}:00`;

    // Calculate comparison to overall average (assuming a baseline of 10 new users per day)
    const baselineAverage = 10;
    const comparisonToAverage = (averageNewUsersPerDay / baselineAverage * 100 - 100).toFixed(0);

    return {
      totalUsers,
      averageNewUsersPerDay,
      daysDiff,
      trend,
      mostCommonLocation,
      peakRegistrationTimes,
      comparisonToAverage
    };
  };

  const insights = getInsights();

  // Trend indicator symbol
  const trendSymbol = {
    increasing: "↑",
    decreasing: "↓",
    neutral: "→"
  };

  // Determine the appropriate time unit to display based on the date range
  const getTimeUnitDisplay = () => {
    const { averageNewUsersPerDay, daysDiff } = insights;
    
    // Format with appropriate precision (2 decimal places max)
    const formatNumber = (num) => {
      return Number.parseFloat(num).toFixed(
        num >= 10 ? 0 : num >= 1 ? 1 : 2
      );
    };
    
    // Select the most appropriate time unit
    if (daysDiff >= 60) {
      // For ranges over 60 days, show per month
      const perMonth = averageNewUsersPerDay * 30;
      return `${formatNumber(perMonth)} per month`;
    } else if (daysDiff >= 14) {
      // For ranges over 14 days, show per week
      const perWeek = averageNewUsersPerDay * 7;
      return `${formatNumber(perWeek)} per week`;
    } else {
      // For shorter ranges, show per day
      return `${formatNumber(averageNewUsersPerDay)} per day`;
    }
  };

  // Generates meaningful explanatory text based on the insights
  const generateMeaning = () => {
    if (!filteredData || filteredData.length === 0) {
      return "No data available for the selected filters. Try adjusting your date range.";
    }

    const userRateDisplay = getTimeUnitDisplay();

    return (
      <div className="text-sm space-y-2">
        <p className="font-medium">This report shows:</p>
        <p>
          <span className="font-medium">Total Users:</span> {insights.totalUsers}
          {insights.trend !== "neutral" && 
            <span className={`ml-1 ${insights.trend === "increasing" ? "text-green-500" : "text-red-500"}`}>
              {trendSymbol[insights.trend]}
            </span>
          }
        </p>
        <p>
          <span className="font-medium">New Users:</span> {userRateDisplay}
          {insights.daysDiff > 1 && (
            <span className="text-gray-500 text-xs ml-1">
              (based on {insights.daysDiff} day{insights.daysDiff !== 1 ? 's' : ''} of data)
            </span>
          )}
        </p>
        {insights.comparisonToAverage !== 0 && (
          <p>
            <span className="font-medium">Compared to Baseline:</span> 
            <span className={Number(insights.comparisonToAverage) > 0 ? "text-green-500" : "text-red-500"}>
              {" "}{insights.comparisonToAverage > 0 ? "+" : ""}{insights.comparisonToAverage}%
            </span>
          </p>
        )}
        {insights.mostCommonLocation !== "N/A" && (
          <p><span className="font-medium">Most Registrations From:</span> {insights.mostCommonLocation}</p>
        )}
        {insights.peakRegistrationTimes !== "N/A" && (
          <p><span className="font-medium">Peak Registration Hours:</span> {insights.peakRegistrationTimes}</p>
        )}
        <p className="mt-3 text-gray-500 italic">
          This report helps you {insights.trend === "increasing" ? 
            "track user growth trends and onboarding success" : 
            insights.trend === "decreasing" ? 
            "analyze why new user signups may be slowing down" : 
            "monitor user registration trends"}.
        </p>
      </div>
    );
  };

  return generateMeaning();
};

export default UsersInsights;