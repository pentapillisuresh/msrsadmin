import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProjectForm from '../components/Projects/ProjectForm';
import ProjectList from '../components/Projects/ProjectList';
import ProjectView from '../components/Projects/ProjectView';
import CategoryManager from '../components/Projects/CategoryManager';
import { Plus, X, FolderPlus } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useLocalStorage('c3r_projects', []);
  const [categories, setCategories] = useLocalStorage('c3r_categories', [
    'Education',
    'Healthcare',
    'Environment',
    'Community Development',
    'Women Empowerment'
  ]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  const handleSave = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...projectData, id: p.id } : p));
    } else {
      setProjects([...projects, { 
        ...projectData, 
        id: Date.now(), 
        createdAt: new Date().toISOString() 
      }]);
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

  const handleView = (project) => {
    setViewingProject(project);
    setShowView(true);
  };

  const handleStatusChange = (id, status) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleAddCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const projectsUsingCategory = projects.filter(p => p.category === categoryToDelete);
    if (projectsUsingCategory.length > 0) {
      alert(`Cannot delete category "${categoryToDelete}" because it is used by ${projectsUsingCategory.length} project(s). Please reassign or delete those projects first.`);
      return false;
    }
    setCategories(categories.filter(c => c !== categoryToDelete));
    return true;
  };

  const handleUpdateCategory = (oldCategory, newCategory) => {
    if (oldCategory === newCategory) return;
    if (categories.includes(newCategory)) {
      alert(`Category "${newCategory}" already exists!`);
      return false;
    }
    setProjects(projects.map(p => 
      p.category === oldCategory ? { ...p, category: newCategory } : p
    ));
    setCategories(categories.map(c => c === oldCategory ? newCategory : c));
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">CSR Projects Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCategoryManager(true)} 
            className="btn-secondary text-sm flex items-center gap-1"
          >
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </button>
          <button 
            onClick={() => { setEditingProject(null); setShowForm(true); }} 
            className="btn-primary text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Form Modal */}
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
              <ProjectForm 
                initialData={editingProject} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && viewingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold">Project Details</h3>
              <button onClick={() => setShowView(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ProjectView project={viewingProject} />
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold">Manage Categories</h3>
              <button onClick={() => setShowCategoryManager(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <CategoryManager 
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateCategory={handleUpdateCategory}
              />
            </div>
          </div>
        </div>
      )}

      <ProjectList
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onStatusChange={handleStatusChange}
        categories={categories}
      />
    </div>
  );
}