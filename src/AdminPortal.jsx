import React, { useState } from 'react';
import { 
  Users, CheckCircle, Clock, Search, LogOut, Home, 
  ChevronRight, LayoutDashboard, FileText, Settings, ShieldAlert,
  Download, Filter, ArrowUpRight, Menu, X, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_STUDENTS = [
    { id: 1, name: 'Sachin', email: 'sachin@gmail.com', phone: '98412233XX', progress: 62, status: 'Processing', country: 'Australia', docs: { pp: true, passport: true, citizenship: false, academic: true } },
    { id: 2, name: 'Aashma K.', email: 'aashma@gmail.com', phone: '98014455XX', progress: 100, status: 'Verified', country: 'UK', docs: { pp: true, passport: true, citizenship: true, academic: true } },
    { id: 3, name: 'Pradip Shrestha', email: 'pradip@gmail.com', phone: '98516677XX', progress: 40, status: 'Pending', country: 'Canada', docs: { pp: true, passport: false, citizenship: false, academic: true } },
    { id: 4, name: 'Rohan Thapa', email: 'rohan@gmail.com', phone: '98129988XX', progress: 12, status: 'Pending', country: 'USA', docs: { pp: false, passport: false, citizenship: false, academic: false } },
    { id: 5, name: 'Sita Maya', email: 'sita@gmail.com', phone: '98491122XX', progress: 85, status: 'Review', country: 'Australia', docs: { pp: true, passport: true, citizenship: true, academic: false } },
];

export default function AdminPortal({ onLogout, onExitToSite }) {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredStudents = DUMMY_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden relative">
      
      {/* --- MOBILE SIDEBAR TOGGLE (FAB) --- */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 z-[150] w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white active:scale-90 transition-transform"
      >
        <Menu size={24} />
      </button>

      {/* --- SIDEBAR (Desktop & Mobile Drawer) --- */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth > 1024) && (
          <>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110]" 
            />
            <motion.aside 
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                className="fixed lg:relative top-0 left-0 h-full w-[85%] max-w-[300px] bg-[#0F172A] text-white p-8 flex flex-col z-[120] lg:z-10 lg:translate-x-0 transition-none shadow-2xl"
            >
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 p-2 rounded-xl text-white font-black uppercase text-xs">Admin</div>
                        <h2 className="text-xl font-black tracking-tighter uppercase">ERA HUB</h2>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/10 rounded-xl"><X size={20}/></button>
                </div>

                <nav className="flex-1 space-y-2">
                    <AdminLink icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab === 'dash'} onClick={() => {setActiveTab('dash'); setIsSidebarOpen(false);}} />
                    <AdminLink icon={<Users size={18}/>} label="Student List" active={activeTab === 'students'} onClick={() => {setActiveTab('students'); setIsSidebarOpen(false);}} />
                    <AdminLink icon={<ShieldAlert size={18}/>} label="Visa Alerts" active={activeTab === 'visa'} onClick={() => {setActiveTab('visa'); setIsSidebarOpen(false);}} />
                </nav>

                <div className="mt-auto pt-10 border-t border-white/5 space-y-3">
                    <button onClick={onExitToSite} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-xs text-slate-400 hover:text-white transition-all"><Home size={18}/> Public Site</button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-xs text-red-400 hover:bg-red-400/10 transition-all"><LogOut size={18}/> Log Out</button>
                </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN ADMIN AREA --- */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        
        {/* RESPONSIVE HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Management</h1>
                <p className="text-slate-500 font-bold text-[10px] uppercase mt-2 tracking-widest">Putalisadak HQ Control</p>
            </div>
            <button className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase text-slate-600 shadow-sm hover:shadow-md transition-all">
                <Download size={16}/> Export List
            </button>
        </header>

        {/* RESPONSIVE STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            <StatBox label="Total" count="1.2k" icon={<Users className="text-indigo-600"/>} />
            <StatBox label="Active" count="850" icon={<CheckCircle className="text-emerald-500"/>} />
            <StatBox label="Pending" count="42" icon={<Clock className="text-orange-500"/>} />
            <StatBox label="Visa" count="99%" icon={<ShieldAlert className="text-purple-600"/>} />
        </div>

        {/* STUDENT LIST CONTAINER */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Student Registry</h3>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-indigo-600" 
                        placeholder="Search student..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- DESKTOP TABLE VIEW (Visible on LG screens) --- */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                            <th className="pb-4 pl-6">Student Info</th>
                            <th className="pb-4">Docs Status</th>
                            <th className="pb-4">Progress</th>
                            <th className="pb-4 pr-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all rounded-3xl group">
                                <td className="py-6 pl-6 rounded-l-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm">{student.name.charAt(0)}</div>
                                        <div>
                                            <div className="font-black text-slate-900 tracking-tight">{student.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6">
                                    <div className="flex gap-1">
                                        <DocIcon active={student.docs.pp} label="PP" />
                                        <DocIcon active={student.docs.passport} label="PAS" />
                                        <DocIcon active={student.docs.citizenship} label="CIT" />
                                    </div>
                                </td>
                                <td className="py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${student.progress}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black">{student.progress}%</span>
                                    </div>
                                </td>
                                <td className="py-6 pr-6 text-right rounded-r-3xl">
                                    <button className="p-3 bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-all"><ArrowUpRight size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE LIST VIEW (Visible on SM screens) --- */}
            <div className="lg:hidden space-y-4">
                {filteredStudents.map(student => (
                    <motion.div 
                        key={student.id}
                        whileTap={{ scale: 0.98 }}
                        className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm text-sm">{student.name.charAt(0)}</div>
                                <div>
                                    <div className="font-black text-slate-900 tracking-tight text-sm">{student.name}</div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase">{student.country}</div>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${student.progress === 100 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {student.status}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div className="flex gap-1.5">
                                <DocIcon active={student.docs.pp} label="PP" />
                                <DocIcon active={student.docs.passport} label="PAS" />
                                <DocIcon active={student.docs.citizenship} label="CIT" />
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-indigo-600 mb-1">{student.progress}%</div>
                                <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600" style={{ width: `${student.progress}%` }} />
                                </div>
                            </div>
                        </div>
                        <button className="absolute top-4 right-4 text-slate-300"><MoreVertical size={16}/></button>
                    </motion.div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

const AdminLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        {icon} {label}
    </button>
);

const StatBox = ({ label, count, icon }) => (
    <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col justify-between h-32 md:h-40">
        <div className="flex justify-between items-start">
            <div className="p-2 md:p-3 bg-slate-50 rounded-xl">{icon}</div>
            <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</div>
        </div>
        <div className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900 leading-none">{count}</div>
    </div>
);

const DocIcon = ({ active, label }) => (
    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border flex items-center justify-center text-[7px] md:text-[8px] font-black ${active ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
        {label}
    </div>
);