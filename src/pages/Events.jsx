// src/pages/Events.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import EventForm from '../components/Events/EventForm';
import { Plus, X, Calendar, MapPin } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useLocalStorage('c3r_events', []);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleSave = (eventData) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...eventData, id: e.id } : e));
    } else {
      setEvents([...events, { ...eventData, id: Date.now(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this event?')) setEvents(events.filter(e => e.id !== id));
  };

  const handleStatusToggle = (id, status) => {
    setEvents(events.map(e => e.id === id ? { ...e, status } : e));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-lg font-semibold">Events & Initiatives</h2><button onClick={() => { setEditingEvent(null); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Event</button></div>

      {showForm && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full"><div className="border-b p-4 flex justify-between"><h3 className="font-semibold">{editingEvent ? 'Edit Event' : 'Add Event'}</h3><button onClick={() => { setShowForm(false); setEditingEvent(null); }}><X className="w-5 h-5" /></button></div><div className="p-6"><EventForm initialData={editingEvent} onSave={handleSave} onCancel={() => setShowForm(false)} /></div></div></div>)}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (<div className="col-span-full text-center py-12 text-gray-400">No events added yet</div>) : (events.map(event => (<div key={event.id} className="bg-white rounded-xl shadow-sm border overflow-hidden"><div className="p-4"><div className="flex justify-between items-start"><h3 className="font-semibold text-gray-800">{event.title}</h3><span className={`text-xs px-2 py-1 rounded-full ${event.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{event.status}</span></div><p className="text-xs text-gray-500 mt-2 line-clamp-2">{event.description}</p><div className="flex items-center gap-3 mt-3 text-xs text-gray-500"><div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(event.date).toLocaleDateString()}</div><div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</div></div><div className="flex justify-end gap-2 mt-4 pt-3 border-t"><button onClick={() => handleStatusToggle(event.id, event.status === 'Upcoming' ? 'Completed' : 'Upcoming')} className="text-xs text-indigo-600 hover:underline">{event.status === 'Upcoming' ? 'Mark Completed' : 'Mark Upcoming'}</button><button onClick={() => { setEditingEvent(event); setShowForm(true); }} className="text-xs text-blue-600 hover:underline">Edit</button><button onClick={() => handleDelete(event.id)} className="text-xs text-red-600 hover:underline">Delete</button></div></div></div>)))}
      </div>
    </div>
  );
}