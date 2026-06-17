// src/components/Documents/DocumentList.jsx
import React from 'react';
import { Edit, Trash2, Eye, FileText, Download } from 'lucide-react';
import {api} from '../../services/ApiService';

export default function DocumentList({ documents, onEdit, onDelete }) {
  const handleView = async (doc) => {
    console.log("rrr::",doc)
    try {
      // Increment view count by fetching the document
      const response = await api.get(`/documents/${doc.id}`);
      if (response.success) {
        // Open the document URL in a new tab
        if (response.data.documentUrl) {
          window.open(`https://service.msrsfoundation.org${response.data.data.documentUrl}`, '_blank');
        }
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Error opening document. Please try again.');
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await api.get(`/documents/${doc.id}`, {
        responseType: 'blob'
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document. Please try again.');
    }
  };

  const getDocumentIcon = (type) => {
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Year</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Views</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Upload Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  No documents uploaded
                 </td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(doc.type)}
                      <span className="font-medium">{doc.name}</span>
                    </div>
                   </td>
                  <td className="px-4 py-3">
                    {doc.documentType}
                    {doc.certificateType && ` - ${doc.certificateType}`}
                    {doc.reportType && ` - ${doc.reportType}`}
                   </td>
                  <td className="px-4 py-3">{doc.year}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {doc.views || 0}
                    </div>
                   </td>
                  <td className="px-4 py-3 text-gray-500">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '—'}
                   </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      
                      <button 
                        onClick={() => handleDownload(doc)} 
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => onDelete(doc.id)} 
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
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
  );
}