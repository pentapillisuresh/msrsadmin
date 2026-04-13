import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Check, X, Phone, Mail, UserPlus, Eye, Calendar, Briefcase, Heart, BookOpen, Users, Plus, Trash2, Edit } from 'lucide-react';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useLocalStorage('c3r_volunteers', []);
  const [showForm, setShowForm] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      dob: '',
      gender: '',
      phone: '',
      email: '',
      address: ''
    },
    applicationType: {
      applyAs: '',
      mode: ''
    },
    areasOfInterest: [],
    customArea: '',
    skillsAndQualification: {
      education: '',
      skills: ''
    },
    availability: {
      startDate: '',
      duration: ''
    },
    motivation: '',
    declaration: false
  });

  const areasOfInterestOptions = [
    'Education & Teaching Support',
    'Rural Development Programs',
    'Women Empowerment Initiatives',
    'Health & Awareness Campaigns',
    'Spiritual & Cultural Programs',
    'CSR Project Execution',
    'Digital Media & Content Creation',
    'Fundraising & Partnerships',
    'Administration & Operations'
  ];

  const handleAccept = (id) => { 
    setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: 'Accepted' } : v)); 
  };

  const handleReject = (id) => { 
    setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: 'Rejected' } : v)); 
  };

  const contactVolunteer = (volunteer) => { 
    window.location.href = `mailto:${volunteer.email || volunteer.personalInfo?.email}`; 
  };

  const handleViewVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setViewModal(true);
  };

  const handleEditVolunteer = (volunteer) => {
    setEditingVolunteer(volunteer);
    if (volunteer.personalInfo) {
      setFormData(volunteer);
    } else {
      // Convert old format to new format
      setFormData({
        personalInfo: {
          fullName: volunteer.name || '',
          dob: '',
          gender: '',
          phone: volunteer.phone || '',
          email: volunteer.email || '',
          address: ''
        },
        applicationType: {
          applyAs: volunteer.type || 'Volunteer',
          mode: 'Online'
        },
        areasOfInterest: [],
        customArea: '',
        skillsAndQualification: {
          education: '',
          skills: volunteer.skills || ''
        },
        availability: {
          startDate: '',
          duration: volunteer.availability || ''
        },
        motivation: '',
        declaration: false
      });
    }
    setShowForm(true);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAreaOfInterestToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.includes(area)
        ? prev.areasOfInterest.filter(a => a !== area)
        : [...prev.areasOfInterest, area]
    }));
  };

  const handleAddCustomArea = () => {
    if (formData.customArea && !formData.areasOfInterest.includes(formData.customArea)) {
      setFormData(prev => ({
        ...prev,
        areasOfInterest: [...prev.areasOfInterest, prev.customArea],
        customArea: ''
      }));
    }
  };

  const handleRemoveArea = (area) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.filter(a => a !== area)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVolunteer) {
      setVolunteers(volunteers.map(v => v.id === editingVolunteer.id ? { ...formData, id: v.id, status: v.status, appliedAt: v.appliedAt } : v));
    } else {
      const newVolunteer = {
        id: Date.now(),
        ...formData,
        status: 'Pending',
        appliedAt: new Date().toISOString()
      };
      setVolunteers([...volunteers, newVolunteer]);
    }
    setShowForm(false);
    setEditingVolunteer(null);
    setFormData({
      personalInfo: {
        fullName: '',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        address: ''
      },
      applicationType: {
        applyAs: '',
        mode: ''
      },
      areasOfInterest: [],
      customArea: '',
      skillsAndQualification: {
        education: '',
        skills: ''
      },
      availability: {
        startDate: '',
        duration: ''
      },
      motivation: '',
      declaration: false
    });
  };

  // Helper function to safely get volunteer name
  const getVolunteerName = (volunteer) => {
    return volunteer.personalInfo?.fullName || volunteer.name || 'Unknown';
  };

  // Helper function to safely get volunteer type
  const getVolunteerType = (volunteer) => {
    return volunteer.applicationType?.applyAs || volunteer.type || 'Volunteer';
  };

  // Helper function to safely get volunteer skills
  const getVolunteerSkills = (volunteer) => {
    return volunteer.skillsAndQualification?.skills || volunteer.skills || 'Not specified';
  };

  // Helper function to safely get volunteer duration
  const getVolunteerDuration = (volunteer) => {
    return volunteer.availability?.duration || volunteer.availability || 'Not specified';
  };

  // Helper function to safely get volunteer phone
  const getVolunteerPhone = (volunteer) => {
    return volunteer.personalInfo?.phone || volunteer.phone || 'N/A';
  };

  // Helper function to safely get volunteer email
  const getVolunteerEmail = (volunteer) => {
    return volunteer.personalInfo?.email || volunteer.email || '';
  };

  // Helper function to safely get volunteer date
  const getVolunteerDate = (volunteer) => {
    return volunteer.appliedAt ? new Date(volunteer.appliedAt).toLocaleDateString() : 'N/A';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Volunteer & Internship Management</h2>
        <button 
          onClick={() => {
            setEditingVolunteer(null);
            setShowForm(true);
          }}
          className="btn-primary text-sm flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">{editingVolunteer ? 'Edit Application' : 'Volunteer Application Form'}</h3>
              <button onClick={() => {
                setShowForm(false);
                setEditingVolunteer(null);
              }} className="hover:bg-gray-100 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.personalInfo.fullName}
                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={formData.personalInfo.dob}
                        onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        required
                        value={formData.personalInfo.gender}
                        onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <textarea
                        required
                        rows="2"
                        value={formData.personalInfo.address}
                        onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Application Type */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Application Type
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apply As *</label>
                      <select
                        required
                        value={formData.applicationType.applyAs}
                        onChange={(e) => handleInputChange('applicationType', 'applyAs', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Type</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode *</label>
                      <select
                        required
                        value={formData.applicationType.mode}
                        onChange={(e) => handleInputChange('applicationType', 'mode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-600" />
                    Areas of Interest
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {areasOfInterestOptions.map(area => (
                      <label key={area} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.areasOfInterest.includes(area)}
                          onChange={() => handleAreaOfInterestToggle(area)}
                          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add Custom Area of Interest"
                      value={formData.customArea}
                      onChange={(e) => setFormData(prev => ({ ...prev, customArea: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomArea}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.areasOfInterest.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.areasOfInterest.map(area => (
                        <span key={area} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                          {area}
                          <button type="button" onClick={() => handleRemoveArea(area)} className="hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills & Qualification */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Skills & Qualification
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Educational Qualification *</label>
                      <input
                        type="text"
                        required
                        value={formData.skillsAndQualification.education}
                        onChange={(e) => handleInputChange('skillsAndQualification', 'education', e.target.value)}
                        placeholder="e.g., Bachelor's in Social Work, MBA, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Skills *</label>
                      <textarea
                        required
                        rows="2"
                        value={formData.skillsAndQualification.skills}
                        onChange={(e) => handleInputChange('skillsAndQualification', 'skills', e.target.value)}
                        placeholder="e.g., Communication, Leadership, Teaching, Digital Marketing, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Availability
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.availability.startDate}
                        onChange={(e) => handleInputChange('availability', 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <select
                        required
                        value={formData.availability.duration}
                        onChange={(e) => handleInputChange('availability', 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Duration</option>
                        <option value="1 month">1 month</option>
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-600" />
                    Motivation
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join us? *</label>
                    <textarea
                      required
                      rows="4"
                      value={formData.motivation}
                      onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                      placeholder="Tell us about your motivation to volunteer with MSRS Foundation..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Declaration */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declaration}
                      onChange={(e) => setFormData(prev => ({ ...prev, declaration: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I hereby declare that the information provided is true and correct and I agree to abide by the rules and values of the Foundation.
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => {
                    setShowForm(false);
                    setEditingVolunteer(null);
                  }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    {editingVolunteer ? 'Update Application' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Volunteer Modal */}
      {viewModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Volunteer Details</h3>
              <button onClick={() => setViewModal(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{getVolunteerName(selectedVolunteer)}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getVolunteerType(selectedVolunteer) === 'Volunteer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {getVolunteerType(selectedVolunteer)}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${selectedVolunteer.status === 'Accepted' ? 'bg-green-100 text-green-700' : selectedVolunteer.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selectedVolunteer.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium">{getVolunteerEmail(selectedVolunteer)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{getVolunteerPhone(selectedVolunteer)}</p>
                </div>
                {selectedVolunteer.personalInfo && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium">{selectedVolunteer.personalInfo.dob}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-sm font-medium">{selectedVolunteer.personalInfo.gender}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium">{selectedVolunteer.personalInfo.address}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm text-gray-500">Mode</p>
                  <p className="text-sm font-medium">{selectedVolunteer.applicationType?.mode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-sm font-medium">{getVolunteerDuration(selectedVolunteer)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Areas of Interest</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedVolunteer.areasOfInterest?.map(area => (
                      <span key={area} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{area}</span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Educational Qualification</p>
                  <p className="text-sm font-medium">{selectedVolunteer.skillsAndQualification?.education || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Skills</p>
                  <p className="text-sm font-medium">{getVolunteerSkills(selectedVolunteer)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Motivation</p>
                  <p className="text-sm font-medium">{selectedVolunteer.motivation || 'Not provided'}</p>
                </div>
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No applications yet</p>
                    <p className="text-sm">Click the "Add Application" button to receive volunteer applications</p>
                  </td>
                </tr>
              ) : (
                volunteers.map((volunteer, index) => (
                  <tr key={volunteer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{getVolunteerName(volunteer)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full inline-block ${getVolunteerType(volunteer) === 'Volunteer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {getVolunteerType(volunteer)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{getVolunteerEmail(volunteer)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{getVolunteerPhone(volunteer)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px]">
                        <p className="text-sm text-gray-600 truncate">{getVolunteerSkills(volunteer)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{getVolunteerDuration(volunteer)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{getVolunteerDate(volunteer)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full inline-block ${
                        volunteer.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                        volunteer.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {volunteer.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(volunteer.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Accept"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(volunteer.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewVolunteer(volunteer)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditVolunteer(volunteer)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => contactVolunteer(volunteer)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}