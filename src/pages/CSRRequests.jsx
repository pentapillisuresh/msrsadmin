// src/pages/CSRRequests.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import RequestDetails from '../components/CSRRequests/RequestDetails';
import { Eye, Download, FileText } from 'lucide-react';

const statusOptions = ['New', 'Contacted', 'In Discussion', 'Closed'];

export default function CSRRequests() {
  const [requests, setRequests] = useLocalStorage('c3r_csr_requests', []);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleStatusChange = (id, status) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r));
  };

  const handleAddNote = (id, note) => {
    setRequests(requests.map(r => r.id === id ? { ...r, notes: [...(r.notes || []), { text: note, date: new Date().toISOString() }] } : r));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(requests, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csr_requests_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">CSR Meeting Requests</h2>
        <button onClick={exportData} className="btn-secondary text-sm flex items-center gap-1"><Download className="w-4 h-4" /> Export</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Company</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contact Person</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Budget</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th></tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">No CSR requests received yet</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{req.companyName}</td>
                    <td className="px-4 py-3">{req.contactPerson}</td>
                    <td className="px-4 py-3 font-semibold">₹{req.budget}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><select value={req.status || 'New'} onChange={(e) => handleStatusChange(req.id, e.target.value)} className="text-xs px-2 py-1 rounded-full border border-gray-200 bg-white"><option>New</option><option>Contacted</option><option>In Discussion</option><option>Closed</option></select></td>
                    <td className="px-4 py-3 text-right"><button onClick={() => setSelectedRequest(req)} className="btn-secondary text-xs py-1 px-3">View Details</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetails request={selectedRequest} onClose={() => setSelectedRequest(null)} onAddNote={handleAddNote} />
      )}
    </div>
  );
}