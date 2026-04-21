import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, X, Image as ImageIcon, Video, Trash2, Upload, FileVideo, Camera, Filter, FolderPlus, Edit2, Check } from 'lucide-react';

// Predefined default categories
const DEFAULT_CATEGORIES = [
  'Events',
  'Projects',
  'CSR Activities',
  'Volunteering',
  'Donations',
  'Impact Stories'
];

export default function Media() {
  const [media, setMedia] = useLocalStorage('c3r_media', []);
  const [categories, setCategories] = useLocalStorage('c3r_media_categories', DEFAULT_CATEGORIES);
  const [showUpload, setShowUpload] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [uploadType, setUploadType] = useState('image');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState(categories[0] || '');
  const [newCategoryInline, setNewCategoryInline] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Category manager state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  // --- Category CRUD functions ---
  const handleAddCategory = (newCat) => {
    if (!newCat.trim()) return;
    if (categories.includes(newCat.trim())) {
      alert('Category already exists');
      return;
    }
    setCategories([...categories, newCat.trim()]);
  };

  const handleUpdateCategory = (oldCat, newCat) => {
    if (oldCat === newCat) return;
    if (categories.includes(newCat)) {
      alert('Category already exists');
      return false;
    }
    // Update all media items using this category
    setMedia(media.map(item => 
      item.category === oldCat ? { ...item, category: newCat } : item
    ));
    setCategories(categories.map(c => c === oldCat ? newCat : c));
    // If filter was on old category, update it
    if (filterCategory === oldCat) setFilterCategory(newCat);
    if (uploadCategory === oldCat) setUploadCategory(newCat);
    return true;
  };

  const handleDeleteCategory = (catToDelete) => {
    const usedBy = media.filter(item => item.category === catToDelete).length;
    if (usedBy > 0) {
      alert(`Cannot delete "${catToDelete}" because it is used by ${usedBy} media item(s).`);
      return false;
    }
    setCategories(categories.filter(c => c !== catToDelete));
    if (filterCategory === catToDelete) setFilterCategory('all');
    if (uploadCategory === catToDelete) setUploadCategory(categories[0] || '');
    return true;
  };

  // --- Upload functions ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (uploadType === 'image' && !file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (uploadType === 'video' && !file.type.startsWith('video/')) {
        alert('Please upload a video file');
        return;
      }
      const maxSize = uploadType === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewCategoryInline = () => {
    if (newCategoryInline.trim() && !categories.includes(newCategoryInline.trim())) {
      setCategories([...categories, newCategoryInline.trim()]);
      setUploadCategory(newCategoryInline.trim());
      setNewCategoryInline('');
    } else if (newCategoryInline.trim() && categories.includes(newCategoryInline.trim())) {
      alert('Category already exists');
    }
  };

  const handleUpload = () => {
    if (uploadPreview && uploadTitle && uploadCategory) {
      const newMedia = {
        id: Date.now(),
        type: uploadType,
        data: uploadPreview,
        title: uploadTitle,
        category: uploadCategory,
        fileName: uploadFile?.name,
        fileSize: uploadFile?.size,
        createdAt: new Date().toISOString()
      };
      setMedia([...media, newMedia]);
      setUploadFile(null);
      setUploadPreview('');
      setUploadTitle('');
      setUploadCategory(categories[0]);
      setShowUpload(false);
    } else {
      alert('Please fill all fields (title and category)');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this media?')) 
      setMedia(media.filter(m => m.id !== id));
  };

  const filteredMedia = filterCategory === 'all' 
    ? media 
    : media.filter(m => m.category === filterCategory);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Media Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCategoryManager(true)} 
            className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FolderPlus className="w-4 h-4" /> Manage Categories
          </button>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={() => setShowUpload(true)} 
            className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Media
          </button>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Manage Media Categories</h3>
              <button onClick={() => setShowCategoryManager(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Add new category */}
              <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(newCategoryInline); setNewCategoryInline(''); }} className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryInline}
                  onChange={(e) => setNewCategoryInline(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              {/* List of categories with edit/delete */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700">Existing Categories</h4>
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    {editingCategory === cat ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            handleUpdateCategory(cat, editValue);
                            setEditingCategory(null);
                          }}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-700">{cat}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setEditValue(cat);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg">
                <strong>Note:</strong> Categories used by existing media cannot be deleted.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Upload Media</h3>
              <button 
                onClick={() => {
                  setShowUpload(false);
                  setUploadFile(null);
                  setUploadPreview('');
                  setUploadTitle('');
                  setNewCategoryInline('');
                }} 
                className="hover:bg-gray-100 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Media Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType('image');
                      setUploadFile(null);
                      setUploadPreview('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      uploadType === 'image' 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType('video');
                      setUploadFile(null);
                      setUploadPreview('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      uploadType === 'video' 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <FileVideo className="w-4 h-4" />
                    Video
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  value={uploadTitle} 
                  onChange={(e) => setUploadTitle(e.target.value)} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Category selection + inline add */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategoryInline}
                    onChange={(e) => setNewCategoryInline(e.target.value)}
                    placeholder="Or add new category"
                    className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategoryInline}
                    className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* File upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {uploadType === 'image' ? 'Upload Image' : 'Upload Video'}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 cursor-pointer">
                  <div className="space-y-1 text-center">
                    {uploadPreview ? (
                      <div className="relative">
                        {uploadType === 'image' ? (
                          <img src={uploadPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                        ) : (
                          <video src={uploadPreview} controls className="max-h-48 mx-auto rounded-lg" />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFile(null);
                            setUploadPreview('');
                          }}
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
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              type="file" 
                              className="sr-only" 
                              accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {uploadType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV, AVI up to 50MB'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => {
                    setShowUpload(false);
                    setUploadFile(null);
                    setUploadPreview('');
                    setUploadTitle('');
                    setNewCategoryInline('');
                  }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={!uploadPreview || !uploadTitle || !uploadCategory}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No media found</p>
            <p className="text-sm">Click "Add Media" to upload images or videos</p>
          </div>
        ) : (
          filteredMedia.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group relative">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {item.type === 'image' ? (
                  <img 
                    src={item.data} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                    }}
                  />
                ) : (
                  <video 
                    src={item.data} 
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.category && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}