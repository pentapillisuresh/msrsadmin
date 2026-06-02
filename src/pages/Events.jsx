// src/pages/Events.jsx
import React, { useState, useEffect } from 'react';
import {api} from '../services/ApiService';
import EventForm from '../components/Events/EventForm';
import EventCategoryManager from '../components/Events/EventCategoryManager';
import { Plus, X, Calendar, MapPin, Clock, Image as ImageIcon, Upload, Edit, Trash2, Eye, Filter, FolderPlus } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/');
      if (response.success) {
        setEvents(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Error fetching events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API (categoryRelated = 'event')
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/?categoryRelated=event');
      if (response.success) {
        setEventCategories(response.data || []);
      }
      console.log("category:::",response.data)
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  // Category management handlers with API integration
  const handleAddCategory = async (newCategoryName) => {
    try {
      const response = await api.post('/categories/', {
        name: newCategoryName,
        categoryRelated: 'event',
        description: `Events related to ${newCategoryName}`,
        status: 'active'
      });
      
      if (response.success) {
        setEventCategories([...eventCategories, response.data.data]);
        alert('Category added successfully!');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const eventsUsingCategory = events.filter(e => e.categoryId === categoryId);
    if (eventsUsingCategory.length > 0) {
      alert(`Cannot delete category because it is used by ${eventsUsingCategory.length} event(s). Please reassign or delete those events first.`);
      return false;
    }
    
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      if (response.success) {
        setEventCategories(eventCategories.filter(c => c.id !== categoryId));
        alert('Category deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  const handleUpdateCategory = async (categoryId, newCategoryName) => {
    const category = eventCategories.find(c => c.id === categoryId);
    if (category.name === newCategoryName) return;
    
    if (eventCategories.some(c => c.name === newCategoryName)) {
      alert(`Category "${newCategoryName}" already exists!`);
      return false;
    }
    
    try {
      const response = await api.put(`/categories/${categoryId}`, {
        name: newCategoryName,
        categoryRelated: 'event',
        description: `Events related to ${newCategoryName}`,
        status: 'active'
      });
      
      if (response.success) {
        setEventCategories(eventCategories.map(c => 
          c.id === categoryId ? response.data.data : c
        ));
        // Update events with the new category name
        setEvents(events.map(e => 
          e.categoryId === categoryId ? { ...e, Category: response.data.data } : e
        ));
        alert('Category updated successfully!');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    }
  };

  const handleSave = async (eventData) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('eventName', eventData.title);
      formData.append('description', eventData.description);
      formData.append('date', eventData.date);
      formData.append('time', eventData.time);
      formData.append('location', eventData.location);
      formData.append('categoryId', eventData.categoryId);
      formData.append('status', eventData.status.toLowerCase());
      
      if (eventData.imageFile) {
        formData.append('image', eventData.imageFile);
      }

      let response;
      if (editingEvent) {
        // Update existing event
        response = await api.put(`/events/${editingEvent.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new event
        response = await api.post('/events/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      if (response.success) {
        fetchEvents(); // Refresh the list
        setShowForm(false);
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await api.delete(`/events/${id}`);
        if (response.success) {
          setEvents(events.filter(e => e.id !== id));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
      }
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      const response = await api.put(`/events/${id}`, {
        status: newStatus.toLowerCase()
      });
      
      if (response.success) {
        setEvents(events.map(e => e.id === id ? { ...e, status: newStatus.toLowerCase() } : e));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating event status. Please try again.');
    }
  };

  const handleViewEvent = async (event) => {
    try {
      const response = await api.get(`/events/${event.id}`);
      console.log("event item::",response)
      if (response.success) {
        setSelectedEvent(response.data);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Error loading event details. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      case 'ongoing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Upcoming';
  };

  const filteredEvents = categoryFilter === 'all' 
    ? events 
    : events.filter(event => event.categoryId === categoryFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

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
                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                updating={updating}
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
                  <img src={`http://localhost:3000${selectedEvent.image}`} alt={selectedEvent.eventName} className="w-full h-64 object-cover rounded-lg" />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedEvent.eventName}</h4>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedEvent.status)}`}>
                      {formatStatus(selectedEvent.status)}
                    </span>
                    {selectedEvent.Category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        {selectedEvent.Category.name}
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
                          <img src={`http://localhost:3000${event.image}`} alt={event.eventName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900">{event.eventName}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{event.description || 'No description'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {event.Category ? (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                          {event.Category.name}
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
                      <select
                        value={event.status}
                        onChange={(e) => handleStatusToggle(event.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(event.status)} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleViewEvent(event)} className="text-green-600 hover:text-green-800" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
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