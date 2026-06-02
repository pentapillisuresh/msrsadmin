// src/components/CSRRequests/RequestDetails.jsx
import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Calendar, DollarSign, Building2, FileText as FileIcon, Clock, Edit2 } from 'lucide-react';

export default function RequestDetails({ request, onClose, onAddNote, onStatusChange, onDelete }) {
  const [note, setNote] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState(request.status || 'pending');
  const [updating, setUpdating] = useState(false);

  const handleAddNote = async () => {
    if (note.trim()) {
      await onAddNote(request.id, note);
      setNote('');
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus !== request.status) {
      setUpdating(true);
      await onStatusChange(request.id, newStatus);
      setUpdating(false);
      setShowStatusUpdate(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the meeting request from ${request.companyName}?`)) {
      onDelete(request.id);
      onClose();
    }
  };

  const parseNotes = () => {
    if (request.remark) {
      try {
        return JSON.parse(request.remark);
      } catch (e) {
        return [];
      }
    }
    return request.notes || [];
  };

  const notes = parseNotes();

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">CSR Meeting Request</h3>
            <p className="text-sm text-gray-500">ID: {request.id}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Current Status</h4>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {request.status || 'pending'}
                </span>
              </div>
              <button 
                onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" /> Update Status
              </button>
            </div>
            
            {showStatusUpdate && (
              <div className="mt-3 pt-3 border-t flex gap-2">
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
                <button 
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="btn-primary px-4 py-2"
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            )}
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Company Details</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">{request.companyName}</p>
                <p className="text-xs text-gray-500"><Building2 className="inline w-3 h-3 mr-1" /> CIN: {request.cinNumber || 'N/A'}</p>
                <p className="text-xs text-gray-500">Industry: {request.industryType || 'N/A'}</p>
                {request.url && <p className="text-xs text-blue-600">Website: {request.url}</p>}
                <p className="text-xs text-gray-500">CSR Reg No: {request.csrRegistrationNumber}</p>
                <p className="text-xs text-gray-500">PAN: {request.panNumber}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Contact Person</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">{request.applicantName}</p>
                <p className="text-xs text-gray-500">Role: {request.role}</p>
                <p className="text-xs text-gray-500"><Mail className="inline w-3 h-3 mr-1" /> {request.email}</p>
                <p className="text-xs text-gray-500"><Phone className="inline w-3 h-3 mr-1" /> {request.mobileNumber}</p>
                <p className="text-xs text-gray-500"><MapPin className="inline w-3 h-3 mr-1" /> {request.address}</p>
              </div>
            </div>
          </div>

          {/* CSR Budget Details */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Budget Details</h4>
            <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium">Total Budget Required</p>
                <p className="text-indigo-600 font-bold text-lg">₹{parseFloat(request.budgetRequired).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Proposed CSR Budget</p>
                <p className="text-green-600 font-bold text-lg">₹{parseFloat(request.proposedCsrBudget).toLocaleString()}</p>
              </div>
            </div>
            {request.csrAlignment && (
              <p className="text-sm mt-2"><span className="font-medium">CSR Alignment:</span> {request.csrAlignment}</p>
            )}
          </div>

          {/* CSR Interests */}
          {request.csrInterests && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">CSR Interests</h4>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(request.csrInterests).map((interest, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Details */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Meeting Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Preferred Mode</p>
                <p className="text-sm capitalize">{request.preferredMeetingMode || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Project Type</p>
                <p className="text-sm">{request.preferredProjectType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Preferred Location</p>
                <p className="text-sm">{request.preferredProjectLocation}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm">{request.timelineForCsrActivity}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Preferred Date & Time</p>
                <p className="text-sm">
                  <Calendar className="inline w-3 h-3 mr-1" />
                  {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : 'N/A'}
                  {request.preferredTime && ` at ${request.preferredTime}`}
                </p>
              </div>
              {request.alternateDateTime && (
                <div>
                  <p className="text-sm font-medium">Alternate Date/Time</p>
                  <p className="text-sm">{request.alternateDateTime}</p>
                </div>
              )}
            </div>
          </div>

          {/* Purpose & Requirements */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Purpose of Meeting</h4>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{request.purposeOfMeeting || 'No additional information provided'}</p>
          </div>

          {request.specificRequirements && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Specific Requirements</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{request.specificRequirements}</p>
            </div>
          )}

          {/* Internal Notes */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Internal Notes</h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <textarea 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="Add a note..." 
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  rows="2" 
                />
                <button 
                  onClick={handleAddNote} 
                  className="btn-primary text-sm px-4"
                >
                  Add
                </button>
              </div>
              
              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map((n, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.date).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No notes added yet</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Delete Request
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}