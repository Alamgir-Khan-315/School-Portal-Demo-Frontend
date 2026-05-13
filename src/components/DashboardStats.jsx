import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BACKEND_URL } from '../config';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserSquare, 
  Clock, 
  DollarSign, 
  BookOpen, 
  FileText, 
  Calendar, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md hover-lift">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.indigo}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const DashboardStats = ({ role }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const iconMap = {
    'Users': Users,
    'UserSquare': UserSquare,
    'Clock': Clock,
    'DollarSign': DollarSign,
    'BookOpen': BookOpen,
    'FileText': FileText,
    'Calendar': Calendar,
    'GraduationCap': GraduationCap,
    'CheckCircle': CheckCircle,
    'AlertCircle': AlertCircle,
    'TrendingUp': TrendingUp
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${BACKEND_URL}/api/stats`, config);
        
        // Map icon strings to components if needed, or backend can just send title and we map here
        const mappedStats = data.stats.map(s => ({
          ...s,
          icon: iconMap[s.icon] || (s.title.includes('Student') ? Users : s.title.includes('Teacher') ? UserSquare : s.title.includes('Revenue') ? DollarSign : s.title.includes('Class') ? BookOpen : s.title.includes('Attendance') ? Calendar : GraduationCap)
        }));

        setStats(mappedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchStats();
    }
  }, [user, role]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
            <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-slate-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
