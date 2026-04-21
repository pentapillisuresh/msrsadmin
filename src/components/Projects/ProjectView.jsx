import React from 'react';

export default function ProjectView({ project }) {
  return (
    <div className="space-y-4">
      {project.image && (
        <div className="flex justify-center">
          <img src={project.image} alt={project.title} className="max-w-full max-h-64 rounded-lg object-cover border" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Category</label>
          <p className="text-sm text-gray-800">{project.category}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Status</label>
          <p className="text-sm">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
              project.status === 'Active' ? 'bg-green-100 text-green-700' :
              project.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {project.status}
            </span>
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Date</label>
          <p className="text-sm text-gray-800">{project.date || '—'}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Budget Required</label>
          <p className="text-sm text-gray-800 font-semibold">₹{project.budgetRequired?.toLocaleString()}</p>
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-500">Objective</label>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{project.objective || '—'}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">Target Beneficiaries</label>
          <p className="text-sm text-gray-800">{project.targetBeneficiaries || '—'}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">CSR Alignment</label>
          <p className="text-sm text-gray-800">{project.csrAlignment || '—'}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">State</label>
          <p className="text-sm text-gray-800">{project.state || '—'}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500">District</label>
          <p className="text-sm text-gray-800">{project.district || '—'}</p>
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-500">Impact Metrics</label>
          {project.impactMetrics && project.impactMetrics.length > 0 ? (
            <ul className="list-disc list-inside mt-1 space-y-1">
              {project.impactMetrics.map((metric, idx) => (
                <li key={idx} className="text-sm text-gray-800">{metric}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </div>
      </div>
    </div>
  );
}