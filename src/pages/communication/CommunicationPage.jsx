import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Inbox, 
  Megaphone, 
  Search, 
  MoreVertical, 
  Clock, 
  User,
  Plus,
  Mail,
  ChevronRight,
  SendHorizontal
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const CommunicationPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('announcements');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Announcement',
    subject: '',
    body: '',
    targetRole: 'All',
    recipients: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'announcements' ? '/communication/announcements' : '/communication/inbox';
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/communication/send', formData);
      toast.success(`${formData.type} sent successfully`);
      setShowCompose(false);
      setFormData({ type: 'Announcement', subject: '', body: '', targetRole: 'All', recipients: [] });
      fetchData();
    } catch (error) {
      toast.error("Failed to send communication");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-gray-500 text-sm">Stay connected with announcements and internal messages.</p>
        </div>
        <button 
          onClick={() => setShowCompose(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Compose
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left Sidebar Tabs */}
        <div className="w-64 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'announcements' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'text-gray-500 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Megaphone size={20} />
            <span className="font-bold">Announcements</span>
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'inbox' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'text-gray-500 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Inbox size={20} />
            <span className="font-bold">Inbox</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder={`Search ${activeTab}...`} className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-auto divide-y divide-gray-50">
            {loading ? (
              <div className="p-10 text-center text-gray-400">Loading...</div>
            ) : data.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No {activeTab} yet.</div>
            ) : data.map((item) => (
              <div key={item._id} className="p-6 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {item.sender?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {item.subject}
                      </h4>
                      <p className="text-xs text-gray-500">
                        From: <span className="font-semibold">{item.sender?.name}</span> • {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {item.targetRole && (
                    <span className="badge bg-indigo-50 text-indigo-600 uppercase tracking-widest text-[10px]">
                      {item.targetRole}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 ml-13">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <SendHorizontal className="text-indigo-600" size={24} />
                Send New Bulletin
              </h3>
              <button onClick={() => setShowCompose(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Announcement'})}
                  className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                    formData.type === 'Announcement' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  Announcement
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Message'})}
                  className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                    formData.type === 'Message' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  Direct Message
                </button>
              </div>

              <div className="space-y-4">
                {formData.type === 'Announcement' && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Target Audience</label>
                    <select 
                      className="input-field"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                    >
                      <option value="All">Everyone (Students & Staff)</option>
                      <option value="Teacher">Teachers Only</option>
                      <option value="Staff">Administrative Staff</option>
                      <option value="Admin">Administrators</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Subject</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter short identifying subject..."
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Content</label>
                  <textarea 
                    className="input-field min-h-[180px] py-4" 
                    placeholder="Write your message here..."
                    required
                    value={formData.body}
                    onChange={(e) => setFormData({...formData, body: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full btn-primary py-4 text-lg !shadow-indigo-600/30">
                  Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationPage;
