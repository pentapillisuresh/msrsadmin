// src/pages/Messages.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Mail, CheckCircle, User, Calendar } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useLocalStorage('c3r_messages', [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', message: 'Interested in partnering for our CSR initiative.', resolved: false, date: '2024-01-20' },
    { id: 2, name: 'Sneha Mehta', email: 'sneha@example.com', message: 'Can you share your annual report?', resolved: false, date: '2024-01-22' }
  ]);

  const markResolved = (id) => { setMessages(messages.map(m => m.id === id ? { ...m, resolved: true } : m)); };

  const activeMessages = messages.filter(m => !m.resolved);
  const resolvedMessages = messages.filter(m => m.resolved);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Contact Messages</h2>
      
      <div className="space-y-6">
        <div><h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><Mail className="w-4 h-4" /> Active Messages ({activeMessages.length})</h3><div className="space-y-3">{activeMessages.length === 0 ? (<div className="bg-white rounded-xl p-6 text-center text-gray-400">No active messages</div>) : (activeMessages.map(msg => (<div key={msg.id} className="bg-white rounded-xl shadow-sm border p-4"><div className="flex justify-between items-start"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><div><p className="font-medium text-sm">{msg.name}</p><p className="text-xs text-gray-500">{msg.email}</p></div></div><button onClick={() => markResolved(msg.id)} className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Mark Resolved</button></div><p className="text-sm text-gray-600 mt-2">{msg.message}</p><p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(msg.date).toLocaleDateString()}</p></div>)))}</div></div>

        <div><h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Resolved Messages ({resolvedMessages.length})</h3><div className="space-y-3">{resolvedMessages.length === 0 ? (<div className="bg-white rounded-xl p-6 text-center text-gray-400">No resolved messages</div>) : (resolvedMessages.map(msg => (<div key={msg.id} className="bg-gray-50 rounded-xl border p-4 opacity-75"><div className="flex justify-between items-start"><div><p className="font-medium text-sm">{msg.name}</p><p className="text-xs text-gray-500">{msg.email}</p></div><span className="text-xs text-green-600">Resolved</span></div><p className="text-sm text-gray-500 mt-2">{msg.message}</p></div>)))}</div></div>
      </div>
    </div>
  );
}