import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for admin dashboard
  const siteStats = {
    totalUsers: 45,
    activeWorkers: 32,
    supervisors: 8,
    admins: 5,
    checklistCompletionRate: 78,
    openHazards: 7,
    resolvedHazards: 24,
    safetyScore: 92
  };
  
  // Chart data
  const userDistributionData = {
    labels: ['Workers', 'Supervisors', 'Admins'],
    datasets: [
      {
        data: [siteStats.activeWorkers, siteStats.supervisors, siteStats.admins],
        backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899'],
        borderColor: ['#3B82F6', '#8B5CF6', '#EC4899'],
        borderWidth: 1,
      },
    ],
  };
  
  const hazardTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Reported Hazards',
        data: [12, 19, 15, 8, 13, 17, 14, 16, 19, 15, 21, 7],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Resolved Hazards',
        data: [8, 15, 12, 7, 10, 15, 13, 14, 16, 12, 18, 5],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const complianceRateData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Compliance Rate (%)',
        data: [65, 72, 78, 82],
        backgroundColor: '#6366F1',
        borderRadius: 6,
      },
    ],
  };

  const recentUsers = [
    { id: 1, name: 'John Smith', role: 'Worker', status: 'Active', lastActive: '2023-11-02' },
    { id: 2, name: 'Maria Garcia', role: 'Supervisor', status: 'Active', lastActive: '2023-11-03' },
    { id: 3, name: 'Robert Johnson', role: 'Worker', status: 'Inactive', lastActive: '2023-10-15' },
    { id: 4, name: 'Sarah Williams', role: 'Worker', status: 'Active', lastActive: '2023-11-01' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8 mt-10"
    >
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-xl text-white text-opacity-90">Welcome back, <span className="font-semibold">{user?.name || 'Admin'}</span>!</p>
            </div>
            <div className="flex space-x-2 bg-white bg-opacity-20 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'overview' 
                  ? 'bg-white text-indigo-700 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('analytics')} 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'analytics' 
                  ? 'bg-white text-indigo-700 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'}`}
              >
                Analytics
              </button>
              <button 
                onClick={() => setActiveTab('users')} 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'users' 
                  ? 'bg-white text-indigo-700 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'}`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveTab('system')} 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'system' 
                  ? 'bg-white text-indigo-700 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'}`}
              >
                System
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Analytics Charts Section */}
      {activeTab === 'analytics' && (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800">User Distribution</h2>
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={userDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                  cutout: '65%',
                }}
              />
            </div>
          </div>
          
          <div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Hazard Trends (Annual)</h2>
            <div className="h-64">
              <Line 
                data={hazardTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          
          <div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-white md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly Compliance Rate</h2>
            <div className="h-64">
              <Bar 
                data={complianceRateData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Site Stats */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-gray-700 font-medium">Total Users</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">{siteStats.totalUsers}</p>
          <div className="mt-2 text-sm flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{siteStats.activeWorkers} Workers</span>
            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full">{siteStats.supervisors} Supervisors</span>
            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">{siteStats.admins} Admins</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-gray-700 font-medium">Checklist Completion</h3>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-green-100">
              <div style={{ width: `${siteStats.checklistCompletionRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-500"></div>
            </div>
          </div>
          <p className="text-4xl font-bold text-green-600">{siteStats.checklistCompletionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Site-wide completion rate</p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-gray-700 font-medium">Open Hazards</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{siteStats.openHazards}</p>
          <p className="text-sm text-gray-500 mt-1">Requiring attention</p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-gray-700 font-medium">Resolved Hazards</h3>
          </div>
          <p className="text-4xl font-bold text-green-600">{siteStats.resolvedHazards}</p>
          <p className="text-sm text-gray-500 mt-1">Successfully addressed</p>
        </motion.div>
      </motion.div>
      
      {/* Admin Actions */}
      <motion.div 
        variants={itemVariants}
        className="glass-card rounded-xl shadow-lg p-8 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Admin Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/user-management" className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span>User Management</span>
          </Link>
          <Link to="/site-settings" className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span>Site Settings</span>
          </Link>
          <Link to="/reports" className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>Generate Reports</span>
          </Link>
          <Link to="/audit-logs" className="flex items-center p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Audit Logs</span>
          </Link>
        </div>
      </motion.div>
      
      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New User
            </button>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <button className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-blue-600 font-medium hover:bg-blue-50 transition-colors">All Users</button>
            <button className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-blue-50 transition-colors">Admins</button>
            <button className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-blue-50 transition-colors">Supervisors</button>
            <button className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-blue-50 transition-colors">Workers</button>
          </div>
          
          <div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">User</th>
                    <th className="py-3 px-6 text-left">Role</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Last Active</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {recentUsers.map((user, index) => (
                    <motion.tr 
                      key={index} 
                      className="border-b border-gray-200 hover:bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <span className={`py-1 px-3 rounded-full text-xs ${
                          user.role === 'Admin' ? 'bg-red-200 text-red-700' : 
                          user.role === 'Supervisor' ? 'bg-yellow-200 text-yellow-700' : 
                          'bg-green-200 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <span className={`py-1 px-3 rounded-full text-xs ${
                          user.status === 'Active' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">{user.lastActive}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2 transform hover:bg-blue-100 hover:scale-110 cursor-pointer transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-2 transform hover:bg-yellow-100 hover:scale-110 cursor-pointer transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center transform hover:bg-red-100 hover:scale-110 cursor-pointer transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">Showing 1 to 5 of 24 entries</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Previous</button>
                <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">2</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">3</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Recent Users - Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-xl shadow-lg p-8 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Recent Users
            </h2>
            <Link to="/user-management" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center">
              <span>View All Users</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-lg">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map((user, index) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'Worker' ? 'bg-blue-100 text-blue-800' : 
                          user.role === 'Supervisor' ? 'bg-purple-100 text-purple-800' : 
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">No recent users found.</p>
            </div>
          )}
        </motion.div>
      )}
      
      {/* System Tab Content */}
      {activeTab === 'system' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-white">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                System Performance
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                    <span className="text-sm font-medium text-gray-700">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    <span className="text-sm font-medium text-gray-700">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Disk Space</span>
                    <span className="text-sm font-medium text-gray-700">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Network Load</span>
                    <span className="text-sm font-medium text-gray-700">51%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '51%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-white">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Firewall Active</p>
                    <p className="text-sm text-green-600">All ports secured</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">SSL Certificate</p>
                    <p className="text-sm text-green-600">Valid for 267 days</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800">Updates Available</p>
                    <p className="text-sm text-yellow-600">3 security patches pending</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Backup Status</p>
                    <p className="text-sm text-green-600">Last backup: 6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              Server Status
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Service</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Uptime</th>
                    <th className="py-3 px-6 text-left">Last Restart</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">Web Server</td>
                    <td className="py-3 px-6 text-left">
                      <span className="py-1 px-3 rounded-full text-xs bg-green-200 text-green-700">Running</span>
                    </td>
                    <td className="py-3 px-6 text-left">14 days, 6 hours</td>
                    <td className="py-3 px-6 text-left">2023-06-15 08:30</td>
                    <td className="py-3 px-6 text-center">
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors">Restart</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">Database Server</td>
                    <td className="py-3 px-6 text-left">
                      <span className="py-1 px-3 rounded-full text-xs bg-green-200 text-green-700">Running</span>
                    </td>
                    <td className="py-3 px-6 text-left">14 days, 6 hours</td>
                    <td className="py-3 px-6 text-left">2023-06-15 08:30</td>
                    <td className="py-3 px-6 text-center">
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors">Restart</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">API Gateway</td>
                    <td className="py-3 px-6 text-left">
                      <span className="py-1 px-3 rounded-full text-xs bg-green-200 text-green-700">Running</span>
                    </td>
                    <td className="py-3 px-6 text-left">7 days, 12 hours</td>
                    <td className="py-3 px-6 text-left">2023-06-22 02:15</td>
                    <td className="py-3 px-6 text-center">
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors">Restart</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">Caching Service</td>
                    <td className="py-3 px-6 text-left">
                      <span className="py-1 px-3 rounded-full text-xs bg-yellow-200 text-yellow-700">Degraded</span>
                    </td>
                    <td className="py-3 px-6 text-left">3 days, 4 hours</td>
                    <td className="py-3 px-6 text-left">2023-06-26 10:45</td>
                    <td className="py-3 px-6 text-center">
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors">Restart</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* System Health - Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-xl shadow-lg p-8 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                Server Status
              </h3>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Uptime: 99.98%
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Database
              </h3>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Response time: 45ms
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Last Backup
              </h3>
              <div className="text-gray-700 font-medium">2023-11-03 04:30 AM</div>
              <div className="mt-3 text-sm text-gray-500">
                Next scheduled: 2023-11-04 04:30 AM
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;