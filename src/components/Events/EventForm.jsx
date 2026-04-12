// src/components/Events/EventForm.jsx
import React, { useState } from 'react';

export default function EventForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || { title: '', description: '', date: '', location: '', status: 'Upcoming' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (<form onSubmit={handleSubmit} className="space-y-4"><div><label className="label">Event Title</label><input name="title" value={formData.title} onChange={handleChange} className="input-field" required /></div><div><label className="label">Description</label><textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="input-field" /></div><div><label className="label">Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required /></div><div><label className="label">Location</label><input name="location" value={formData.location} onChange={handleChange} className="input-field" /></div><div><label className="label">Status</label><select name="status" value={formData.status} onChange={handleChange} className="input-field"><option>Upcoming</option><option>Completed</option></select></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button><button type="submit" className="btn-primary text-sm">Save Event</button></div></form>);
}