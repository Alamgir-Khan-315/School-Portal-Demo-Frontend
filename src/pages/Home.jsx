import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, ArrowRight, Star, ShieldCheck, Zap, Globe, ClipboardCheck, FileText } from 'lucide-react';
import heroImg from '../assets/hero.png';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="School Campus" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold text-sm mb-6 backdrop-blur-md">
                ✨ Excellence in Education
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                Empowering Minds,<br />
                <span className="text-gradient brightness-125">Shaping Futures</span>
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
                Welcome to EduPortal. A state-of-the-art educational platform designed to foster learning, creativity, and excellence through innovation.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/admission" className="btn-primary flex items-center gap-2 group">
                  Apply for Admission 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="btn-secondary flex items-center gap-2">
                  Student Portal
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 flex items-center gap-8 text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">1500+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Students</span>
              </div>
              <div className="w-px h-10 bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">100+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Teachers</span>
              </div>
              <div className="w-px h-10 bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">50+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Awards</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 right-10 hidden lg:block animate-float">
          <div className="glass-card-dark p-6 rounded-3xl border border-white/10 max-w-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-900">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-white font-bold">Top Rated</h4>
                <p className="text-slate-400 text-xs">Academic Excellence</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/4 right-20 hidden lg:block animate-float-delayed">
          <div className="glass-card-dark p-6 rounded-3xl border border-white/10 max-w-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">Secure Portal</h4>
                <p className="text-slate-400 text-xs">End-to-end encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.span 
              className="text-indigo-600 font-bold tracking-widest uppercase text-sm"
              {...fadeInUp}
            >
              Why Choose EduPortal
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6"
              {...fadeInUp}
            >
              Excellence in Every Detail
            </motion.h2>
            <motion.p 
              className="text-slate-600 max-w-2xl mx-auto text-lg"
              {...fadeInUp}
            >
              We provide a comprehensive environment for holistic development, combining traditional values with modern technology.
            </motion.p>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { 
                icon: <BookOpen />, 
                title: "Modern Curriculum", 
                desc: "Designed to meet global standards and prepare students for the ever-evolving future.",
                color: "bg-indigo-50 text-indigo-600"
              },
              { 
                icon: <Users />, 
                title: "Expert Faculty", 
                desc: "Learn from world-class educators who are passionate about mentoring the next generation.",
                color: "bg-purple-50 text-purple-600"
              },
              { 
                icon: <Trophy />, 
                title: "Holistic Growth", 
                desc: "Focusing on character building, sports, and arts alongside academic excellence.",
                color: "bg-yellow-50 text-yellow-600"
              },
              { 
                icon: <Zap />, 
                title: "Digital Integration", 
                desc: "Seamlessly integrated digital learning tools for an enhanced educational experience.",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                icon: <ShieldCheck />, 
                title: "Safe Environment", 
                desc: "Providing a secure and nurturing space for students to explore their full potential.",
                color: "bg-green-50 text-green-600"
              },
              { 
                icon: <Globe />, 
                title: "Global Reach", 
                desc: "Connecting students with opportunities and perspectives from all around the world.",
                color: "bg-rose-50 text-rose-600"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(feature.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portal Services Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.span 
              className="text-indigo-400 font-bold tracking-widest uppercase text-sm"
              {...fadeInUp}
            >
              Digital Campus
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
              {...fadeInUp}
            >
              Premium Portal Services
            </motion.h2>
            <motion.p 
              className="text-slate-400 max-w-2xl mx-auto text-lg"
              {...fadeInUp}
            >
              Experience seamless academic management with our integrated suite of digital services designed for students, teachers, and parents.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ClipboardCheck />,
                title: "Smart Attendance",
                desc: "Real-time attendance tracking with instant notifications and visual analytics for parents and students.",
                color: "from-green-500 to-emerald-700"
              },
              {
                icon: <FileText />,
                title: "Notes Sharing",
                desc: "Teachers can easily upload and distribute study materials, assignments, and important lecture notes.",
                color: "from-blue-500 to-indigo-700"
              },
              {
                icon: <Trophy />,
                title: "Digital Results",
                desc: "Instant access to exam results, performance graphs, and historical academic records.",
                color: "from-purple-500 to-pink-700"
              },
              {
                icon: <Globe />,
                title: "Communication",
                desc: "Direct messaging channels between teachers and students for doubt clearing and mentorship.",
                color: "from-orange-500 to-red-700"
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card-dark p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br ${service.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(service.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-500/5 overflow-hidden border border-slate-100">
            <div className="bg-indigo-600 px-10 py-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="p-2 bg-white/20 rounded-lg">📢</span>
                Latest Announcements
              </h2>
              <button className="text-white/80 hover:text-white text-sm font-bold flex items-center gap-1">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="p-10 divide-y divide-slate-100">
              <motion.div 
                className="py-6 first:pt-0"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Admission</span>
                  <span className="text-sm font-medium text-slate-400">May 10, 2026</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Admissions Open for 2026-2027 Academic Year</h4>
                <p className="text-slate-600">We are now accepting applications for all grades. Limited seats available for the upcoming session. Join our community today.</p>
              </motion.div>
              <motion.div 
                className="py-6 last:pb-0"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Sports</span>
                  <span className="text-sm font-medium text-slate-400">May 15, 2026</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Annual Sports Extravaganza 2026</h4>
                <p className="text-slate-600">Get ready for three days of intense competition and school spirit. Registration for various track and field events starts Monday.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] bg-indigo-900 overflow-hidden py-16 px-10 text-center">
            <div className="absolute inset-0 bg-mesh opacity-40"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to embark on a journey of excellence?</h2>
              <p className="text-indigo-100 text-lg mb-10 opacity-90">
                Join our vibrant community of learners and educators. Your future starts here at EduPortal.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/admission" className="px-10 py-4 rounded-2xl bg-yellow-400 text-indigo-900 font-bold hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20">
                  Apply Online
                </Link>
                <Link to="/contact" className="px-10 py-4 rounded-2xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all">
                  Contact Admissions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
