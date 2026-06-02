// src/pages/Volunteers.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import { Check, X, Phone, Mail, UserPlus, Eye, Calendar, Briefcase, Heart, BookOpen, Users, Plus, Trash2, Edit, Ban, RotateCcw, FolderPlus } from 'lucide-react';
import VolunteerCategoryManager from '../components/Volunteers/VolunteerCategoryManager';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    address: '',
    qualification: '',
    occupation: '',
    maritalStatus: 'single',
    applicationType: '',
    mode: '',
    customerArea: '',
    availableStartDateTime: '',
    availableEndDateTime: '',
    motivation: '',
    feedbackSuggestion: '',
    status: 'pending',
    categoryId: ''
  });

  const areasOfInterestOptions = [
    'Education & Teaching Support',
    'Rural Development Programs',
    'Women Empowerment Initiatives',
    'Health & Awareness Campaigns',
    'Spiritual & Cultural Programs',
    'CSR Project Execution',
    'Digital Media & Content Creation',
    'Fundraising & Partnerships',
    'Administration & Operations'
  ];

  const degreeOptions = [
    'High School / Secondary',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate (PhD)',
    'Diploma',
    'Vocational Training',
    'Other'
  ];

  // Fetch volunteers from API
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/volunteers');
      if (response.success) {
        setVolunteers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      alert('Error fetching volunteers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/?categoryRelated=volunteer');
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchVolunteers();
    fetchCategories();
  }, []);

  // Category management handlers
  const handleAddCategory = async (newCategoryName) => {
    try {
      const response = await api.post('/categories/', {
        name: newCategoryName,
        categoryRelated: 'volunteer',
        description: `Volunteer opportunities related to ${newCategoryName}`,
        status: 'active'
      });
      
      if (response.success) {
        setCategories([...categories, response.data]);
        alert('Category added successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
      return false;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const volunteersUsingCategory = volunteers.filter(v => v.categoryId === categoryId);
    if (volunteersUsingCategory.length > 0) {
      alert(`Cannot delete category because it is used by ${volunteersUsingCategory.length} volunteer(s). Please reassign or delete those volunteers first.`);
      return false;
    }
    
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      if (response.success) {
        setCategories(categories.filter(c => c.id !== categoryId));
        alert('Category deleted successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
      return false;
    }
  };

  const handleUpdateCategory = async (categoryId, newCategoryName) => {
    const category = categories.find(c => c.id === categoryId);
    if (category.name === newCategoryName) return true;
    
    if (categories.some(c => c.name === newCategoryName)) {
      alert(`Category "${newCategoryName}" already exists!`);
      return false;
    }
    
    try {
      const response = await api.put(`/categories/${categoryId}`, {
        name: newCategoryName,
        categoryRelated: 'volunteer',
        description: `Volunteer opportunities related to ${newCategoryName}`,
        status: 'active'
      });
      
      if (response.success) {
        setCategories(categories.map(c => 
          c.id === categoryId ? response.data : c
        ));
        alert('Category updated successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
      return false;
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await api.put(`/volunteers/${id}`, { status: 'approved' });
      if (response.success) {
        await fetchVolunteers();
      }
    } catch (error) {
      console.error('Error accepting volunteer:', error);
      alert('Error updating volunteer status. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await api.put(`/volunteers/${id}`, { status: 'rejected' });
      if (response.success) {
        await fetchVolunteers();
      }
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
      alert('Error updating volunteer status. Please try again.');
    }
  };

  const handleBlock = async (id) => {
    if (window.confirm('Block this volunteer? They will no longer be able to apply or be contacted.')) {
      try {
        const response = await api.put(`/volunteers/${id}`, { status: 'inactive' });
        if (response.success) {
          await fetchVolunteers();
        }
      } catch (error) {
        console.error('Error blocking volunteer:', error);
        alert('Error updating volunteer status. Please try again.');
      }
    }
  };

  const handleUnblock = async (id) => {
    if (window.confirm('Unblock this volunteer? Their status will be set back to Pending.')) {
      try {
        const response = await api.put(`/volunteers/${id}`, { status: 'pending' });
        if (response.success) {
          await fetchVolunteers();
        }
      } catch (error) {
        console.error('Error unblocking volunteer:', error);
        alert('Error updating volunteer status. Please try again.');
      }
    }
  };

  const contactVolunteer = (volunteer) => {
    window.location.href = `mailto:${volunteer.email}`;
  };

  const handleViewVolunteer = async (volunteer) => {
    try {
      const response = await api.get(`/volunteers/${volunteer.id}`);
      if (response.success) {
        setSelectedVolunteer(response.data);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching volunteer details:', error);
      alert('Error loading volunteer details. Please try again.');
    }
  };

  const handleEditVolunteer = async (volunteer) => {
    try {
      const response = await api.get(`/volunteers/${volunteer.id}`);
      if (response.success) {
        const volunteerData = response.data;
        setEditingVolunteer(volunteerData);
        setFormData({
          name: volunteerData.name || '',
          email: volunteerData.email || '',
          phoneNumber: volunteerData.phoneNumber || '',
          gender: volunteerData.gender || '',
          dob: volunteerData.dob || '',
          address: volunteerData.address || '',
          qualification: volunteerData.qualification || '',
          occupation: volunteerData.occupation || '',
          maritalStatus: volunteerData.maritalStatus || 'single',
          applicationType: volunteerData.applicationType || '',
          mode: volunteerData.mode || '',
          customerArea: volunteerData.customerArea || '',
          availableStartDateTime: volunteerData.availableStartDateTime || '',
          availableEndDateTime: volunteerData.availableEndDateTime || '',
          motivation: volunteerData.motivation || '',
          feedbackSuggestion: volunteerData.feedbackSuggestion || '',
          status: volunteerData.status || 'pending',
          categoryId: volunteerData.categoryId || ''
        });
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching volunteer details:', error);
      alert('Error loading volunteer details. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.gender || !formData.dob || !formData.address) {
      alert('Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (formData.phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setSubmitting(true);

    try {
      let response;
      if (editingVolunteer) {
        response = await api.put(`/volunteers/${editingVolunteer.id}`, formData);
      } else {
        response = await api.post('/volunteers', formData);
      }

      if (response.success) {
        await fetchVolunteers();
        setShowForm(false);
        setEditingVolunteer(null);
        resetForm();
        alert(editingVolunteer ? 'Volunteer updated successfully!' : 'Volunteer added successfully!');
      }
    } catch (error) {
      console.error('Error saving volunteer:', error);
      alert('Error saving volunteer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer record?')) {
      try {
        const response = await api.delete(`/volunteers/${id}`);
        if (response.success) {
          await fetchVolunteers();
          alert('Volunteer deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting volunteer:', error);
        alert('Error deleting volunteer. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      gender: '',
      dob: '',
      address: '',
      qualification: '',
      occupation: '',
      maritalStatus: 'single',
      applicationType: '',
      mode: '',
      customerArea: '',
      availableStartDateTime: '',
      availableEndDateTime: '',
      motivation: '',
      feedbackSuggestion: '',
      status: 'pending',
      categoryId: ''
    });
  };

  const openAddForm = () => {
    setEditingVolunteer(null);
    resetForm();
    setShowForm(true);
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesCategory = filterCategory === 'all' || v.categoryId === filterCategory;
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading volunteers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Volunteer & Internship Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="text-sm flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </button>
          <button
            onClick={openAddForm}
            className="text-sm flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add Application
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Manage Volunteer Categories</h3>
              <button 
                onClick={() => setShowCategoryManager(false)} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <VolunteerCategoryManager 
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategory={handleUpdateCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">{editingVolunteer ? 'Edit Application' : 'Volunteer Application Form'}</h3>
              <button onClick={() => { setShowForm(false); setEditingVolunteer(null); }} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select name="gender" required value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status *</label>
                      <select name="maritalStatus" required value={formData.maritalStatus} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <textarea name="address" required rows="2" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Professional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                      <select name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select Qualification</option>
                        {degreeOptions.map(deg => <option key={deg} value={deg}>{deg}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                      <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="e.g., Student, Professional, Retired" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Application Type</label>
                      <select name="applicationType" value={formData.applicationType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select Type</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                      <select name="mode" value={formData.mode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select Mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-indigo-600" />
                    Category
                  </h4>
                  <div>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.length === 0 ? (
                        <option value="" disabled>No categories available. Please add categories first.</option>
                      ) : (
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      )}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        No categories available. Click "Manage Categories" to add volunteer categories.
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Availability
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                      <input type="datetime-local" name="availableStartDateTime" value={formData.availableStartDateTime} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                      <input type="datetime-local" name="availableEndDateTime" value={formData.availableEndDateTime} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-600" />
                    Areas of Interest
                  </h4>
                  <div>
                    <input type="text" name="customerArea" value={formData.customerArea} onChange={handleInputChange} placeholder="Enter areas of interest (comma separated)" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    <p className="text-xs text-gray-500 mt-1">e.g., Education, Healthcare, Environment, Women Empowerment</p>
                  </div>
                </div>

                {/* Motivation */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-600" />
                    Motivation
                  </h4>
                  <div>
                    <textarea name="motivation" rows="4" value={formData.motivation} onChange={handleInputChange} placeholder="Why do you want to join us?" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                {/* Feedback/Suggestions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Feedback & Suggestions
                  </h4>
                  <div>
                    <textarea name="feedbackSuggestion" rows="3" value={formData.feedbackSuggestion} onChange={handleInputChange} placeholder="Any feedback or suggestions..." className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                {/* Status (Only for edit) */}
                {editingVolunteer && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Status</h4>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="active">Active</option>
                      <option value="rejected">Rejected</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => { setShowForm(false); setEditingVolunteer(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {submitting ? 'Saving...' : (editingVolunteer ? 'Update' : 'Submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Volunteer Details</h3>
              <button onClick={() => setViewModal(false)} className="hover:bg-gray-100 p-1 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedVolunteer.name}</h4>
                  <div className="flex gap-2 mt-1">
                    {selectedVolunteer.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        {selectedVolunteer.category.name}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedVolunteer.status)}`}>
                      {formatStatus(selectedVolunteer.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Email</p><p className="text-sm font-medium">{selectedVolunteer.email}</p></div>
                <div><p className="text-sm text-gray-500">Phone</p><p className="text-sm font-medium">{selectedVolunteer.phoneNumber}</p></div>
                <div><p className="text-sm text-gray-500">DOB</p><p className="text-sm font-medium">{selectedVolunteer.dob}</p></div>
                <div><p className="text-sm text-gray-500">Gender</p><p className="text-sm font-medium">{selectedVolunteer.gender}</p></div>
                <div><p className="text-sm text-gray-500">Marital Status</p><p className="text-sm font-medium">{selectedVolunteer.maritalStatus}</p></div>
                <div><p className="text-sm text-gray-500">Qualification</p><p className="text-sm font-medium">{selectedVolunteer.qualification || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Occupation</p><p className="text-sm font-medium">{selectedVolunteer.occupation || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Application Type</p><p className="text-sm font-medium">{selectedVolunteer.applicationType || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Mode</p><p className="text-sm font-medium">{selectedVolunteer.mode || 'N/A'}</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">Address</p><p className="text-sm font-medium">{selectedVolunteer.address}</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">Areas of Interest</p><p className="text-sm font-medium">{selectedVolunteer.customerArea || 'Not specified'}</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">Motivation</p><p className="text-sm font-medium">{selectedVolunteer.motivation || 'Not provided'}</p></div>
                {selectedVolunteer.feedbackSuggestion && (
                  <div className="col-span-2"><p className="text-sm text-gray-500">Feedback/Suggestions</p><p className="text-sm font-medium">{selectedVolunteer.feedbackSuggestion}</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Qualification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Applied On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No applications yet</p>
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((volunteer, index) => (
                  <tr key={volunteer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{volunteer.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${volunteer.applicationType === 'Volunteer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {volunteer.applicationType || 'Volunteer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {volunteer.Category ? (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          {volunteer.Category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{volunteer.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{volunteer.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-[150px]">{volunteer.qualification || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(volunteer.status)}`}>
                        {formatStatus(volunteer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{new Date(volunteer.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {volunteer.status === 'pending' && (
                          <>
                            <button onClick={() => handleAccept(volunteer.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Accept">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(volunteer.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {volunteer.status !== 'inactive' && volunteer.status !== 'rejected' ? (
                          <button onClick={() => handleBlock(volunteer.id)} className="p-1 text-gray-600 hover:bg-gray-50 rounded" title="Block">
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : volunteer.status === 'inactive' && (
                          <button onClick={() => handleUnblock(volunteer.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Unblock">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleViewVolunteer(volunteer)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEditVolunteer(volunteer)} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(volunteer.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => contactVolunteer(volunteer)} className="p-1 text-gray-600 hover:bg-gray-50 rounded" title="Email">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}