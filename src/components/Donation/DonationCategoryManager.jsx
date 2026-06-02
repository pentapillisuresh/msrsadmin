// src/components/Donations/DonationCategoryManager.jsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import axios from 'axios';

export default function DonationCategoryManager({ categories, onAddCategory, onDeleteCategory, onUpdateCategory }) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (newCategory.trim()) {
      setLoading(true);
      try {
        // API call to create category
        const response = await axios.post('http://localhost:3000/api/categories/', {
          name: newCategory.trim(),
          categoryRelated: 'donation',
          description: `Donations related to ${newCategory.trim()}`,
          status: 'active'
        });
        
        if (response.data.success) {
          onAddCategory(response.data.data);
          setNewCategory('');
        }
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditValue(category.name);
  };

  const saveEdit = async () => {
    if (editValue.trim() && editingCategory) {
      setLoading(true);
      try {
        // API call to update category
        const response = await axios.put(`http://localhost:3000/api/categories/${editingCategory.id}`, {
          name: editValue.trim(),
          categoryRelated: 'donation',
          description: `Donations related to ${editValue.trim()}`,
          status: 'active'
        });
        
        if (response.data.success) {
          onUpdateCategory(editingCategory.id, response.data.data);
          setEditingCategory(null);
          setEditValue('');
        }
      } catch (error) {
        console.error('Error updating category:', error);
        alert('Error updating category. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      setLoading(true);
      try {
        // API call to delete category
        const response = await axios.delete(`http://localhost:3000/api/categories/${category.id}`);
        
        if (response.data.success) {
          onDeleteCategory(category.id);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Cannot delete category that is being used by donations.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New donation category name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Existing Categories</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No categories added yet
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {editingCategory?.id === category.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      autoFocus
                    />
                    <button 
                      onClick={saveEdit} 
                      disabled={loading}
                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={cancelEdit} 
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-700 font-medium">{category.name}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => startEdit(category)} 
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category)} 
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
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
      </div>

      <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <strong className="font-medium">Note:</strong> Categories used by existing donations cannot be deleted. Please reassign or delete those donations first.
      </div>
    </div>
  );
}