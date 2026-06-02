// src/pages/AccessLogs.jsx
import React, { useState, useEffect } from 'react';
import {api} from '../services/ApiService';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // Fetch access logs from API
  const fetchAccessLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/access-logs/');
      if (response.success) {
        setLogs(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching access logs:', error);
      alert('Error fetching access logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessLogs();
  }, []);

  // Update status function
  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      const response = await api.put(`/access-logs/${id}`, {
        status: status
      });
      
      if (response.success) {
        // Update local state
        setLogs(logs.map(log => 
          log.id === id ? { ...log, status: status } : log
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating access log status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const filteredLogs = logs.filter(log => {
    // Search filter
    const matchesSearch = log.name?.toLowerCase().includes(search.toLowerCase()) ||
                          log.email?.toLowerCase().includes(search.toLowerCase()) ||
                          log.documentType?.toLowerCase().includes(search.toLowerCase());
    
    // Document type filter
    const matchesType = filterType === 'all' || log.documentType === filterType;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportLogs = () => {
    const exportData = logs.map(log => ({
      name: log.name,
      email: log.email,
      phoneNumber: log.phoneNumber,
      country: log.country,
      state: log.state,
      district: log.district,
      documentType: log.documentType,
      status: log.status,
      otp: log.OTP,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `access_logs_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Active' },
      inactive: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Inactive' },
      expired: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Expired' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading access logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Document Access Tracking</h2>
          <p className="text-sm text-gray-500 mt-1">Total Access Records: {logs.length}</p>
        </div>
        <button 
          onClick={exportLogs} 
          className="btn-secondary text-sm flex items-center gap-1"
          disabled={logs.length === 0}
        >
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email or document type..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full px-3 py-2 pl-9 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)} 
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="Certificate">Certificates</option>
          <option value="Audit Report">Audit Reports</option>
        </select>
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Document</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">OTP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Access Date</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    No access records found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{log.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{log.email || '—'}</p>
                      <p className="text-xs text-gray-500">{log.phoneNumber || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{log.country || '—'}</p>
                      <p className="text-xs text-gray-500">
                        {log.district ? `${log.district}, ` : ''}{log.state || ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{log.documentType}</p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {log.OTP || '—'}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={log.status}
                        onChange={(e) => handleStatusUpdate(log.id, e.target.value)}
                        disabled={updating === log.id}
                        className="text-xs px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Access</p>
              <p className="text-2xl font-semibold text-gray-900">{logs.length}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-green-600">
                {logs.filter(l => l.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-2xl font-semibold text-red-600">
                {logs.filter(l => l.status === 'inactive').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {logs.filter(l => l.status === 'expired').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );
}