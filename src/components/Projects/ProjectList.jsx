// ProjectList.jsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import {api} from '../../services/ApiService';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700'
};

export default function ProjectList({ projects, onEdit, onDelete, onView, onStatusChange, categories, setProjects }) {
  const [loading, setLoading] = useState(false);
  const clientToken = localStorage.getItem('token');
  const handleStatusChange = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append('status', status);
      
      const response = await api.put(`/projects/${id}`, formData,{
        headers: { 'Content-Type': 'multipart/form-data' },
        Authorization: `Bearer ${clientToken}`,
      });
      if (response.success) {
        onStatusChange(id, status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating project status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await api.delete(`/projects/${id}`,{
          headers: { 'Content-Type': 'multipart/form-data' },
          Authorization: `Bearer ${clientToken}`,
        });
        if (response.success) {
          onDelete(id);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">State/District</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Budget (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-400">No projects added yet</td>
              </tr>
            ) : (
              projects.map(project => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {project.projectImage ? (
                      <img src={`https://service.msrsfoundation.org${project.projectImage}`} alt={project.name} className="w-10 h-10 object-cover rounded-md" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {project.Category?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {project.district ? `${project.district}, ${project.state}` : project.state || '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{parseFloat(project.budgetRequired).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      value={project.status} 
                      onChange={(e) => handleStatusChange(project.id, e.target.value)} 
                      className={`text-xs px-2 py-1 rounded-full border-0 ${statusColors[project.status]} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {project.date || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onView(project)} className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(project)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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