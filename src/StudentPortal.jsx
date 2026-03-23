import React, { useState } from 'react';
import { 
  User, FileText, Landmark, GraduationCap, BookOpen, 
  CheckCircle, Save, Edit3, LogOut, FileUp, 
  ShieldCheck, LayoutDashboard, Home, Camera, Check, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentPortal({ studentData, setStudentData, onLogout, onExitToSite }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const calculateCompletion = () => {
    let points = 0; const totalPoints = 8;
    if (studentData.fullName) points++; if (studentData.idNumber) points++; if (studentData.phone) points++;
    const docs = studentData.docsUploaded || {};
    if (docs.passport) points++; if (docs.citizenship) points++;
    if (docs.slc) points++; if (docs.plusTwo) points++; if (docs.ppPhoto) points++;
    return Math.round((points / totalPoints) * 100);
  };

  const completionPercent = calculateCompletion();

  if (!studentData.isProfileComplete) {
    return <OnboardingForm studentData={studentData} setStudentData={setStudentData} />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden relative">
      
      {/* MOBILE FAB BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-10 right-8 z-[100] w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white active:scale-95 transition-transform"
      >
        <LayoutDashboard size={24} />
      </button>

      {/* SIDEBAR (Desktop Fixed, Mobile Drawer) */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth > 1024) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]" />
            <motion.aside 
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                className="fixed lg:relative top-0 left-0 h-full w-[85%] max-w-[320px] bg-[#0F172A] text-white p-10 flex flex-col z-[120] lg:z-10 lg:translate-x-0 transition-none"
            >
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black">N</div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Next Era</h2>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-3 bg-white/10 rounded-2xl"><X size={20}/></button>
                </div>

                <div className="mb-12 bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center">
                    <div className="text-5xl font-black text-indigo-400 mb-2 tracking-tighter">{completionPercent}%</div>
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-5">Profile Ready</div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${completionPercent}%` }} />
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <PortalLink label="Overview" active={activeTab === 'overview'} onClick={() => {setActiveTab('overview'); setIsSidebarOpen(false);}} icon={<LayoutDashboard size={20}/>} />
                    <PortalLink label="Identity" active={activeTab === 'profile'} onClick={() => {setActiveTab('profile'); setIsSidebarOpen(false);}} icon={<User size={20}/>} />
                    <PortalLink label="Document Vault" active={activeTab === 'docs'} onClick={() => {setActiveTab('docs'); setIsSidebarOpen(false);}} icon={<FileText size={20}/>} />
                </nav>

                <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
                    <button onClick={onExitToSite} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm text-slate-400 hover:text-white transition-all"><Home size={18}/> View Site</button>
                    <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18}/> Sign Out</button>
                </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto p-6 md:p-14">
        <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Dashboard</h1>
            <p className="text-slate-500 font-bold text-xs uppercase mt-3 tracking-widest">Scholar: {studentData.fullName}</p>
        </header>

        <div className="max-w-4xl space-y-8">
            {activeTab === 'overview' && (
                <div className="bg-indigo-600 rounded-[3rem] p-10 md:p-14 text-white relative shadow-2xl overflow-hidden">
                    <h3 className="text-4xl font-black mb-4 tracking-tight uppercase leading-none">Status: <br/>{completionPercent === 100 ? 'Application Ready' : 'Incomplete'}</h3>
                    <p className="text-indigo-100 text-lg mb-10 leading-relaxed max-w-sm">
                        {completionPercent === 100 ? "Our documentation experts are now reviewing your profile for university submission." : "Please finish uploading your PP photo and transcripts to unlock processing."}
                    </p>
                    <button onClick={() => setActiveTab('docs')} className="w-full md:w-auto bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Complete Now</button>
                    <ShieldCheck className="absolute -right-10 bottom-0 opacity-10 hidden md:block" size={300} />
                </div>
            )}

            {activeTab === 'profile' && <ProfileView studentData={studentData} setStudentData={setStudentData} isEditing={isEditing} setIsEditing={setIsEditing} />}
            {activeTab === 'docs' && <MobileDocView studentData={studentData} setStudentData={setStudentData} />}
        </div>
      </main>
    </div>
  );
}

const PortalLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        {icon} {label}
    </button>
);

const ProfileView = ({ studentData, setStudentData, isEditing, setIsEditing }) => {
    const [local, setLocal] = useState({...studentData});
    return (
        <div className="bg-white border rounded-[3rem] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tight">Identity Details</h3>
                <button onClick={() => isEditing ? (setStudentData(local), setIsEditing(false)) : setIsEditing(true)} className="text-indigo-600 font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>
            <div className="space-y-8">
                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Legal Full Name</label>
                {isEditing ? <input className="w-full p-5 bg-slate-50 border rounded-2xl font-bold" value={local.fullName} onChange={e => setLocal({...local, fullName: e.target.value})} /> : <p className="text-xl font-black text-slate-800">{studentData.fullName}</p>}</div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Citizenship ID</label>
                {isEditing ? <input className="w-full p-5 bg-slate-50 border rounded-2xl font-bold" value={local.idNumber} onChange={e => setLocal({...local, idNumber: e.target.value})} /> : <p className="text-xl font-black text-slate-800">{studentData.idNumber}</p>}</div>
            </div>
        </div>
    );
};

const MobileDocView = ({ studentData, setStudentData }) => {
    const toggleDoc = (id) => {
        const docs = studentData.docsUploaded || {};
        setStudentData({...studentData, docsUploaded: {...docs, [id]: !docs[id]}});
    };
    return (
        <div className="space-y-4">
            <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-400 ml-5">Document Vault</h4>
            {['passport', 'citizenship', 'slc', 'plusTwo', 'ppPhoto'].map(id => (
                <motion.div 
                    key={id} whileTap={{ scale: 0.98 }} onClick={() => toggleDoc(id)} 
                    className={`p-7 rounded-[2.5rem] border-2 transition-all flex justify-between items-center cursor-pointer ${studentData.docsUploaded?.[id] ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${studentData.docsUploaded?.[id] ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                            {id === 'ppPhoto' ? <Camera size={22}/> : (studentData.docsUploaded?.[id] ? <Check size={22}/> : <FileUp size={22}/>)}
                        </div>
                        <div>
                            <div className="font-black text-slate-900 uppercase text-sm tracking-tight">{id.replace(/([A-Z])/g, ' $1')}</div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${studentData.docsUploaded?.[id] ? 'text-indigo-600' : 'text-slate-300'}`}>
                                {studentData.docsUploaded?.[id] ? 'Captured' : 'Awaiting Upload'}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const OnboardingForm = ({ studentData, setStudentData }) => {
    const [formData, setFormData] = useState({ ...studentData });
    return (
        <div className="fixed inset-0 bg-[#0F172A] flex items-center justify-center p-6 z-[300]">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <h2 className="text-4xl font-black mb-10 tracking-tighter uppercase text-slate-900">Setup Account</h2>
                <form onSubmit={(e) => { e.preventDefault(); setStudentData({ ...formData, isProfileComplete: true }); }} className="space-y-6">
                    <input required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold outline-indigo-600" placeholder="Full Legal Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    <input required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold outline-indigo-600" placeholder="Citizenship No." value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                    <button className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black uppercase text-sm tracking-widest shadow-2xl">Complete Profile</button>
                </form>
            </motion.div>
        </div>
    );
};