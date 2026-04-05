import React, { useState } from 'react';
import { Globe, Check, ArrowRight, BookOpen, Plane, GraduationCap, MapPin, Phone, Mail, ShieldCheck, Users, Award } from 'lucide-react';
import { supabase } from '../supabaseClient.js';

export default function LandingPage({ onNavigateAuth }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleConsult = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      // If you don't have a consultations table yet, this will just simulate success
      await supabase.from('consultations').insert([{ email }]);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setEmail('');
    } catch (err) {
      console.error(err);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-200 selection:text-teal-900">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-teal-100 px-6 h-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2.5 rounded-xl text-white shadow-md">
            <Globe size={24}/>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-slate-900 uppercase leading-none">Sephora</span>
            <span className="text-[9px] font-black tracking-widest text-teal-600 uppercase mt-0.5">Intl Education</span>
          </div>
        </div>
        <div className="hidden lg:flex gap-8 items-center font-bold text-xs text-slate-600 uppercase tracking-widest">
          <a href="#destinations" className="hover:text-teal-600 transition-colors">Study Abroad</a>
          <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
          <a href="#test-prep" className="hover:text-teal-600 transition-colors">Test Prep</a>
          <a href="#about" className="hover:text-teal-600 transition-colors">About Us</a>
        </div>
        <button onClick={onNavigateAuth} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2">
          Student Portal <ArrowRight size={16} />
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="absolute top-40 left-0 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="flex-1 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-bold text-[10px] uppercase tracking-widest border border-teal-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Admissions Open 2026/2027
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05]">
            SHAPE YOUR <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">GLOBAL FUTURE.</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
            Your trusted partner for international education. From selecting the perfect university and acing your IELTS/PTE, to securing your student visa with a 99% success rate.
          </p>
          
          <div className="bg-white p-4 rounded-2xl border border-teal-50 max-w-md shadow-xl shadow-teal-900/5">
            <h3 className="font-black uppercase text-[10px] text-teal-600 tracking-widest mb-3 ml-2">Book a Free Consultation</h3>
            <form onSubmit={handleConsult} className="flex gap-2">
              <input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all" required />
              <button type="submit" className="bg-slate-900 text-white px-6 rounded-xl font-black hover:bg-teal-600 transition-colors flex items-center justify-center">
                {submitted ? <Check size={20}/> : <ArrowRight size={20}/>}
              </button>
            </form>
            {submitted && <p className="text-teal-600 text-xs font-bold mt-3 ml-2">We'll be in touch shortly!</p>}
          </div>
        </div>
        <div className="flex-1 relative z-10 w-full">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative border-8 border-white">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" alt="Students studying" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* --- STATS BANNER --- */}
      <section className="bg-teal-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-teal-500/50 text-center">
          <div>
            <h3 className="text-4xl font-black mb-1">5,000+</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-100">Visas Approved</p>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-1">15+</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-100">Partner Countries</p>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-1">200+</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-100">Top Universities</p>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-1">99%</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-100">Success Rate</p>
          </div>
        </div>
      </section>

      {/* --- STUDY DESTINATIONS --- */}
      <section id="destinations" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase mb-4">Top Study Destinations</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Choose from the world's most prestigious education systems. We provide tailored guidance for each country's specific requirements.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Australia', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=600' },
            { name: 'Canada', img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=600' },
            { name: 'United Kingdom', img: 'https://images.unsplash.com/photo-1513635269975-5969336cd100?auto=format&fit=crop&q=80&w=600' },
            { name: 'United States', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600' }
          ].map((country) => (
            <div key={country.name} className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg">
              <img src={country.img} alt={country.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity group-hover:from-teal-900/90" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-2">{country.name}</h3>
                <span className="text-teal-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Explore Programs <ArrowRight size={14}/>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- OUR SERVICES & TEST PREP --- */}
      <section id="services" className="bg-teal-50 py-24 px-6 border-y border-teal-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase mb-4">Comprehensive Services</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">From your first English test to your final Visa approval, we handle the complexities so you can focus on your future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow border border-teal-50">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6"><BookOpen size={28}/></div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Test Preparation</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">Expert coaching for IELTS, PTE, and SAT. We provide mock tests, specialized study materials, and intensive classes.</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2">
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> IELTS Preparation</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> PTE Academic</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> SAT Classes</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow border border-teal-50">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6"><GraduationCap size={28}/></div>
              <h3 className="text-xl font-black text-slate-900 mb-3">University Admission</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">We screen your profile and apply to universities that perfectly match your academic background and budget.</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2">
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> Course Counseling</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> Offer Letter Processing</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> Scholarship Assistance</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow border border-teal-50">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6"><Plane size={28}/></div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Visa Processing</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">Our high success rate comes from rigorous documentation checks and thorough visa interview preparation.</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2">
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> Documentation Prep</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> Mock Interviews</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-500"/> Pre-Departure Briefing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US / ABOUT --- */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Why Choose Sephora?</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            As a leading education consultancy, we understand the unique aspirations of our students. We provide personalized guidance that transforms global ambitions into reality, backed by our state-of-the-art digital student portal.
          </p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-teal-100 text-teal-600 p-2 rounded-lg h-fit"><ShieldCheck size={20}/></div>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">Transparent Processing</h4>
                <p className="text-sm text-slate-500 mt-1">Track your entire application journey, document by document, directly through our Student Portal.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 bg-teal-100 text-teal-600 p-2 rounded-lg h-fit"><Users size={20}/></div>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">Expert Counselors</h4>
                <p className="text-sm text-slate-500 mt-1">Our team is deeply familiar with global educational landscapes and immigration policies.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full grid grid-cols-2 gap-4">
           <div className="bg-slate-100 rounded-3xl h-48 overflow-hidden"><img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Counseling"/></div>
           <div className="bg-slate-100 rounded-3xl h-64 overflow-hidden -mb-16"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Students"/></div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-500 p-2 rounded-lg text-white"><Globe size={20}/></div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter text-white uppercase leading-none">Sephora</span>
                <span className="text-[8px] font-black tracking-widest text-teal-400 uppercase mt-0.5">Intl Education</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6">Empowering students to achieve their global education dreams through expert counseling, test preparation, and seamless visa processing.</p>
            <div className="flex space-x-4">
               {/* Social placeholders */}
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer text-white">FB</div>
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer text-white">IG</div>
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer text-white">IN</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#destinations" className="hover:text-teal-400 transition-colors">Study in Australia</a></li>
              <li><a href="#destinations" className="hover:text-teal-400 transition-colors">Study in Canada</a></li>
              <li><a href="#test-prep" className="hover:text-teal-400 transition-colors">IELTS & PTE Classes</a></li>
              <li><button onClick={onNavigateAuth} className="hover:text-teal-400 transition-colors">Student Login</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-teal-500 flex-shrink-0 mt-0.5"/>
                <span>Corporate Office,<br/>Kathmandu, Bagmati Province, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-teal-500 flex-shrink-0"/>
                <span>+977 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-teal-500 flex-shrink-0"/>
                <span>info@sephoraedu.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-xs font-medium text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Sephora International Education Consultancy. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}