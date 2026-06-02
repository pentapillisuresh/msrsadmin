// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import { Save, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Get current user ID (you can store this in localStorage or context)
  useEffect(() => {
    // Get user ID from localStorage or context
    const storedUserId = localStorage.getItem('adminUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // For demo purposes, you can set a default admin ID
      // In production, this should come from authentication context
      setUserId('admin-user-id'); // Replace with actual user ID from auth
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' });
  };

  // Verify current password (optional - if your API supports it)
  const verifyCurrentPassword = async () => {
    if (!userId) return false;
    
    setVerifying(true);
    try {
      const response = await api.post(`/users/verify-password/${userId}`, {
        password: formData.currentPassword
      });
      return response.success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters', type: 'error' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New password and confirm password do not match', type: 'error' });
      return;
    }

    if (!userId) {
      setMessage({ text: 'User not authenticated. Please login again.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Call the reset password API
      const response = await api.put(`/reset-password/${userId}`, {
        newPassword: newPassword
      });
      
      if (response.success) {
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ text: 'Password reset successfully! Please login with your new password.', type: 'success' });
        
        // Optional: Clear stored password from localStorage if you're using it
        localStorage.removeItem('adminPassword');
        
        // Optional: Redirect to login page after 2 seconds
        setTimeout(() => {
          // window.location.href = '/login';
        }, 2000);
      } else {
        setMessage({ text: response.data.message || 'Failed to reset password', type: 'error' });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response?.status === 404) {
        setMessage({ text: 'Admin user not found', type: 'error' });
      } else if (error.response?.status === 401) {
        setMessage({ text: 'Current password is incorrect', type: 'error' });
      } else {
        setMessage({ text: 'Error resetting password. Please try again.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Security Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Reset your admin account password</p>
        </div>
        <Lock className="w-6 h-6 text-gray-400" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-md space-y-6">
        {message.text && (
          <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
              required
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
              required
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
              required
              placeholder="Re-enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary text-sm flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Resetting...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Reset Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Tips */}
      <div className="bg-blue-50 rounded-lg p-4 max-w-md border border-blue-100">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Security Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use a strong password with at least 8 characters</li>
          <li>• Include numbers, symbols, and both uppercase & lowercase letters</li>
          <li>• Avoid using common words or personal information</li>
          <li>• Never share your password with anyone</li>
          <li>• Change your password regularly</li>
        </ul>
      </div>

      {/* Password Strength Indicator (Optional) */}
      {formData.newPassword && (
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-600">Password Strength:</span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  formData.newPassword.length >= 8 
                    ? 'w-full bg-green-500' 
                    : formData.newPassword.length >= 6 
                    ? 'w-2/3 bg-yellow-500' 
                    : 'w-1/3 bg-red-500'
                }`}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {formData.newPassword.length < 6 && 'Too short'}
            {formData.newPassword.length >= 6 && formData.newPassword.length < 8 && 'Fair password'}
            {formData.newPassword.length >= 8 && 'Strong password'}
          </p>
        </div>
      )}
    </div>
  );
}