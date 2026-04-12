// src/pages/Team.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TeamMemberForm from '../components/Team/TeamMemberForm';
import { Plus, X, User, Trash2, Edit } from 'lucide-react';

export default function Team() {
  const [team, setTeam] = useLocalStorage('c3r_team', []);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const handleSave = (memberData) => {
    if (editingMember) {
      setTeam(team.map(m => m.id === editingMember.id ? { ...memberData, id: m.id } : m));
    } else {
      setTeam([...team, { ...memberData, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingMember(null);
  };

  const handleDelete = (id) => { if (window.confirm('Remove this team member?')) setTeam(team.filter(m => m.id !== id)); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-lg font-semibold">Team Management</h2><button onClick={() => { setEditingMember(null); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Member</button></div>

      {showForm && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full"><div className="border-b p-4 flex justify-between"><h3 className="font-semibold">{editingMember ? 'Edit Member' : 'Add Member'}</h3><button onClick={() => { setShowForm(false); setEditingMember(null); }}><X className="w-5 h-5" /></button></div><div className="p-6"><TeamMemberForm initialData={editingMember} onSave={handleSave} onCancel={() => setShowForm(false)} /></div></div></div>)}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{team.length === 0 ? (<div className="col-span-full text-center py-12 text-gray-400">No team members added</div>) : (team.map(member => (<div key={member.id} className="bg-white rounded-xl shadow-sm border p-4"><div className="flex gap-3"><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-indigo-600" /></div><div className="flex-1"><div className="flex justify-between"><div><h3 className="font-semibold">{member.name}</h3><p className="text-xs text-indigo-600">{member.role}</p></div><div className="flex gap-1"><button onClick={() => { setEditingMember(member); setShowForm(true); }} className="p-1 text-gray-400 hover:text-blue-600"><Edit className="w-3 h-3" /></button><button onClick={() => handleDelete(member.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button></div></div><p className="text-xs text-gray-500 mt-1">{member.email}</p><p className="text-xs text-gray-500">{member.phone}</p></div></div></div>)))}</div>
    </div>
  );
}