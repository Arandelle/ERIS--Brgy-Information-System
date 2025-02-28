import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', requests: 2 },
  { month: 'Feb', requests: 5 },
  { month: 'Mar', requests: 10 },
  { month: 'Apr', requests: 2 },
  { month: 'May', requests: 1 }
];

const EmergencyBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="requests" fill="#3388ff" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EmergencyBarChart;
