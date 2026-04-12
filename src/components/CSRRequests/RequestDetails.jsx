// src/components/CSRRequests/RequestDetails.jsx
import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Calendar, DollarSign, Building2, FileText as FileIcon } from 'lucide-react';

export default function RequestDetails({ request, onClose, onAddNote }) {
  const [note, setNote] = useState('');

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote(request.id, note);
      setNote('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h3 className="font-semibold">CSR Request Details</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          {/* Company Details */}
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Company Details</h4><div className="space-y-1"><p className="text-sm"><Building2 className="inline w-3 h-3 mr-1" /> {request.companyName}</p><p className="text-xs text-gray-500">CIN: {request.cin || 'N/A'}</p><p className="text-xs text-gray-500">Industry: {request.industry || 'N/A'}</p></div></div>
            <div><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Contact Person</h4><div className="space-y-1"><p className="text-sm">{request.contactPerson}</p><p className="text-xs text-gray-500"><Mail className="inline w-3 h-3 mr-1" /> {request.email}</p><p className="text-xs text-gray-500"><Phone className="inline w-3 h-3 mr-1" /> {request.phone}</p></div></div>
          </div>

          {/* CSR Interest */}
          <div><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">CSR Interest</h4><div className="grid grid-cols-2 gap-4"><div><p className="text-sm font-medium">Budget</p><p className="text-indigo-600 font-bold">₹{request.budget}</p></div><div><p className="text-sm font-medium">Timeline</p><p className="text-sm">{request.timeline || 'N/A'}</p></div></div></div>

          {/* Meeting Details */}
          <div><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Meeting Request</h4><div className="grid grid-cols-2 gap-4"><div><p className="text-sm font-medium">Mode</p><p className="text-sm">{request.meetingMode || 'Not specified'}</p></div><div><p className="text-sm font-medium">Date & Time</p><p className="text-sm">{request.meetingDateTime || 'To be scheduled'}</p></div></div></div>

          {/* Additional Info */}
          <div><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Purpose & Requirements</h4><p className="text-sm bg-gray-50 p-3 rounded-lg">{request.purpose || 'No additional information provided'}</p></div>

          {/* Uploaded Files */}
          {request.files && request.files.length > 0 && (<div><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Attachments</h4><div className="space-y-1">{request.files.map((file, idx) => (<div key={idx} className="flex items-center gap-2 text-sm text-blue-600"><FileIcon className="w-4 h-4" /><a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></div>))}</div></div>)}

          {/* Internal Notes */}
          <div><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Internal Notes</h4><div className="space-y-2 mb-3"><div className="flex gap-2"><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="input-field text-sm" rows="2" /><button onClick={handleAddNote} className="btn-primary text-sm px-3">Add</button></div>{request.notes && request.notes.map((n, idx) => (<div key={idx} className="bg-gray-50 p-2 rounded text-sm"><p className="text-gray-600">{n.text}</p><p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</p></div>))}</div></div>
        </div>
      </div>
    </div>
  );
}