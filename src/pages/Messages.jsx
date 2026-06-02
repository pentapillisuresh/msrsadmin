// src/pages/Messages.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import { Mail, CheckCircle, User, Calendar, Clock, Flag, Reply, Archive, Trash2, Eye, X, AlertCircle, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/all');
      if (response.success) {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error fetching messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Update message status
  const updateStatus = async (id, status) => {
    try {
      const response = await api.put(`/messages/${id}/status`, { status });
      if (response.success) {
        await fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating message status. Please try again.');
    }
  };

  // Reply to message
  const handleReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.put(`/messages/${selectedMessage.id}/status`, {
        status: 'replied',
        replyMessage: replyText
      });
      
      if (response.success) {
        await fetchMessages();
        setShowReplyModal(false);
        setReplyText('');
        alert('Reply sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // View message details
  const handleViewMessage = async (message) => {
    try {
      const response = await api.get(`/messages/${message.id}`);
      if (response.success) {
        setSelectedMessage(response.data);
        // Mark as read if it's unread
        if (response.data.data.status === 'unread') {
          await updateStatus(message.id, 'read');
        }
      }
    } catch (error) {
      console.error('Error fetching message details:', error);
      alert('Error loading message details. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      unread: { icon: Mail, color: 'bg-blue-100 text-blue-700', label: 'Unread' },
      read: { icon: Eye, color: 'bg-gray-100 text-gray-700', label: 'Read' },
      replied: { icon: Reply, color: 'bg-green-100 text-green-700', label: 'Replied' },
      archived: { icon: Archive, color: 'bg-purple-100 text-purple-700', label: 'Archived' },
      spam: { icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Spam' }
    };
    const config = statusConfig[status] || statusConfig.unread;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" /> {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-700', label: 'Low' },
      medium: { color: 'bg-blue-100 text-blue-700', label: 'Medium' },
      high: { color: 'bg-orange-100 text-orange-700', label: 'High' },
      urgent: { color: 'bg-red-100 text-red-700', label: 'Urgent' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Flag className="w-3 h-3" /> {config.label}
      </span>
    );
  };

  const getContactMethodIcon = (method) => {
    switch(method) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || m.priority === filterPriority;
    return matchesStatus && matchesPriority && !m.isDeleted;
  });

  const unreadCount = messages.filter(m => m.status === 'unread' && !m.isDeleted).length;
  const totalCount = messages.filter(m => !m.isDeleted).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">Contact Messages</h2>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount} unread • {totalCount} total messages
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No messages found</p>
            <p className="text-sm">Messages will appear here when received</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div 
              key={message.id} 
              className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all cursor-pointer ${
                message.status === 'unread' ? 'border-l-4 border-l-indigo-500 bg-indigo-50/30' : ''
              }`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{message.name}</h3>
                    {getStatusBadge(message.status)}
                    {getPriorityBadge(message.priority)}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {message.email}
                    </span>
                    {message.phoneNumber && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {message.phoneNumber}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                  {message.subject && (
                    <p className="text-xs text-gray-400 mt-1">Subject: {message.subject}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {message.status !== 'replied' && message.status !== 'archived' && message.status !== 'spam' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessage(message);
                        setShowReplyModal(true);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Reply"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                  )}
                  {message.status !== 'archived' && message.status !== 'spam' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(message.id, 'archived');
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                  {message.status !== 'spam' && message.status !== 'archived' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Mark this message as spam?')) {
                          updateStatus(message.id, 'spam');
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Mark as Spam"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && !showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Message Details</h3>
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Sender Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                    <p className="text-gray-900 font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                    <p className="text-gray-900">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phoneNumber && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                      <p className="text-gray-900">{selectedMessage.phoneNumber}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Preferred Contact</label>
                    <p className="text-gray-900 capitalize flex items-center gap-1">
                      {getContactMethodIcon(selectedMessage.contactMethod)}
                      {selectedMessage.contactMethod}
                    </p>
                  </div>
                  {selectedMessage.address && (
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-500 uppercase">Address</label>
                      <p className="text-gray-900">{selectedMessage.address}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Subject</label>
                    <p className="text-gray-900">{selectedMessage.subject || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Received</label>
                    <p className="text-gray-900">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Message</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Reply Info */}
              {selectedMessage.replyMessage && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Reply</label>
                  <div className="mt-2 p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Replied on: {new Date(selectedMessage.repliedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {selectedMessage.status !== 'replied' && selectedMessage.status !== 'archived' && selectedMessage.status !== 'spam' && (
                  <button
                    onClick={() => setShowReplyModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Reply className="w-4 h-4" /> Reply
                  </button>
                )}
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Reply to {selectedMessage.name}</h3>
              <button 
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }} 
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-600 font-medium">Original Message:</p>
                <p className="text-gray-500 mt-1 line-clamp-3">{selectedMessage.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply *</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Type your reply here..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}