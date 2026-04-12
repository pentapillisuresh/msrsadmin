// src/components/Projects/ProjectForm.jsx
import React, { useState } from 'react';

export default function ProjectForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    title: '', category: '', objective: '', description: '', problemStatement: '',
    solutionApproach: '', targetBeneficiaries: '', location: '', duration: '',
    csrAlignment: '', totalBudget: '', budgetBreakdown: '', expectedImpact: '',
    numberOfBeneficiaries: '', outcomes: '', status: 'Upcoming', featured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Project Title</label><input name="title" value={formData.title} onChange={handleChange} className="input-field" required /></div>
        <div><label className="label">Category</label><select name="category" value={formData.category} onChange={handleChange} className="input-field"><option>Education</option><option>Healthcare</option><option>Skill Development</option><option>Environment</option><option>Women Empowerment</option></select></div>
      </div>
      <div><label className="label">Objective</label><input name="objective" value={formData.objective} onChange={handleChange} className="input-field" required /></div>
      <div><label className="label">Description</label><textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="input-field" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Location (State, District)</label><input name="location" value={formData.location} onChange={handleChange} className="input-field" /></div>
        <div><label className="label">Duration</label><input name="duration" value={formData.duration} onChange={handleChange} className="input-field" placeholder="e.g., 6 months" /></div>
      </div>
      <div><label className="label">Total Budget (₹)</label><input name="totalBudget" type="number" value={formData.totalBudget} onChange={handleChange} className="input-field" /></div>
      <div><label className="label">Target Beneficiaries</label><input name="targetBeneficiaries" value={formData.targetBeneficiaries} onChange={handleChange} className="input-field" /></div>
      <div><label className="label">Status</label><select name="status" value={formData.status} onChange={handleChange} className="input-field"><option>Active</option><option>Completed</option><option>Upcoming</option></select></div>
      <div className="flex items-center gap-2"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /><label className="text-sm">Mark as Featured</label></div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">Save Project</button>
      </div>
    </form>
  );
}