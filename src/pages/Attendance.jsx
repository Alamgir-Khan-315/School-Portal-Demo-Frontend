import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  ClipboardCheck, 
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Save,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const STATUS_COLORS = {
  'Present': 'bg-green-100 text-green-700 border-green-200',
  'Absent': 'bg-red-100 text-red-700 border-red-200',
  'Late': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Half Day': 'bg-orange-100 text-orange-700 border-orange-200'
};

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  
  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  
  // For teachers
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    fetchClasses();
    if (user.role === 'student' || user.role === 'admin') {
      fetchAttendance();
    }
  }, [date, user.role]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/classes`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setClasses(res.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      if (error.response?.status === 404) {
        console.error('Classes API not found. Please restart the backend server.');
      }
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attendance?date=${date}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRecords(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchClassStudents = async (classId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/students?classId=${classId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const students = res.data;
      setStudentsList(students);
      
      // Initialize attendance data object
      const initialData = {};
      students.forEach(s => initialData[s._id] = 'Present'); // default present
      setAttendanceData(initialData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const val = e.target.value;
    setSelectedClass(val);
    if (val) {
      fetchClassStudents(val);
    } else {
      setStudentsList([]);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const payload = {
        date,
        classId: selectedClass,
        records: Object.keys(attendanceData).map(studentId => ({
          studentId,
          status: attendanceData[studentId]
        }))
      };
      
      await axios.post(`${BACKEND_URL}/api/attendance/bulk`, payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      alert('Attendance marked successfully!');
      setLoading(false);
      fetchAttendance(); // Refresh records
    } catch (error) {
      console.error(error);
      alert('Failed to mark attendance: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  // Filtered records for display
  const filteredRecords = records.filter(r => {
    const studentName = r.student?.user?.name || '';
    const studentRoll = r.student?.rollNumber || '';
    const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          studentRoll.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !classFilter || r.class?._id === classFilter;
    return matchesSearch && matchesClass;
  });

  const renderTeacherView = () => (
    <div className="space-y-6">
      <div className="glass-card-premium p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Class</label>
            <select 
              value={selectedClass} 
              onChange={handleClassChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white text-slate-900 font-bold"
            >
              <option value="">-- Select Class --</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white"
            />
          </div>
          <div className="w-full md:w-auto">
            <button 
              onClick={submitAttendance}
              disabled={!selectedClass || studentsList.length === 0 || loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Save Attendance
            </button>
          </div>
        </div>
      </div>

      {loading && !studentsList.length ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : studentsList.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600">
                  <th className="p-4 pl-6 w-24">Roll #</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4 text-center">Mark Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsList.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 text-sm font-bold text-slate-500">{student.rollNumber}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{student.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{student.user?.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <select
                          value={attendanceData[student._id]}
                          onChange={(e) => handleStatusChange(student._id, e.target.value)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer shadow-sm ${STATUS_COLORS[attendanceData[student._id]] || 'bg-white text-slate-600 border-slate-200'}`}
                        >
                          {['Present', 'Absent', 'Late', 'Half Day'].map(status => (
                            <option key={status} value={status} className="bg-white text-slate-900 font-medium">
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ClipboardCheck size={40} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-lg">Select a class to start</p>
          <p className="text-slate-400 text-sm mt-1">If class list is empty, ensure students are assigned to classes in Admissions.</p>
        </div>
      )}
    </div>
  );

  const renderViewOnly = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student name or roll..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-48">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
            <label className="text-xs font-black text-indigo-900 uppercase tracking-tighter">Date:</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-indigo-700 outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm"><ClipboardCheck size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Found</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{filteredRecords.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl shadow-sm"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Present</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{filteredRecords.filter(r => r.status === 'Present').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl shadow-sm"><XCircle size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Absent</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{filteredRecords.filter(r => r.status === 'Absent').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <th className="p-4 pl-6">Student & Roll</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  {user.role === 'admin' && <th className="p-4 text-right pr-6">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                          {record.student?.user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{record.student?.user?.name || 'Student'}</p>
                          <p className="text-[10px] font-bold text-slate-400">#{record.student?.rollNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg w-fit border border-slate-100">
                        <BookOpen size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{record.class?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-600">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${STATUS_COLORS[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    {user.role === 'admin' && (
                      <td className="p-4 text-right pr-6">
                        <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors">Edit</button>
                      </td>
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="text-slate-200" />
                        <p className="text-slate-500 font-bold">No results matching your filters</p>
                        <p className="text-slate-400 text-xs">Try adjusting your search or selecting a different class.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
          <ClipboardCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Center</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and monitor academic presence records.</p>
        </div>
      </div>

      {(user.role === 'teacher' || (user.role === 'admin' && selectedClass)) ? renderTeacherView() : renderViewOnly()}
      
      {user.role === 'admin' && !selectedClass && (
        <div className="mt-12 p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Need to mark attendance as Admin?</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-lg">Administrators can take over attendance marking for any class in case of teacher unavailability.</p>
            <button 
              onClick={() => setSelectedClass('pending')} 
              className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition shadow-lg active:scale-95"
            >
              Start Marking Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
