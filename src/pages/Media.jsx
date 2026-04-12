// src/pages/Media.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, X, Image as ImageIcon, Video, Trash2 } from 'lucide-react';

export default function Media() {
  const [media, setMedia] = useLocalStorage('c3r_media', []);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('image');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');

  const handleUpload = () => {
    if (uploadUrl && uploadTitle) {
      setMedia([...media, { id: Date.now(), type: uploadType, url: uploadUrl, title: uploadTitle, createdAt: new Date().toISOString() }]);
      setUploadUrl('');
      setUploadTitle('');
      setShowUpload(false);
    }
  };

  const handleDelete = (id) => { if (window.confirm('Delete this media?')) setMedia(media.filter(m => m.id !== id)); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-lg font-semibold">Media Management</h2><button onClick={() => setShowUpload(true)} className="btn-primary text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Media</button></div>

      {showUpload && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full"><div className="border-b p-4 flex justify-between"><h3 className="font-semibold">Upload Media</h3><button onClick={() => setShowUpload(false)}><X className="w-5 h-5" /></button></div><div className="p-6 space-y-4"><div><label className="label">Media Type</label><select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="input-field"><option value="image">Image</option><option value="video">Video</option></select></div><div><label className="label">Title</label><input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} className="input-field" placeholder="Enter title" /></div><div><label className="label">URL / Embed Code</label><input value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)} className="input-field" placeholder="Image URL or YouTube embed code" /></div><div className="flex justify-end gap-3"><button onClick={() => setShowUpload(false)} className="btn-secondary">Cancel</button><button onClick={handleUpload} className="btn-primary">Upload</button></div></div></div></div>)}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{media.length === 0 ? (<div className="col-span-full text-center py-12 text-gray-400">No media uploaded yet</div>) : (media.map(item => (<div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group relative"><div className="aspect-video bg-gray-100 flex items-center justify-center">{item.type === 'image' ? (<img src={item.url} alt={item.title} className="w-full h-full object-cover" />) : (<Video className="w-8 h-8 text-gray-400" />)}</div><div className="p-2"><p className="text-xs font-medium truncate">{item.title}</p></div><button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-3 h-3" /></button></div>)))}</div>
    </div>
  );
}