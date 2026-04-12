// src/pages/Volunteers.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Check, X, Phone, Mail } from 'lucide-react';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useLocalStorage('c3r_volunteers', [
    { id: 1, name: 'Amit Sharma', type: 'Volunteer', skills: 'Teaching, Community Outreach', availability: 'Weekends', status: 'Pending', email: 'amit@example.com', phone: '9876543210' },
    { id: 2, name: 'Priya Patel', type: 'Intern', skills: 'Content Writing, Social Media', availability: 'Full Time', status: 'Pending', email: 'priya@example.com', phone: '9876543211' }
  ]);

  const handleAccept = (id) => { setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: 'Accepted' } : v)); };
  const handleReject = (id) => { setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: 'Rejected' } : v)); };

  const contactVolunteer = (volunteer) => { window.location.href = `mailto:${volunteer.email}`; };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Volunteer & Internship Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {volunteers.map(v => (<div key={v.id} className="bg-white rounded-xl shadow-sm border p-4"><div className="flex justify-between items-start"><div><h3 className="font-semibold">{v.name}</h3><span className={`text-xs px-2 py-0.5 rounded-full ${v.type === 'Volunteer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{v.type}</span></div><div className="flex gap-1">{v.status === 'Pending' && (<><button onClick={() => handleAccept(v.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button><button onClick={() => handleReject(v.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button></>)}</div></div><div className="mt-3 space-y-1"><p className="text-sm text-gray-600"><span className="font-medium">Skills:</span> {v.skills}</p><p className="text-sm text-gray-600"><span className="font-medium">Availability:</span> {v.availability}</p><div className="flex gap-3 mt-2"><button onClick={() => contactVolunteer(v)} className="text-xs text-indigo-600 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</button><button className="text-xs text-indigo-600 flex items-center gap-1"><Phone className="w-3 h-3" /> {v.phone}</button></div></div><div className="mt-3 pt-2 border-t"><span className={`text-xs px-2 py-0.5 rounded-full ${v.status === 'Accepted' ? 'bg-green-100 text-green-700' : v.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v.status}</span></div></div>))}
      </div>
    </div>
  );
}