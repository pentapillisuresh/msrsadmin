import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-blue-100 text-blue-700',
  Upcoming: 'bg-yellow-100 text-yellow-700'
};

export default function ProjectList({ projects, onEdit, onDelete, onView, onStatusChange, categories }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title</th>
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
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-10 h-10 object-cover rounded-md" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {project.district ? `${project.district}, ${project.state}` : project.state || '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{project.budgetRequired?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      value={project.status} 
                      onChange={(e) => onStatusChange(project.id, e.target.value)} 
                      className={`text-xs px-2 py-1 rounded-full border-0 ${statusColors[project.status]} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {Object.keys(statusColors).map(s => <option key={s}>{s}</option>)}
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
                      <button onClick={() => onDelete(project.id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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