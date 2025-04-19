import React from 'react';
import {
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const Home: React.FC = () => {
  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Other', value: 200 },
  ];

  const recentOrders = [
    {
      id: '#1234',
      customer: 'John Doe',
      date: '2023-10-15',
      total: '$120.00',
      status: 'Delivered',
    },
    {
      id: '#1235',
      customer: 'Jane Smith',
      date: '2023-10-14',
      total: '$85.50',
      status: 'Processing',
    },
    {
      id: '#1236',
      customer: 'Robert Johnson',
      date: '2023-10-13',
      total: '$220.00',
      status: 'Shipped',
    },
    {
      id: '#1237',
      customer: 'Emily Davis',
      date: '2023-10-12',
      total: '$45.75',
      status: 'Delivered',
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex-grow h-screen gap-4 p-8 bg-transparent text-black flex flex-col ">
      <div className="w-full p-4 rounded-md bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <p className="text-gray-500">
          Here's what's happening in your store today
        </p>
      </div>

      <div className="w-full flex gap-4">
        <div className="grow p-4 rounded-md bg-white shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <FaUsers className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">1,482</p>
            <p className="text-green-500 text-sm">+12% from last month</p>
          </div>
        </div>
        <div className="grow p-4 rounded-md bg-white shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <FaShoppingCart className="text-green-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500">Orders</p>
            <p className="text-2xl font-bold">328</p>
            <p className="text-green-500 text-sm">+8% from last month</p>
          </div>
        </div>
        <div className="grow p-4 rounded-md bg-white shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <FaMoneyBillWave className="text-purple-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500">Revenue</p>
            <p className="text-2xl font-bold">$12,875</p>
            <p className="text-green-500 text-sm">+23% from last month</p>
          </div>
        </div>
        <div className="grow p-4 rounded-md bg-white shadow-sm flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4">
            <FaChartLine className="text-yellow-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500">Avg. Order Value</p>
            <p className="text-2xl font-bold">$39.25</p>
            <p className="text-red-500 text-sm">-2% from last month</p>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-4">
        <div className="grow-6 p-4 rounded-md bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grow-4 p-4 rounded-md bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full flex gap-4">
        <div className="grow-7 p-4 rounded-md bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Customer</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Total</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-2 px-4">{order.id}</td>
                    <td className="py-2 px-4">{order.customer}</td>
                    <td className="py-2 px-4">{order.date}</td>
                    <td className="py-2 px-4">{order.total}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grow-3 p-4 rounded-md bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <FaUsers size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <FaShoppingCart size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">New order placed #1237</p>
                <p className="text-xs text-gray-500">45 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                <FaShoppingCart size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">Order #1234 delivered</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                <FaUsers size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Customer feedback received
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
