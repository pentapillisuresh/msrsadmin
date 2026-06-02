// CategoryManager.jsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import {api} from '../../services/ApiService';

export default function CategoryManager({ categories, onAddCategory, onDeleteCategory, onUpdateCategory }) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setLoading(true);
      try {
        const response = await api.post('/categories/', {
          name: newCategory.trim(),
          categoryRelated: 'project',
          description: `Projects related to ${newCategory.trim()}`,
          status: 'active'
        });
        
        if (response.success) {
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
        const response = await api.put(`/categories/${editingCategory.id}`, {
          name: editValue.trim(),
          categoryRelated: 'project',
          description: `Projects related to ${editValue.trim()}`,
          status: 'active'
        });
        
        if (response.success) {
          onUpdateCategory(editingCategory.id, response.data);
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

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      setLoading(true);
      try {
        const response = await api.delete(`/categories/${category.id}`);
        if (response.success) {
          onDeleteCategory(category.id);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Cannot delete category that is being used by projects.');
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
          placeholder="Enter new category name"
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-4 py-2 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Existing Categories</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              {editingCategory?.id === category.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    disabled={loading}
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
                  <span className="text-gray-700">{category.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(category)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
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
      </div>

      <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg">
        <strong>Note:</strong> Categories that are currently used by projects cannot be deleted. Please reassign or delete those projects first.
      </div>
    </div>
  );
}