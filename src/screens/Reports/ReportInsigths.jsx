import React from 'react';

const ReportInsights = ({ filteredData, generateData }) => {
  // Calculate insights based on filtered data
  const getInsights = () => {
    // Return early if no data
    if (!filteredData || filteredData.length === 0) {
      return {
        totalCount: 0,
        averagePerDay: 0,
        trend: "neutral",
        mostCommonLocation: "N/A",
        peakTimes: "N/A",
        comparisonToAverage: 0
      };
    }

    // Total count
    const totalCount = filteredData.length;
    
    // Calculate date range
    let startDate = generateData.startDate ? new Date(generateData.startDate) : null;
    let endDate = generateData.endDate ? new Date(generateData.endDate) : null;
    
    if (!startDate && filteredData.length > 0) {
      // If no start date provided, use earliest date in data
      startDate = new Date(Math.min(...filteredData.map(item => new Date(item.timestamp))));
    }
    
    if (!endDate && filteredData.length > 0) {
      // If no end date provided, use latest date in data
      endDate = new Date(Math.max(...filteredData.map(item => new Date(item.timestamp))));
    }
    
    // Calculate days in range
    const daysDiff = startDate && endDate ? 
      Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))) : 1;
    
    // Average per day
    const averagePerDay = (totalCount / daysDiff).toFixed(1);
    
    // Determine trend (simplified)
    let trend = "neutral";
    if (filteredData.length >= 2) {
      // Group by date and sort chronologically
      const dateGroups = {};
      filteredData.forEach(item => {
        const date = new Date(item.timestamp).toISOString().split('T')[0];
        dateGroups[date] = (dateGroups[date] || 0) + 1;
      });
      
      const sortedDates = Object.keys(dateGroups).sort();
      if (sortedDates.length >= 2) {
        // Compare first half to second half
        const midpoint = Math.floor(sortedDates.length / 2);
        const firstHalfAvg = sortedDates.slice(0, midpoint).reduce((sum, date) => sum + dateGroups[date], 0) / midpoint;
        const secondHalfAvg = sortedDates.slice(midpoint).reduce((sum, date) => sum + dateGroups[date], 0) / (sortedDates.length - midpoint);
        
        if (secondHalfAvg > firstHalfAvg * 1.1) trend = "increasing";
        else if (secondHalfAvg < firstHalfAvg * 0.9) trend = "decreasing";
      }
    }
    
    // Most common location
    const locationCounts = {};
    filteredData.forEach(item => {
      if (item.location && item.location.geoCodeLocation) {
        locationCounts[item.location.geoCodeLocation] = (locationCounts[item.location.geoCodeLocation] || 0) + 1;
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
    
    // Determine peak times
    const hourCounts = Array(24).fill(0);
    filteredData.forEach(item => {
      if (item.timestamp) {
        const hour = new Date(item.timestamp).getHours();
        hourCounts[hour]++;
      }
    });
    
    const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
    const peakTimeStart = maxHour;
    const peakTimeEnd = (maxHour + 1) % 24;
    const peakTimes = `${peakTimeStart}:00-${peakTimeEnd}:00`;
    
    // Calculate comparison to overall average (assuming a baseline of 5 per day)
    const baselineAverage = 5;
    const comparisonToAverage = (averagePerDay / baselineAverage * 100 - 100).toFixed(0);
    
    return {
      totalCount,
      averagePerDay,
      trend,
      mostCommonLocation,
      peakTimes,
      comparisonToAverage
    };
  };
  
  const insights = getInsights();
  const emergencyType = generateData.emergencyType;

  // Trend indicator symbol
  const trendSymbol = {
    increasing: "↑",
    decreasing: "↓",
    neutral: "→"
  };
  
  // Generates meaningful explanatory text based on the insights
  const generateMeaning = () => {
    if (!filteredData || filteredData.length === 0) {
      return "No data available for the selected filters. Try adjusting your date range or emergency type.";
    }
    
    return (
      <div className="text-sm space-y-2 text-gray-600">
        <p className="font-medium">This report shows:</p>
        <p>
          <span className="font-medium">Total <span className='font-bold'>{emergencyType}</span> Emergencies:</span> {insights.totalCount} 
          {insights.trend !== "neutral" && 
            <span className={`ml-1 ${insights.trend === "increasing" ? "text-red-500" : "text-green-500"}`}>
              {trendSymbol[insights.trend]}
            </span>
          }
        </p>
        <p><span className="font-medium">Daily Average:</span> {insights.averagePerDay} incidents per day</p>
        {insights.comparisonToAverage !== 0 && (
          <p>
            <span className="font-medium">Compared to Baseline:</span> 
            <span className={Number(insights.comparisonToAverage) > 0 ? "text-red-500" : "text-green-500"}>
              {" "}{insights.comparisonToAverage > 0 ? "+" : ""}{insights.comparisonToAverage}%
            </span>
          </p>
        )}
        {insights.mostCommonLocation !== "N/A" && (
          <p><span className="font-medium">Hotspot:</span> {insights.mostCommonLocation}</p>
        )}
        {insights.peakTimes !== "N/A" && (
          <p><span className="font-medium">Peak Hours:</span> {insights.peakTimes}</p>
        )}
        <p className="mt-3 text-gray-400 italic">
          This report will help you {insights.trend === "increasing" ? 
            "identify the rising trend in emergency incidents" : 
            insights.trend === "decreasing" ? 
            "understand the factors contributing to the decrease in incidents" : 
            "analyze the pattern of emergency incidents"}.
        </p>
      </div>
    );
  };

  return generateMeaning();
};

export default ReportInsights;