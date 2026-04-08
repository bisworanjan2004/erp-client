import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Eye,
  Trash2,
  Calendar,
  Phone,
  MapPin,
  Upload
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

const RegistrationPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    dob: '',
    className: '1',
    section: 'A',
    contactNumber: '',
    address: '',
    document: null
  });

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/registration?status=${statusFilter}`);
      setRegistrations(data);
    } catch (error) {
      toast.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await api.post('/registration', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Application submitted successfully");
      setShowModal(false);
      setFormData({ studentName: '', fatherName: '', dob: '', className: '1', section: 'A', contactNumber: '', address: '', document: null });
      fetchRegistrations();
    } catch (error) {
      toast.error("Failed to submit application");
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/registration/${id}/approve`);
      toast.success("Registration approved! Roll number assigned.");
      fetchRegistrations();
      setSelectedReg(null);
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/registration/${id}/reject`);
      toast.error("Application rejected");
      fetchRegistrations();
      setSelectedReg(null);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Admissions</h1>
          <p className="text-gray-500 text-sm">Manage new applications and enrollment approval.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          New Admission
        </button>
      </div>

      {/* Stats Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pending Approval', status: 'Pending', color: 'border-amber-500 text-amber-600' },
          { label: 'Enrolled Students', status: 'Approved', color: 'border-emerald-500 text-emerald-600' },
          { label: 'Rejected Applications', status: 'Rejected', color: 'border-red-500 text-red-600' }
        ].map((tab) => (
          <button
            key={tab.status}
            onClick={() => setStatusFilter(tab.status)}
            className={`p-4 rounded-2xl border-2 bg-white text-left transition-all ${
              statusFilter === tab.status 
              ? `${tab.color} shadow-lg shadow-gray-100` 
              : 'border-transparent text-gray-400 opacity-60'
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1">{tab.label}</p>
            <p className="text-2xl font-black">View List</p>
          </button>
        ))}
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Student Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Grade & Section</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Application Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Loading data...</td></tr>
              ) : registrations.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">No records found.</td></tr>
              ) : registrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-50 transition-all group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{reg.studentName}</p>
                    <p className="text-xs text-gray-500">Father: {reg.fatherName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge bg-indigo-50 text-indigo-700">Class {reg.class} • {reg.section}</span>
                    {reg.rollNumber && <p className="text-[10px] mt-1 font-bold text-indigo-400">Roll: {reg.rollNumber}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1"><Phone size={12}/> {reg.contactNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(reg.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedReg(reg)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
             <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Admission Profile</h3>
                <p className="text-indigo-200 text-xs">Review student details and documents</p>
              </div>
              <button onClick={() => setSelectedReg(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
                    <p className="text-lg font-bold text-gray-900">{selectedReg.studentName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Father's Name</label>
                    <p className="text-lg font-bold text-gray-900">{selectedReg.fatherName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Date of Birth</label>
                    <p className="text-lg font-bold text-gray-900">{new Date(selectedReg.dob).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Admission For</label>
                    <p className="text-lg font-bold text-indigo-600">Grade {selectedReg.class} - Sector {selectedReg.section}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Address</label>
                    <p className="text-sm text-gray-600 italic">"{selectedReg.address}"</p>
                  </div>
                </div>
              </div>

              {selectedReg.documentUrl && (
                <div className="mb-8">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Verification Document</label>
                  <a 
                    href={selectedReg.documentUrl} 
                    target="_blank" 
                    className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all text-indigo-600 font-bold"
                  >
                    <FileText size={20} />
                    View Student Document (ID/Address Proof)
                  </a>
                </div>
              )}

              {selectedReg.status === 'Pending' && (
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => handleReject(selectedReg._id)}
                    className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject Application
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedReg._id)}
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve Enrollment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative my-8 animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">New Student Admission Form</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Student Full Name</label>
                  <input type="text" className="input-field" required value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Father's Name</label>
                  <input type="text" className="input-field" required value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date of Birth</label>
                  <input type="date" className="input-field" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Grade / Class</label>
                  <input type="text" className="input-field" required placeholder="e.g. 10" value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section</label>
                  <input type="text" className="input-field" required placeholder="e.g. A" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Number</label>
                <input type="tel" className="input-field" required value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Complete Address</label>
                <textarea className="input-field min-h-[80px]" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Upload Documents (PDF/Image)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="doc-upload"
                    onChange={(e) => setFormData({...formData, document: e.target.files[0]})}
                  />
                  <label 
                    htmlFor="doc-upload"
                    className="flex flex-col items-center justify-center p-8 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-3xl cursor-pointer hover:bg-indigo-50 transition-all gap-2"
                  >
                    <Upload className="text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-600">
                      {formData.document ? formData.document.name : "Click to select file or drop here"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full btn-primary py-4 text-lg !shadow-indigo-600/30">
                  Submit Admission Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
