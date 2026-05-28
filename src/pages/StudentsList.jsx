import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BACKEND_URL } from '../config';
import { User, Hash, Calendar, Phone, UserCheck, Users, BookOpen, Search, Filter } from 'lucide-react';

const StudentsList = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [user.token, selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { classId: selectedClass }
      };
      const res = await axios.get(`${BACKEND_URL}/api/students`, config);
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/classes`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setClasses(res.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Filter students by search locally
  const filteredStudents = students.filter(s => 
    (s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading && students.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students by name or roll number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-64">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Users size={16} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Enrolled Students</h2>
            </div>
            <p className="text-sm text-slate-500">{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} shown</p>
          </div>
        </div>

        {error && (
          <div className="p-4 m-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Parent Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                        <Users size={28} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold">No students found.</p>
                      <p className="text-xs text-slate-400">Try changing the class filter or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                          {student.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-none mb-1">{student.user?.name || '—'}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{student.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-100/50">
                        <BookOpen size={11} />
                        {student.class?.name || 'Unassigned'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-600">#{student.rollNumber}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-bold text-slate-700">{student.parentName || '—'}</p>
                        <p className="text-[10px] text-slate-400">Guardian</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400" />
                        {student.parentContact || '—'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-tighter rounded-full border border-green-100">
                          <UserCheck size={10} /> Active
                        </span>
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this student and their account?')) {
                              try {
                                await axios.delete(`${BACKEND_URL}/api/students/${student._id}`, {
                                  headers: { Authorization: `Bearer ${user.token}` },
                                });
                                setStudents(prev => prev.filter(s => s._id !== student._id));
                              } catch (err) {
                                alert(err.response?.data?.message || 'Deletion failed');
                              }
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg"
                          title="Delete Student"
                        >
                          <Hash size={14} className="rotate-45" />
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
};

export default StudentsList;
