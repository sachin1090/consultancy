import React, { useState } from 'react';
import { 
  Globe, User, ShieldCheck, GraduationCap, 
  FileText, CheckCircle, Send, LayoutDashboard, 
  Users, Settings, LogOut, Menu, ArrowRight, Upload, Trash2, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MAIN APP COMPONENT (Holds the "Mock Database") ---
export default function App() {
  const [view, setView] = useState('home');
  
  // This is our "Mock Database"
  const [students, setStudents] = useState([
    { 
      id: "STU-001", 
      name: "Alex Johnson", 
      email: "alex@example.com",
      country: "UK", 
      status: "Reviewing", 
      docs: [{ name: "Passport_Copy.pdf", date: "2026-03-20", status: "Verified" }] 
    }
  ]);

  // Function to add a new student from Admin
  const provisionStudent = (newStudent) => {
    setStudents([...students, { ...newStudent, id: `STU-00${students.length + 1}`, docs: [], status: 'New' }]);
    alert("New student provisioned! They can now log in.");
  };

  // Function for student to upload doc
  const uploadDoc = (studentId, docName) => {
    setStudents(students.map(s => {
      if(s.id === studentId) {
        return { ...s, docs: [...s.docs, { name: docName, date: "2026-03-23", status: "Pending" }] };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      <Navbar setView={setView} currentView={view} />
      <AnimatePresence mode="wait">
        {view === 'home' && <Home setView={setView} key="home" />}
        {view === 'student' && <StudentPortal students={students} onUpload={uploadDoc} key="student" />}
        {view === 'admin' && <AdminPortal students={students} onProvision={provisionStudent} key="admin" />}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const Navbar = ({ setView, currentView }) => (
  <nav className="flex items-center justify-between p-6 bg-white border-b sticky top-0 z-50">
    <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600 cursor-pointer" onClick={() => setView('home')}>
      <Globe size={28} /> <span>GlobalPath</span>
    </div>
    <div className="hidden md:flex gap-8 font-medium text-gray-600">
      <button onClick={() => setView('home')} className={currentView === 'home' ? 'text-indigo-600' : ''}>Home</button>
      <button onClick={() => setView('student')} className={currentView === 'student' ? 'text-indigo-600' : ''}>Student Portal</button>
      <button onClick={() => setView('admin')} className={currentView === 'admin' ? 'text-indigo-600' : ''}>Admin Portal</button>
    </div>
    <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">Live Demo</span>
    </div>
  </nav>
);

const Home = ({ setView }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-20">
    <section className="py-24 px-6 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white">
      <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
        The Future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Global Education.</span>
      </motion.h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        Personalized consultancy for the world's top universities. High-speed visa processing and automated document management.
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setView('student')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all">
          Start Application <ArrowRight size={20}/>
        </button>
      </div>
    </section>
  </motion.div>
);

const StudentPortal = ({ students, onUpload }) => {
  const [activeTab, setActiveTab] = useState('docs');
  const me = students[0]; // For demo, we are the first student

  return (
    <div className="flex min-h-[90vh] bg-gray-50">
      <aside className="w-64 bg-white border-r p-6 hidden lg:block">
        <div className="space-y-2">
          <button onClick={() => setActiveTab('docs')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-semibold transition-all ${activeTab === 'docs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
            <FileText size={20}/> Documents
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-semibold transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
            <User size={20}/> My Profile
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-4 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold">Hello, {me.name} 👋</h2>
              <p className="text-gray-500">Application ID: {me.id}</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-indigo-100 flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400">Current Phase:</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider">{me.status}</span>
            </div>
          </header>

          <div className="grid gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Document Vault</h3>
                    <button 
                        onClick={() => onUpload(me.id, "New_Document.pdf")}
                        className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-600 transition"
                    >
                        <Upload size={16}/> Upload New
                    </button>
                </div>
                
                <div className="space-y-3">
                    {me.docs.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 text-red-500 rounded-lg"><FileText size={24}/></div>
                                <div>
                                    <p className="font-bold text-gray-800">{doc.name}</p>
                                    <p className="text-xs text-gray-400 font-medium">Uploaded on {doc.date}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${doc.status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {doc.status}
                            </span>
                        </div>
                    ))}
                    {me.docs.length === 0 && <p className="text-center py-10 text-gray-400 border-2 border-dashed rounded-3xl">No documents uploaded yet.</p>}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const AdminPortal = ({ students, onProvision }) => {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('UK');

  const handleSubmit = (e) => {
    e.preventDefault();
    onProvision({ name: newName, country: newCountry });
    setShowModal(false);
    setNewName('');
  };

  return (
    <div className="flex min-h-[90vh] bg-gray-950 text-white">
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Global Dashboard</h2>
            <p className="text-slate-400 font-medium mt-1">Managing {students.length} active international applications.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            + Provision Student
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-xl">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="p-6">Applicant Info</th>
                <th className="p-6">Destination</th>
                <th className="p-6">Documents</th>
                <th className="p-6">Stage</th>
                <th className="p-6">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((s, i) => (
                <tr key={i} className="group hover:bg-slate-800/40 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs uppercase">{s.name.charAt(0)}</div>
                        <div>
                            <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition">{s.name}</p>
                            <p className="text-xs text-slate-500">{s.id}</p>
                        </div>
                    </div>
                  </td>
                  <td className="p-6 font-semibold text-slate-300">{s.country}</td>
                  <td className="p-6">
                    <div className="flex -space-x-2">
                        {s.docs.map((_,idx) => <div key={idx} className="w-8 h-8 rounded-lg bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">PDF</div>)}
                        {s.docs.length === 0 && <span className="text-slate-600 text-xs italic font-medium">No files</span>}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${s.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                        <button className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 transition"><Eye size={16}/></button>
                        <button className="p-2 bg-slate-800 rounded-lg hover:bg-red-900/40 text-red-400 transition"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PROVISION MODAL --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md">
              <h3 className="text-2xl font-bold mb-2">Provision Student</h3>
              <p className="text-slate-400 text-sm mb-8">This creates a new secure portal for the applicant.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input required className="w-full bg-slate-800 border-none p-4 rounded-xl focus:ring-2 ring-indigo-500 outline-none" placeholder="e.g. John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Country</label>
                    <select className="w-full bg-slate-800 border-none p-4 rounded-xl focus:ring-2 ring-indigo-500 outline-none" value={newCountry} onChange={(e) => setNewCountry(e.target.value)}>
                        <option>UK</option>
                        <option>USA</option>
                        <option>Canada</option>
                        <option>Australia</option>
                    </select>
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-slate-400 font-bold hover:text-white transition">Cancel</button>
                    <button type="submit" className="flex-[2] bg-indigo-500 py-4 rounded-2xl font-bold">Create Portal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}