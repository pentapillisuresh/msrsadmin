// src/components/Documents/DocumentList.jsx
import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

export default function DocumentList({ documents, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Year</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Views</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th></tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (<tr><td colSpan="5" className="text-center py-8 text-gray-400">No documents uploaded</td></tr>) : (
              documents.map(doc => (<tr key={doc.id} className="border-b hover:bg-gray-50"><td className="px-4 py-3 font-medium">{doc.title}</td><td className="px-4 py-3">{doc.type}{doc.certificateType && ` - ${doc.certificateType}`}{doc.reportType && ` - ${doc.reportType}`}</td><td className="px-4 py-3">{doc.year}</td><td className="px-4 py-3"><div className="flex items-center gap-1"><Eye className="w-3 h-3" /> {doc.views || 0}</div></td><td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={() => onEdit(doc)} className="p-1 text-blue-600"><Edit className="w-4 h-4" /></button><button onClick={() => onDelete(doc.id)} className="p-1 text-red-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}