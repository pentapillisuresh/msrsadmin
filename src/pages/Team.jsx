import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TeamMemberForm from '../components/Team/TeamMemberForm';
import { Plus, X, User, Trash2, Edit, Mail, Phone } from 'lucide-react';

export default function Team() {
  const [team, setTeam] = useLocalStorage('c3r_team', []);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const handleSave = (memberData) => {
    if (editingMember) {
      setTeam(team.map(m => m.id === editingMember.id ? { ...memberData, id: m.id } : m));
    } else {
      setTeam([...team, { ...memberData, id: Date.now(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingMember(null);
  };

  const handleDelete = (id) => { 
    if (window.confirm('Remove this team member?')) 
      setTeam(team.filter(m => m.id !== id)); 
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setViewModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Team Management</h2>
        <button 
          onClick={() => { setEditingMember(null); setShowForm(true); }} 
          className="btn-primary text-sm flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Team Member Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{editingMember ? 'Edit Member' : 'Add Member'}</h3>
              <button 
                onClick={() => { setShowForm(false); setEditingMember(null); }} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <TeamMemberForm 
                initialData={editingMember} 
                onSave={handleSave} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {viewModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Team Member Details</h3>
              <button 
                onClick={() => setViewModal(false)} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center">
              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                {selectedMember.image ? (
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/128?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-indigo-200">
                    <User className="w-16 h-16 text-indigo-600" />
                  </div>
                )}
              </div>
              
              <h4 className="text-xl font-bold text-gray-900">{selectedMember.name}</h4>
              <p className="text-indigo-600 font-medium mt-1">{selectedMember.role}</p>
              
              <div className="mt-6 space-y-3 text-left">
                {selectedMember.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMember.email}</span>
                  </div>
                )}
                {selectedMember.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMember.phone}</span>
                  </div>
                )}
                {selectedMember.createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">Joined:</span>
                    <span className="text-gray-700">{new Date(selectedMember.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No team members added</p>
            <p className="text-sm">Click the "Add Member" button to add your first team member</p>
          </div>
        ) : (
          team.map(member => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-4">
                <div className="flex gap-3">
                  {/* Profile Image */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleViewMember(member)}
                  >
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 hover:border-indigo-500 transition-colors"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/64?text=Error';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors">
                        <User className="w-8 h-8 text-indigo-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleViewMember(member)}
                        >
                          {member.name}
                        </h3>
                        <p className="text-xs text-indigo-600 mt-0.5">{member.role}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button 
                          onClick={() => { setEditingMember(member); setShowForm(true); }} 
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)} 
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    {member.email && (
                      <p className="text-xs text-gray-500 mt-2 truncate">{member.email}</p>
                    )}
                    {member.phone && (
                      <p className="text-xs text-gray-500">{member.phone}</p>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`}
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Email
                        </a>
                      )}
                      {member.phone && (
                        <a 
                          href={`tel:${member.phone}`}
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}