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
      const savedView = localStorage.getItem('viewMode');
      if (savedView) setViewMode(savedView);
    } else { handleLogout(); }
  }, []);

  useEffect(() => {
    localStorage.setItem('next_era_user', JSON.stringify(studentData));
    localStorage.setItem('viewMode', viewMode);
  }, [studentData, viewMode]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); setViewMode('portal'); setIsLoginModalOpen(false);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('session_start', Date.now().toString());
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setViewMode('site'); setSitePage('home');
    localStorage.clear(); window.location.reload();
  };

  const openPage = (title, desc) => {
    setDummyData({ title, desc }); setSitePage('dummy');
    setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoggedIn && viewMode === 'portal') {
    return <StudentPortal studentData={studentData} setStudentData={setStudentData} onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  return (
    <div className="bg-[#FBFBFF] font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-10 py-5 md:py-8" onMouseLeave={() => setActiveDropdown(null)}>
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-100/20 rounded-2xl md:rounded-[2.5rem] px-5 md:px-10 py-3 md:py-5 flex justify-between items-center transition-all">
          <div className="flex items-center gap-3 font-black text-xl md:text-2xl tracking-tighter text-slate-900 cursor-pointer group" onClick={() => setSitePage('home')}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-lg group-hover:rotate-6 transition-transform">
              <GraduationCap size={22}/>
            </div>
            <span>NEXT ERA</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <NavItem label="About Us" active={activeDropdown === 'about'} onHover={() => setActiveDropdown('about')}>
              <div className="p-3 w-64 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white shadow-2xl">
                  <SubNavLink onClick={() => openPage("Our Story", "The hub of global education in Putalisadak.")} icon={<Users className="text-indigo-500"/>} title="Who We Are" desc="Our History" />
              </div>
            </NavItem>
            <NavItem label="Services" active={activeDropdown === 'services'} onHover={() => setActiveDropdown('services')}>
              <div className="p-4 w-[450px] grid grid-cols-2 gap-3 bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white shadow-2xl">
                  <SubNavLink onClick={() => openPage("IELTS & PTE", "Score high with our 2026 curriculum.")} icon={<BookOpen className="text-cyan-500"/>} title="Test Prep" desc="Language Lab" />
                  <SubNavLink onClick={() => openPage("Visa Strategy", "98% visa success rate guaranteed.")} icon={<FileCheck className="text-indigo-500"/>} title="Visa Support" desc="Documentation" />
              </div>
            </NavItem>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => isLoggedIn ? setViewMode('portal') : setIsLoginModalOpen(true)}
              className="hidden md:flex bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              {isLoggedIn ? 'Dashboard' : 'Portal Login'}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-slate-50 border rounded-xl text-slate-900 shadow-sm"><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-2 right-2 bottom-2 w-[85%] bg-white z-[120] rounded-[3rem] p-10 shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-16">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><GraduationCap size={20}/></div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-slate-50 rounded-2xl text-slate-400"><X size={20}/></button>
                </div>
                <div className="space-y-8 flex-1">
                    <button onClick={() => {setSitePage('home'); setIsMobileMenuOpen(false);}} className="block text-4xl font-black tracking-tighter uppercase text-slate-900">Home</button>
                    <button onClick={() => openPage("About Us", "Nepal's premium consultancy.")} className="block text-4xl font-black tracking-tighter uppercase text-slate-900">About</button>
                    <button onClick={() => openPage("Services", "IELTS, Visa & more.")} className="block text-4xl font-black tracking-tighter uppercase text-slate-900">Services</button>
                </div>
                <button onClick={() => {setIsMobileMenuOpen(false); isLoggedIn ? setViewMode('portal') : setIsLoginModalOpen(true);}} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-slate-200">
                    {isLoggedIn ? 'Open Dashboard' : 'Student Login'}
                </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-24">
        <AnimatePresence mode="wait">
          {sitePage === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* HERO */}
              <section className="pt-32 md:pt-48 pb-20 px-6 text-center max-w-7xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-50/40 rounded-full blur-[120px] -z-10" />
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-white border border-slate-200 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 text-indigo-600 shadow-sm">
                  <Sparkles size={14} /> Establish Your Next Era Today
                </motion.div>
                <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] uppercase mb-12">Dream <br/><span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500">Bigger.</span></h1>
                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed px-4">From Putalisadak to the global stage. Premium education consultancy for the scholars of tomorrow.</p>
                <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-900 text-white px-10 md:px-14 py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black text-xl md:text-2xl flex items-center justify-center gap-4 mx-auto hover:bg-indigo-600 shadow-2xl shadow-indigo-100 transition-all">Start Application <ArrowRight size={28} /></button>
              </section>

              {/* BENTO STATS */}
              <section className="py-10 md:py-20 px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                  <StatCard count="98%" label="Visa Success" bg="bg-indigo-600 text-white" />
                  <StatCard count="500+" label="Global Partners" bg="bg-white border text-slate-900" />
                  <StatCard count="12k+" label="Students Placed" bg="bg-white border text-slate-900" colSpan="col-span-2 md:col-span-1" />
              </section>

              {/* TESTIMONIALS (DARK MODE) */}
              <section className="py-32 bg-[#0F172A] text-white rounded-[3rem] md:rounded-[5rem] mx-4 md:mx-10 mb-20 overflow-hidden shadow-2xl">
                <div className="max-w-7xl mx-auto px-10">
                  <h2 className="text-5xl font-black tracking-tighter uppercase mb-20">Student Stories</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <TestimonialCard name="Sachin" location="Sydney, AU" text="The portal made my journey so easy. Highly professional team!" />
                    <TestimonialCard name="Aashma" location="London, UK" text="The best consultancy in Putalisadak. Truly expert documentation." />
                    <TestimonialCard name="Pradip" location="Toronto, CA" text="My Canadian study permit was approved in weeks. 10/10 service." />
                  </div>
                </div>
              </section>

              {/* CORPORATE FOOTER */}
              <footer className="bg-white pt-24 pb-12 px-8 border-t">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-20">
                  <div className="md:col-span-1">
                    <div className="font-black text-3xl mb-6 tracking-tighter text-indigo-600">NEXT ERA</div>
                    <p className="text-slate-500 font-bold text-lg mb-8 italic">"Empowering Scholars. Defining the Future."</p>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"><Phone size={20}/></div>
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"><Mail size={20}/></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8">Headquarters</h4>
                    <p className="text-slate-900 font-black text-lg mb-2">Putalisadak, Kathmandu</p>
                    <p className="text-slate-500 font-bold">Bagmati, Nepal 44600</p>
                  </div>
                  <div className="text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.6em] md:col-span-3 border-t pt-10">© 2026 Next Era Education</div>
                </div>
              </footer>
            </motion.div>
          ) : (
            <motion.div key="dummy" className="max-w-4xl mx-auto py-40 px-6 min-h-screen">
                <button onClick={() => setSitePage('home')} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-10"><ArrowLeft size={16}/> Back Home</button>
                <h2 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 leading-none">{dummyData.title}</h2>
                <p className="text-2xl text-slate-500 font-medium leading-relaxed italic">{dummyData.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />}
    </div>
  );
}

