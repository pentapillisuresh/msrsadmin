// src/pages/Dashboard.jsx
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import StatsCards from '../components/Dashboard/StatsCards';
import { format } from 'date-fns';

export default function Dashboard() {
  const [projects] = useLocalStorage('c3r_projects', []);
  const [csrRequests] = useLocalStorage('c3r_csr_requests', []);
  const [donations] = useLocalStorage('c3r_donations', []);
  const [volunteers] = useLocalStorage('c3r_volunteers', []);
  const [documents] = useLocalStorage('c3r_documents', []);
  const [accessLogs] = useLocalStorage('c3r_access_logs', []);

  const stats = {
    'Total Donations': donations.reduce((sum, d) => sum + d.amount, 0),
    'CSR Requests': csrRequests.length,
    'Total Volunteers': volunteers.length,
    'Total Projects': projects.length,
    'Documents': documents.length,
    'Document Views': accessLogs.length,
  };

  const recentRequests = [...csrRequests].slice(-3).reverse();
  const recentDonations = [...donations].slice(-3).reverse();
  const recentLogs = [...accessLogs].slice(-3).reverse();

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent CSR Requests */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent CSR Requests</h3>
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-xs text-gray-400">No requests yet</p>
            ) : (
              recentRequests.map((req, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{req.companyName}</p>
                    <p className="text-xs text-gray-400">{format(new Date(req.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">₹{req.budget}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Donations</h3>
          <div className="space-y-3">
            {recentDonations.length === 0 ? (
              <p className="text-xs text-gray-400">No donations yet</p>
            ) : (
              recentDonations.map((donation, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{donation.donorName}</p>
                    <p className="text-xs text-gray-400">{donation.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">₹{donation.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Document Views */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Document Views</h3>
          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-gray-400">No views recorded</p>
            ) : (
              recentLogs.map((log, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{log.userName}</p>
                    <p className="text-xs text-gray-400">{log.documentName}</p>
                  </div>
                  <span className="text-xs text-gray-400">{format(new Date(log.timestamp), 'MMM dd')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}