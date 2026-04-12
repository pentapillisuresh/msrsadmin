// src/components/KnowledgeHub/ArticleForm.jsx
import React, { useState } from 'react';

export default function ArticleForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || { type: 'Article', title: '', content: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (<form onSubmit={handleSubmit} className="space-y-4"><div><label className="label">Type</label><select name="type" value={formData.type} onChange={handleChange} className="input-field"><option>Article</option><option>Research Paper</option><option>Case Study</option></select></div><div><label className="label">Title</label><input name="title" value={formData.title} onChange={handleChange} className="input-field" required /></div><div><label className="label">Content</label><textarea name="content" rows="5" value={formData.content} onChange={handleChange} className="input-field" required /></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button><button type="submit" className="btn-primary text-sm">Save</button></div></form>);
}