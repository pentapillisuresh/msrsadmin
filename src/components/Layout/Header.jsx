// src/components/Layout/Header.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserCircle } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Welcome back, Admin!</h1>
          <p className="text-xs text-gray-500">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user?.email}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <UserCircle className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    </header>
  );
}