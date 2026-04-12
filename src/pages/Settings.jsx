// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Save, Phone, Mail, MapPin, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useLocalStorage('c3r_settings', {
    phone: '+91 12345 67890',
    email: 'contact@c3r.org',
    address: 'Mumbai, Maharashtra, India',
    facebook: 'https://facebook.com/c3r',
    twitter: 'https://twitter.com/c3r',
    linkedin: 'https://linkedin.com/company/c3r',
    instagram: 'https://instagram.com/c3r'
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => { setSettings({ ...settings, [e.target.name]: e.target.value }); setSaved(false); };
  const handleSubmit = (e) => { e.preventDefault(); setSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Organization Settings</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl space-y-6">
        {saved && (<div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">Settings saved successfully!</div>)}
        <div><h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact Information</h3><div className="space-y-4"><div><label className="label">Phone Number</label><input name="phone" value={settings.phone} onChange={handleChange} className="input-field" /></div><div><label className="label">Email Address</label><input name="email" value={settings.email} onChange={handleChange} className="input-field" type="email" /></div><div><label className="label">Address</label><textarea name="address" rows="2" value={settings.address} onChange={handleChange} className="input-field" /></div></div></div>
        <div><h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><Globe className="w-4 h-4" /> Social Media Links</h3><div className="space-y-4"><div className="flex items-center gap-2"><Facebook className="w-4 h-4 text-gray-400" /><input name="facebook" value={settings.facebook} onChange={handleChange} className="input-field flex-1" placeholder="Facebook URL" /></div><div className="flex items-center gap-2"><Twitter className="w-4 h-4 text-gray-400" /><input name="twitter" value={settings.twitter} onChange={handleChange} className="input-field flex-1" placeholder="Twitter URL" /></div><div className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-gray-400" /><input name="linkedin" value={settings.linkedin} onChange={handleChange} className="input-field flex-1" placeholder="LinkedIn URL" /></div><div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-gray-400" /><input name="instagram" value={settings.instagram} onChange={handleChange} className="input-field flex-1" placeholder="Instagram URL" /></div></div></div>
        <div className="flex justify-end"><button type="submit" className="btn-primary text-sm flex items-center gap-1"><Save className="w-4 h-4" /> Save Settings</button></div>
      </form>
    </div>
  );
}