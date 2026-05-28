import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <GraduationCap size={32} className="text-indigo-400" />
              <span className="font-bold text-xl tracking-wider">EduPortal</span>
            </Link>
            <p className="text-sm text-slate-400">
              Empowering education through modern technology. Our premium portal makes school management seamless and intuitive for everyone.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition"><Globe size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition">Contact Support</Link></li>
              <li><Link to="/admission" className="hover:text-indigo-400 transition">Admissions</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-4">Portal Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-400">Smart Attendance Tracking</span></li>
              <li><span className="text-slate-400">Digital Result Publishing</span></li>
              <li><span className="text-slate-400">Notes & File Sharing</span></li>
              <li><span className="text-slate-400">Online Fee Management</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>123 Education Lane, Learning District, City 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-400 shrink-0" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400 shrink-0" />
                <span>support@eduportal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EduPortal Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
