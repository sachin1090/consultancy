import React, { useState } from 'react';
import { 
  User, FileText, Landmark, GraduationCap, BookOpen, 
  CheckCircle, Save, Edit3, LogOut, FileUp, 
  ShieldCheck, LayoutDashboard, Home, Camera, Check, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IMMIGRATION_RULES = {
  Australia: "Subclass 500 Visa. Needs GTE proof and OSHC health cover.",
  USA: "F-1 Student Visa. Requires SEVIS fee and I-20 form.",
  UK: "Student Visa. Requires 70 points, CAS letter, and IELTS.",
  Canada: "Study Permit. Needs LOA and Provincial Attestation (PAL)."
};

export default function StudentPortal({ studentData, setStudentData, onLogout, onExitToSite }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // --- 1. COMPLETION LOGIC ---
  const calculateCompletion = () => {
    let points = 0;
    const totalPoints = 8; // 3 Profile fields + 5 Document slots

    if (studentData.fullName) points++;
    if (studentData.idNumber) points++;
    if (studentData.phone) points++;
    
    // Safety check for docsUploaded object
    const docs = studentData.docsUploaded || {};
    if (docs.passport) points++;
    if (docs.citizenship) points++;
    if (docs.slc) points++;
    if (docs.plusTwo) points++;
    if (docs.ppPhoto) points++;

    return Math.round((points / totalPoints) * 100);
  };

  const completionPercent = calculateCompletion();

  // --- 2. MANDATORY ONBOARDING CHECK ---
  if (!studentData.isProfileComplete) {
    return <OnboardingForm studentData={studentData} setStudentData={setStudentData} />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0F172A] text-white flex flex-col p-8 shrink-0">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center font-black">N</div>
            <h2 className="text-xl font-black tracking-tight uppercase">Next Era</h2>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">Student Portal</p>
        </div>

        {/* PROGRESS METRIC */}
        <div className="mb-10 bg-white/5 p-5 rounded-[1.5rem] border border-white/10">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Application</span>
                <span className="text-sm font-black text-indigo-400">{completionPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercent}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                />
            </div>
        </div>

        <nav className="flex-1 space-y-1">
          <PortalLink icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <PortalLink icon={<User size={18}/>} label="Identity" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <PortalLink icon={<FileText size={18}/>} label="Vault" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
          <PortalLink icon={<BookOpen size={18}/>} label="Global KB" active={activeTab === 'kb'} onClick={() => setActiveTab('kb')} />
        </nav>

        <div className="mt-auto space-y-2 pt-6 border-t border-white/5">
            <button onClick={onExitToSite} className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"><Home size={16}/> View Site</button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-xs text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={16}/> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-12">
        <header className="mb-12 flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Portal</h1>
                <p className="text-slate-500 font-medium tracking-tight">Status for {studentData.fullName}</p>
            </div>
            {completionPercent === 100 && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-black text-[10px] uppercase shadow-sm">
                    <Check size={14}/> Profile 100% Complete
                </div>
            )}
        </header>

        <AnimateContent key={activeTab}>
            {activeTab === 'overview' && <Overview studentData={studentData} percent={completionPercent} setActiveTab={setActiveTab} />}
            {activeTab === 'profile' && <ProfileView studentData={studentData} setStudentData={setStudentData} isEditing={isEditing} setIsEditing={setIsEditing} />}
            {activeTab === 'docs' && <DocumentsView studentData={studentData} setStudentData={setStudentData} />}
            {activeTab === 'kb' && <KnowledgeBase />}
        </AnimateContent>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

const OnboardingForm = ({ studentData, setStudentData }) => {
    const [formData, setFormData] = useState({ ...studentData });
    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-6 z-[300]">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[3.5rem] p-16 shadow-2xl">
                <h2 className="text-4xl font-black mb-10 tracking-tight uppercase text-indigo-600">Profile Setup</h2>
                <form onSubmit={(e) => { e.preventDefault(); setStudentData({ ...formData, isProfileComplete: true }); }} className="grid md:grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Full Name</label>
                        <input required className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" value={formData.fullName || ''} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Citizenship No</label>
                        <input required className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" value={formData.idNumber || ''} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone</label>
                        <input required className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <button className="col-span-2 bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-600 transition-all mt-6 uppercase tracking-widest">Enter Portal</button>
                </form>
            </motion.div>
        </div>
    );
};

const Overview = ({ studentData, percent, setActiveTab }) => (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <h3 className="text-3xl font-bold mb-2">Completion: {percent}%</h3>
          <p className="opacity-80 mb-8 text-lg">
            {percent === 100 ? "Documents submitted. We are reviewing your application." : "Upload your photo and legal scans to reach 100%."}
          </p>
          <button onClick={() => setActiveTab('docs')} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Go to Documents</button>
          <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-20"><ShieldCheck size={250}/></div>
      </div>
      <div className="bg-white border rounded-[3rem] p-10 flex flex-col justify-center items-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              {studentData.docsUploaded?.ppPhoto ? <CheckCircle className="text-green-500"/> : <Camera className="text-slate-300"/>}
          </div>
          <h4 className="font-black text-[10px] uppercase text-slate-400">PP Photo</h4>
          <span className="text-xs font-bold mt-1">{studentData.docsUploaded?.ppPhoto ? 'Uploaded' : 'Missing'}</span>
      </div>
    </div>
);

