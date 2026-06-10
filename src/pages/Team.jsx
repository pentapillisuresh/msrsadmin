// src/pages/Team.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import TeamMemberForm from '../components/Team/TeamMemberForm';
import { Plus, X, User, Trash2, Edit, Mail, Phone, FolderPlus, Filter, Check } from 'lucide-react';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Category manager state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Fetch board members from API
  const fetchBoardMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/board');
      console.log('Board members response:', response);
      if (response.success) {
        const members = response.data.data || response.data || [];
        setTeam(members);
        console.log('Loaded members:', members);
      }
    } catch (error) {
      console.error('Error fetching board members:', error);
      alert('Error fetching board members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/?categoryRelated=board');
      console.log('Categories response:', response);
      if (response.success) {
        const categoriesData = response.data.data || response.data || [];
        setCategories(categoriesData);
        console.log('Loaded categories:', categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchBoardMembers();
    fetchCategories();
  }, []);

  // --- Category CRUD functions with API integration ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    if (categories.some(c => c.name === newCategory.trim())) {
      alert('Category already exists');
      return;
    }
    
    try {
      const categoryData = {
        name: newCategory.trim(),
        categoryRelated: 'board',
        description: `Board members related to ${newCategory.trim()}`,
        status: 'active'
      };
      
      console.log('Adding category:', categoryData);
      const response = await api.post('/categories/', categoryData);
      
      console.log('Add category response:', response);
      if (response.success) {
        const newCategoryData = response.data.data || response.data;
        setCategories([...categories, newCategoryData]);
        setNewCategory('');
        alert('Category added successfully!');
        await fetchCategories(); // Refresh categories
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleUpdateCategory = async (catId, newCatName) => {
    if (!newCatName.trim()) return;
    
    try {
      const response = await api.put(`/categories/${catId}`, {
        name: newCatName.trim(),
        categoryRelated: 'board',
        description: `Board members related to ${newCatName.trim()}`,
        status: 'active'
      });
      
      if (response.success) {
        const updatedCategory = response.data.data || response.data;
        setCategories(categories.map(c => 
          c.id === catId ? updatedCategory : c
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

  const handleDeleteCategory = async (catId, catName) => {
    const usedBy = team.filter(m => m.categoryId === catId).length;
    if (usedBy > 0) {
      alert(`Cannot delete "${catName}" because it is used by ${usedBy} team member(s).`);
      return false;
    }
    
    try {
      const response = await api.delete(`/categories/${catId}`);
      if (response.success) {
        setCategories(categories.filter(c => c.id !== catId));
        if (filterCategory === catId) setFilterCategory('all');
        alert('Category deleted successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
      return false;
    }
  };

  // --- Member CRUD with API integration ---
  const handleSave = async (memberData) => {
    console.log('Received member data:', memberData);
    console.log('Selected categoryId:', memberData.categoryId);
    
    // Validate category selection
    if (!memberData.categoryId) {
      alert('Please select a category');
      setSubmitting(false);
      return;
    }
    
    // Find the selected category name for debugging
    const selectedCategory = categories.find(c => c.id === memberData.categoryId);
    console.log('Selected category:', selectedCategory);
    
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('role', memberData.role);
      formData.append('email', memberData.email || '');
      formData.append('phoneNumber', memberData.phone || '');
      formData.append('categoryId', memberData.categoryId); // Make sure this is being sent
      formData.append('mediaType', 'image');
      formData.append('status', 'active');
      
      if (memberData.image && memberData.image instanceof File) {
        formData.append('image', memberData.image);
      }

      // Log all form data for debugging
      console.log('Sending form data:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      let response;
      if (editingMember) {
        response = await api.put(`/board/${editingMember.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/board', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      console.log('Save member response:', response);
      
      if (response.success) {
        await fetchBoardMembers();
        setShowForm(false);
        setEditingMember(null);
        alert(editingMember ? 'Team member updated successfully!' : 'Team member added successfully!');
      } else {
        alert(response.message || 'Error saving team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Error saving team member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        const response = await api.delete(`/board/${id}`);
        if (response.success) {
          await fetchBoardMembers();
          alert('Team member deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
        alert('Error deleting team member. Please try again.');
      }
    }
  };

  const handleViewMember = async (member) => {
    try {
      const response = await api.get(`/board/${member.id}`);
      if (response.success) {
        setSelectedMember(response.data.data || response.data);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
      alert('Error loading member details. Please try again.');
    }
  };

  const handleEditMember = async (member) => {
    try {
      const response = await api.get(`/board/${member.id}`);
      if (response.success) {
        const memberData = response.data.data || response.data;
        setEditingMember(memberData);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
      alert('Error loading member details. Please try again.');
    }
  };

  const filteredMembers = filterCategory === 'all'
    ? team
    : team.filter(m => m.categoryId === filterCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Board & Team Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCategoryManager(true)} 
            className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </button>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={() => { setEditingMember(null); setShowForm(true); }} 
            className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Manage Team Categories</h3>
              <button onClick={() => setShowCategoryManager(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Add new category */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* List of categories with edit/delete */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700">Existing Categories</h4>
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No categories added yet
                  </div>
                ) : (
                  categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      {editingCategory === cat.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                          />
                          <button
                            onClick={async () => {
                              await handleUpdateCategory(cat.id, editValue);
                              setEditingCategory(null);
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-700">{cat.name}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingCategory(cat.id);
                                setEditValue(cat.name);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg">
                <strong>Note:</strong> Categories used by existing team members cannot be deleted.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{editingMember ? 'Edit Member' : 'Add Member'}</h3>
              <button onClick={() => { setShowForm(false); setEditingMember(null); }} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <TeamMemberForm 
                initialData={editingMember} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
                categories={categories}
                submitting={submitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {viewModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Team Member Details</h3>
              <button onClick={() => setViewModal(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center">
              {selectedMember.image ? (
                <img src={`http://localhost:3000${selectedMember.image}`} alt={selectedMember.name} className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 mx-auto" />
              ) : (
                <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-indigo-200 mx-auto">
                  <User className="w-16 h-16 text-indigo-600" />
                </div>
              )}
              <h4 className="text-xl font-bold text-gray-900 mt-4">{selectedMember.name}</h4>
              <p className="text-indigo-600 font-medium mt-1">{selectedMember.role}</p>
              {selectedMember.Category && (
                <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {selectedMember.Category.name}
                </span>
              )}
              <div className="mt-6 space-y-3 text-left">
                {selectedMember.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMember.email}</span>
                  </div>
                )}
                {selectedMember.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMember.phoneNumber}</span>
                  </div>
                )}
                {selectedMember.createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">Joined:</span>
                    <span className="text-gray-700">{new Date(selectedMember.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No team members found</p>
            <p className="text-sm">Click "Add Member" to add your first team member</p>
          </div>
        ) : (
          filteredMembers.map(member => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="cursor-pointer" onClick={() => handleViewMember(member)}>
                    {member.image ? (
                      <img src={`http://localhost:3000${member.image}`} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 hover:border-indigo-500" />
                    ) : (
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center hover:bg-indigo-200">
                        <User className="w-8 h-8 text-indigo-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600" onClick={() => handleViewMember(member)}>
                          {member.name}
                        </h3>
                        <p className="text-xs text-indigo-600 mt-0.5">{member.role}</p>
                        {member.Category && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {member.Category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => handleEditMember(member)} className="p-1 text-gray-400 hover:text-blue-600" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-1 text-gray-400 hover:text-red-600" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {member.email && <p className="text-xs text-gray-500 mt-2 truncate">{member.email}</p>}
                    {member.phoneNumber && <p className="text-xs text-gray-500">{member.phoneNumber}</p>}
                    <div className="flex gap-2 mt-2">
                      {member.email && <a href={`mailto:${member.email}`} className="text-xs text-indigo-600 hover:text-indigo-800">Email</a>}
                      {member.phoneNumber && <a href={`tel:${member.phoneNumber}`} className="text-xs text-indigo-600 hover:text-indigo-800">Call</a>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}