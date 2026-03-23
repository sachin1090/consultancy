import React, { useState, useEffect } from 'react';
import StudentPortal from './StudentPortal';
import AdminPortal from './AdminPortal'; // New Component
import { 
  GraduationCap, ArrowRight, Lock, Phone, Mail, MapPin, 
  ChevronDown, Users, BookOpen, ShieldCheck, 
  Globe, PlaneTakeoff, FileCheck, ArrowLeft, Sparkles, Star, Quote, Menu, X, Landmark, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'student'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('site'); 
  const [sitePage, setSitePage] = useState('home');
  const [dummyData, setDummyData] = useState({ title: '', desc: '' });
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [studentData, setStudentData] = useState(() => {
    const saved = localStorage.getItem('next_era_user');
    return saved ? JSON.parse(saved) : {
      email: 'sachin@gmail.com', fullName: 'Sachin', idNumber: '44521-X', phone: '9841XXXXXX', isProfileComplete: true,
      docsUploaded: { passport: true, citizenship: false, slc: true, plusTwo: false, ppPhoto: true }
    };
  });

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setViewMode(role === 'admin' ? 'admin' : 'portal');
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setViewMode('site');
    localStorage.clear();
    window.location.reload();
  };

  // --- CONDITIONAL RENDERING ---
  if (isLoggedIn && viewMode === 'portal') {
    return <StudentPortal studentData={studentData} setStudentData={setStudentData} onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  if (isLoggedIn && viewMode === 'admin') {
    return <AdminPortal onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  return (
    <div className="bg-[#FBFBFF] font-sans text-slate-900 overflow-x-hidden">
      {/* NAVBAR (Updated with Admin Check) */}
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-10 py-6">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-[2rem] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => setSitePage('home')}>
            <div className="bg-indigo-600 p-2 rounded-xl text-white"><GraduationCap size={22}/></div>
            <span>NEXT ERA</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => setSitePage('home')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">Home</button>
            <button onClick={() => setSitePage('home')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">Universities</button>
            <button onClick={() => setSitePage('home')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">Scholarships</button>
          </div>

          <button 
            onClick={() => isLoggedIn ? setViewMode(userRole === 'admin' ? 'admin' : 'portal') : setIsLoginModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Member Login'}
          </button>
        </div>
      </nav>

      <main className="pt-32">
        {sitePage === 'home' ? (
          <>
            {/* POLISHED HERO */}
            <section className="pt-20 pb-20 text-center px-6 max-w-7xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-indigo-100">
                <Sparkles size={14} /> The Top Rated Consultancy in Kathmandu 2026
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase mb-10">Study <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Anywhere.</span></h1>
              <p className="text-slate-500 font-medium text-xl md:text-2xl max-w-2xl mx-auto mb-12">Expert guidance for Australia, UK, USA, and Canada. Join 12,000+ students who achieved their dreams with Next Era.</p>
              
              {/* UNIVERSITY LOGOS DUMMY */}
              <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 mb-20">
                <div className="font-black text-xl tracking-tighter">OXFORD</div>
                <div className="font-black text-xl tracking-tighter">HARVARD</div>
                <div className="font-black text-xl tracking-tighter">MIT</div>
                <div className="font-black text-xl tracking-tighter">MELBOURNE</div>
                <div className="font-black text-xl tracking-tighter">UBC CANADA</div>
              </div>
            </section>

            {/* BENTO SERVICES */}
            <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                <ServiceCard icon={<Globe/>} title="Global Reach" desc="Partnerships with 600+ universities across 4 continents." />
                <ServiceCard icon={<FileCheck/>} title="Visa Mastery" desc="99.2% success rate for Subclass 500 and F1 visas." />
                <ServiceCard icon={<BookOpen/>} title="Test Center" desc="IELTS/PTE classes with 2026 updated digital mocks." />
                <ServiceCard icon={<ShieldCheck/>} title="GTE/SOP Support" desc="Personalized narrative building for immigration success." />
            </section>
          </>
        ) : (
          <div className="p-20 text-center font-black text-4xl">DUMMY PAGE CONTENT</div>
        )}
      </main>

      {/* LOGIN MODAL (Updated for Admin) */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsLoginModalOpen(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-white w-full max-w-md p-12 rounded-[3.5rem] shadow-2xl text-center">
              <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Identity Check</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const pass = e.target.pass.value;
                if(email === 'admin@nextera.com' && pass === 'admin') handleLoginSuccess('admin');
                else if(email === 'sachin@gmail.com' && pass === '12345') handleLoginSuccess('student');
              }} className="space-y-4 text-left">
                <input name="email" className="w-full p-5 bg-slate-50 border rounded-2xl font-bold" placeholder="sachin@gmail.com or admin@nextera.com" />
                <input name="pass" type="password" className="w-full p-5 bg-slate-50 border rounded-2xl font-bold" placeholder="12345 or admin" />
                <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Enter Dashboard</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ServiceCard = ({icon, title, desc}) => (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
        <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">{icon}</div>
        <h4 className="font-black text-xl mb-3 tracking-tighter uppercase">{title}</h4>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
    </div>
);