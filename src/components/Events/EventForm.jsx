import React, { useState } from 'react';

export default function EventForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || { 
    title: '', 
    description: '', 
    date: '', 
    time: '',
    location: '', 
    image: null,
    imagePreview: null,
    status: 'Upcoming' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          image: file,
          imagePreview: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    // Create a copy without the file object for storage
    const saveData = {
      ...formData,
      image: formData.imagePreview || formData.image // Store base64 or existing image
    };
    onSave(saveData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label text-sm font-medium text-gray-700 mb-1 block">Event Title</label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          required 
        />
      </div>

      <div>
        <label className="label text-sm font-medium text-gray-700 mb-1 block">Description</label>
        <textarea 
          name="description" 
          rows="3" 
          value={formData.description} 
          onChange={handleChange} 
          className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label text-sm font-medium text-gray-700 mb-1 block">Date</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            required 
          />
        </div>

        <div>
          <label className="label text-sm font-medium text-gray-700 mb-1 block">Time</label>
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            required 
          />
        </div>
      </div>

      <div>
        <label className="label text-sm font-medium text-gray-700 mb-1 block">Location</label>
        <input 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      <div>
        <label className="label text-sm font-medium text-gray-700 mb-1 block">Upload Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span>
                <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        
        {formData.imagePreview && (
          <div className="mt-3">
            <div className="relative inline-block">
              <img src={formData.imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg shadow-md" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="label text-sm font-medium text-gray-700 mb-1 block">Status</label>
        <select 
          name="status" 
          value={formData.status} 
          onChange={handleChange} 
          className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option>Upcoming</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn-secondary px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-primary px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          Save Event
        </button>
      </div>
    </form>
  );
}