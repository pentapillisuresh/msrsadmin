// src/components/Documents/DocumentForm.jsx
import React, { useState } from 'react';

export default function DocumentForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    documentType: initialData?.documentType || 'Certificate',
    certificateType: initialData?.certificateType || '',
    reportType: initialData?.reportType || 'Monthly',
    title: initialData?.title || '',
    year: initialData?.year || new Date().getFullYear(),
    description: initialData?.description || '',
    file: null
  });
  
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setFilePreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
        <select 
          name="documentType" 
          value={formData.documentType} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Certificate">Certificate</option>
          <option value="Audit Report">Audit Report</option>
        </select>
      </div>

      {formData.documentType === 'Certificate' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type *</label>
          <input 
            name="certificateType" 
            value={formData.certificateType} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}

      {formData.documentType === 'Audit Report' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type *</label>
          <select 
            name="certificateType" 
            value={formData.certificateType} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
        <input 
          name="year" 
          type="number" 
          value={formData.year} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          name="description" 
          rows="3" 
          value={formData.description} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Document File *</label>
        <input 
          type="file" 
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required={!initialData}
        />
        {filePreview && (
          <p className="mt-1 text-sm text-gray-500">Selected file: {filePreview}</p>
        )}
        {initialData?.documentUrl && !filePreview && (
          <p className="mt-1 text-sm text-gray-500">Current file: {initialData.title}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary text-sm px-4 py-2"
        >
          {loading ? 'Saving...' : (initialData ? 'Update Document' : 'Save Document')}
        </button>
      </div>
    </form>
  );
}