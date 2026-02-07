
import React from 'react';
import { Card } from '../components/UI';
import { ShieldAlert, HeartPulse, ChevronRight, Activity, ShieldCheck, Microscope } from 'lucide-react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden pt-16 pb-32 min-h-[80vh] flex flex-col justify-center">
      {/* Visual background elements */}
      <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-teal-700 font-bold text-sm mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Activity size={18} className="text-teal-500" /> AI-Powered Medicine Safety & Allergy Intelligence
        </div>
        
        <h1 className="text-6xl md:text-[100px] font-black text-slate-900 tracking-tighter leading-none mb-6">
          Hygeia
        </h1>
        
        <p className="text-xl text-slate-500 max-w-xl mx-auto mb-20 font-medium leading-relaxed">
          The international standard for pharmaceutical trust. 
          Independently verify what you consume.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* FAKE MEDICINE DETECTION CARD */}
          <button 
            onClick={() => onNavigate('fake-detection')}
            className="group relative text-left focus:outline-none focus:ring-4 focus:ring-teal-500/20 rounded-[2.5rem]"
          >
            <div className="absolute inset-0 bg-teal-500/5 rounded-[2.5rem] scale-95 opacity-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 -z-10 blur-2xl"></div>
            <Card className="h-full border-2 border-transparent group-hover:border-teal-200 group-hover:-translate-y-4 transition-all duration-500 p-10 overflow-hidden">
              <div className="flex flex-col h-full relative z-10">
                <div className="bg-teal-50 text-teal-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-500">
                  <ShieldAlert size={40} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Fake Medicine Detection</h2>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-slate-500 font-medium text-lg leading-relaxed mb-6">
                    Upload a medicine image to detect counterfeit drugs using AI-based visual inspection.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-teal-600 font-bold text-lg">
                  Verify Medicine Authenticity <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              {/* Decorative Pill Placeholder Illustration */}
              <div className="absolute top-10 right-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                <Microscope size={200} />
              </div>
            </Card>
          </button>

          {/* ALLERGY & DRUG SAFETY CARD */}
          <button 
            onClick={() => onNavigate('safety-check')}
            className="group relative text-left focus:outline-none focus:ring-4 focus:ring-blue-500/20 rounded-[2.5rem]"
          >
            <div className="absolute inset-0 bg-blue-500/5 rounded-[2.5rem] scale-95 opacity-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 -z-10 blur-2xl"></div>
            <Card className="h-full border-2 border-transparent group-hover:border-blue-200 group-hover:-translate-y-4 transition-all duration-500 p-10 overflow-hidden">
              <div className="flex flex-col h-full relative z-10">
                <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                  <HeartPulse size={40} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Allergy & Drug Safety Check</h2>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-slate-500 font-medium text-lg leading-relaxed mb-6">
                    Analyze ingredients and drug families to prevent allergic reactions before consumption.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-lg">
                  Check Allergy & Drug Safety <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              {/* Decorative Shield Placeholder Illustration */}
              <div className="absolute top-10 right-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={200} />
              </div>
            </Card>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
