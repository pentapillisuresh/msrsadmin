// src/pages/Projects.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProjectForm from '../components/Projects/ProjectForm';
import ProjectList from '../components/Projects/ProjectList';
import { Plus, X } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useLocalStorage('c3r_projects', []);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleSave = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...projectData, id: p.id } : p));
    } else {
      setProjects([...projects, { ...projectData, id: Date.now(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleStatusChange = (id, status) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleFeaturedToggle = (id, featured) => {
    setProjects(projects.map(p => p.id === id ? { ...p, featured } : p));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">CSR Projects Management</h2>
        <button onClick={() => { setEditingProject(null); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => { setShowForm(false); setEditingProject(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ProjectForm initialData={editingProject} onSave={handleSave} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      <ProjectList
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onFeaturedToggle={handleFeaturedToggle}
      />
    </div>
  );
}