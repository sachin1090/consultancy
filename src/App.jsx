import React, { useState, useEffect } from 'react';
import StudentPortal from './StudentPortal';
import { 
  GraduationCap, ArrowRight, Lock, Phone, Mail, MapPin, 
  LayoutDashboard, ChevronDown, Users, BookOpen, ShieldCheck, 
  Globe, PlaneTakeoff, FileCheck, ArrowLeft, Sparkles, Star, Quote, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_TIMEOUT = 60 * 60 * 1000; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('site'); 
  const [sitePage, setSitePage] = useState('home');
  const [dummyData, setDummyData] = useState({ title: '', desc: '' });
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [studentData, setStudentData] = useState(() => {
    const saved = localStorage.getItem('next_era_user');
    if (saved) return JSON.parse(saved);
    return {
      email: 'sachin@gmail.com', fullName: '', idNumber: '', phone: '', isProfileComplete: false,
      docsUploaded: { passport: false, citizenship: false, slc: false, plusTwo: false, ppPhoto: false }
    };
  });

  useEffect(() => {
    const sessionStart = localStorage.getItem('session_start');
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    if (loginStatus && sessionStart && (Date.now() - parseInt(sessionStart) < SESSION_TIMEOUT)) {
      setIsLoggedIn(true);
    } else {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('next_era_user', JSON.stringify(studentData));
  }, [studentData]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode('site');
    localStorage.clear();
    window.location.reload();
  };

  const openPage = (title, desc) => {
    setDummyData({ title, desc });
    setSitePage('dummy');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoggedIn && viewMode === 'portal') {
    return <StudentPortal studentData={studentData} setStudentData={setStudentData} onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  return (
    <div className="bg-mesh min-h-screen font-sans text-slate-900 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-7xl mx-auto glass-card rounded-2xl md:rounded-[2.5rem] px-5 md:px-8 py-3 md:py-4 flex justify-between items-center border-white/60">
          <div className="flex items-center gap-3 font-black text-xl md:text-2xl tracking-tighter cursor-pointer" onClick={() => setSitePage('home')}>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><GraduationCap size={20}/></div>
            <span>NEXT ERA</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <NavItem label="About" active={activeDropdown === 'about'} onHover={() => setActiveDropdown('about')}>
              <div className="p-3 w-64 glass-card rounded-2xl shadow-xl">
                <SubNavLink onClick={() => openPage("Our Story", "The leading agency in Nepal.")} icon={<Users size={16}/>} title="Who We Are" desc="Our History" />
              </div>
            </NavItem>
            <NavItem label="Services" active={activeDropdown === 'services'} onHover={() => setActiveDropdown('services')}>
              <div className="p-4 w-64 glass-card rounded-2xl shadow-xl">
                <SubNavLink onClick={() => openPage("IELTS/PTE", "Unlock your scores.")} icon={<BookOpen size={16}/>} title="Test Prep" desc="Language Classes" />
              </div>
            </NavItem>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => isLoggedIn ? setViewMode('portal') : setIsLoginModalOpen(true)}
              className="hidden md:block bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all"
            >
              {isLoggedIn ? 'Dashboard' : 'Login'}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-900 bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[120] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <span className="font-black tracking-tighter text-xl text-indigo-600">MENU</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="space-y-6">
                    <MobileNavLink label="Home" onClick={() => {setSitePage('home'); setIsMobileMenuOpen(false);}} />
                    <MobileNavLink label="Our Story" onClick={() => openPage("Our Story", "Leading since 2026.")} />
                    <MobileNavLink label="Test Prep" onClick={() => openPage("IELTS/PTE", "Score high with us.")} />
                    <hr/>
                    <button onClick={() => {setIsMobileMenuOpen(false); isLoggedIn ? setViewMode('portal') : setIsLoginModalOpen(true);}} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">
                        {isLoggedIn ? 'Go to Dashboard' : 'Student Login'}
                    </button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-24 px-4">
        <AnimatePresence mode="wait">
          {sitePage === 'home' ? (
            <motion.div key="home">
              <section className="pt-20 md:pt-40 pb-20 text-center max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] uppercase mb-8">Next Era <br/><span className="text-gradient">Education.</span></h1>
                <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-10 px-4">Nepal's premium bridge to global universities. Based in Putalisadak.</p>
                <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-900 text-white px-8 md:px-12 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black text-lg md:text-xl flex items-center gap-3 mx-auto">Start Today <ArrowRight /></button>
              </section>

              <section className="py-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                <StatCard count="98%" label="Visa Success" />
                <StatCard count="500+" label="Partners" />
                <StatCard count="12k" label="Students" />
              </section>
            </motion.div>
          ) : (
            <motion.div key="dummy" className="max-w-4xl mx-auto py-20 px-4">
                <button onClick={() => setSitePage('home')} className="flex items-center gap-2 text-indigo-600 font-black text-xs mb-8"><ArrowLeft size={16}/> Back</button>
                <h2 className="text-5xl md:text-8xl font-black uppercase text-gradient mb-6">{dummyData.title}</h2>
                <p className="text-xl text-slate-500 leading-relaxed">{dummyData.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white py-12 px-6 border-t mt-20 text-center">
        <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em]">© 2026 Next Era Education</p>
      </footer>

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />}
    </div>
  );
}

// --- SUB COMPONENTS ---

const NavItem = ({ label, children, active, onHover }) => (
    <div className="relative" onMouseEnter={onHover}>
        <button className={`flex items-center gap-1 font-bold text-[11px] uppercase tracking-widest ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label} <ChevronDown size={12}/></button>
        <AnimatePresence>{active && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[110]">{children}</motion.div>}</AnimatePresence>
    </div>
);

const SubNavLink = ({ icon, title, desc, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl w-full text-left">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">{icon}</div>
        <div><div className="font-black text-xs text-slate-900">{title}</div><div className="text-[9px] text-slate-400 font-bold uppercase">{desc}</div></div>
    </button>
);

const MobileNavLink = ({ label, onClick }) => (
    <button onClick={onClick} className="block w-full text-left text-2xl font-black tracking-tighter text-slate-900 hover:text-indigo-600 transition-colors uppercase">{label}</button>
);

const StatCard = ({ count, label }) => (
    <div className="bg-white p-10 rounded-[2rem] border border-slate-100 text-center">
        <div className="text-5xl font-black text-indigo-600 mb-1">{count}</div>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</div>
    </div>
);

const LoginModal = ({ onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'sachin@gmail.com' && pass === '12345') onSuccess();
    };
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-2xl font-black mb-6 uppercase">Student Login</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input className="w-full p-4 bg-slate-50 border rounded-xl font-bold" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" className="w-full p-4 bg-slate-50 border rounded-xl font-bold" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
                    <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100">Enter Portal</button>
                </form>
            </motion.div>
        </div>
    );
};