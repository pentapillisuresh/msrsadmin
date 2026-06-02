// ProjectForm.jsx
import React, { useState, useEffect } from 'react';
import {api} from '../../services/ApiService';

// ---------- Mock API for Indian states & districts (replace with real endpoint) ----------
const fetchStates = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { code: 'MH', name: 'Maharashtra' },
        { code: 'DL', name: 'Delhi' },
        { code: 'KA', name: 'Karnataka' },
        { code: 'TN', name: 'Tamil Nadu' },
        { code: 'UP', name: 'Uttar Pradesh' },
        { code: 'GJ', name: 'Gujarat' },
        { code: 'WB', name: 'West Bengal' },
        { code: 'RJ', name: 'Rajasthan' },
        { code: 'AP', name: 'Andhra Pradesh' }
      ]);
    }, 300);
  });
};

const fetchDistricts = (stateCode) => {
  const districtMap = {
    MH: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    DL: ['New Delhi', 'South Delhi', 'East Delhi', 'North Delhi'],
    KA: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru'],
    TN: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
    UP: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
    GJ: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    WB: ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri'],
    RJ: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    AP: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore']
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(districtMap[stateCode] || []);
    }, 300);
  });
};
// -------------------------------------------------------------------------------------

export default function ProjectForm({ initialData, onSave, onCancel, categories }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    categoryId: initialData?.categoryId || '',
    objective: initialData?.objective || '',
    targetBeneficiaries: initialData?.targetBeneficiaries || '',
    budgetRequired: initialData?.budgetRequired || '',
    impactMetrics: initialData?.points ? JSON.parse(initialData.points) : [''],
    csrAlignment: initialData?.csrAlignment || '',
    state: initialData?.state || '',
    district: initialData?.district || '',
    date: initialData?.date || '',
    status: initialData?.status || 'pending',
    projectImage: initialData?.projectImage || '',
    applicationType: initialData?.applicationType || 'NGO',
    mode: initialData?.mode || 'Offline'
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.projectImage ? `http://localhost:3000${initialData.projectImage}` : '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load states on mount
  useEffect(() => {
    fetchStates().then(data => setStates(data));
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (!formData.state) {
      setDistricts([]);
      return;
    }
    setLoadingDistricts(true);
    fetchDistricts(formData.state).then(data => {
      setDistricts(data);
      setLoadingDistricts(false);
      if (!data.includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: '' }));
      }
    });
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Impact metrics handlers
  const handleImpactChange = (index, value) => {
    const newMetrics = [...formData.impactMetrics];
    newMetrics[index] = value;
    setFormData(prev => ({ ...prev, impactMetrics: newMetrics }));
  };

  const addImpactPoint = () => {
    setFormData(prev => ({ ...prev, impactMetrics: [...prev.impactMetrics, ''] }));
  };

  const removeImpactPoint = (index) => {
    const newMetrics = formData.impactMetrics.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, impactMetrics: newMetrics }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    
    // Add all fields to FormData
    formDataToSend.append('name', formData.name);
    formDataToSend.append('objective', formData.objective);
    formDataToSend.append('targetBeneficiaries', formData.targetBeneficiaries);
    formDataToSend.append('budgetRequired', formData.budgetRequired);
    formDataToSend.append('csrAlignment', formData.csrAlignment);
    formDataToSend.append('state', formData.state);
    formDataToSend.append('district', formData.district);
    formDataToSend.append('applicationType', formData.applicationType);
    formDataToSend.append('mode', formData.mode);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('categoryId', formData.categoryId);
    
    // Clean and add points
    const cleanedMetrics = formData.impactMetrics.filter(m => m.trim() !== '');
    formDataToSend.append('points', JSON.stringify(cleanedMetrics));
    
    // Add image if selected
    if (imageFile) {
      formDataToSend.append('projectImage', imageFile);
    }

    try {
      let response;
      if (initialData?.id) {
        // Update existing project
        response = await api.put(`/projects/${initialData.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new project
        response = await api.post('/projects/', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      if (response.success) {
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Objective *</label>
          <textarea
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            required
            rows="2"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application Type *</label>
          <select
            name="applicationType"
            value={formData.applicationType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NGO">NGO</option>
            <option value="Corporate">Corporate</option>
            <option value="Government">Government</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode *</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Beneficiaries</label>
          <input
            type="text"
            name="targetBeneficiaries"
            value={formData.targetBeneficiaries}
            onChange={handleChange}
            placeholder="e.g., 5000 rural women"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Required (₹)</label>
          <input
            type="number"
            name="budgetRequired"
            value={formData.budgetRequired}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CSR Alignment</label>
          <input
            type="text"
            name="csrAlignment"
            value={formData.csrAlignment}
            onChange={handleChange}
            placeholder="e.g., Environment Sustainability"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.code} value={state.name}>{state.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
          <input
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            placeholder="District"
            disabled={!formData.state || loadingDistricts}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
            </div>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Impact Metrics (multiple points)</label>
          {formData.impactMetrics.map((metric, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={metric}
                onChange={(e) => handleImpactChange(idx, e.target.value)}
                placeholder={`Impact point ${idx + 1}`}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.impactMetrics.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImpactPoint(idx)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImpactPoint}
            className="text-sm text-blue-600 hover:text-blue-700 mt-1"
          >
            + Add another impact point
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary px-4 py-2">
          {loading ? 'Saving...' : (initialData ? 'Update Project' : 'Create Project')}
        </button>
      </div>
    </form>
  );
}