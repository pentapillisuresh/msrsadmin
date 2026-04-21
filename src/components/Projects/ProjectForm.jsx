import React, { useState, useEffect } from 'react';

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
        { code: 'RJ', name: 'Rajasthan' }
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
    RJ: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota']
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
    title: initialData?.title || '',
    category: initialData?.category || categories[0] || '',
    objective: initialData?.objective || '',
    targetBeneficiaries: initialData?.targetBeneficiaries || '',
    budgetRequired: initialData?.budgetRequired || '',
    impactMetrics: initialData?.impactMetrics || [''],
    csrAlignment: initialData?.csrAlignment || '',
    state: initialData?.state || '',
    district: initialData?.district || '',
    date: initialData?.date || '',
    status: initialData?.status || 'Upcoming',
    image: initialData?.image || ''  // base64 string
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [imagePreview, setImagePreview] = useState(formData.image || '');

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, image: base64 }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedMetrics = formData.impactMetrics.filter(m => m.trim() !== '');
    onSave({ ...formData, impactMetrics: cleanedMetrics });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
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
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
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
            placeholder="e.g., Schedule VII, Education"
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
              <option key={state.code} value={state.code}>{state.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={!formData.state || loadingDistricts}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select District</option>
            {districts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
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
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
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
        <button type="submit" className="btn-primary px-4 py-2">
          {initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}