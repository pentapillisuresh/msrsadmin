// src/components/KnowledgeHub/ArticleForm.jsx
import React, { useState } from 'react';

export default function ArticleForm({ initialData, onSave, onCancel, categories = [], submitting = false }) {
  const [formData, setFormData] = useState({
    title: initialData?.name || '',
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    content: initialData?.description || '',
    file: null,
    fileUrl: initialData?.file || ''
  });
  const [filePreview, setFilePreview] = useState(initialData?.file ? `http://localhost:3000${initialData.file}` : '');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file, fileUrl: URL.createObjectURL(file) });
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.categoryId) {
      alert('Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        >
          <option value="">Select Category</option>
          {categories.length === 0 && <option value="" disabled>No categories available. Please add categories first.</option>}
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">
            No categories available. Click "Manage Categories" to add categories.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea 
          name="content" 
          rows="5" 
          value={formData.content} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (PDF, DOC, etc.)</label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
        />
        {filePreview && filePreview !== initialData?.file && (
          <div className="mt-2 text-xs text-gray-500">File selected: {formData.file?.name}</div>
        )}
        {initialData?.file && !formData.file && (
          <div className="mt-2">
            <a href={`http://localhost:3000${initialData.file}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">Current file</a>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}