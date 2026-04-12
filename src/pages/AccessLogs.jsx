// src/pages/AccessLogs.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Search, Filter, Download } from 'lucide-react';

export default function AccessLogs() {
  const [logs] = useLocalStorage('c3r_access_logs', []);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName?.toLowerCase().includes(search.toLowerCase()) ||
                          log.documentName?.toLowerCase().includes(search.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && log.documentType === filterType;
  });

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `access_logs_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Document Access Tracking</h2>
        <button onClick={exportLogs} className="btn-secondary text-sm flex items-center gap-1"><Download className="w-4 h-4" /> Export Logs</button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by user or document..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" /></div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field w-40"><option value="all">All Types</option><option value="Certificate">Certificates</option><option value="Audit Report">Audit Reports</option></select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left">User</th><th className="px-4 py-3 text-left">Contact</th><th className="px-4 py-3 text-left">Location</th><th className="px-4 py-3 text-left">Document</th><th className="px-4 py-3 text-left">Date & Time</th></tr></thead>
            <tbody>{filteredLogs.length === 0 ? (<tr><td colSpan="5" className="text-center py-8 text-gray-400">No access records found</td></tr>) : (filteredLogs.map((log, idx) => (<tr key={idx} className="border-b hover:bg-gray-50"><td className="px-4 py-3"><p className="font-medium">{log.userName}</p><p className="text-xs text-gray-500">{log.email}</p></td><td className="px-4 py-3"><p className="text-sm">{log.phone}</p></td><td className="px-4 py-3"><p className="text-sm">{log.city}, {log.state}</p></td><td className="px-4 py-3"><p className="font-medium">{log.documentName}</p><p className="text-xs text-gray-500">{log.documentType}</p></td><td className="px-4 py-3 text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td></tr>)))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}