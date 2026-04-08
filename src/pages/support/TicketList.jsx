import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium'
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/support?status=${statusFilter}`);
      setTickets(data);
    } catch (error) {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', formData);
      toast.success("Ticket raised successfully");
      setShowModal(false);
      setFormData({ title: '', description: '', priority: 'Medium' });
      fetchTickets();
    } catch (error) {
      toast.error("Failed to raise ticket");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/support/${id}`, { status });
      toast.success(`Ticket marked as ${status}`);
      fetchTickets();
      if (selectedTicket) setSelectedTicket(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <span className="badge bg-blue-50 text-blue-600">Open</span>;
      case 'In-Progress': return <span className="badge bg-amber-50 text-amber-600">In Progress</span>;
      case 'Resolved': return <span className="badge bg-emerald-50 text-emerald-600">Resolved</span>;
      case 'Closed': return <span className="badge bg-gray-100 text-gray-600">Closed</span>;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-amber-600';
      case 'Low': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Desk</h1>
          <p className="text-gray-500 text-sm">Manage help requests and technical support tickets.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create New Ticket
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-xl w-fit border border-gray-100 shadow-sm">
        {['', 'Open', 'In-Progress', 'Resolved', 'Closed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === tab 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab || 'All Tickets'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500">No tickets found in this category</div>
        ) : tickets.map((ticket) => (
          <div 
            key={ticket._id} 
            className="card group hover:shadow-md transition-all cursor-pointer border-l-4 border-l-indigo-600"
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="flex justify-between items-start mb-4">
              {getStatusBadge(ticket.status)}
              <span className={`text-xs font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{ticket.title}</h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
              {ticket.description}
            </p>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                  {ticket.raisedBy?.name?.charAt(0)}
                </div>
                {ticket.raisedBy?.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative">
             <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Ticket Details</h3>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {getStatusBadge(selectedTicket.status)}
                <span className={`badge bg-gray-100 ${getPriorityColor(selectedTicket.priority)}`}>
                  {selectedTicket.priority} Priority
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  Ticket ID: {selectedTicket._id.slice(-8).toUpperCase()}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedTicket.title}</h2>
              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <p className="text-gray-700 leading-relaxed italic">"{selectedTicket.description}"</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Raised By</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.raisedBy?.name}</p>
                  <p className="text-sm text-gray-500">{selectedTicket.raisedBy?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Created Date</p>
                  <p className="font-semibold text-gray-900">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex gap-4">
                {selectedTicket.status === 'Open' && (
                  <button 
                    onClick={() => updateStatus(selectedTicket._id, 'In-Progress')}
                    className="btn-primary bg-amber-500 hover:bg-amber-600 !shadow-amber-500/20 flex-1"
                  >
                    Start Investigation
                  </button>
                )}
                {['Open', 'In-Progress'].includes(selectedTicket.status) && (
                  <button 
                    onClick={() => updateStatus(selectedTicket._id, 'Resolved')}
                    className="btn-primary bg-emerald-500 hover:bg-emerald-600 !shadow-emerald-500/20 flex-1"
                  >
                    Mark Resolved
                  </button>
                )}
                {selectedTicket.status === 'Resolved' && (
                  <button 
                    onClick={() => updateStatus(selectedTicket._id, 'Closed')}
                    className="btn-secondary flex-1"
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Raise New Ticket</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Printer not working in Library"
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  className="input-field min-h-[120px]" 
                  placeholder="Detailed description of the problem..."
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        formData.priority === p 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
