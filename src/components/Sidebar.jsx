import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare, 
  BookOpen, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings,
  Bell,
  MessageSquare,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  Wallet
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const location = useLocation();
  
  const mainLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  ];

  const adminModules = [
    { name: 'Admissions', path: '/dashboard/admissions', icon: ClipboardCheck },
    { name: 'Students', path: '/dashboard/students', icon: Users },
    { name: 'Teachers', path: '/dashboard/teachers', icon: UserSquare },
    { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardCheck },
    { name: 'Classes', path: '/dashboard/classes', icon: BookOpen },
    { name: 'Finance', path: '/dashboard/fees', icon: CreditCard },
  ];

  const teacherModules = [
    { name: 'My Classes', path: '/dashboard/my-classes', icon: BookOpen },
    { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardCheck },
    { name: 'Grades', path: '/dashboard/grades', icon: FileText },
    { name: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
  ];

  const studentModules = [
    { name: 'Schedule', path: '/dashboard/schedule', icon: Calendar },
    { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardCheck },
    { name: 'Results', path: '/dashboard/results', icon: FileText },
    { name: 'Fees', path: '/dashboard/fees', icon: Wallet },
  ];

  const modules = role === 'admin' ? adminModules : role === 'teacher' ? teacherModules : studentModules;

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      <div className="p-6">
        <div className="mb-8 px-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Main
          </h2>
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50' 
                      : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {isActive && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                  <Icon size={20} className={`relative z-10 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-indigo-600 group-hover:scale-110'}`} />
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Modules
          </h2>
          <nav className="space-y-1">
            {modules.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 group ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-full"></div>}
                  <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-indigo-600 group-hover:scale-110'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200/50">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100/50 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <GraduationCap size={16} className="text-indigo-600" />
            </div>
            <p className="text-xs font-bold text-indigo-900">EduPortal Pro</p>
          </div>
          <p className="text-[10px] text-indigo-600/80 leading-relaxed mb-4 relative z-10">Premium school management ecosystem.</p>
          <button className="w-full py-2.5 bg-white rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm border border-indigo-100 relative z-10">
            View Updates
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
