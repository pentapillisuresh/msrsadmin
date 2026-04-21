import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TeamMemberForm from '../components/Team/TeamMemberForm';
import { Plus, X, User, Trash2, Edit, Mail, Phone, FolderPlus, Filter,Check } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Leadership', 'Operations', 'Finance', 'Communications', 'Volunteers'];

export default function Team() {
  const [team, setTeam] = useLocalStorage('c3r_team', []);
  const [categories, setCategories] = useLocalStorage('c3r_team_categories', DEFAULT_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  // Category manager state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // --- Category CRUD functions ---
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      alert('Category already exists');
      return;
    }
    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
  };

  const handleUpdateCategory = (oldCat, newCat) => {
    if (oldCat === newCat) return;
    if (categories.includes(newCat)) {
      alert('Category already exists');
      return false;
    }
    // Update all team members using this category
    setTeam(team.map(m => m.category === oldCat ? { ...m, category: newCat } : m));
    setCategories(categories.map(c => c === oldCat ? newCat : c));
    if (filterCategory === oldCat) setFilterCategory(newCat);
    return true;
  };

  const handleDeleteCategory = (catToDelete) => {
    const usedBy = team.filter(m => m.category === catToDelete).length;
    if (usedBy > 0) {
      alert(`Cannot delete "${catToDelete}" because it is used by ${usedBy} team member(s).`);
      return false;
    }
    setCategories(categories.filter(c => c !== catToDelete));
    if (filterCategory === catToDelete) setFilterCategory('all');
    return true;
  };

  // --- Member CRUD ---
  const handleSave = (memberData) => {
    if (editingMember) {
      setTeam(team.map(m => m.id === editingMember.id ? { ...memberData, id: m.id } : m));
    } else {
      setTeam([...team, { ...memberData, id: Date.now(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingMember(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this team member?')) 
      setTeam(team.filter(m => m.id !== id));
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setViewModal(true);
  };

  const filteredMembers = filterCategory === 'all'
    ? team
    : team.filter(m => m.category === filterCategory);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Team Management</h2>
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
                <option key={cat} value={cat}>{cat}</option>
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
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    {editingCategory === cat ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            handleUpdateCategory(cat, editValue);
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
                        <span className="text-gray-700">{cat}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setEditValue(cat);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
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
                <img src={selectedMember.image} alt={selectedMember.name} className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 mx-auto" />
              ) : (
                <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-indigo-200 mx-auto">
                  <User className="w-16 h-16 text-indigo-600" />
                </div>
              )}
              <h4 className="text-xl font-bold text-gray-900 mt-4">{selectedMember.name}</h4>
              <p className="text-indigo-600 font-medium mt-1">{selectedMember.role}</p>
              {selectedMember.category && (
                <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {selectedMember.category}
                </span>
              )}
              <div className="mt-6 space-y-3 text-left">
                {selectedMember.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMember.email}</span>
                  </div>
                )}
                {selectedMember.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMember.phone}</span>
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
                      <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 hover:border-indigo-500" />
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
                        {member.category && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {member.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => { setEditingMember(member); setShowForm(true); }} className="p-1 text-gray-400 hover:text-blue-600" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-1 text-gray-400 hover:text-red-600" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {member.email && <p className="text-xs text-gray-500 mt-2 truncate">{member.email}</p>}
                    {member.phone && <p className="text-xs text-gray-500">{member.phone}</p>}
                    <div className="flex gap-2 mt-2">
                      {member.email && <a href={`mailto:${member.email}`} className="text-xs text-indigo-600 hover:text-indigo-800">Email</a>}
                      {member.phone && <a href={`tel:${member.phone}`} className="text-xs text-indigo-600 hover:text-indigo-800">Call</a>}
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


