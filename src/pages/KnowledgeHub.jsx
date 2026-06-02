// src/pages/KnowledgeHub.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import ArticleForm from '../components/KnowledgeHub/ArticleForm';
import KnowledgeCategoryManager from '../components/KnowledgeHub/KnowledgeCategoryManager';
import { Plus, X, FolderPlus, FileText, Download, Edit, Trash2, Eye } from 'lucide-react';

export default function KnowledgeHub() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [viewingArticle, setViewingArticle] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch articles from API
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/e-library');
      if (response.success) {
        setArticles(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      alert('Error fetching articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/?categoryRelated=knowledge');
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  // Category management handlers
  const handleAddCategory = async (newCategoryName) => {
    try {
      const response = await api.post('/categories/', {
        name: newCategoryName,
        categoryRelated: 'knowledge',
        description: `E-Library resources related to ${newCategoryName}`,
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
    const articlesUsingCategory = articles.filter(a => a.categoryId === categoryId);
    if (articlesUsingCategory.length > 0) {
      alert(`Cannot delete category because it is used by ${articlesUsingCategory.length} article(s). Please reassign or delete those articles first.`);
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
        categoryRelated: 'knowledge',
        description: `E-Library resources related to ${newCategoryName}`,
        status: 'active'
      });
      
      if (response.success) {
        setCategories(categories.map(c => 
          c.id === categoryId ? response.data : c
        ));
        // Update articles with the new category
        setArticles(articles.map(a => 
          a.categoryId === categoryId ? { ...a, Category: response.data.data } : a
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

  const handleSave = async (articleData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', articleData.title);
      formData.append('description', articleData.content);
      formData.append('categoryId', articleData.categoryId);
      formData.append('status', 'active');
      
      if (articleData.file) {
        formData.append('file', articleData.file);
      }

      let response;
      if (editingArticle) {
        response = await api.put(`/e-library/${editingArticle.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/e-library', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.success) {
        await fetchArticles();
        setShowForm(false);
        setEditingArticle(null);
        alert(editingArticle ? 'Article updated successfully!' : 'Article added successfully!');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await api.delete(`/e-library/${id}`);
        if (response.success) {
          await fetchArticles();
          alert('Article deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article. Please try again.');
      }
    }
  };

  const handleView = async (article) => {
    try {
      const response = await api.get(`/e-library/${article.id}`);
      if (response.success) {
        setViewingArticle(response.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching article details:', error);
      alert('Error loading article details. Please try again.');
    }
  };

  const handleEdit = async (article) => {
    try {
      const response = await api.get(`/e-library/${article.id}`);
      if (response.success) {
        setEditingArticle(response.data);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching article details:', error);
      alert('Error loading article details. Please try again.');
    }
  };

  const filteredArticles = articles.filter(a => {
    if (filterCategory !== 'all' && a.categoryId !== filterCategory) return false;
    if (searchTerm && !a.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !a.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-800">E-Library Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCategoryManager(true)} 
            className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </button>
          <button 
            onClick={() => { setEditingArticle(null); setShowForm(true); }} 
            className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Content
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterCategory('all')} 
            className={`px-3 py-1 text-sm rounded-full transition-colors ${filterCategory === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFilterCategory(cat.id)} 
              className={`px-3 py-1 text-sm rounded-full transition-colors ${filterCategory === cat.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description Preview</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                    No content found
                  </td>
                </tr>
              ) : (
                filteredArticles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{article.name}</td>
                    <td className="px-4 py-3">
                      {article.Category ? (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                          {article.Category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{article.description}</td>
                    <td className="px-4 py-3">
                      {article.file ? (
                        <a href={`http://localhost:3000${article.file}`} download target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                          <Download className="w-4 h-4" /> Download
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${article.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {article.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleView(article)} className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(article)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded" title="Delete">
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

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Manage Categories</h3>
              <button onClick={() => setShowCategoryManager(false)} className="hover:bg-gray-100 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <KnowledgeCategoryManager 
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategory={handleUpdateCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">{editingArticle ? 'Edit Content' : 'Add Content'}</h3>
              <button onClick={() => { setShowForm(false); setEditingArticle(null); }} className="hover:bg-gray-100 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ArticleForm 
                initialData={editingArticle} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
                categories={categories}
                submitting={submitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Article Details</h3>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-gray-100 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{viewingArticle.name}</h4>
                {viewingArticle.Category && (
                  <span className="inline-flex mt-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    {viewingArticle.Category.name}
                  </span>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                <p className="text-gray-700 whitespace-pre-wrap mt-1">{viewingArticle.description}</p>
              </div>
              {viewingArticle.file && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</label>
                  <div className="mt-1">
                    <a href={`http://localhost:3000${viewingArticle.file}`} download target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Download file
                    </a>
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-400 pt-2 border-t">
                Created: {viewingArticle.createdAt ? new Date(viewingArticle.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}