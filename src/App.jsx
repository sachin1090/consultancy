import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient.js';
import LandingPage from './components/LandingPage.jsx';
import StudentPortal from './components/StudentPortal.jsx';
import AdminPortal from './components/AdminPortal.jsx';

// --- Error Boundary to prevent Silent Freezes ---
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, errorMessage: '' }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorMessage: error.message }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center font-sans">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h1 className="text-3xl font-black uppercase text-slate-900 mb-2">Portal Crash Prevented</h1>
          <p className="text-slate-500 font-bold mb-8 max-w-md">{this.state.errorMessage}</p>
          <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.reload(); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-teal-600 transition-colors">
            Clear Cache & Restart
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [authLoading, setAuthLoading] = useState(false); 
  const [showAuth, setShowAuth] = useState(false); 
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [appError, setAppError] = useState(null); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) setAppError(error.message);
      setSession(session);
      if (session) getProfile(session.user.id);
      else setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        getProfile(session.user.id);
      } else { 
        setProfile(null); 
        setLoading(false); 
        if (event === 'SIGNED_OUT') setShowAuth(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const getProfile = async (id) => {
    try {
      setAppError(null);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      
      if (error && error.code === 'PGRST116') {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const newProfile = {
            id: id,
            full_name: userData.user.user_metadata?.full_name || 'Scholar',
            role: 'student',
            status: 'Onboarding',
            email: userData.user.email
          };
          await supabase.from('profiles').insert([newProfile]);
          setProfile(newProfile);
          setLoading(false);
          return;
        }
      } else if (error) {
        throw error;
      }
      
      setProfile(data);
    } catch (err) {
      console.error("Profile Error:", err);
      setAppError("Failed to verify user profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault(); 
    setAuthLoading(true); 
    setAppError(null);
    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({ 
          email: form.email, 
          password: form.password, 
          options: { data: { full_name: form.name, role: 'student', status: 'Onboarding' } } 
        });
        if (error) throw error;
        alert("Registration successful! You can now log in.");
        setAuthMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
      }
    } catch (err) { 
      setAppError(err.message); 
    } finally {
      setAuthLoading(false); 
    }
  };

  const emergencyReset = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.clear(); 
    sessionStorage.clear();
    setProfile(null);
    setSession(null);
    setAppError(null);
    setShowAuth(false);
    setLoading(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-teal-600" size={48} /></div>;

  if (session) {
    if (!profile) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-6 text-center">
          {appError ? (
             <>
               <AlertCircle className="text-red-500 mb-4" size={48} />
               <p className="text-slate-500 font-bold mb-8 max-w-sm">{appError}</p>
             </>
          ) : <Loader2 className="animate-spin text-teal-600 mb-8" size={48} />}
          <button type="button" onClick={emergencyReset} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors shadow-xl">
            Emergency Sign Out
          </button>
        </div>
      );
    }

    if (profile.role === 'admin') return <AdminPortal onLogout={emergencyReset} />;
    if (profile.role === 'suspended') return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-red-50 text-red-500 w-24 h-24 rounded-full flex items-center justify-center mb-8"><AlertCircle size={48} /></div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Account Suspended</h1>
        <button type="button" onClick={emergencyReset} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-600 transition-colors mt-8">Sign Out</button>
      </div>
    );
    
    return <StudentPortal profile={profile} session={session} onLogout={emergencyReset} />;
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative font-sans">
        <button type="button" onClick={() => setShowAuth(false)} className="absolute top-8 left-8 flex items-center gap-2 font-bold text-slate-400 hover:text-slate-900 uppercase text-xs tracking-widest transition-colors z-10">
          <ChevronRight className="rotate-180" size={16}/> Back Home
        </button>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-10 text-center">ACCESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">PORTAL.</span></h1>
        
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-teal-50 relative z-10">
          {appError && <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2"><AlertCircle size={16} className="flex-shrink-0" /> {appError}</div>}

          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            {authMode === 'register' && <input type="text" required placeholder="Full Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-bold" onChange={e => setForm({...form, name: e.target.value})} />}
            <input type="email" required placeholder="Email Address" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-bold" onChange={e => setForm({...form, email: e.target.value})} />
            <input type="password" required placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-bold" onChange={e => setForm({...form, password: e.target.value})} />
            
            <button type="submit" disabled={authLoading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 transition-colors mt-2 flex justify-center items-center h-16">
              {authLoading ? <Loader2 className="animate-spin" size={24} /> : (authMode === 'login' ? 'Secure Login' : 'Create Account')}
            </button>
          </form>
          <p className="text-center font-black text-slate-400 uppercase text-[10px] tracking-widest cursor-pointer hover:text-teal-600" onClick={() => { setAppError(null); setAuthMode(authMode === 'login' ? 'register' : 'login'); }}>{authMode === 'login' ? "New Scholar? Register here" : "Have an account? Sign in"}</p>
        </div>
      </div>
    );
  }

  return <LandingPage onNavigateAuth={() => setShowAuth(true)} />;
}

// Wrap the app before exporting
export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}