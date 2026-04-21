import React, { useState } from 'react';
import { User, Upload, X } from 'lucide-react';

export default function TeamMemberForm({ initialData, onSave, onCancel, categories = [] }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    category: initialData?.category || (categories[0] || ''),
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    image: null,
    imagePreview: initialData?.image || null
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
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

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null, imagePreview: null });
  };

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const saveData = {
      ...formData,
      image: formData.imagePreview || null
    };
    onSave(saveData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image (Optional)</label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {formData.imagePreview ? (
              <div className="relative">
                <img src={formData.imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200" />
                <button type="button" onClick={handleRemoveImage} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Upload Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
        <input name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Project Manager" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required>
          {categories.length === 0 && <option value="">Loading...</option>}
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="member@example.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="+91 98765 43210" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">Save Member</button>
      </div>
    </form>
  );
}