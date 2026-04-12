// src/components/Projects/ProjectList.jsx
import React from 'react';
import { Edit, Trash2, Star } from 'lucide-react';

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-blue-100 text-blue-700',
  Upcoming: 'bg-yellow-100 text-yellow-700'
};

export default function ProjectList({ projects, onEdit, onDelete, onStatusChange, onFeaturedToggle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Location</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Budget</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Featured</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th></tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-gray-400">No projects added yet</td></tr>
            ) : (
              projects.map(project => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3 text-gray-600">{project.category}</td>
                  <td className="px-4 py-3 text-gray-600">{project.location}</td>
                  <td className="px-4 py-3 font-semibold">₹{project.totalBudget}</td>
                  <td className="px-4 py-3"><select value={project.status} onChange={(e) => onStatusChange(project.id, e.target.value)} className={`text-xs px-2 py-1 rounded-full border-0 ${statusColors[project.status]}`}>{Object.keys(statusColors).map(s => <option key={s}>{s}</option>)}</select></td>
                  <td className="px-4 py-3"><button onClick={() => onFeaturedToggle(project.id, !project.featured)} className={`p-1 rounded ${project.featured ? 'text-yellow-500' : 'text-gray-300'}`}><Star className="w-4 h-4" /></button></td>
                  <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={() => onEdit(project)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button><button onClick={() => onDelete(project.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}