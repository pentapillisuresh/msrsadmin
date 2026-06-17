import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import { Plus, X, Eye, Edit, Trash2, Filter, Image as ImageIcon, Calendar, User } from 'lucide-react';
import BlogForm from '../components/Blog/BlogForm';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: 10
      };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await api.getBlogs(params);
      if (response && response.success) {
        setBlogs(response.data.data || []);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error.message || 'Error fetching blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, statusFilter]);

  const handleSave = async (blogData) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('author', blogData.author);
      formData.append('status', blogData.status);
      
      if (blogData.imageFile) {
        formData.append('image', blogData.imageFile);
      }

      let response;
      if (editingBlog) {
        response = await api.updateBlog(editingBlog.id, formData);
      } else {
        response = await api.createBlog(formData);
      }
      
      if (response && response.success) {
        await fetchBlogs();
        setShowForm(false);
        setEditingBlog(null);
        alert(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
      } else {
        alert('Failed to save blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert(error.message || 'Error saving blog. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await api.deleteBlog(id);
        if (response && response.success) {
          await fetchBlogs();
          alert('Blog deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog. Please try again.');
      }
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      const response = await api.updateBlogStatus(id, newStatus);
      if (response && response.success) {
        setBlogs(blogs.map(blog => blog.id === id ? { ...blog, status: newStatus } : blog));
        alert('Blog status updated!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating blog status. Please try again.');
    }
  };

  const handleViewBlog = async (blog) => {
    try {
      const response = await api.getBlogById(blog.id);
      if (response && response.success) {
        setSelectedBlog(response.data);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
      alert('Error loading blog details. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';
  };

  // Filter blogs by search (search by title or author only since tags removed)
  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Blog Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={() => { setEditingBlog(null); setShowForm(true); }} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Blog
          </button>
        </div>
      </div>

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h3>
              <button onClick={() => { setShowForm(false); setEditingBlog(null); }} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <BlogForm 
                initialData={editingBlog} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
                updating={updating}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Blog Details</h3>
              <button onClick={() => setViewModal(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {selectedBlog.image && (
                <div className="mb-6">
                  <img src={`https://service.msrsfoundation.org${selectedBlog.image}`} alt={selectedBlog.title} className="w-full h-64 object-cover rounded-lg" />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedBlog.title}</h4>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedBlog.status)}`}>
                      {formatStatus(selectedBlog.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{selectedBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedBlog.views || 0} views</span>
                  </div>
                </div>
                {selectedBlog.content && (
                  <div className="pt-4 border-t">
                    <h5 className="font-semibold text-gray-900 mb-2">Content</h5>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedBlog.content}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Image</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Author</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Views</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <p className="text-lg">No blogs found</p>
                    <p className="text-sm">Click "Add Blog" to create one</p>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {blog.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img src={`https://service.msrsfoundation.org${blog.image}`} alt={blog.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900">{blog.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{blog.content?.substring(0, 60)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{blog.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{blog.views || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={blog.status}
                        onChange={(e) => handleStatusToggle(blog.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(blog.status)} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleViewBlog(blog)} className="text-green-600 hover:text-green-800" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditingBlog(blog); setShowForm(true); }} className="text-blue-600 hover:text-blue-800" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-800" title="Delete">
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}