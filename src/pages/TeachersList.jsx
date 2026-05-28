import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BACKEND_URL } from '../config';
import { User, Hash, Phone, UserCheck, Users, Briefcase, GraduationCap, Plus, X } from 'lucide-react';

const TeachersList = () => {
  const { user } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: 'General',
    qualification: '',
    contactNumber: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, [user.token]);

  const fetchTeachers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const res = await axios.get(`${BACKEND_URL}/api/teachers`, config);
      setTeachers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(`${BACKEND_URL}/api/teachers`, formData, config);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        employeeId: '',
        department: 'General',
        qualification: '',
        contactNumber: ''
      });
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  if (loading && teachers.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Users size={16} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Faculty Members</h2>
            </div>
            <p className="text-sm text-slate-500">{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} currently active</p>
          </div>
          {user.role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              <Plus size={18} />
              Add Teacher
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 m-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Qualification</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {teacher.user?.name?.charAt(0).toUpperCase() || 'T'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{teacher.user?.name || '—'}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{teacher.user?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-600">
                    {teacher.employeeId || '—'}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-100/50">
                      <Briefcase size={12} />
                      {teacher.department || 'General'}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-slate-400" />
                      {teacher.qualification || '—'}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone size={12} />
                      {teacher.contactNumber || '—'}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-tighter rounded-full border border-green-100">
                        <UserCheck size={11} /> Active
                      </span>
                      {user.role === 'admin' && (
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this teacher and their account?')) {
                              try {
                                await axios.delete(`${BACKEND_URL}/api/teachers/${teacher._id}`, {
                                  headers: { Authorization: `Bearer ${user.token}` },
                                });
                                setTeachers(prev => prev.filter(t => t._id !== teacher._id));
                              } catch (err) {
                                alert(err.response?.data?.message || 'Failed to delete');
                              }
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1 hover:bg-red-50 rounded"
                        >
                          <Hash size={14} className="rotate-45" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold">Register New Teacher</h3>
              <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform duration-300 p-1">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddTeacher} className="p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Employee ID</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Department</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    <option>General</option>
                    <option>Science</option>
                    <option>Mathematics</option>
                    <option>Arts</option>
                    <option>Computer Science</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Qualification</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Contact Number</label>
                  <input 
                    type="tel"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-6">
                <button 
                  type="submit" disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Register Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
