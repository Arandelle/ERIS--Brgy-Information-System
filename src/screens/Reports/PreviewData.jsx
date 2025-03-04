import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFetchData } from '../../hooks/useFetchData';


// Table component for displaying filtered data
export const EmergencyTable = ({ data }) => {
 const {data: responders} = useFetchData("responders");

  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-left">ID</th>
          <th className="py-2 px-4 border-b text-left">Type</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Location</th>
          <th className="py-2 px-4 border-b text-left">Responder</th>
          <th className="py-2 px-4 border-b text-left">Logs</th>
          <th className="py-2 px-4 border-b text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((request, index) => {
            const responderDetails = responders?.find((responder) => responder.id === request?.responderId);

        return(
        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
            <td className="py-2 px-4 border-b">{request.emergencyId || "N/A"}</td>
            <td className="py-2 px-4 border-b">{request.emergencyType || "N/A"}</td>
            <td className="py-2 px-4 border-b">{request.status || "N/A"}</td>
            <td className="py-2 px-4 border-b">{request.location?.geoCodeLocation || "N/A"}</td>
            <td className="py-2 px-4 border-b">{responderDetails?.fullname|| "N/A"}</td>
            <td className="py-2 px-4 border-b">{request.messageLog || "N/A"}</td> 
            <td className="py-2 px-4 border-b">{new Date(request.timestamp).toLocaleString() || "N/A"}</td>
          </tr>
        )})}
      </tbody>
    </table>
  );
};

// Chart component for data visualization by days
export const EmergencyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available for chart</div>;
  }

  // Process data for the chart (count by day)
  const processChartData = () => {
    // Group emergencies by date
    const dailyCounts = {};
    
    data.forEach(item => {
      if (!item.timestamp) return;
      
      // Format date as YYYY-MM-DD
      const date = new Date(item.timestamp);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count emergencies per day
      if (dailyCounts[dateStr]) {
        dailyCounts[dateStr]++;
      } else {
        dailyCounts[dateStr] = 1;
      }
    });
    
    // Convert to array format for Recharts
    const chartData = Object.keys(dailyCounts).map(date => {
      // Format the date for display (e.g., "Mar 4")
      const displayDate = new Date(date);
      const formattedDate = `${displayDate.toLocaleString('default', { month: 'short' })} ${displayDate.getDate()}`;
      
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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="displayDate" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} emergencies`, 'Count']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Bar dataKey="count" name="Emergency Count" fill="#4f46e5" barSize={40} radius={[4, 4, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};