import React, { useState } from 'react';
import { 
  Users, CheckCircle, Clock, Search, LogOut, Home, 
  ChevronRight, LayoutDashboard, FileText, Settings, ShieldAlert,
  Download, Filter, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- DUMMY DATA FOR ADMIN ---
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

  const filteredStudents = DUMMY_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#0F172A] text-white p-10 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-16">
            <div className="bg-indigo-500 p-2 rounded-xl text-white font-black">AD</div>
            <h2 className="text-xl font-black uppercase tracking-tighter">ERA ADMIN</h2>
        </div>

        <nav className="flex-1 space-y-2">
            <AdminLink icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab === 'dash'} onClick={() => setActiveTab('dash')} />
            <AdminLink icon={<Users size={18}/>} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
            <AdminLink icon={<ShieldAlert size={18}/>} label="Visa Alerts" active={activeTab === 'visa'} onClick={() => setActiveTab('visa')} />
            <AdminLink icon={<Settings size={18}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto space-y-4 pt-10 border-t border-white/5">
            <button onClick={onExitToSite} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-xs text-slate-400 hover:text-white transition-all hover:bg-white/5"><Home size={18}/> Back to Site</button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-xs text-red-400 hover:bg-red-400/10 transition-all"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* MAIN ADMIN AREA */}
      <main className="flex-1 overflow-y-auto p-12">
        
        {/* TOP DASHBOARD STATS */}
        <div className="grid grid-cols-4 gap-6 mb-12">
            <StatBox label="Total Students" count="1,284" icon={<Users className="text-indigo-600"/>} trend="+12% this week" />
            <StatBox label="Verified Profiles" count="850" icon={<CheckCircle className="text-emerald-500"/>} trend="98% Success" />
            <StatBox label="Pending Docs" count="42" icon={<Clock className="text-orange-500"/>} trend="Attention needed" />
            <StatBox label="Visa Success" count="99.2%" icon={<ShieldAlert className="text-purple-600"/>} trend="Global Rank #1" />
        </div>

        {/* STUDENT TABLE */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Student Registry</h3>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-indigo-600" 
                            placeholder="Search by name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100"><Filter size={20}/></button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-slate-400 font-black text-[10px] uppercase tracking-widest px-6">
                            <th className="pb-4 pl-6">Student Info</th>
                            <th className="pb-4">Country</th>
                            <th className="pb-4">Docs Status</th>
                            <th className="pb-4">Completion</th>
                            <th className="pb-4 pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="bg-white border-y border-slate-50 group hover:shadow-lg transition-all rounded-3xl">
                                <td className="py-6 pl-6 rounded-l-[2rem] border-l border-y border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-indigo-600">{student.name.charAt(0)}</div>
                                        <div>
                                            <div className="font-black text-slate-900 tracking-tight">{student.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 border-y border-slate-100">
                                    <div className="font-black text-xs uppercase tracking-widest text-slate-600 bg-slate-50 px-4 py-1.5 rounded-full inline-block">{student.country}</div>
                                </td>
                                <td className="py-6 border-y border-slate-100">
                                    <div className="flex gap-1.5">
                                        <DocBadge active={student.docs.pp} label="PP" />
                                        <DocBadge active={student.docs.passport} label="PAS" />
                                        <DocBadge active={student.docs.citizenship} label="CIT" />
                                        <DocBadge active={student.docs.academic} label="ACD" />
                                    </div>
                                </td>
                                <td className="py-6 border-y border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${student.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${student.progress}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900">{student.progress}%</span>
                                    </div>
                                </td>
                                <td className="py-6 pr-6 rounded-r-[2rem] border-r border-y border-slate-100">
                                    <button className="bg-slate-50 text-slate-400 p-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all group-hover:scale-105 shadow-sm">
                                        <ArrowUpRight size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}

const AdminLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        {icon} {label}
    </button>
);

const StatBox = ({ label, count, icon, trend }) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</div>
        </div>
        <div>
            <div className="text-4xl font-black tracking-tighter text-slate-900 mb-1">{count}</div>
            <div className="text-[10px] font-bold text-slate-400 italic">{trend}</div>
        </div>
    </div>
);

const DocBadge = ({ active, label }) => (
    <div className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${active ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
        {label}
    </div>
);