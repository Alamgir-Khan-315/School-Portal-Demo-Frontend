import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Menu, X, LogOut, User, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isDashboard ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm h-16 flex items-center' : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <GraduationCap size={32} className={isDashboard ? "text-indigo-600 group-hover:scale-110 transition-transform" : "text-yellow-300 group-hover:rotate-12 transition-transform"} />
              <span className={`font-bold text-xl tracking-wider ${isDashboard ? "text-slate-900" : "text-white"}`}>EduPortal</span>
            </Link>
          </div>

          {!isDashboard && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="hover:bg-indigo-500 px-3 py-2 rounded-md font-medium transition">Home</Link>
                <Link to="/about" className="hover:bg-indigo-500 px-3 py-2 rounded-md font-medium transition">About Us</Link>
                <Link to="/contact" className="hover:bg-indigo-500 px-3 py-2 rounded-md font-medium transition">Contact</Link>
                <Link to="/admission" className="bg-yellow-400 text-indigo-900 hover:bg-yellow-300 px-4 py-2 rounded-md font-bold transition shadow-sm">Apply Now</Link>
                
                {user ? (
                  <div className="flex items-center gap-4 ml-4 pl-4 border-l border-indigo-400">
                    <Link to="/dashboard" className="flex items-center gap-2 hover:text-yellow-300 transition">
                      <User size={18} />
                      <span>{user?.name || 'Dashboard'}</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-1 text-red-200 hover:text-red-100 transition font-bold text-sm bg-indigo-700 px-3 py-1 rounded-lg">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="hover:text-yellow-300 px-3 py-2 font-medium transition">Login</Link>
                )}
              </div>
            </div>
          )}

          {isDashboard && (
            <div className="flex items-center gap-6">
              <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              {user && (
                <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                  <div className="flex items-center gap-3 px-3 py-1.5 bg-white rounded-2xl border border-slate-200/60 shadow-sm min-w-[180px] justify-end hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'User'}</p>
                      <p className="text-[10px] text-indigo-600 mt-1 capitalize font-bold bg-indigo-50 px-2 py-0.5 rounded-full inline-block tracking-tighter">
                        {user?.role || 'Role'}
                      </p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300 shadow-sm"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {!isDashboard && (
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu - only for non-dashboard */}
      {isOpen && !isDashboard && (
        <div className="md:hidden bg-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md font-medium hover:bg-indigo-500">Home</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md font-medium hover:bg-indigo-500">About Us</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md font-medium hover:bg-indigo-500">Contact</Link>
            <Link to="/admission" className="block px-3 py-2 rounded-md font-medium bg-yellow-400 text-indigo-900 mt-2">Apply Now</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md font-medium text-yellow-300">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md font-medium text-red-300">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md font-medium hover:bg-indigo-500">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
