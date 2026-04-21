import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ArticleForm from '../components/KnowledgeHub/ArticleForm';
import KnowledgeCategoryManager from '../components/KnowledgeHub/KnowledgeCategoryManager';
import { Plus, X, FolderPlus, FileText, Download, Edit, Trash2, Eye } from 'lucide-react';

export default function KnowledgeHub() {
  const [articles, setArticles] = useLocalStorage('c3r_knowledge', []);
  const [categories, setCategories] = useLocalStorage('c3r_knowledge_categories', [
    'CSR Best Practices',
    'Sustainability',
    'Community Impact',
    'Legal Updates',
    'Case Studies'
  ]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [viewingArticle, setViewingArticle] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Category management handlers
  const handleAddCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const articlesUsingCategory = articles.filter(a => a.category === categoryToDelete);
    if (articlesUsingCategory.length > 0) {
      alert(`Cannot delete category "${categoryToDelete}" because it is used by ${articlesUsingCategory.length} article(s).`);
      return false;
    }
    setCategories(categories.filter(c => c !== categoryToDelete));
    return true;
  };

  const handleUpdateCategory = (oldCategory, newCategory) => {
    if (oldCategory === newCategory) return;
    if (categories.includes(newCategory)) {
      alert(`Category "${newCategory}" already exists!`);
      return false;
    }
    setArticles(articles.map(a => 
      a.category === oldCategory ? { ...a, category: newCategory } : a
    ));
    setCategories(categories.map(c => c === oldCategory ? newCategory : c));
    return true;
  };

  const handleSave = (articleData) => {
    if (editingArticle) {
      setArticles(articles.map(a => a.id === editingArticle.id ? { ...articleData, id: a.id } : a));
    } else {
      setArticles([...articles, { ...articleData, id: Date.now(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this item?')) setArticles(articles.filter(a => a.id !== id));
  };

  const filteredArticles = articles.filter(a => {
    if (filterCategory !== 'all' && a.category !== filterCategory) return false;
    if (searchTerm && !a.title.toLowerCase().includes(searchTerm.toLowerCase()) && !a.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Knowledge Hub</h2>
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
          <button onClick={() => setFilterCategory('all')} className={`px-3 py-1 text-sm rounded-full ${filterCategory === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
            All
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1 text-sm rounded-full ${filterCategory === cat ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 text-sm border rounded-lg w-64 focus:ring-2 focus:ring-indigo-500"
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Preview</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">No content found</td>
                </tr>
              ) : (
                filteredArticles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{article.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{article.content}</td>
                    <td className="px-4 py-3">
                      {article.fileUrl ? (
                        <a href={article.fileUrl} download className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                          <Download className="w-4 h-4" /> Download
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setViewingArticle(article); setShowViewModal(true); }} className="text-gray-600 hover:text-gray-800" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditingArticle(article); setShowForm(true); }} className="text-blue-600 hover:text-blue-800" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-800" title="Delete">
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
              <button onClick={() => setShowCategoryManager(false)} className="hover:bg-gray-100 p-1 rounded-lg">
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
              <button onClick={() => { setShowForm(false); setEditingArticle(null); }} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ArticleForm 
                initialData={editingArticle} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
                categories={categories}
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
              <button onClick={() => setShowViewModal(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{viewingArticle.title}</h4>
                <span className="inline-flex mt-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                  {viewingArticle.category}
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Content</label>
                <p className="text-gray-700 whitespace-pre-wrap mt-1">{viewingArticle.content}</p>
              </div>
              {viewingArticle.fileUrl && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Attachment</label>
                  <div className="mt-1">
                    <a href={viewingArticle.fileUrl} download className="text-indigo-600 hover:underline flex items-center gap-1">
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