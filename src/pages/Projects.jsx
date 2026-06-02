// Projects.jsx (Main Component)
import React, { useState, useEffect } from 'react';
import ProjectForm from '../components/Projects/ProjectForm';
import ProjectList from '../components/Projects/ProjectList';
import ProjectView from '../components/Projects/ProjectView';
import CategoryManager from '../components/Projects/CategoryManager';
import { Plus, X, FolderPlus } from 'lucide-react';
import {api} from '../services/ApiService';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');

      if (response.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/?categoryRelated=project');

      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const handleSave = (savedProject) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
    } else {
      setProjects([savedProject, ...projects]);
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
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
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const handleUpdateCategory = (categoryId, updatedCategory) => {
    setCategories(categories.map(c => c.id === categoryId ? updatedCategory : c));
    // Also update projects that use this category
    setProjects(projects.map(p => 
      p.categoryId === categoryId ? { ...p, Category: updatedCategory } : p
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

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
        setProjects={setProjects}
      />
    </div>
  );
}