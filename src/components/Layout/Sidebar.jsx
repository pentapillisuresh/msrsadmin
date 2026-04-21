// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Users, FileText, Calendar,
  HandHeart, UserPlus, BookOpen, Image, UserCog, MessageSquare,
  Settings, LogOut, BarChart3, Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderKanban, label: 'CSR Projects' },
  { path: '/csr-requests', icon: Users, label: 'CSR Requests' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/access-logs', icon: Download, label: 'Access Logs' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/donations', icon: HandHeart, label: 'Donations' },
  { path: '/volunteers', icon: UserPlus, label: 'Volunteers' },
  { path: '/knowledge-hub', icon: BookOpen, label: 'Knowledge Hub' },
  { path: '/media', icon: Image, label: 'Media' },
  { path: '/team', icon: UserCog, label: 'Team' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-800">MSRS Foundation Admin</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}