// --- SUB-COMPONENTS ---
const NavItem = ({ label, children, active, onHover }) => (
  <div className="relative" onMouseEnter={onHover}>
    <button className={`flex items-center gap-1.5 font-black text-[11px] uppercase tracking-widest transition-all ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>{label} <ChevronDown size={14} /></button>
    <AnimatePresence>{active && <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[110]">{children}</motion.div>}</AnimatePresence>
  </div>
);

const SubNavLink = ({ icon, title, desc, onClick }) => (
  <button onClick={onClick} className="flex items-start gap-4 p-4 hover:bg-indigo-50/50 rounded-[1.5rem] transition-all text-left w-full group">
    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">{icon}</div>
    <div><div className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{desc}</div></div>
  </button>
);

const StatCard = ({ count, label, bg, colSpan = "" }) => (
  <div className={`p-12 rounded-[2.5rem] md:rounded-[4rem] text-center shadow-2xl shadow-indigo-100/20 transition-transform hover:-translate-y-2 ${bg} ${colSpan}`}>
    <div className="text-5xl md:text-7xl font-black mb-2 tracking-tighter">{count}</div>
    <div className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">{label}</div>
  </div>
);

const TestimonialCard = ({ name, location, text }) => (
  <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] relative">
    <Quote className="absolute top-8 right-8 text-indigo-500/10" size={60} />
    <div className="flex gap-1 text-orange-400 mb-6"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
    <p className="text-lg text-slate-300 font-medium italic mb-8">"{text}"</p>
    <div className="font-black text-white">{name}</div>
    <div className="text-xs font-black uppercase text-indigo-400 tracking-widest">{location}</div>
  </div>
);

const LoginModal = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'sachin@gmail.com' && pass === '12345') onSuccess();
    else setError('Invalid Credentials (sachin@gmail.com / 12345)');
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="relative bg-white w-full max-w-md p-10 md:p-14 rounded-[3.5rem] shadow-2xl">
        <h3 className="text-3xl font-black mb-10 tracking-tight text-center uppercase">Portal Login</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full p-5 bg-slate-50 border rounded-2xl font-bold" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full p-5 bg-slate-50 border rounded-2xl font-bold" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
          <button className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100">Enter Dashboard</button>
        </form>
      </motion.div>
    </div>
  );
};