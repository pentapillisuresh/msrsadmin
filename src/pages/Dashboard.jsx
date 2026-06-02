// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import { format } from 'date-fns';
import {api} from '../services/ApiService';
import { Loader2, Calendar, MapPin, Users as UsersIcon, Mail, Phone, Building2, FileText as FileTextIcon } from 'lucide-react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all');

  // Fetch dashboard data from API
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/dashboard', {
        params: {
          timeRange: timeRange
        }
      });
      
      console.log("response::",response)
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'An error occurred while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { summary, recentActivities, lastUpdated } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {format(new Date(lastUpdated), 'MMM dd, yyyy hh:mm a')}
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={summary} />

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.projects.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                No projects found
              </div>
            ) : (
              recentActivities.projects.map((project) => (
                <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{project.name}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{project.objective}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{project.state}, {project.district}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'approved' ? 'bg-green-100 text-green-700' :
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-bold text-indigo-600">
                        ₹{parseInt(project.budgetRequired).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.events.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                No events found
              </div>
            ) : (
              recentActivities.events.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{event.eventName}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Meeting Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Meeting Requests</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.meetingRequests.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                No meeting requests found
              </div>
            ) : (
              recentActivities.meetingRequests.map((meeting) => (
                <div key={meeting.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-900">{meeting.companyName}</h4>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                        <span className="flex items-center space-x-1">
                          <UsersIcon className="w-3 h-3" />
                          <span>{meeting.applicantName}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{meeting.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{meeting.mobileNumber}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-500">
                          {format(new Date(meeting.preferredDate), 'MMM dd, yyyy')}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{meeting.preferredMeetingMode}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        meeting.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                        meeting.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.messages.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                No messages found
              </div>
            ) : (
              recentActivities.messages.map((message) => (
                <div key={message.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{message.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          message.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          message.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          message.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {message.priority}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{message.subject}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{message.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-2">
                        <span>{message.email}</span>
                        <span>•</span>
                        <span>{format(new Date(message.createdAt), 'MMM dd, yyyy hh:mm a')}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        message.status === 'unread' ? 'bg-blue-100 text-blue-700' :
                        message.status === 'read' ? 'bg-gray-100 text-gray-700' :
                        message.status === 'replied' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {message.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{summary.totalDonationsCount}</p>
            <p className="text-xs text-gray-600 mt-1">Total Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{summary.totalDocuments}</p>
            <p className="text-xs text-gray-600 mt-1">Documents Available</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{summary.totalELibrary}</p>
            <p className="text-xs text-gray-600 mt-1">E-Library Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{summary.totalMessages}</p>
            <p className="text-xs text-gray-600 mt-1">Total Messages</p>
          </div>
        </div>
      </div>
    </div>
  );
}