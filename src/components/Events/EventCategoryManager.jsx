import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function EventCategoryManager({ categories, onAddCategory, onDeleteCategory, onUpdateCategory }) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const saveEdit = () => {
    if (editValue.trim() && editingCategory) {
      onUpdateCategory(editingCategory, editValue.trim());
      setEditingCategory(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New event category name"
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Existing Categories</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              {editingCategory === category ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-700">{category}</span>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(category)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteCategory(category)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
        <strong>Note:</strong> Categories used by existing events cannot be deleted. Reassign or delete those events first.
      </div>
    </div>
  );
}