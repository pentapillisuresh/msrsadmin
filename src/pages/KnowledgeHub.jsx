// src/pages/KnowledgeHub.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ArticleForm from '../components/KnowledgeHub/ArticleForm';
import { Plus, X, FileText, BookOpen, File } from 'lucide-react';

export default function KnowledgeHub() {
  const [articles, setArticles] = useLocalStorage('c3r_knowledge', []);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleSave = (articleData) => {
    if (editingArticle) {
      setArticles(articles.map(a => a.id === editingArticle.id ? { ...articleData, id: a.id } : a));
    } else {
      setArticles([...articles, { ...articleData, id: Date.now(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleDelete = (id) => { if (window.confirm('Delete this item?')) setArticles(articles.filter(a => a.id !== id)); };

  const filteredArticles = articles.filter(a => filter === 'all' ? true : a.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-lg font-semibold">Knowledge Hub</h2><button onClick={() => { setEditingArticle(null); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Content</button></div>

      <div className="flex gap-2"><button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>All</button><button onClick={() => setFilter('Article')} className={`px-3 py-1 text-sm rounded-full ${filter === 'Article' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>Articles</button><button onClick={() => setFilter('Research Paper')} className={`px-3 py-1 text-sm rounded-full ${filter === 'Research Paper' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>Research Papers</button><button onClick={() => setFilter('Case Study')} className={`px-3 py-1 text-sm rounded-full ${filter === 'Case Study' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>Case Studies</button></div>

      {showForm && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full"><div className="border-b p-4 flex justify-between"><h3 className="font-semibold">{editingArticle ? 'Edit Content' : 'Add Content'}</h3><button onClick={() => { setShowForm(false); setEditingArticle(null); }}><X className="w-5 h-5" /></button></div><div className="p-6"><ArticleForm initialData={editingArticle} onSave={handleSave} onCancel={() => setShowForm(false)} /></div></div></div>)}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{filteredArticles.map(article => (<div key={article.id} className="bg-white rounded-xl shadow-sm border p-4"><div className="flex justify-between items-start"><div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-gray-100">{article.type === 'Article' ? <BookOpen className="w-4 h-4" /> : article.type === 'Research Paper' ? <File className="w-4 h-4" /> : <FileText className="w-4 h-4" />}</div><div><h3 className="font-semibold">{article.title}</h3><p className="text-xs text-gray-400">{article.type}</p></div></div><button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button></div><p className="text-sm text-gray-600 mt-2 line-clamp-2">{article.content}</p><div className="mt-3 flex justify-end"><button onClick={() => { setEditingArticle(article); setShowForm(true); }} className="text-xs text-indigo-600 hover:underline">Edit</button></div></div>))}</div>
    </div>
  );
}