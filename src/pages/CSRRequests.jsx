// src/pages/CSRRequests.jsx
import React, { useState, useEffect } from 'react';
import {api} from '../services/ApiService';
import RequestDetails from '../components/CSRRequests/RequestDetails';
import { Eye, Download, FileText, Trash2 } from 'lucide-react';

const statusOptions = ['pending', 'scheduled', 'completed', 'cancelled', 'rescheduled'];

export default function CSRRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const clientToken = localStorage.getItem('token');
  // Fetch meetings from API
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/meetings/',{
        headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${clientToken}`
      }});

      if (response.success) {
        setRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      alert('Error fetching meeting requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingStatus(id);
    try {
      const response = await api.put(`/meetings/${id}/status`, {
        status: status },{
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'application/json',
          },
  
        });
      
      if (response.success) {
        // Update local state
        setRequests(requests.map(r => 
          r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating meeting status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this meeting request?')) {
      try {
        const response = await axios.delete(`/meetings/${id}`);
        if (response.success) {
          setRequests(requests.filter(r => r.id !== id));
          if (selectedRequest?.id === id) {
            setSelectedRequest(null);
          }
        }
      } catch (error) {
        console.error('Error deleting meeting:', error);
        alert('Error deleting meeting request. Please try again.');
      }
    }
  };

  const handleAddNote = async (id, note) => {
    try {
      // First get the current meeting
      const currentMeeting = requests.find(r => r.id === id);
      
      // Update with new note
      const updatedNotes = [...(currentMeeting.notes || []), { 
        text: note, 
        date: new Date().toISOString() 
      }];
      
      // Send update to API with the remark field
      const response = await axios.put(`/meetings/${id}/status`, {
        remark: JSON.stringify(updatedNotes)
      });
      
      if (response.success) {
        setRequests(requests.map(r => 
          r.id === id ? { ...r, remark: JSON.stringify(updatedNotes), notes: updatedNotes } : r
        ));
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error adding note. Please try again.');
    }
  };

  const exportData = () => {
    const exportData = requests.map(req => ({
      companyName: req.companyName,
      cinNumber: req.cinNumber,
      industryType: req.industryType,
      applicantName: req.applicantName,
      email: req.email,
      mobileNumber: req.mobileNumber,
      budgetRequired: req.budgetRequired,
      proposedCsrBudget: req.proposedCsrBudget,
      preferredDate: req.preferredDate,
      preferredTime: req.preferredTime,
      status: req.status,
      purposeOfMeeting: req.purposeOfMeeting,
      createdAt: req.createdAt
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csr_meeting_requests_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      rescheduled: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading meeting requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">CSR Meeting Requests</h2>
        <button 
          onClick={exportData} 
          className="btn-secondary text-sm flex items-center gap-1"
          disabled={requests.length === 0}
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contact Person</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Budget (₹)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Proposed Budget (₹)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Preferred Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No CSR meeting requests received yet
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{req.companyName}</td>
                    <td className="px-4 py-3">{req.applicantName}</td>
                    <td className="px-4 py-3 font-semibold">₹{parseFloat(req.budgetRequired).toLocaleString()}</td>
                    <td className="px-4 py-3">₹{parseFloat(req.proposedCsrBudget).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {req.preferredDate ? new Date(req.preferredDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={req.status || 'pending'} 
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        disabled={updatingStatus === req.id}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(req.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedRequest(req)} 
                          className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button 
                          onClick={() => handleDeleteRequest(req.id)} 
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetails 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
          onAddNote={handleAddNote}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteRequest}
        />
      )}
    </div>
  );
}