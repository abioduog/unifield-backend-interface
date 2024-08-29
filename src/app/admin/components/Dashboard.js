import React from 'react';
import { Users, ShoppingBag, CreditCard, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <Icon className="text-blue-500" size={24} />
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
      {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      <span className="ml-1 text-sm">{trendValue}</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Retailers" 
          value="1,234" 
          icon={Users} 
          trend="up" 
          trendValue="5% from last month" 
        />
        <StatCard 
          title="Total Sales" 
          value="₦15,678,900" 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="12% from last month" 
        />
        <StatCard 
          title="Credit Utilization" 
          value="65%" 
          icon={CreditCard} 
          trend="down" 
          trendValue="3% from last month" 
        />
        <StatCard 
          title="Active Alerts" 
          value="7" 
          icon={AlertCircle} 
          trend="up" 
          trendValue="2 more than yesterday" 
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <ul className="space-y-3">
          <li className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2 text-blue-500" />
            <span>New retailer registered: Electronics Plus</span>
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <ShoppingBag size={16} className="mr-2 text-green-500" />
            <span>Large order placed: ₦500,000 by Supermart Store</span>
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <AlertCircle size={16} className="mr-2 text-red-500" />
            <span>Low stock alert: Coca-Cola 500ml</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;