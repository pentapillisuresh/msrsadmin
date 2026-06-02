// src/pages/Donations.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import { Download, Search, Plus, Edit, Trash2, X, DollarSign, Users, FolderPlus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import DonationCategoryManager from '../components/Donation/DonationCategoryManager';

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    monthlyStats: []
  });
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDonationType, setFilterDonationType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Form state based on Donation model
  const [formData, setFormData] = useState({
    donerName: '',
    donerEmail: '',
    donerPhoneNumber: '',
    citizenship: 'Indian',
    donationType: 'once',
    cause: '',
    description: '',
    donationAmount: '',
    panCard: '',
    status: 'pending',
    categoryId: ''
  });

  // Fetch donations from API
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/donations');
      if (response.success) {
        setDonations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      alert('Error fetching donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await api.get('/donations/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/?categoryRelated=donation');
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchStats();
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategoryName) => {
    try {
      const response = await api.post('/categories/', {
        name: newCategoryName,
        categoryRelated: 'donation',
        description: `Donation related to ${newCategoryName}`,
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
    const donationsUsingCategory = donations.filter(d => d.categoryId === categoryId);
    if (donationsUsingCategory.length > 0) {
      alert(`Cannot delete category because it is used by ${donationsUsingCategory.length} donation(s). Please reassign or delete those donations first.`);
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
        categoryRelated: 'donation',
        description: `Donations related to ${newCategoryName}`,
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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingDonation(null);
    setFormData({
      donerName: '',
      donerEmail: '',
      donerPhoneNumber: '',
      citizenship: 'Indian',
      donationType: 'once',
      cause: '',
      description: '',
      donationAmount: '',
      panCard: '',
      status: 'pending',
      categoryId: categories[0]?.id || ''
    });
    setShowForm(true);
  };

  const openEditForm = async (donation) => {
    try {
      const response = await api.get(`/donations/${donation.id}`);
      if (response.success) {
        const donationData = response.data;
        setEditingDonation(donationData);
        setFormData({
          donerName: donationData.donerName,
          donerEmail: donationData.donerEmail,
          donerPhoneNumber: donationData.donerPhoneNumber,
          citizenship: donationData.citizenship,
          donationType: donationData.donationType,
          cause: donationData.cause,
          description: donationData.description || '',
          donationAmount: donationData.donationAmount,
          panCard: donationData.panCard || '',
          status: donationData.status,
          categoryId: donationData.categoryId || ''
        });
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching donation details:', error);
      alert('Error loading donation details. Please try again.');
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.donerName || !formData.donerEmail || !formData.donerPhoneNumber || !formData.donationAmount || !formData.cause) {
      alert('Please fill all required fields');
      return;
    }

    const amountNum = parseFloat(formData.donationAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Amount must be a positive number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.donerEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    if (formData.donerPhoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setSubmitting(true);

    try {
      const donationData = {
        donerName: formData.donerName,
        donerEmail: formData.donerEmail,
        donerPhoneNumber: formData.donerPhoneNumber,
        citizenship: formData.citizenship,
        donationType: formData.donationType,
        cause: formData.cause,
        description: formData.description,
        donationAmount: amountNum,
        panCard: formData.panCard,
        status: formData.status,
        categoryId: formData.categoryId || null
      };

      let response;
      if (editingDonation) {
        response = await api.put(`/donations/${editingDonation.id}`, donationData);
      } else {
        response = await api.post('/donations/createByAdmin', donationData);
      }

      if (response.data.success) {
        await fetchDonations();
        await fetchStats();
        setShowForm(false);
        setEditingDonation(null);
        alert(editingDonation ? 'Donation updated successfully!' : 'Donation added successfully!');
      }
    } catch (error) {
      console.error('Error saving donation:', error);
      alert('Error saving donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      try {
        const response = await api.delete(`/donations/${id}`);
        if (response.data.success) {
          await fetchDonations();
          await fetchStats();
          alert('Donation deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting donation:', error);
        alert('Error deleting donation. Please try again.');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await api.put(`/donations/${id}/status`, { status: newStatus });
      if (response.success) {
        await fetchDonations();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating donation status. Please try again.');
    }
  };

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.donerName?.toLowerCase().includes(search.toLowerCase()) ||
                          d.donerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesType = filterDonationType === 'all' || d.donationType === filterDonationType;
    const matchesCategory = filterCategory === 'all' || d.categoryId === filterCategory;
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const totalAmount = filteredDonations.reduce((sum, d) => sum + parseFloat(d.donationAmount), 0);

  const exportData = () => {
    const exportData = donations.map(d => ({
      donerName: d.donerName,
      donerEmail: d.donerEmail,
      donerPhoneNumber: d.donerPhoneNumber,
      citizenship: d.citizenship,
      donationType: d.donationType,
      cause: d.cause,
      description: d.description,
      donationAmount: d.donationAmount,
      panCard: d.panCard,
      status: d.status,
      category: d.Category?.name,
      createdAt: d.createdAt
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading donations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Donation Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={exportData} 
            className="text-sm flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={donations.length === 0}
          >
            <Download className="w-4 h-4" /> Export
          </button>
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
            <Plus className="w-4 h-4" /> Add Donation
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 font-medium">Total Donations</p>
              <p className="text-2xl font-bold">₹{stats.totalAmount?.toFixed(2) || totalAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 font-medium">Total Donors</p>
              <p className="text-2xl font-bold">{donations.length}</p>
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 font-medium">Completed</p>
              <p className="text-2xl font-bold">{donations.filter(d => d.status === 'completed').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 font-medium">Pending</p>
              <p className="text-2xl font-bold">{donations.filter(d => d.status === 'pending').length}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Monthly Stats Chart */}
      {stats.monthlyStats && stats.monthlyStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Donation Trends</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stats.monthlyStats.map((month, idx) => (
              <div key={idx} className="flex-1 min-w-[100px] text-center">
                <div className="text-xs text-gray-500 mb-1">{month.month}</div>
                <div className="bg-indigo-100 rounded-lg p-2">
                  <div className="text-sm font-semibold text-indigo-700">₹{parseFloat(month.total).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{month.count} donations</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
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
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={filterDonationType}
          onChange={(e) => setFilterDonationType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="once">One Time</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Donation Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cause</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-400">
                    No donations found
                  </td>
                </tr>
              ) : (
                filteredDonations.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{d.donerName}</p>
                      <p className="text-xs text-gray-500">PAN: {d.panCard || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{d.donerEmail}</p>
                      <p className="text-xs text-gray-500">{d.donerPhoneNumber}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">
                      ₹{parseFloat(d.donationAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 capitalize">
                        {d.donationType === 'once' ? 'One Time' : 'Monthly'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{d.cause}</p>
                      {d.description && (
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{d.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {d.Category ? (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                          {d.Category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusUpdate(d.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(d.status)} focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    {/* <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditForm(d)} 
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(d.id)} 
                          className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Manage Donation Categories</h3>
              <button 
                onClick={() => setShowCategoryManager(false)} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <DonationCategoryManager 
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategory={handleUpdateCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{editingDonation ? 'Edit Donation' : 'Add Donation'}</h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name *</label>
                  <input
                    type="text"
                    name="donerName"
                    value={formData.donerName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="donerEmail"
                    value={formData.donerEmail}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="donerPhoneNumber"
                    value={formData.donerPhoneNumber}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship *</label>
                  <select
                    name="citizenship"
                    value={formData.citizenship}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Indian">Indian</option>
                    <option value="NRI">NRI</option>
                    <option value="Foreign">Foreign</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type *</label>
                  <select
                    name="donationType"
                    value={formData.donationType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="once">One Time</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="donationAmount"
                    value={formData.donationAmount}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cause *</label>
                <input
                  type="text"
                  name="cause"
                  value={formData.cause}
                  onChange={handleFormChange}
                  placeholder="e.g., Education, Healthcare, Environment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Additional details about the donation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleFormChange}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Category Dropdown - Added here */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
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
                    No categories available. Click "Manage Categories" to add donation categories.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Donation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}