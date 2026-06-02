// src/components/Dashboard/StatsCards.jsx
import React from 'react';
import { HandHeart, Users, FolderKanban, FileText, Calendar, MessagesSquare, BookOpen, Briefcase } from 'lucide-react';

const statsConfig = [
  { icon: HandHeart, label: 'Total Donations', color: 'bg-green-100 text-green-600', key: 'totalDonationsAmount' },
  { icon: Users, label: 'Total Volunteers', color: 'bg-blue-100 text-blue-600', key: 'totalVolunteers' },
  { icon: Briefcase, label: 'CSR Meetings', color: 'bg-indigo-100 text-indigo-600', key: 'totalMeetingRequests' },
  { icon: FolderKanban, label: 'Total Projects', color: 'bg-orange-100 text-orange-600', key: 'totalProjects' },
  { icon: Calendar, label: 'Total Events', color: 'bg-purple-100 text-purple-600', key: 'totalEvents' },
  { icon: FileText, label: 'Documents', color: 'bg-cyan-100 text-cyan-600', key: 'totalDocuments' },
  { icon: BookOpen, label: 'E-Library', color: 'bg-pink-100 text-pink-600', key: 'totalELibrary' },
  { icon: MessagesSquare, label: 'Messages', color: 'bg-yellow-100 text-yellow-600', key: 'totalMessages' },
];

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {statsConfig.map((config, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{config.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {config.key === 'totalDonationsAmount' 
                  ? `₹${(stats[config.key] || 0).toLocaleString('en-IN')}`
                  : (stats[config.key] || 0).toLocaleString()
                }
              </p>
            </div>
            <div className={`p-2 rounded-lg ${config.color}`}>
              <config.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}