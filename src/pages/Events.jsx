import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import EventForm from '../components/Events/EventForm';
import EventCategoryManager from '../components/Events/EventCategoryManager';
import { Plus, X, Calendar, MapPin, Clock, Image as ImageIcon, Upload, Edit, Trash2, Eye, Filter, FolderPlus } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useLocalStorage('c3r_events', []);
  const [eventCategories, setEventCategories] = useLocalStorage('c3r_event_categories', [
    'Workshop',
    'Seminar',
    'Webinar',
    'Conference',
    'Fundraiser',
    'Awareness Campaign',
    'Training Program',
    'Other'
  ]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Category management handlers
  const handleAddCategory = (newCategory) => {
    if (!eventCategories.includes(newCategory)) {
      setEventCategories([...eventCategories, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const eventsUsingCategory = events.filter(e => e.category === categoryToDelete);
    if (eventsUsingCategory.length > 0) {
      alert(`Cannot delete category "${categoryToDelete}" because it is used by ${eventsUsingCategory.length} event(s). Please reassign or delete those events first.`);
      return false;
    }
    setEventCategories(eventCategories.filter(c => c !== categoryToDelete));
    return true;
  };

  const handleUpdateCategory = (oldCategory, newCategory) => {
    if (oldCategory === newCategory) return;
    if (eventCategories.includes(newCategory)) {
      alert(`Category "${newCategory}" already exists!`);
      return false;
    }
    // Update all events using the old category
    setEvents(events.map(e => 
      e.category === oldCategory ? { ...e, category: newCategory } : e
    ));
    setEventCategories(eventCategories.map(c => c === oldCategory ? newCategory : c));
    return true;
  };

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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Upcoming': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setViewModal(true);
  };

  const filteredEvents = categoryFilter === 'all' 
    ? events 
    : events.filter(event => event.category === categoryFilter);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Events & Initiatives</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCategoryManager(true)} 
            className="btn-secondary text-sm flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200"
          >
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </button>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {eventCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={() => { setEditingEvent(null); setShowForm(true); }} 
            className="btn-primary text-sm flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Manage Event Categories</h3>
              <button onClick={() => setShowCategoryManager(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <EventCategoryManager 
                categories={eventCategories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategory={handleUpdateCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
              <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <EventForm 
                initialData={editingEvent} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
                categories={eventCategories}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Event Details</h3>
              <button onClick={() => setViewModal(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {selectedEvent.image && (
                <div className="mb-6">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-64 object-cover rounded-lg" />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h4>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                    {selectedEvent.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        {selectedEvent.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  {selectedEvent.time && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  )}
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                {selectedEvent.description && (
                  <div className="pt-4 border-t">
                    <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Created: {selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Image</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Event Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Date & Time</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Location</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No events found</p>
                    <p className="text-sm">Click "Add Event" to create one</p>
                   </td>
                 </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {event.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{event.description || 'No description'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {event.category ? (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                          {event.category}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{event.date ? new Date(event.date).toLocaleDateString() : 'Not set'}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {event.location ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="max-w-[200px] truncate">{event.location}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleViewEvent(event)} className="text-green-600 hover:text-green-800" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {event.status !== 'Cancelled' && (
                          <button onClick={() => handleStatusToggle(event.id, event.status === 'Upcoming' ? 'Completed' : 'Upcoming')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            {event.status === 'Upcoming' ? 'Complete' : 'Upcoming'}
                          </button>
                        )}
                        <button onClick={() => { setEditingEvent(event); setShowForm(true); }} className="text-blue-600 hover:text-blue-800" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800" title="Delete">
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
    </div>
  );
}