import React, { useState } from 'react';
import { 
  User, FileText, Landmark, GraduationCap, BookOpen, 
  CheckCircle, Save, Edit3, LogOut, FileUp, 
  ShieldCheck, LayoutDashboard, Home, Camera, Check, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IMMIGRATION_RULES = {
  Australia: "Subclass 500 Visa. Needs GTE proof.",
  USA: "F-1 Student Visa. Requires I-20.",
  UK: "Student Visa. Needs CAS letter.",
  Canada: "Study Permit. Needs LOA."
};

export default function StudentPortal({ studentData, setStudentData, onLogout, onExitToSite }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const calculateCompletion = () => {
    let points = 0;
    const totalPoints = 8;
    if (studentData.fullName) points++;
    if (studentData.idNumber) points++;
    if (studentData.phone) points++;
    const docs = studentData.docsUploaded || {};
    if (docs.passport) points++;
    if (docs.citizenship) points++;
    if (docs.slc) points++;
    if (docs.plusTwo) points++;
    if (docs.ppPhoto) points++;
    return Math.round((points / totalPoints) * 100);
  };

  const completionPercent = calculateCompletion();

  if (!studentData.isProfileComplete) {
    return <OnboardingForm studentData={studentData} setStudentData={setStudentData} />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden relative">
      
      {/* MOBILE SIDEBAR TOGGLE BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl"
      >
        <Menu size={24} />
      </button>

      {/* SIDEBAR (Desktop & Mobile Drawer) */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth > 1024) && (
          <>
            {/* Dark Overlay for Mobile */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed lg:relative top-0 left-0 h-full w-72 bg-[#0F172A] text-white flex flex-col p-8 z-[120] lg:z-10 lg:translate-x-0 transition-none`}
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black">N</div>
                    <h2 className="text-xl font-black uppercase">Next Era</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 bg-white/10 rounded-lg"><X size={18}/></button>
              </div>

              <div className="mb-10 bg-white/5 p-5 rounded-2xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-indigo-400 mb-1">{completionPercent}%</div>
                  <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-3">Progress</div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${completionPercent}%` }} />
                  </div>
              </div>

              <nav className="flex-1 space-y-1">
                <PortalLink label="Overview" active={activeTab === 'overview'} onClick={() => {setActiveTab('overview'); setIsSidebarOpen(false);}} />
                <PortalLink label="Profile" active={activeTab === 'profile'} onClick={() => {setActiveTab('profile'); setIsSidebarOpen(false);}} />
                <PortalLink label="Documents" active={activeTab === 'docs'} onClick={() => {setActiveTab('docs'); setIsSidebarOpen(false);}} />
              </nav>

              <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
                  <button onClick={onExitToSite} className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition-all"><Home size={16}/> View Site</button>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-xs text-red-400 transition-all"><LogOut size={16}/> Logout</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 uppercase">Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium">Scholar: {studentData.fullName || 'New Student'}</p>
        </header>

        <div className="max-w-4xl">
            {activeTab === 'overview' && <Overview percent={completionPercent} setActiveTab={setActiveTab} />}
            {activeTab === 'profile' && <ProfileView studentData={studentData} setStudentData={setStudentData} isEditing={isEditing} setIsEditing={setIsEditing} />}
            {activeTab === 'docs' && <DocumentsView studentData={studentData} setStudentData={setStudentData} />}
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

const PortalLink = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`w-full text-left p-4 rounded-xl font-bold text-sm transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>{label}</button>
);

const Overview = ({ percent, setActiveTab }) => (
    <div className="space-y-6">
      <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <h3 className="text-3xl font-bold mb-2">{percent}% Ready</h3>
          <p className="opacity-80 mb-6 text-sm md:text-lg">Finish your document vault to start processing.</p>
          <button onClick={() => setActiveTab('docs')} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-xs uppercase">Go to Vault</button>
          <div className="absolute top-1/2 -right-10 opacity-10 hidden md:block"><ShieldCheck size={200}/></div>
      </div>
    </div>
);

const ProfileView = ({ studentData, setStudentData, isEditing, setIsEditing }) => {
    const [local, setLocal] = useState({...studentData});
    return (
        <div className="bg-white border rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight">Profile</h3>
                <button onClick={() => isEditing ? (setStudentData(local), setIsEditing(false)) : setIsEditing(true)} className="text-indigo-600 font-bold text-sm underline">
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="space-y-6">
                <div><label className="text-[10px] font-black text-slate-400 uppercase">Name</label>
                {isEditing ? <input className="w-full p-3 bg-slate-50 border rounded-xl" value={local.fullName} onChange={e => setLocal({...local, fullName: e.target.value})} /> : <p className="font-bold">{studentData.fullName}</p>}</div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase">ID No</label>
                {isEditing ? <input className="w-full p-3 bg-slate-50 border rounded-xl" value={local.idNumber} onChange={e => setLocal({...local, idNumber: e.target.value})} /> : <p className="font-bold">{studentData.idNumber}</p>}</div>
            </div>
        </div>
    );
};

const DocumentsView = ({ studentData, setStudentData }) => {
    const toggleDoc = (id) => {
        const docs = studentData.docsUploaded || {};
        setStudentData({...studentData, docsUploaded: {...docs, [id]: !docs[id]}});
    };
    return (
        <div className="space-y-4">
            <h4 className="font-black text-indigo-600 uppercase text-xs mb-4">Document Vault</h4>
            {['passport', 'citizenship', 'slc', 'plusTwo', 'ppPhoto'].map(id => (
                <div key={id} onClick={() => toggleDoc(id)} className={`p-5 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all ${studentData.docsUploaded?.[id] ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-transparent'}`}>
                    <span className="font-bold text-sm uppercase">{id}</span>
                    {studentData.docsUploaded?.[id] ? <CheckCircle className="text-indigo-600" size={20}/> : <FileUp className="text-slate-300" size={20}/>}
                </div>
            ))}
        </div>
    );
};

const OnboardingForm = ({ studentData, setStudentData }) => {
    const [formData, setFormData] = useState({ ...studentData });
    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-[300]">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center">
                <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Setup Profile</h2>
                <form onSubmit={(e) => { e.preventDefault(); setStudentData({ ...formData, isProfileComplete: true }); }} className="space-y-4">
                    <input required className="w-full p-4 bg-slate-50 border rounded-xl font-bold" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    <input required className="w-full p-4 bg-slate-50 border rounded-xl font-bold" placeholder="ID Number" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest">Complete</button>
                </form>
            </div>
        </div>
    );
};