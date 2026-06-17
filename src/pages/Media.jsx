// components/Media.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, X, Trash2, Upload, FileVideo, Camera, Filter, 
  Edit2, Loader, Save, Image, Video, Grid, LayoutList,
  Play, Pause, Maximize2, Download, ChevronLeft, ChevronRight,
  FolderOpen, Calendar, Eye, Heart, Share2, Info
} from 'lucide-react';
import {api} from '../services/ApiService';

export default function Media() {
  const [media, setMedia] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  const [uploadType, setUploadType] = useState('image');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategoryId, setUploadCategoryId] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // all, image, video
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch media and categories
  useEffect(() => {
    fetchMedia();
    fetchCategories();
  }, [mediaTypeFilter, statusFilter, selectedCategory]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.categoryId = selectedCategory;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (mediaTypeFilter !== 'all') params.mediaType = mediaTypeFilter;
      
      const response = await api.get('/media', { params });
      
      let mediaData = [];
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          mediaData = response.data.data;
        } else if (Array.isArray(response.data)) {
          mediaData = response.data;
        } else if (Array.isArray(response)) {
          mediaData = response;
        }
      } else if (Array.isArray(response)) {
        mediaData = response;
      }
      
      setMedia(mediaData);
    } catch (error) {
      console.error('Error fetching media:', error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      let categoriesData = [];
      if (response && response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response && Array.isArray(response)) {
        categoriesData = response;
      }
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !uploadCategoryId) {
        setUploadCategoryId(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle || !uploadCategoryId) {
      alert('Please fill all required fields');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('name', uploadTitle);
    formData.append('mediaType', uploadType);
    formData.append('categoryId', uploadCategoryId);
    if (uploadDescription) formData.append('description', uploadDescription);

    try {
      await api.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchMedia();
      resetUploadForm();
      setShowUpload(false);
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!uploadTitle || !uploadCategoryId) {
      alert('Please fill all required fields');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name', uploadTitle);
    formData.append('mediaType', uploadType);
    formData.append('categoryId', uploadCategoryId);
    if (uploadDescription) formData.append('description', uploadDescription);
    if (uploadFile) formData.append('file', uploadFile);

    try {
      await api.put(`/media/${editingMedia.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchMedia();
      setShowEditModal(false);
      resetUploadForm();
      alert('Media updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this media? This action cannot be undone.')) {
      try {
        await api.delete(`/media/${id}`);
        await fetchMedia();
        alert('Media deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        alert(error.response?.data?.message || 'Failed to delete media');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/media/${id}`, { status: newStatus });
      await fetchMedia();
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update media status');
    }
  };

  const handleEdit = (mediaItem) => {
    setEditingMedia(mediaItem);
    setUploadTitle(mediaItem.name);
    setUploadDescription(mediaItem.description || '');
    setUploadCategoryId(mediaItem.categoryId);
    setUploadType(mediaItem.mediaType);
    setUploadFile(null);
    setUploadPreview('');
    setShowEditModal(true);
  };

  const openLightbox = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setShowLightbox(false);
  };

  const navigateLightbox = (direction) => {
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedMedia?.id);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < filteredMedia.length) {
      setSelectedMedia(filteredMedia[newIndex]);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadPreview('');
    setUploadTitle('');
    setUploadDescription('');
    setUploadCategoryId(categories[0]?.id || '');
    setEditingMedia(null);
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return '';
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return `https://service.msrsfoundation.org${cleanPath}`;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  // Filter and search media
  const filteredMedia = Array.isArray(media) ? media.filter(item => {
    if (mediaTypeFilter !== 'all' && item.mediaType !== mediaTypeFilter) return false;
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) : [];

  const images = filteredMedia.filter(m => m.mediaType === 'image');
  const videos = filteredMedia.filter(m => m.mediaType === 'video');

  // Stats
  const stats = {
    total: media.length,
    images: media.filter(m => m.mediaType === 'image').length,
    videos: media.filter(m => m.mediaType === 'video').length,
    active: media.filter(m => m.status === 'active').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Media Gallery</h1>
          <p className="text-purple-100">Manage and organize your images and videos</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-purple-100">Total Media</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.images}</div>
              <div className="text-sm text-purple-100">Images</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.videos}</div>
              <div className="text-sm text-purple-100">Videos</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-purple-100">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-0 bg-white border-b shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMediaTypeFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  mediaTypeFilter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
                All
              </button>
              <button
                onClick={() => setMediaTypeFilter('image')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  mediaTypeFilter === 'image' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                Images
                {stats.images > 0 && (
                  <span className="ml-1 text-xs">{stats.images}</span>
                )}
              </button>
              <button
                onClick={() => setMediaTypeFilter('video')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  mediaTypeFilter === 'video' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Video className="w-4 h-4" />
                Videos
                {stats.videos > 0 && (
                  <span className="ml-1 text-xs">{stats.videos}</span>
                )}
              </button>

              <div className="w-px h-8 bg-gray-300 mx-2"></div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => setShowUpload(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" /> Upload Media
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Upload className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-500">No media found</p>
            <p className="text-sm text-gray-400 mt-2">Click "Upload Media" to add images or videos</p>
          </div>
        ) : (
          <>
            {/* Category Sections */}
            {mediaTypeFilter === 'all' ? (
              <>
                {/* Images Section */}
                {images.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <Camera className="w-6 h-6 text-indigo-600" />
                          Photos
                        </h2>
                        <p className="text-gray-500 mt-1">{images.length} images</p>
                      </div>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {images.map(item => renderMediaCard(item, 'image'))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {images.map(item => renderMediaListItem(item, 'image'))}
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Section */}
                {videos.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <Video className="w-6 h-6 text-indigo-600" />
                          Videos
                        </h2>
                        <p className="text-gray-500 mt-1">{videos.length} videos</p>
                      </div>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {videos.map(item => renderMediaCard(item, 'video'))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {videos.map(item => renderMediaListItem(item, 'video'))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Single media type view
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-3"
              }>
                {filteredMedia.map(item => renderMediaCard(item, mediaTypeFilter))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal for Images/Videos */}
      {showLightbox && selectedMedia && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X className="w-8 h-8" />
          </button>
          
          {filteredMedia.length > 1 && (
            <>
              <button onClick={() => navigateLightbox('prev')} className="absolute left-4 text-white hover:text-gray-300">
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button onClick={() => navigateLightbox('next')} className="absolute right-4 text-white hover:text-gray-300">
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] mx-auto">
            {selectedMedia.mediaType === 'image' ? (
              <img 
                src={getFileUrl(selectedMedia.file)} 
                alt={selectedMedia.name}
                className="max-w-full max-h-[85vh] object-contain"
              />
            ) : (
              <video 
                src={getFileUrl(selectedMedia.file)} 
                controls
                autoPlay
                className="max-w-full max-h-[85vh]"
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-bold">{selectedMedia.name}</h3>
              <p className="text-gray-200 mt-1">{selectedMedia.description}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {getCategoryName(selectedMedia.categoryId)}
                </span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {selectedMedia.mediaType}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && renderUploadModal()}
      
      {/* Edit Modal */}
      {showEditModal && editingMedia && renderEditModal()}
    </div>
  );

  // Render Media Card
  function renderMediaCard(item, type) {
    return (
      <div key={item.id} className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div 
          className="aspect-video bg-gray-100 overflow-hidden"
          onClick={() => openLightbox(item)}
        >
          {type === 'image' ? (
            <img 
              src={getFileUrl(item.file)} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="relative w-full h-full">
              <video 
                src={getFileUrl(item.file)} 
                className="w-full h-full object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all">
                <Play className="w-12 h-12 text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          )}
          
          {item.status === 'inactive' && (
            <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded">
              Inactive
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          {item.description && (
            <p className="text-xs text-gray-500 truncate mt-1">{item.description}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {getCategoryName(item.categoryId)}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleStatus(item.id, item.status); }}
                className={`p-1.5 rounded-lg transition-colors ${
                  item.status === 'active' 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                title={item.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                {item.status === 'active' ? 'D' : 'A'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render List Item
  function renderMediaListItem(item, type) {
    return (
      <div key={item.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4 cursor-pointer">
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0" onClick={() => openLightbox(item)}>
          {type === 'image' ? (
            <img src={getFileUrl(item.file)} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0" onClick={() => openLightbox(item)}>
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.description && <p className="text-sm text-gray-500 truncate">{item.description}</p>}
          <div className="flex gap-2 mt-1">
            <span className="text-xs text-gray-500">{getCategoryName(item.categoryId)}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {item.status}
            </span>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleToggleStatus(item.id, item.status)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
            {item.status === 'active' ? 'D' : 'A'}
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render Upload Modal
  function renderUploadModal() {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Upload New Media</h3>
            <button onClick={() => { setShowUpload(false); resetUploadForm(); }} className="hover:bg-gray-100 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {/* Media Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {['image', 'video'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setUploadType(type);
                      setUploadFile(null);
                      setUploadPreview('');
                    }}
                    className={`py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      uploadType === type 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {type === 'image' ? <Camera className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                value={uploadTitle} 
                onChange={(e) => setUploadTitle(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={uploadDescription} 
                onChange={(e) => setUploadDescription(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter description (optional)"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={uploadCategoryId}
                onChange={(e) => setUploadCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {uploadType === 'image' ? 'Upload Image *' : 'Upload Video *'}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  {uploadPreview ? (
                    <div className="relative">
                      {uploadType === 'image' ? (
                        <img src={uploadPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      ) : (
                        <video src={uploadPreview} controls className="max-h-48 mx-auto rounded-lg" />
                      )}
                      <button
                        onClick={() => { setUploadFile(null); setUploadPreview(''); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Choose file</span>
                          <input id="file-upload" type="file" className="sr-only" accept={uploadType === 'image' ? 'image/*' : 'video/*'} onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setUploadFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => setUploadPreview(reader.result);
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        {uploadType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV, AVI up to 50MB'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
              <button onClick={() => { setShowUpload(false); resetUploadForm(); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleUpload} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50" disabled={!uploadPreview || !uploadTitle || !uploadCategoryId || uploading}>
                {uploading ? <Loader className="w-4 h-4 animate-spin inline" /> : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Edit Modal
  function renderEditModal() {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="border-b p-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Edit Media</h3>
            <button onClick={() => { setShowEditModal(false); resetUploadForm(); }} className="hover:bg-gray-100 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {editingMedia && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current File</label>
                <div className="bg-gray-100 rounded-lg p-2">
                  {editingMedia.mediaType === 'image' ? (
                    <img src={getFileUrl(editingMedia.file)} alt={editingMedia.name} className="w-full h-32 object-cover rounded" />
                  ) : (
                    <video src={getFileUrl(editingMedia.file)} className="w-full h-32 object-cover rounded" controls />
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows="3" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={uploadCategoryId} onChange={(e) => setUploadCategoryId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Replace File (optional)</label>
              <input type="file" accept={uploadType === 'image' ? 'image/*' : 'video/*'} onChange={(e) => {
                const file = e.target.files[0];
                if (file) setUploadFile(file);
              }} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current file</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => { setShowEditModal(false); resetUploadForm(); }} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg" disabled={uploading}>
                {uploading ? <Loader className="w-4 h-4 animate-spin inline" /> : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}