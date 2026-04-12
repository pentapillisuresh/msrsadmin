// src/components/Team/TeamMemberForm.jsx
import React, { useState } from 'react';

export default function TeamMemberForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || { name: '', role: '', email: '', phone: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (<form onSubmit={handleSubmit} className="space-y-4"><div><label className="label">Full Name</label><input name="name" value={formData.name} onChange={handleChange} className="input-field" required /></div><div><label className="label">Role</label><input name="role" value={formData.role} onChange={handleChange} className="input-field" placeholder="e.g., Project Manager" required /></div><div><label className="label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" /></div><div><label className="label">Phone</label><input name="phone" value={formData.phone} onChange={handleChange} className="input-field" /></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button><button type="submit" className="btn-primary text-sm">Save Member</button></div></form>);
}