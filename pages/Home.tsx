import React from 'react';
import { Card } from '../components/UI';
import { ShieldAlert, HeartPulse, ChevronRight, Activity } from 'lucide-react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-16 px-4">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/60 backdrop-blur-md text-teal-800 font-bold text-sm mb-6 shadow-sm">
            <Activity size={16} className="text-teal-600" /> AI-Powered Medicine Safety
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 tracking-tight">
            Hygeia
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The new standard for pharmaceutical trust. Verify authenticity and check for allergy risks instantly.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fake Medicine Detection */}
          <button
            onClick={() => onNavigate('fake-detection')}
            className="text-left focus:outline-none focus:ring-4 focus:ring-teal-500/20 rounded-2xl group transition-transform hover:-translate-y-2 duration-500"
          >
            <Card glass className="h-full p-10 hover:shadow-2xl hover:shadow-teal-900/10 hover:border-teal-200/50 transition-all duration-500 overflow-hidden relative">
              <div className="bg-teal-50/80 text-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500 shadow-sm">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-teal-700 transition-colors">Fake Detection</h2>

              {/* Description - hidden by default, shows on hover */}
              <div className="max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                <p className="text-slate-600 text-base mb-6 leading-relaxed">
                  Upload a medicine image to detect counterfeit drugs using AI-based visual inspection.
                </p>
              </div>

              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mt-2 uppercase tracking-wide">
                Verify Authenticity <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Card>
          </button>

          {/* Allergy & Drug Safety */}
          <button
            onClick={() => onNavigate('safety-check')}
            className="text-left focus:outline-none focus:ring-4 focus:ring-blue-500/20 rounded-2xl group transition-transform hover:-translate-y-2 duration-500"
          >
            <Card glass className="h-full p-10 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200/50 transition-all duration-500 overflow-hidden relative">
              <div className="bg-blue-50/80 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <HeartPulse size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">Safety Check</h2>

              {/* Description - hidden by default, shows on hover */}
              <div className="max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                <p className="text-slate-600 text-base mb-6 leading-relaxed">
                  Check medications against your allergy profile to prevent adverse reactions.
                </p>
              </div>

              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mt-2 uppercase tracking-wide">
                Check Safety <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Card>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
