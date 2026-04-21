import React, { useState } from 'react';

export default function ArticleForm({ initialData, onSave, onCancel, categories = [] }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || (categories[0] || ''),
    content: initialData?.content || '',
    file: null,
    fileUrl: initialData?.fileUrl || ''
  });
  const [filePreview, setFilePreview] = useState(initialData?.fileUrl || '');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setFormData({ ...formData, file: file, fileUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const saveData = {
      ...formData,
      fileUrl: formData.fileUrl || filePreview
    };
    onSave(saveData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        >
          {categories.length === 0 && <option value="">Loading categories...</option>}
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <textarea 
          name="content" 
          rows="5" 
          value={formData.content} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (PDF, DOC, etc.)</label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
        />
        {filePreview && !filePreview.startsWith('data:') && (
          <div className="mt-2">
            <a href={filePreview} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">Current file</a>
          </div>
        )}
        {filePreview && filePreview.startsWith('data:') && (
          <div className="mt-2 text-xs text-gray-500">File loaded (will be saved as base64)</div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">Save</button>
      </div>
    </form>
  );
}