
import React from 'react';
import { ShieldCheck, UserCircle, Globe, Shield, Activity, Lock, HeartPulse } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigateHome }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-teal-50/30">
      {/* Premium Healthcare Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/40 px-4">
        <div className="max-w-7xl mx-auto flex justify-between h-20 items-center">
          {/* Logo Section - Icon Only */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={onNavigateHome}
          >
            <div className="bg-teal-500 p-2.5 rounded-2xl text-white group-hover:shadow-teal-500/40 transition-all shadow-lg shadow-teal-500/20 group-hover:scale-105">
              <ShieldCheck size={28} />
            </div>
          </div>

          {/* Action Section - Simplified 'Login' button */}
          <div className="flex items-center">
            <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl font-bold text-sm hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/30 transition-all shadow-sm active:scale-95 group">
              <div className="bg-teal-100 p-1.5 rounded-lg text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <UserCircle size={20} strokeWidth={2.5} />
              </div>
              <span>Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Professional Clinical Footer */}
      <footer className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
            {/* Brand Identity */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-teal-500 p-1.5 rounded-lg text-white">
                  <ShieldCheck size={18} />
                </div>
                <span className="font-black text-xl text-slate-900 tracking-tight">Hygeia</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                The global benchmark for pharmaceutical transparency and consumer drug safety verification.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Live Verification Active
                </div>
              </div>
            </div>

            {/* Compliance & Verification */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Trust & Compliance</h4>
              <ul className="space-y-4">
                <li><div className="text-sm font-bold text-slate-600 flex items-center gap-2 cursor-default"><Shield size={14} className="text-teal-500" /> FDA/EMA Guidelines</div></li>
                <li><div className="text-sm font-bold text-slate-600 flex items-center gap-2 cursor-default"><Lock size={14} className="text-teal-500" /> HIPAA Compliant</div></li>
                <li><div className="text-sm font-bold text-slate-600 flex items-center gap-2 cursor-default"><Globe size={14} className="text-teal-500" /> Global Narcotics Data</div></li>
              </ul>
            </div>

            {/* Platform Modules */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Security Modules</h4>
              <ul className="space-y-4">
                <li><div className="text-sm font-bold text-slate-600 flex items-center gap-2 cursor-default"><Activity size={14} className="text-teal-500" /> Anti-Counterfeit AI</div></li>
                <li><div className="text-sm font-bold text-slate-600 flex items-center gap-2 cursor-default"><HeartPulse size={14} className="text-teal-500" /> Cross-Reaction Check</div></li>
                <li><div className="text-sm font-bold text-slate-600 flex items-center gap-2 cursor-default"><ShieldCheck size={14} className="text-teal-500" /> Batch Verifier</div></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Global Support</h4>
              <div className="bg-white/40 border border-slate-200/50 p-6 rounded-3xl">
                <p className="text-xs font-bold text-slate-500 mb-4 leading-relaxed">
                  Connect with our clinical response team for platform integration.
                </p>
                <button className="text-xs font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors">
                  Contact Specialist →
                </button>
              </div>
            </div>
          </div>

          {/* Legal Bar */}
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-200/30">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
              © {new Date().getFullYear()} Hygeia Platform • International Medical Standards
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Privacy Framework</a>
              <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Safety Protocol</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
