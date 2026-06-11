// src/pages/Documents.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import DocumentForm from '../components/Documents/DocumentForm';
import DocumentList from '../components/Documents/DocumentList';
import { Plus, X } from 'lucide-react';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const clientToken = localStorage.getItem('token');

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents/', {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("rrr:::", response)
      if (response.success) {
        setDocuments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      alert('Error fetching documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSave = async (docData) => {
    try {
      const formData = new FormData();

      // Add all text fields
      formData.append('name', docData.title);
      formData.append('description', docData.description || '');
      formData.append('year', docData.year);
      formData.append('documentType', docData.documentType);
      formData.append('certificateType', docData.certificateType);

      // Add file if selected
      if (docData.file) {
        formData.append('document', docData.file);
      }

      let response;
      if (editingDoc) {
        // Update existing document
        response = await api.put(`/documents/${editingDoc.id}`, formData, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new document
        response = await api.post('/documents/', formData, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      console.log("rrr::", response)
      if (response.success) {
        fetchDocuments(); // Refresh the list
        setShowForm(false);
        setEditingDoc(null);
      }
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Error saving document. Please try again.');
    }
  };
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return; // Stop if user clicks Cancel
    }

    try {
      const response = await api.delete(`/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        setDocuments((prev) =>
          prev.filter((doc) => doc.id !== id)
        );

        alert("Document deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);

      const message =
        error.response?.data?.message ||
        "Error deleting document. Please try again.";

      alert(message);
    }
  };
  const handleEdit = async (doc) => {
    try {
      // Fetch full document details
      const response = await api.get(`/documents/${doc.id}`, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.success) {
        setEditingDoc(response.data.data);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
      alert('Error loading document details. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Document & Audit Management</h2>
        <button
          onClick={() => { setEditingDoc(null); setShowForm(true); }}
          className="btn-primary text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold">{editingDoc ? 'Edit Document' : 'Upload Document'}</h3>
              <button
                onClick={() => { setShowForm(false); setEditingDoc(null); }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <DocumentForm
                initialData={editingDoc}
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      <DocumentList
        documents={documents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}