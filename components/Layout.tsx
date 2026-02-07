import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigateHome }) => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Clean Navbar with Glass Effect */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 px-4 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onNavigateHome}
          >
            <div className="bg-teal-600 p-2 rounded-lg text-white shadow-lg shadow-teal-600/20">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Hygeia</span>
          </div>

          {/* Login Button */}
          <button className="flex items-center gap-2 bg-white/50 border border-white/60 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-teal-700 transition-all backdrop-blur-sm shadow-sm">
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Simple Footer with Glass Effect */}
      <footer className="py-8 px-4 border-t border-white/20 mt-12 bg-white/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-teal-600/90 p-1.5 rounded-md text-white">
                <ShieldCheck size={16} />
              </div>
              <span className="font-semibold text-slate-800">Hygeia</span>
              <span className="text-slate-500 text-sm">• AI Medicine Safety</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-600 font-medium">
              <a href="#" className="hover:text-teal-700 transition-colors">Privacy</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Terms</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} Hygeia. For informational purposes only. Consult a healthcare professional.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
