// src/components/Dashboard/StatsCards.jsx
import React from 'react';
import { HandHeart, Users, FolderKanban, FileText, Eye, Download } from 'lucide-react';

const statsConfig = [
  { icon: HandHeart, label: 'Total Donations', color: 'bg-green-100 text-green-600' },
  { icon: Users, label: 'CSR Requests', color: 'bg-blue-100 text-blue-600' },
  { icon: UserPlus, label: 'Total Volunteers', color: 'bg-purple-100 text-purple-600' },
  { icon: FolderKanban, label: 'Total Projects', color: 'bg-orange-100 text-orange-600' },
  { icon: FileText, label: 'Documents', color: 'bg-cyan-100 text-cyan-600' },
  { icon: Eye, label: 'Document Views', color: 'bg-pink-100 text-pink-600' },
];

import { UserPlus } from 'lucide-react';

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsConfig.map((config, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">{config.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats[config.label] || 0}</p>
            </div>
            <div className={`p-2 rounded-lg ${config.color}`}>
              <config.icon className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}