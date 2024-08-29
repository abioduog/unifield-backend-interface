'use client';

import React, { useState } from 'react';
import { Users, ShoppingBag, CreditCard, Package, AlertCircle, TrendingUp, TrendingDown, Download, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button"; // Updated this line

// Mock data (replace with real API calls in production)
const salesData = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 5000, orders: 300 },
  { month: 'Apr', sales: 2780, orders: 208 },
  { month: 'May', sales: 1890, orders: 180 },
  { month: 'Jun', sales: 2390, orders: 220 },
];

const inventoryData = [
  { name: 'In Stock', value: 70 },
  { name: 'Low Stock', value: 20 },
  { name: 'Out of Stock', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

const QuickLink = ({ icon: Icon, label }) => (
  <Button className="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition duration-300">
    <Icon size={20} className="mr-2" />
    {label}
  </Button>
);

const DashboardAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value="₦15,678,900" 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="12% from last month" 
        />
        <StatCard 
          title="Active Retailers" 
          value="1,234" 
          icon={Users} 
          trend="up" 
          trendValue="5% from last month" 
        />
        <StatCard 
          title="Credit Utilization" 
          value="65%" 
          icon={CreditCard} 
          trend="down" 
          trendValue="3% from last month" 
        />
        <StatCard 
          title="Inventory Levels" 
          value="12,345" 
          icon={Package} 
          trend="up" 
          trendValue="2% from last week" 
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-time Updates</h2>
        <ul className="space-y-3">
          <li className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2 text-blue-500" />
            <span>New retailer signed up: Electronics Plus (2 minutes ago)</span>
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <ShoppingBag size={16} className="mr-2 text-green-500" />
            <span>Large order placed: ₦500,000 by Supermart Store (15 minutes ago)</span>
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <AlertCircle size={16} className="mr-2 text-red-500" />
            <span>Low stock alert: Coca-Cola 500ml (1 hour ago)</span>
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <QuickLink icon={Users} label="Add New Retailer" />
          <QuickLink icon={ShoppingBag} label="Process Order" />
          <QuickLink icon={Package} label="Update Inventory" />
          <QuickLink icon={CreditCard} label="Manage Credits" />
        </div>
      </div>
    </div>
  );

  const renderAdvancedAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Sales Trends</h2>
          <div className="flex items-center space-x-2">
            <Button className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition duration-300">
              <Filter size={20} />
            </Button>
            <Button className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg transition duration-300">
              <Download size={20} />
            </Button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Turnover</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customizable KPI Tracking</h2>
        <p className="text-gray-600 mb-4">Implement custom KPI tracking components here based on user preferences.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <Button
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview Dashboard
        </Button>
        <Button
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Advanced Analytics
        </Button>
      </div>

      {activeTab === 'overview' ? renderOverviewDashboard() : renderAdvancedAnalytics()}
    </div>
  );
};

export default DashboardAnalytics;