import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BACKEND_URL } from '../config';
import { User, Hash, Calendar, Phone, UserCheck, Users } from 'lucide-react';

const StudentsList = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const res = await axios.get(`${BACKEND_URL}/api/students`, config);
        setStudents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user.token]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
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
          <p className="text-sm text-slate-500">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
        </div>
      </div>

      {error && (
        <div className="p-4 m-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Roll No.</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Date of Birth</th>
              <th className="px-6 py-4">Parent</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                      <Users size={28} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-medium">No students enrolled yet.</p>
                    <p className="text-xs text-slate-400">Approve admission queries to enroll students.</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        {student.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                      </div>
                      <div className="font-bold text-slate-900">{student.user?.name || '—'}</div>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Hash size={13} className="text-slate-400" />
                      <span className="font-mono font-semibold">{student.rollNumber}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {student.user?.email || '—'}
                  </td>

                  {/* DOB */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={12} />
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'}
                    </div>
                  </td>

                  {/* Parent Name */}
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {student.parentName || '—'}
                  </td>

                  {/* Parent Contact */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone size={12} />
                      {student.parentContact || '—'}
                    </div>
                  </td>

                  {/* Status & Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full w-fit">
                        <UserCheck size={11} /> Active
                      </span>
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this student and their account? This cannot be undone.')) {
                            try {
                              await axios.delete(`${BACKEND_URL}/api/students/${student._id}`, {
                                headers: { Authorization: `Bearer ${user.token}` },
                              });
                              setStudents(prev => prev.filter(s => s._id !== student._id));
                            } catch (err) {
                              alert(err.response?.data?.message || 'Failed to delete student');
                            }
                          }
                        }}
                        className="text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-xs font-bold transition"
                      >
                        Delete
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
  );
};

export default StudentsList;
