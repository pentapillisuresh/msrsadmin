// src/components/Documents/DocumentForm.jsx
import React, { useState } from 'react';

export default function DocumentForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    type: 'Certificate', certificateType: 'CSR-1', title: '', year: new Date().getFullYear(), description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label">Document Type</label><select name="type" value={formData.type} onChange={handleChange} className="input-field"><option>Certificate</option><option>Audit Report</option></select></div>
      {formData.type === 'Certificate' && (<div><label className="label">Certificate Type</label><select name="certificateType" value={formData.certificateType} onChange={handleChange} className="input-field"><option>CSR-1</option><option>12A</option><option>80G</option><option>MCA</option><option>NGO Darpan</option></select></div>)}
      {formData.type === 'Audit Report' && (<div><label className="label">Report Type</label><select name="reportType" value={formData.reportType} onChange={handleChange} className="input-field"><option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option><option>Yearly</option></select></div>)}
      <div><label className="label">Title</label><input name="title" value={formData.title} onChange={handleChange} className="input-field" required /></div>
      <div><label className="label">Year</label><input name="year" type="number" value={formData.year} onChange={handleChange} className="input-field" /></div>
      <div><label className="label">Description</label><textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="input-field" /></div>
      <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button><button type="submit" className="btn-primary text-sm">Save Document</button></div>
    </form>
  );
}