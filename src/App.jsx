import React, { useState, useEffect } from 'react';
import StudentPortal from './StudentPortal';
import { 
  GraduationCap, ArrowRight, Lock, Phone, Mail, MapPin, 
  LayoutDashboard, ChevronDown, Users, BookOpen, ShieldCheck, 
  Globe, PlaneTakeoff, FileCheck, ArrowLeft, Sparkles, Star, Quote 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Session configuration: 1 Hour
const SESSION_TIMEOUT = 60 * 60 * 1000; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('site'); // 'site' or 'portal'
  const [sitePage, setSitePage] = useState('home'); // 'home' or 'dummy'
  const [dummyData, setDummyData] = useState({ title: '', desc: '' });
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Initialize studentData with the docsUploaded object for the completion metric
  const [studentData, setStudentData] = useState(() => {
    const saved = localStorage.getItem('next_era_user');
    if (saved) return JSON.parse(saved);

    return {
      email: 'sachin@gmail.com',
      fullName: '',
      idNumber: '',
      phone: '',
      isProfileComplete: false,
      docsUploaded: {
          passport: false,
          citizenship: false,
          slc: false,
          plusTwo: false,
          ppPhoto: false
      }
    };
  });

  // Check session on mount
  useEffect(() => {
    const sessionStart = localStorage.getItem('session_start');
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';

    if (loginStatus && sessionStart) {
      const now = Date.now();
      if (now - parseInt(sessionStart) < SESSION_TIMEOUT) {
        setIsLoggedIn(true);
        const savedView = localStorage.getItem('viewMode');
        if (savedView) setViewMode(savedView);
      } else {
        handleLogout(); // Session expired
      }
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('next_era_user', JSON.stringify(studentData));
    localStorage.setItem('viewMode', viewMode);
  }, [studentData, viewMode]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setViewMode('portal');
    setIsLoginModalOpen(false);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('session_start', Date.now().toString());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode('site');
    setSitePage('home');
    localStorage.clear();
    window.location.reload();
  };

  const openPage = (title, desc) => {
    setDummyData({ title, desc });
    setSitePage('dummy');
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic: If user is logged in and wants to see the portal, switch components
  if (isLoggedIn && viewMode === 'portal') {
    return (
      <StudentPortal 
        studentData={studentData} 
        setStudentData={setStudentData} 
        onLogout={handleLogout} 
        onExitToSite={() => setViewMode('site')} 
      />
    );
  }

  return (
    <div className="bg-mesh min-h-screen font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6" onMouseLeave={() => setActiveDropdown(null)}>
        <div className="max-w-7xl mx-auto glass-card rounded-[2.5rem] px-8 py-4 flex justify-between items-center border-white/60">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter text-slate-900 cursor-pointer group" onClick={() => setSitePage('home')}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-2xl text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <GraduationCap size={24}/>
            </div>
            <span>NEXT ERA</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <NavItem label="About Us" active={activeDropdown === 'about'} onHover={() => setActiveDropdown('about')}>
              <div className="p-3 w-64 glass-card rounded-[2rem] shadow-2xl">
                  <SubNavLink onClick={() => openPage("Our Story", "Building the next era of Nepalese scholars since 2026.")} icon={<Users className="text-indigo-500"/>} title="Who We Are" desc="Our History" />
                  <SubNavLink onClick={() => openPage("Expert Team", "Meet our certified global advisors.")} icon={<ShieldCheck className="text-purple-500"/>} title="Our Team" desc="The Experts" />
              </div>
            </NavItem>

            <NavItem label="Services" active={activeDropdown === 'services'} onHover={() => setActiveDropdown('services')}>
              <div className="p-4 w-[480px] grid grid-cols-2 gap-3 glass-card rounded-[2.5rem] shadow-2xl">
                  <SubNavLink onClick={() => openPage("IELTS & PTE", "Get the scores required for top universities.")} icon={<BookOpen className="text-cyan-500"/>} title="Test Prep" desc="IELTS, PTE & TOEFL" />
                  <SubNavLink onClick={() => openPage("Visa Strategy", "98% success rate in document filing.")} icon={<FileCheck className="text-indigo-500"/>} title="Visa Support" desc="Documentation" />
                  <SubNavLink onClick={() => openPage("Pre-Departure", "What to pack and how to thrive.")} icon={<PlaneTakeoff className="text-emerald-500"/>} title="Ready to Fly" desc="Pre-Departure" />
                  <SubNavLink onClick={() => openPage("University Search", "Finding the perfect match for you.")} icon={<Globe className="text-orange-500"/>} title="Admissions" desc="Direct Partnerships" />
              </div>
            </NavItem>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button onClick={() => setViewMode('portal')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                Go to Dashboard <LayoutDashboard size={18}/>
              </button>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                Portal Login <Lock size={16}/>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {sitePage === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
              {/* HERO */}
              <section className="pt-40 pb-20 px-6 text-center max-w-7xl mx-auto">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-indigo-100">
                  <Sparkles size={14} /> Redefining Education Consultancy
                </motion.div>
                <motion.h1 initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] uppercase mb-12">
                  Dream <br/><span className="text-gradient">Bigger.</span>
                </motion.h1>
                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                  The most premium educational bridge in Putalisadak. We guide the leaders of tomorrow to the world's best institutions.
                </p>
                <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-900 text-white px-12 py-7 rounded-[2.5rem] font-black text-xl flex items-center gap-4 hover:bg-indigo-600 hover:shadow-2xl transition-all group mx-auto">
                  Start Application <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </section>

              {/* BENTO STATS */}
              <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                  <StatCard count="98%" label="Visa Success Rate" />
                  <StatCard count="500+" label="University Partners" />
                  <StatCard count="12k" label="Global Scholars" />
              </section>

              {/* SERVICES */}
              <section className="py-32 px-8 max-w-7xl mx-auto border-t border-slate-200/50">
                <div className="text-center mb-20">
                  <h2 className="text-5xl font-black tracking-tighter uppercase mb-4">Our Expertise</h2>
                  <div className="w-20 h-2 bg-indigo-600 mx-auto rounded-full" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <ServiceBlock icon={<Globe />} title="Direct Admissions" desc="Fast-track admissions to Russell Group and Ivy League universities." />
                  <ServiceBlock icon={<BookOpen />} title="Intensive Coaching" desc="Score high in IELTS, PTE, and SAT with our 2026 prep system." />
                  <ServiceBlock icon={<PlaneTakeoff />} title="Pre-Departure" desc="Briefing on living costs, culture, and immigration laws." />
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="py-32 bg-[#0F172A] text-white overflow-hidden rounded-[4rem] mx-6 mb-20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-8">
                  <h2 className="text-5xl font-black tracking-tighter uppercase mb-20 text-center">Global Stories</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <TestimonialCard name="Pradip S." location="Sydney, AU" text="Next Era provided a level of transparency I couldn't find anywhere else. Their portal is a game changer." />
                    <TestimonialCard name="Aashma K." location="London, UK" text="I got into my first-choice university in the UK. The documentation team is simply the best in Nepal." />
                    <TestimonialCard name="Rohan M." location="Toronto, CA" text="They made my Canadian study permit process look easy. Highly professional and always responsive." />
                  </div>
                </div>
              </section>

              {/* CORPORATE FOOTER */}
              <footer className="bg-white pt-32 pb-12 px-10 border-t">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-24">
                  <div className="col-span-2">
                    <div className="font-black text-3xl mb-8 tracking-tighter uppercase text-indigo-600">Next Era Education</div>
                    <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed text-lg italic">
                      "Empowering scholars. Defining the future."
                    </p>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"><Phone size={20}/></div>
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"><Mail size={20}/></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.3em] text-indigo-600 mb-8">Headquarters</h4>
                    <div className="space-y-4 text-slate-500 font-bold text-sm">
                      <p className="flex gap-2"><MapPin className="text-indigo-600 shrink-0"/> Putalisadak, Kathmandu, Nepal</p>
                      <p className="flex gap-2"><Phone className="text-indigo-600 shrink-0"/> +977 1 4XXXXXX</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.3em] text-indigo-600 mb-8">Quick Links</h4>
                    <ul className="space-y-4 font-bold text-slate-400 text-sm">
                      <li className="hover:text-indigo-600 cursor-pointer transition" onClick={() => setSitePage('home')}>Main Site</li>
                      <li className="hover:text-indigo-600 cursor-pointer transition" onClick={() => setIsLoginModalOpen(true)}>Portal Login</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-12 border-t text-center">
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.6em]">© 2026 Next Era Education Consultancy. All Rights Reserved.</p>
                </div>
              </footer>

            </motion.div>
          ) : (
            <motion.div key="dummy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto py-40 px-6 min-h-screen">
                <button onClick={() => setSitePage('home')} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-10 hover:-translate-x-1 transition-transform"><ArrowLeft size={16}/> Back Home</button>
                <h2 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter uppercase text-gradient leading-none">{dummyData.title}</h2>
                <div className="prose prose-2xl text-slate-500 font-medium leading-relaxed">
                    {dummyData.desc} Providing specialized consultancy for the Nepalese student community with a focus on high-rank institutional placements. This is the official Next Era information channel.
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal onClose={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- UI COMPONENTS ---

const NavItem = ({ label, children, active, onHover }) => (
    <div className="relative" onMouseEnter={onHover}>
        <button className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest transition-all ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>
            {label} <ChevronDown size={14} className={`transition-transform duration-500 ${active ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
            {active && (
                <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[110]">
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const SubNavLink = ({ icon, title, desc, onClick }) => (
    <button onClick={onClick} className="flex items-start gap-4 p-4 hover:bg-indigo-50/50 rounded-[1.5rem] transition-all text-left w-full group">
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">{icon}</div>
        <div>
            <div className="font-black text-sm text-slate-900 mb-0.5 group-hover:text-indigo-600 transition-colors">{title}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{desc}</div>
        </div>
    </button>
);

const StatCard = ({ count, label }) => (
  <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center hover:-translate-y-2 transition-transform">
    <div className="text-6xl font-black text-indigo-600 mb-2 tracking-tighter">{count}</div>
    <div className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</div>
  </div>
);

const ServiceBlock = ({ icon, title, desc }) => (
  <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-indigo-100 transition-all group text-center">
    <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors">{icon}</div>
    <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

const TestimonialCard = ({ name, location, text }) => (
  <div className="p-10 bg-slate-800 border border-slate-700 rounded-[3rem] relative hover:bg-slate-700/50 transition-colors">
    <Quote className="absolute top-8 right-8 text-indigo-500/10" size={60} />
    <div className="flex gap-1 text-orange-400 mb-6"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
    <p className="text-lg text-slate-300 font-medium italic mb-8 leading-relaxed">"{text}"</p>
    <div>
      <div className="font-black text-white">{name}</div>
      <div className="text-xs font-black uppercase text-indigo-400 tracking-widest">{location}</div>
    </div>
  </div>
);

const LoginModal = ({ onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'sachin@gmail.com' && pass === '12345') {
            onSuccess();
        } else {
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} className="relative bg-white w-full max-w-md p-12 rounded-[3.5rem] shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock size={32}/></div>
                    <h3 className="text-3xl font-black mb-2 tracking-tight">Portal Login</h3>
                    <p className="text-slate-500 text-sm font-medium">Verify your scholar identity</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" placeholder="sachin@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-indigo-600" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
                    {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
                    <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-all">Enter Dashboard</button>
                </form>
            </motion.div>
        </div>
    );
};