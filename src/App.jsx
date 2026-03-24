import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import StudentPortal from './StudentPortal';
import AdminPortal from './AdminPortal';
import { 
  GraduationCap, ArrowRight, Phone, Mail, MapPin, 
  ChevronDown, Users, BookOpen, FileCheck, ArrowLeft, 
  Sparkles, Star, Quote, Menu, X 
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

  // --- INITIALIZE AUTH ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user);
      } else {
        setUserRole(null);
        setViewMode('site');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (user) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setUserRole(data.role); 
      setViewMode(data.role === 'admin' ? 'admin' : 'portal');
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

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <GraduationCap className="text-indigo-600" size={40} />
      </motion.div>
    </div>
  );

  // --- ROUTING ---
  if (session && viewMode === 'portal' && userRole === 'student') {
    return <StudentPortal onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  if (session && viewMode === 'admin' && userRole === 'admin') {
    return <AdminPortal onLogout={handleLogout} onExitToSite={() => setViewMode('site')} />;
  }

  return (
    <div className="bg-[#FBFBFF] font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-10 py-6">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-[2rem] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => setSitePage('home')}>
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
              <GraduationCap size={22}/>
            </div>
            <span>NEXT ERA</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => session ? setViewMode(userRole === 'admin' ? 'admin' : 'portal') : setIsLoginModalOpen(true)}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
            >
              {session ? 'Dashboard' : 'Portal Login'}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        <AnimatePresence mode="wait">
          {sitePage === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="pt-20 pb-20 text-center px-6 max-w-7xl mx-auto">
                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] uppercase mb-12">
                  Global <br/><span className="text-indigo-600">Ambition.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium">
                  The premier 2026 destination for Nepalese students seeking world-class education.
                </p>
                <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-900 text-white px-14 py-8 rounded-[3rem] font-black text-2xl flex items-center gap-4 mx-auto hover:bg-indigo-600 shadow-2xl transition-all">
                  Join the Portal <ArrowRight size={28} />
                </button>
              </section>
            </motion.div>
          ) : (
            <motion.div key="dummy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-40 px-6">
                <button onClick={() => setSitePage('home')} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-10"><ArrowLeft size={16}/> Back Home</button>
                <h2 className="text-7xl font-black mb-10 tracking-tighter uppercase">{dummyData.title}</h2>
                <p className="text-2xl text-slate-500">{dummyData.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* LOGIN MODAL */}
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: 'student' } }
      });
      if (error) alert(error.message);
      else {
        alert("Success! Check your email for verification.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl">
        <h3 className="text-3xl font-black mb-2 text-center uppercase tracking-tighter">
          {isSignUp ? 'Register' : 'Portal Login'}
        </h3>
        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">
          Next Era Education Consultancy
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <input 
              className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" 
              placeholder="Full Name" 
              value={fullName} onChange={e => setFullName(e.target.value)} required 
            />
          )}
          <input 
            className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" 
            placeholder="Email" type="email"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
          <input 
            className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" 
            placeholder="Password" type="password"
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg uppercase shadow-xl disabled:opacity-50">
            {loading ? 'Wait...' : (isSignUp ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">
            {isSignUp ? 'Already a member? Login' : "New student? Register here"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};