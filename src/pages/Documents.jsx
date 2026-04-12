// src/pages/Documents.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DocumentForm from '../components/Documents/DocumentForm';
import DocumentList from '../components/Documents/DocumentList';
import { Plus, X } from 'lucide-react';

export default function Documents() {
  const [documents, setDocuments] = useLocalStorage('c3r_documents', []);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const handleSave = (docData) => {
    if (editingDoc) {
      setDocuments(documents.map(d => d.id === editingDoc.id ? { ...docData, id: d.id } : d));
    } else {
      setDocuments([...documents, { ...docData, id: Date.now(), uploadDate: new Date().toISOString(), views: 0 }]);
    }
    setShowForm(false);
    setEditingDoc(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this document?')) setDocuments(documents.filter(d => d.id !== id));
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Document & Audit Management</h2>
        <button onClick={() => { setEditingDoc(null); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Document</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between"><h3 className="font-semibold">{editingDoc ? 'Edit Document' : 'Upload Document'}</h3><button onClick={() => { setShowForm(false); setEditingDoc(null); }}><X className="w-5 h-5" /></button></div>
            <div className="p-6"><DocumentForm initialData={editingDoc} onSave={handleSave} onCancel={() => setShowForm(false)} /></div>
          </div>
        </div>
      )}

      <DocumentList documents={documents} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}