const ProfileView = ({ studentData, setStudentData, isEditing, setIsEditing }) => {
    const [local, setLocal] = useState({...studentData});
    const handleSave = () => {
        setStudentData(local);
        setIsEditing(false);
    };
    return (
        <div className="bg-white border rounded-[3rem] p-12 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black uppercase">My Profile</h3>
                <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="bg-indigo-50 text-indigo-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
                    {isEditing ? <><Save size={18}/> Save</> : <><Edit3 size={18}/> Edit</>}
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
                <DataField label="Full Legal Name" value={local.fullName} isEditing={isEditing} onChange={v => setLocal({...local, fullName: v})} />
                <DataField label="Citizenship ID" value={local.idNumber} isEditing={isEditing} onChange={v => setLocal({...local, idNumber: v})} />
            </div>
        </div>
    );
};

const DataField = ({ label, value, isEditing, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        {isEditing ? <input className="w-full p-4 bg-slate-50 border rounded-xl outline-indigo-600 font-bold" value={value} onChange={e => onChange(e.target.value)} /> : <p className="text-xl font-bold text-slate-800">{value || '---'}</p>}
    </div>
);

const DocumentsView = ({ studentData, setStudentData }) => {
    const toggleDoc = (docId) => {
        const currentDocs = studentData.docsUploaded || {};
        setStudentData({
            ...studentData,
            docsUploaded: {
                ...currentDocs,
                [docId]: !currentDocs[docId]
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="bg-white border p-12 rounded-[3.5rem] shadow-sm">
                <h4 className="font-black text-xl mb-6 flex items-center gap-3 text-indigo-600 uppercase"><Camera size={24}/> Passport Size Photo</h4>
                <div 
                    onClick={() => toggleDoc('ppPhoto')}
                    className={`border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer ${studentData.docsUploaded?.ppPhoto ? 'border-green-200 bg-green-50' : 'border-slate-100 hover:border-indigo-200 bg-slate-50/50'}`}
                >
                    {studentData.docsUploaded?.ppPhoto ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-2"><Check size={40}/></div>
                            <p className="font-black text-green-700 uppercase text-sm">Photo Captured</p>
                        </div>
                    ) : (
                        <>
                            <FileUp className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="font-bold text-slate-800 uppercase tracking-tight">Upload PP Photo</p>
                        </>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <DocSection title="Legal Vault" icon={<Landmark size={20}/>}>
                    <DocItem label="Passport" active={studentData.docsUploaded?.passport} onToggle={() => toggleDoc('passport')} />
                    <DocItem label="Citizenship ID" active={studentData.docsUploaded?.citizenship} onToggle={() => toggleDoc('citizenship')} />
                </DocSection>
                <DocSection title="Academic Vault" icon={<GraduationCap size={20}/>}>
                    <DocItem label="SLC / SEE Transcript" active={studentData.docsUploaded?.slc} onToggle={() => toggleDoc('slc')} />
                    <DocItem label="+2 / High School" active={studentData.docsUploaded?.plusTwo} onToggle={() => toggleDoc('plusTwo')} />
                </DocSection>
            </div>
        </div>
    );
};

const DocSection = ({ title, icon, children }) => (
    <div className="bg-white border p-10 rounded-[3rem] shadow-sm">
        <h4 className="font-black text-xl mb-8 flex items-center gap-3 text-indigo-600 uppercase tracking-tighter">{icon} {title}</h4>
        {children}
    </div>
);

const DocItem = ({ label, active, onToggle }) => (
    <div onClick={onToggle} className={`flex justify-between items-center p-6 rounded-[1.5rem] mb-3 transition-all cursor-pointer border-2 ${active ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-transparent hover:bg-slate-50 font-bold text-slate-500'}`}>
        <span className={`font-bold text-sm ${active ? 'text-indigo-600' : ''}`}>{label}</span>
        {active ? <CheckCircle size={20} className="text-indigo-600" /> : <FileUp size={20} className="text-slate-300" />}
    </div>
);

const KnowledgeBase = () => (
    <div className="grid md:grid-cols-2 gap-8">
        {Object.entries(IMMIGRATION_RULES).map(([c, r]) => (
            <div key={c} className="bg-white border p-10 rounded-[3rem] shadow-sm">
                <h4 className="font-black text-2xl mb-4 text-indigo-600 uppercase tracking-tight">{c}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{r}</p>
            </div>
        ))}
    </div>
);

const PortalLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-bold text-sm transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{icon} {label}</button>
);

const AnimateContent = ({children}) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>{children}</motion.div>
);