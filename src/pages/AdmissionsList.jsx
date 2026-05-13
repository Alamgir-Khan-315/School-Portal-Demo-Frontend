import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Calendar, GraduationCap, Phone, Clock, CheckCircle, Trash2, Loader } from 'lucide-react';
import { BACKEND_URL } from '../config';

const AdmissionsList = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // track which row is loading
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: '' }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAdmissions = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admissions/all`);
      setAdmissions(res.data);
    } catch (err) {
      setError('Failed to fetch admissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmissions(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this admission? A student account will be created.')) return;
    setActionLoading(id + '_approve');
    try {
      const res = await axios.patch(`${BACKEND_URL}/api/admissions/${id}/approve`);
      showToast('success', res.data.message);
      fetchAdmissions(); // refresh list
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admission query? This cannot be undone.')) return;
    setActionLoading(id + '_delete');
    try {
      await axios.delete(`${BACKEND_URL}/api/admissions/${id}`);
      showToast('success', 'Admission deleted successfully');
      setAdmissions((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      showToast('error', 'Failed to delete admission');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admission Queries</h2>
            <p className="text-sm text-slate-500 mt-1">
              {admissions.length} total · {admissions.filter(a => a.status === 'Pending').length} pending
            </p>
          </div>
          <button
            onClick={fetchAdmissions}
            className="text-xs font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 m-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Applying For</th>
                <th className="px-6 py-4">Parent Info</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {admissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No admission queries found.
                  </td>
                </tr>
              ) : (
                admissions.map((query) => {
                  const isApproved = query.status === 'Approved';
                  const approvingThis = actionLoading === query._id + '_approve';
                  const deletingThis = actionLoading === query._id + '_delete';

                  return (
                    <tr key={query._id} className={`transition-colors ${isApproved ? 'bg-green-50/30' : 'hover:bg-slate-50/50'}`}>
                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isApproved ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            <User size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{query.firstName} {query.lastName}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(query.dob).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <GraduationCap size={15} className="text-slate-400" />
                          {query.classApplyingFor}
                        </div>
                      </td>

                      {/* Parent */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{query.parentName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone size={11} />
                          {query.contactNumber}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(query.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          query.status === 'Pending'  ? 'bg-yellow-100 text-yellow-700' :
                          query.status === 'Approved' ? 'bg-green-100 text-green-700'  :
                          'bg-red-100 text-red-700'
                        }`}>
                          {query.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Approve Button */}
                          {!isApproved ? (
                            <button
                              onClick={() => handleApprove(query._id)}
                              disabled={!!actionLoading}
                              title="Approve & create student account"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approvingThis
                                ? <Loader size={12} className="animate-spin" />
                                : <CheckCircle size={13} />
                              }
                              {approvingThis ? 'Approving...' : 'Approve'}
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                              <CheckCircle size={13} /> Enrolled
                            </span>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(query._id)}
                            disabled={!!actionLoading}
                            title="Delete admission query"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingThis
                              ? <Loader size={12} className="animate-spin" />
                              : <Trash2 size={13} />
                            }
                            {deletingThis ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsList;
