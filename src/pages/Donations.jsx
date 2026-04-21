import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Download, Search, Plus, Edit, Trash2, X } from 'lucide-react';

export default function Donations() {
  const [donations, setDonations] = useLocalStorage('c3r_donations', []);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    category: 'Corporate',
    date: '',
    status: 'Completed'
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingDonation(null);
    setFormData({
      donorName: '',
      amount: '',
      category: 'Corporate',
      date: new Date().toISOString().slice(0, 10),
      status: 'Completed'
    });
    setShowForm(true);
  };

  const openEditForm = (donation) => {
    setEditingDonation(donation);
    setFormData({
      donorName: donation.donorName,
      amount: donation.amount,
      category: donation.category,
      date: donation.date,
      status: donation.status
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.donorName || !formData.amount || !formData.date) {
      alert('Please fill all required fields');
      return;
    }
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Amount must be a positive number');
      return;
    }

    const newDonation = {
      id: editingDonation ? editingDonation.id : Date.now(),
      donorName: formData.donorName,
      amount: amountNum,
      category: formData.category,
      date: formData.date,
      status: formData.status
    };

    if (editingDonation) {
      setDonations(donations.map(d => d.id === editingDonation.id ? newDonation : d));
    } else {
      setDonations([...donations, newDonation]);
    }
    setShowForm(false);
    setEditingDonation(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this donation record?')) {
      setDonations(donations.filter(d => d.id !== id));
    }
  };

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.donorName.toLowerCase().includes(search.toLowerCase());
    if (filterCategory === 'all') return matchesSearch;
    return matchesSearch && d.category === filterCategory;
  });

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(donations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Donation Management</h2>
        <div className="flex gap-2">
          <button onClick={exportData} className="btn-secondary text-sm flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={openAddForm} className="btn-primary text-sm flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Donation
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-xs text-indigo-600 font-medium">Total Donations</p>
          <p className="text-2xl font-bold text-indigo-700">₹{totalAmount.toFixed(2)}L</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium">Total Donors</p>
          <p className="text-2xl font-bold text-green-700">{donations.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search donor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          <option>Corporate</option>
          <option>Individual</option>
        </select>
      </div>

      {/* Donation Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Donor Name</th>
                <th className="px-4 py-3 text-left">Amount (₹L)</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">No donations found</td>
                </tr>
              ) : (
                filteredDonations.map(d => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.donorName}</td>
                    <td className="px-4 py-3">₹{d.amount}L</td>
                    <td className="px-4 py-3">{d.category}</td>
                    <td className="px-4 py-3">{new Date(d.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditForm(d)} className="text-blue-600 hover:text-blue-800" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800" title="Delete">
                          <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{editingDonation ? 'Edit Donation' : 'Add Donation'}</h3>
              <button onClick={() => setShowForm(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name *</label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹ in Lakhs) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Corporate</option>
                  <option>Individual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}