import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, LayoutDashboard, LogOut, Menu, X, ExternalLink, Plane } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { supabase } from '../supabaseClient.js';
import { DOC_CATEGORIES, PROCESS_STEPS } from '../constants.js';

export default function StudentPortal({ profile, session, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(profile?.status || 'Onboarding');
  
  // Gets the exact screen size for the confetti drop
  const { width, height } = useWindowSize(); 

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const { data: pData } = await supabase.from('profiles').select('status').eq('id', session.user.id).single();
      const currentStatus = pData?.status || profile?.status || 'Onboarding';
      setLocalStatus(currentStatus);

      const { data: dData } = await supabase.from('documents').select('*').eq('student_id', session.user.id);
      if (dData) {
        setDocs(dData);
        checkAndAutoUpdateStatus(dData, currentStatus);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  const checkAndAutoUpdateStatus = async (uploadedDocs, currentStatus) => {
    if (uploadedDocs.length >= DOC_CATEGORIES.length) {
      const currentIndex = PROCESS_STEPS.indexOf(currentStatus);
      if (currentIndex < 2) {
        const newStatus = 'Docs Complete - Awaiting IELTS';
        await supabase.from('profiles').update({ status: newStatus }).eq('id', session.user.id);
        setLocalStatus(newStatus);
      }
    }
  };

  const handleUpload = async (e, catId) => {
    try {
      setUploading(catId);
      const file = e.target.files[0];
      const path = `${session.user.id}/${catId}_${Date.now()}.${file.name.split('.').pop()}`;
      
      await supabase.storage.from('student-docs').upload(path, file);
      
      await supabase.from('documents').upsert({
        student_id: session.user.id, 
        file_name: file.name, 
        file_path: path, 
        category: catId, 
        status: 'Pending'
      });
      
      fetchData();
    } catch (err) { 
      alert(err.message); 
    } finally { 
      setUploading(null); 
    }
  };

  const safeName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Scholar';
  const currentStatusIndex = Math.max(0, PROCESS_STEPS.indexOf(localStatus));
  const completionPercent = Math.round(((docs?.length || 0) / DOC_CATEGORIES.length) * 100);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* --- CONFETTI DROPPER (Only triggers at exactly 100%) --- */}
      {completionPercent === 100 && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#14b8a6', '#34d399', '#0f766e', '#ffffff']} />
        </div>
      )}

      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth > 1024) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed lg:relative top-0 left-0 h-full w-[85%] max-w-[300px] bg-[#0F172A] text-white p-8 flex flex-col z-[120] lg:z-10 lg:translate-x-0 transition-none shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-teal-500/20">S</div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-black uppercase tracking-tight leading-none text-white">Sephora</h2>
                    <span className="text-[8px] font-black uppercase tracking-widest text-teal-400 mt-1">Intl Education</span>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/10 rounded-xl"><X size={20}/></button>
              </div>

              <nav className="flex-1 space-y-2">
                <button onClick={() => {setActiveTab('overview'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-teal-600 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <LayoutDashboard size={20}/> Overview
                </button>
                <button onClick={() => {setActiveTab('vault'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'vault' ? 'bg-teal-600 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <FileText size={20}/> Document Vault
                </button>
              </nav>
              <div className="mt-auto pt-6 border-t border-white/5">
                <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18}/> Sign Out</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Welcome, {safeName}</h1>
          <p className="text-teal-600 font-black text-xs uppercase mt-2 tracking-widest">Status: {localStatus}</p>
        </header>

        {activeTab === 'overview' && (
          <div className="max-w-4xl space-y-8">
            
            {/* --- GOLDEN BOARDING PASS (Shows only if Visa Approved) --- */}
            {localStatus === 'Visa Approved' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-teal-600 to-emerald-500 p-1 rounded-[2.5rem] mb-8 shadow-2xl shadow-teal-600/30">
                <div className="bg-white rounded-[2.4rem] p-8 flex items-center justify-between border-dashed border-2 border-transparent relative overflow-hidden">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full"></div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full"></div>
                  
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-500 mb-1">Status: Cleared for Takeoff</p>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">VISA APPROVED</h3>
                    <p className="text-slate-500 font-bold text-sm mt-2">Pack your bags, {safeName}. Your global future awaits!</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <Plane size={48} className="text-teal-100 rotate-45 mb-2 inline-block"/>
                    <div className="flex gap-1 justify-end">
                      {[1,2,4,1,3,2,1,5,1,2].map((w, i) => (
                        <div key={i} className="bg-slate-900 h-8 rounded-sm opacity-10" style={{ width: `${w * 4}px` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
                <h3 className="text-2xl font-black mb-3 tracking-tight uppercase">Application Progress</h3>
                <p className="text-slate-400 text-sm mb-8 max-w-sm font-medium">
                  {completionPercent === 100 
                    ? "All documents received! Our team is reviewing your profile for the next steps." 
                    : "Complete your document uploads so our experts can move your application forward."}
                </p>
                
                <div className="relative pt-8">
                  <div className="absolute top-10 left-0 w-full h-1 bg-slate-800 rounded-full" />
                  
                  {/* --- AIRPLANE PROGRESS TRACKER --- */}
                  <div className="absolute top-10 left-0 h-1 bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${(currentStatusIndex / (PROCESS_STEPS.length - 1)) * 100}%` }}>
                    <div className="absolute -right-3 -top-3 bg-white p-1.5 rounded-full shadow-lg text-teal-600 z-20">
                      <Plane size={14} className="rotate-45" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between relative z-10">
                    {PROCESS_STEPS.map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-4 transition-colors ${idx <= currentStatusIndex ? 'bg-teal-500 border-slate-900 ring-2 ring-teal-500' : 'bg-slate-800 border-slate-900'}`} />
                        <span className="hidden md:block text-[9px] font-black uppercase tracking-widest text-slate-500 w-20 text-center">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Docs Vault</p>
                  <p className="text-3xl font-black text-slate-900">{completionPercent}%</p>
                </div>
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600"><FileText/></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="max-w-6xl">
             <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Document Checklist</h2>
                <p className="text-sm font-bold text-slate-400">Securely upload your requirements.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {DOC_CATEGORIES.map((cat) => {
                const file = docs.find(d => d.category === cat.id);
                
                return (
                  /* --- FLOATING HOVER PHYSICS --- */
                  <motion.div 
                    key={cat.id} 
                    whileHover={{ y: -8, scale: 1.02 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-8 rounded-[2rem] border-2 transition-colors flex flex-col h-full cursor-default ${file ? 'bg-teal-50/50 border-teal-200 shadow-md shadow-teal-900/5' : 'bg-white border-slate-100 shadow-sm'}`}
                  >
                    <div className="flex justify-between mb-6">
                      <div className={`p-3 rounded-xl ${file ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}><cat.icon size={24} /></div>
                      {file && <CheckCircle className="text-teal-600" size={24} />}
                    </div>
                    
                    <h3 className="font-black text-slate-900 text-lg mb-1">{cat.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mb-6 flex-grow">{cat.desc}</p>
                    
                    {file && (
                      <a href={supabase.storage.from('student-docs').getPublicUrl(file.file_path).data.publicUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-teal-600 text-[10px] uppercase tracking-widest font-black mb-4 hover:underline">
                        <ExternalLink size={14}/> View Uploaded File
                      </a>
                    )}

                    <input type="file" id={cat.id} hidden onChange={(e) => handleUpload(e, cat.id)} />
                    <label htmlFor={cat.id} className={`block w-full text-center py-4 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer transition-all ${file ? 'bg-white text-teal-600 border border-teal-200 hover:bg-teal-50' : 'bg-slate-900 text-white hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-900/20'}`}>
                      {uploading === cat.id ? 'Uploading...' : file ? 'Replace File' : 'Upload Securely'}
                    </label>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}