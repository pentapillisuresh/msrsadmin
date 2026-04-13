import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, X, Image as ImageIcon, Video, Trash2, Upload, FileVideo, Camera } from 'lucide-react';

export default function Media() {
  const [media, setMedia] = useLocalStorage('c3r_media', []);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('image');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (uploadType === 'image' && !file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (uploadType === 'video' && !file.type.startsWith('video/')) {
        alert('Please upload a video file');
        return;
      }
      
      // Check file size (max 50MB for video, 10MB for image)
      const maxSize = uploadType === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      setUploadFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (uploadPreview && uploadTitle) {
      const newMedia = {
        id: Date.now(),
        type: uploadType,
        data: uploadPreview,
        title: uploadTitle,
        fileName: uploadFile?.name,
        fileSize: uploadFile?.size,
        createdAt: new Date().toISOString()
      };
      setMedia([...media, newMedia]);
      setUploadFile(null);
      setUploadPreview('');
      setUploadTitle('');
      setShowUpload(false);
    } else {
      alert('Please fill all fields');
    }
  };

  const handleDelete = (id) => { 
    if (window.confirm('Delete this media?')) 
      setMedia(media.filter(m => m.id !== id)); 
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Media Management</h2>
        <button 
          onClick={() => setShowUpload(true)} 
          className="btn-primary text-sm flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Media
        </button>
      </div>

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
                }} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  value={uploadTitle} 
                  onChange={(e) => setUploadTitle(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Enter title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {uploadType === 'image' ? 'Upload Image' : 'Upload Video'}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
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
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
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

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => {
                    setShowUpload(false);
                    setUploadFile(null);
                    setUploadPreview('');
                    setUploadTitle('');
                  }} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={!uploadPreview || !uploadTitle}
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
        {media.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No media uploaded yet</p>
            <p className="text-sm">Click the "Add Media" button to upload images or videos</p>
          </div>
        ) : (
          media.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group relative">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {item.type === 'image' ? (
                  <img 
                    src={item.data} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
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
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
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