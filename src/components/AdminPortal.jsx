import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Eye, X, ExternalLink, RefreshCw, UserX, UserCheck, Calendar } from 'lucide-react';
import { supabase } from '../supabaseClient.js';
import { DOC_CATEGORIES, PROCESS_STEPS } from '../constants.js';

export default function AdminPortal({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);
  const [docs, setDocs] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    fetchStudents(); 
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['student', 'suspended'])
      .order('created_at', { ascending: false });
    
    if (data) setStudents(data);
    setLoading(false);
  };

  const openReview = async (student) => {
    setActiveStudent(student);
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('student_id', student.id);
      
    setDocs(data || []);
  };

  const updateStudentStatus = async (newStatus) => {
    setIsUpdating(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', activeStudent.id);
      
    if (error) {
      alert("Database Error: " + error.message);
      setIsUpdating(false);
      return; 
    }
    
    setActiveStudent({ ...activeStudent, status: newStatus });
    setStudents(students.map(s => s.id === activeStudent.id ? { ...s, status: newStatus } : s));
    setIsUpdating(false);
  };

  const toggleDeauthorize = async () => {
    const isCurrentlySuspended = activeStudent.role === 'suspended';
    const action = isCurrentlySuspended ? 'Reauthorize' : 'Deauthorize';
    
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this student?`)) return;
    
    setIsUpdating(true);
    const newRole = isCurrentlySuspended ? 'student' : 'suspended';
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', activeStudent.id);
      
    if (error) {
      alert("Database Error: " + error.message);
      setIsUpdating(false);
      return;
    }
    
    setActiveStudent({ ...activeStudent, role: newRole });
    setStudents(students.map(s => s.id === activeStudent.id ? { ...s, role: newRole } : s));
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 relative font-sans">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-teal-600/20">S</div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Admin Hub</h1>
            <p className="text-teal-600 font-black text-[10px] uppercase tracking-widest mt-1">Sephora Intl Education</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchStudents} className="p-4 bg-white border border-slate-100 text-slate-500 rounded-2xl hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={onLogout} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={20}/>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">No students registered yet.</div>
        )}
        
        {students.map(s => (
          <div key={s.id} className={`bg-white p-8 rounded-[2rem] border transition-all flex flex-col shadow-sm ${s.role === 'suspended' ? 'border-red-200 bg-red-50/30 opacity-75' : 'border-slate-100'}`}>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xl font-black text-slate-900 truncate">{s.full_name}</h3>
              {s.role === 'suspended' && <span className="bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Suspended</span>}
            </div>
            <p className="text-slate-400 font-bold text-xs mb-4">{s.email}</p>
            <div className="mb-6 inline-flex self-start px-3 py-1 bg-teal-50 text-teal-700 rounded-md text-[10px] font-black uppercase tracking-widest">
              {s.status || 'Onboarding'}
            </div>
            <button onClick={() => openReview(s)} className="mt-auto w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-600 transition-colors flex justify-center items-center gap-2">
              <Eye size={16}/> Review Profile
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveStudent(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-[110] p-8 overflow-y-auto flex flex-col">
              
              <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">{activeStudent.full_name}</h2>
                  <p className="text-slate-400 text-sm font-bold mt-1">{activeStudent.email}</p>
                  <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Calendar size={14} /> Joined: {new Date(activeStudent.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button onClick={() => setActiveStudent(null)} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"><X size={20}/></button>
              </div>

              {/* Progress Visualizer */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl mb-8">
                <h4 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-6">Current Progress</h4>
                <div className="relative">
                  <div className="absolute top-2 left-0 w-full h-1 bg-slate-800 rounded-full" />
                  <div className="absolute top-2 left-0 h-1 bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${(Math.max(0, PROCESS_STEPS.indexOf(activeStudent.status || 'Onboarding')) / (PROCESS_STEPS.length - 1)) * 100}%` }} />
                  
                  <div className="flex justify-between relative z-10 overflow-x-auto pb-4 no-scrollbar">
                    {PROCESS_STEPS.map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-3 min-w-[60px]">
                        <div className={`w-5 h-5 rounded-full border-4 flex-shrink-0 transition-colors ${idx <= PROCESS_STEPS.indexOf(activeStudent.status || 'Onboarding') ? 'bg-teal-500 border-slate-900 ring-2 ring-teal-500' : 'bg-slate-800 border-slate-900'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-center leading-tight">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Updater */}
              <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Update Process Stage</h4>
                <select 
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:border-teal-600 transition-colors cursor-pointer"
                  value={activeStudent.status || 'Onboarding'}
                  onChange={(e) => updateStudentStatus(e.target.value)}
                  disabled={isUpdating || activeStudent.role === 'suspended'}
                >
                  {PROCESS_STEPS.map(step => (
                    <option key={step} value={step}>{step}</option>
                  ))}
                </select>
              </div>

              {/* Document Review List */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uploaded Documents</h4>
                  <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{docs.length} / {DOC_CATEGORIES.length}</span>
                </div>
                
                {docs.length > 0 ? docs.map(d => {
                  const categoryInfo = DOC_CATEGORIES.find(c => c.id === d.category);
                  const publicUrl = supabase.storage.from('student-docs').getPublicUrl(d.file_path).data.publicUrl;
                  
                  return (
                    <div key={d.id} className="p-5 bg-white rounded-2xl flex justify-between items-center mb-3 border border-slate-100 shadow-sm">
                      <div className="pr-4 overflow-hidden">
                        <p className="font-black text-teal-600 text-[10px] uppercase tracking-widest mb-1">{categoryInfo ? categoryInfo.name : d.category}</p>
                        <p className="text-xs text-slate-900 font-bold truncate">{d.file_name}</p>
                      </div>
                      <a href={publicUrl} target="_blank" rel="noreferrer" className="flex-shrink-0 bg-slate-50 p-3 rounded-xl text-slate-600 hover:bg-teal-600 hover:text-white transition-colors" title="View Document">
                        <ExternalLink size={18}/>
                      </a>
                    </div>
                  );
                }) : (
                  <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold text-sm">No documents uploaded yet.</p>
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              <div className="mt-auto pt-8 border-t border-red-100">
                 <button 
                  onClick={toggleDeauthorize}
                  disabled={isUpdating}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-2 ${activeStudent.role === 'suspended' ? 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                 >
                   {activeStudent.role === 'suspended' ? <><UserCheck size={16}/> Reauthorize Student</> : <><UserX size={16}/> Deauthorize Student</>}
                 </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}