import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import StudentPortal from '../../src/StudentPortal';
import AdminPortal from '../../src/AdminPortal';
import { 
  GraduationCap, ArrowRight, Lock, Phone, Mail, MapPin, 
  ChevronDown, Users, BookOpen, ShieldCheck, 
  Globe, PlaneTakeoff, FileCheck, ArrowLeft, Sparkles, Star, Quote, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  // --- AUTH & SESSION STATE ---
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  // --- UI STATE ---
  const [viewMode, setViewMode] = useState('site'); 
  const [sitePage, setSitePage] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dummyData, setDummyData] = useState({ title: '', desc: '' });

  // --- STUDENT DATA STATE ---
  const [studentData, setStudentData] = useState(null);

  // --- INITIALIZE AUTH ---
  useEffect(() => {
    // 1. Check current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user);
      else setLoading(false);
    });

    // 2. Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user);
      } else {
        setUserRole(null);
        setStudentData(null);
        setViewMode('site');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch role and profile data from Supabase 'profiles' table
  const fetchUserProfile = async (user) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setUserRole(data.role); 
      setStudentData(data);
      // Automatically enter portal if logged in
      setViewMode(data.role === 'admin' ? 'admin' : 'portal');
    } else if (error) {
      console.error("Profile fetch error:", error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const openPage = (title, desc) => {
    setDummyData({ title, desc });
    setSitePage('dummy');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- LOADING SCREEN ---
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <GraduationCap className="text-indigo-600" size={40} />
      </motion.div>
    </div>
  );

  // --- ROUTING LOGIC ---
  if (session && viewMode === 'portal' && userRole === 'student') {
    return <StudentPortal studentData={studentData} setStudentData={setStudentData} onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  if (session && viewMode === 'admin' && userRole === 'admin') {
    return <AdminPortal onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  return (
    <div className="bg-[#FBFBFF] font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-10 py-6" onMouseLeave={() => setActiveDropdown(null)}>
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-[2rem] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer group" onClick={() => setSitePage('home')}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-lg group-hover:rotate-6 transition-transform">
              <GraduationCap size={22}/>
            </div>
            <span className="hidden sm:inline">NEXT ERA</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <NavItem label="About Us" active={activeDropdown === 'about'} onHover={() => setActiveDropdown('about')}>
              <div className="p-3 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl">
                  <SubNavLink onClick={() => openPage("Our Heritage", "Leading Nepalese students since 2026.")} icon={<Users size={16}/>} title="Who We Are" desc="Our Vision" />
              </div>
            </NavItem>
            <NavItem label="Services" active={activeDropdown === 'services'} onHover={() => setActiveDropdown('services')}>
              <div className="p-4 w-[450px] grid grid-cols-2 gap-3 bg-white rounded-[2rem] border border-slate-100 shadow-2xl">
                  <SubNavLink onClick={() => openPage("IELTS & PTE", "Digital mock tests and certified trainers.")} icon={<BookOpen size={16}/>} title="Test Prep" desc="Scores for Success" />
                  <SubNavLink onClick={() => openPage("Visa Strategy", "Specialized GTE and SOP guidance.")} icon={<FileCheck size={16}/>} title="Visa Support" desc="98% Success" />
              </div>
            </NavItem>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => session ? setViewMode(userRole === 'admin' ? 'admin' : 'portal') : setIsLoginModalOpen(true)}
              className="bg-slate-900 text-white px-6 md:px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              {session ? 'Dashboard' : 'Member Login'}
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
                    <button onClick={() => openPage("Our Story", "Nepal's premium consultancy.")} className="block text-4xl font-black tracking-tighter uppercase text-slate-900">About</button>
                    <button onClick={() => openPage("Services", "IELTS, Visa & more.")} className="block text-4xl font-black tracking-tighter uppercase text-slate-900">Services</button>
                </div>
                <button onClick={() => {setIsMobileMenuOpen(false); session ? setViewMode('portal') : setIsLoginModalOpen(true);}} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-slate-200">
                    {session ? 'Dashboard' : 'Student Login'}
                </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-32">
        <AnimatePresence mode="wait">
          {sitePage === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
              {/* HERO */}
              <section className="pt-20 md:pt-40 pb-20 text-center px-6 max-w-7xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-50/40 rounded-full blur-[120px] -z-10" />
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-white border border-slate-200 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 text-indigo-600 shadow-sm">
                  <Sparkles size={14} /> The Top Rated Consultancy in Kathmandu 2026
                </motion.div>
                <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] uppercase mb-12">Dream <br/><span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500">Bigger.</span></h1>
                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed px-4">From Putalisadak to the global stage. Join 12,000+ students who achieved their dreams with Next Era.</p>
                <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-900 text-white px-10 md:px-14 py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black text-xl md:text-2xl flex items-center justify-center gap-4 mx-auto hover:bg-indigo-600 shadow-2xl shadow-indigo-100 transition-all">Start Application <ArrowRight size={28} /></button>
              </section>

              {/* BENTO STATS */}
              <section className="py-10 md:py-20 px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                  <StatCard count="98%" label="Visa Success" bg="bg-indigo-600 text-white" />
                  <StatCard count="500+" label="Global Partners" bg="bg-white border text-slate-900" />
                  <StatCard count="12k+" label="Students Placed" bg="bg-white border text-slate-900" colSpan="col-span-2 md:col-span-1" />
              </section>

              <footer className="bg-white pt-24 pb-12 px-8 border-t text-center">
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.6em]">© 2026 Next Era Education Consultancy.</p>
              </footer>

            </motion.div>
          ) : (
            <motion.div key="dummy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto py-40 px-6 min-h-screen">
                <button onClick={() => setSitePage('home')} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-10"><ArrowLeft size={16}/> Back Home</button>
                <h2 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 leading-none">{dummyData.title}</h2>
                <p className="text-2xl text-slate-500 font-medium leading-relaxed italic">{dummyData.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- INTEGRATED LOGIN & REGISTER MODAL --- */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal 
            onClose={() => setIsLoginModalOpen(false)} 
            onSuccess={() => setIsLoginModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- LOGIN MODAL COMPONENT (Connected to Supabase) ---
const LoginModal = ({ onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // REGISTER
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: 'student' } 
        }
      });
      if (error) alert(error.message);
      else {
        alert("Registration successful! Please check your email to verify your account.");
        setIsSignUp(false);
      }
    } else {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="relative bg-white w-full max-w-md p-10 md:p-14 rounded-[3.5rem] shadow-2xl">
        <h3 className="text-3xl font-black mb-2 text-center uppercase tracking-tighter">
          {isSignUp ? 'Create Account' : 'Portal Login'}
        </h3>
        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">
          {isSignUp ? 'Start your global journey' : 'Access your document vault'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <input 
              className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" 
              placeholder="Full Name" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required 
            />
          )}
          <input 
            className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" 
            placeholder="Email Address" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" 
            placeholder="Password" 
            type="password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Register Now' : 'Enter Portal')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Create one"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

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
    <div><div className="font-black text-sm text-slate-900">{title}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{desc}</div></div>
  </button>
);

const StatCard = ({ count, label, bg, colSpan = "" }) => (
  <div className={`p-12 rounded-[2.5rem] md:rounded-[4rem] text-center shadow-2xl transition-transform hover:-translate-y-2 ${bg} ${colSpan}`}>
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