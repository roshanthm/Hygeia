
import React, { useState, useRef } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { analyzeAuthenticity } from '../services/geminiService';
import { DrugAnalysis, AuthenticityStatus, Page } from '../types';
import { Upload, X, ShieldAlert, CheckCircle, RefreshCw, AlertTriangle, ArrowLeft, ShieldCheck, Folder, Image as ImageIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface FakeDetectionProps {
  onNavigate: (page: Page) => void;
}

const FakeDetection: React.FC<FakeDetectionProps> = ({ onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DrugAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<'fake' | 'original'>('fake');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample data URLs for demonstration (Generic medicine strip lookalikes)
  const SAMPLES = {
    fake: [
      {
        id: 'f1',
        name: 'Counterfeit Amoxicillin',
        desc: 'Misspelled ingredients, blurry typography.',
        // A placeholder for a "fake" looking medicine (e.g. misspelled label)
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhlYmViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+W0ZBS0UgQU1PWElYSUxMSU4gTEFCRUxdPC90ZXh0Pjwvc3ZnPg=='
      }
    ],
    original: [
      {
        id: 'r1',
        name: 'Verified Aspirin',
        desc: 'Standard production quality, clear batch ID.',
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWFmN2Y1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+W09SSUdJTkFMIEFTUElSSU4gTEFCRUxdPC90ZXh0Pjwvc3ZnPg=='
      }
    ]
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async (imgToUse?: string) => {
    const targetImage = imgToUse || image;
    if (!targetImage) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeAuthenticity(targetImage);
      setAnalysis(result);
    } catch (err) {
      setError("Analysis failed. Please try a clearer image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (url: string) => {
    setImage(url);
    setAnalysis(null);
    setError(null);
    startAnalysis(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Authenticity Verification</h1>
        <p className="text-slate-500 font-medium text-lg">Independently verify medication via AI-driven visual inspection.</p>
      </div>

      {!analysis ? (
        <div className="space-y-16">
          {/* UPLOAD SECTION */}
          <Card className="text-center p-16 border-dashed border-2 border-slate-200 hover:border-teal-400 transition-colors group relative overflow-hidden bg-white/50">
            {!image ? (
              <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all duration-500 text-slate-300">
                  <Upload size={40} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3">Live Scan / Upload</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                  Capture a clear image of the strip or packaging.
                </p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                <Button variant="outline" className="mx-auto rounded-2xl px-10">Choose File</Button>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="relative inline-block group">
                  <img src={image} alt="Medicine" className="max-h-[400px] rounded-3xl mx-auto shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-500" />
                  <button onClick={() => setImage(null)} className="absolute -top-4 -right-4 bg-white text-slate-400 p-3 rounded-full shadow-2xl hover:text-rose-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => startAnalysis()} loading={isAnalyzing} className="px-12 py-5 text-lg rounded-2xl">
                    Run Authenticity Scan
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* ASSET FOLDERS SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Folder size={18} /> Asset Reference Library
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveFolder('fake')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${activeFolder === 'fake' ? 'bg-rose-100 text-rose-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Counterfeits
                </button>
                <button 
                  onClick={() => setActiveFolder('original')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${activeFolder === 'original' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Originals
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SAMPLES[activeFolder].map((sample) => (
                <button 
                  key={sample.id}
                  onClick={() => loadSample(sample.url)}
                  disabled={isAnalyzing}
                  className="group flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-3xl text-left hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/5 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${activeFolder === 'fake' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">{sample.name}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{sample.desc}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 mt-2 block group-hover:translate-x-1 transition-transform">Run Test →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`p-10 rounded-[3rem] shadow-2xl border-2 flex flex-col md:flex-row items-center gap-10 ${
            analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? 'bg-rose-50 border-rose-100 shadow-rose-200/50' :
            analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC ? 'bg-emerald-50 border-emerald-100 shadow-emerald-200/50' : 
            'bg-amber-50 border-amber-100 shadow-amber-200/50'
          }`}>
            <div className="shrink-0">
              {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? (
                <div className="bg-rose-500 text-white p-6 rounded-[2.5rem] shadow-xl shadow-rose-500/30 animate-pulse">
                  <AlertTriangle size={60} strokeWidth={1.5} />
                </div>
              ) : (
                <div className="bg-emerald-500 text-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-500/30">
                  <ShieldCheck size={60} strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                <h2 className="text-4xl font-black text-slate-900">
                  {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? 'Counterfeit Detected' : 'Authentic Medicine'}
                </h2>
                <Badge variant={analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC ? 'success' : 'danger'}>
                  {analysis.authenticityStatus}
                </Badge>
              </div>
              <p className={`text-xl font-semibold ${
                analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT 
                  ? 'High probability of non-standard production. Stop use immediately.' 
                  : 'Packaging matches official manufacturing standards.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Drug Name</h4>
                  <p className="text-2xl font-black text-slate-900">{analysis.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Manufacturer</h4>
                  <p className="text-lg font-bold text-slate-700">{analysis.manufacturer}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Explainable AI Analysis</h4>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 italic text-slate-600 leading-relaxed font-medium">
                  "{analysis.authenticityReasoning}"
                </div>
              </div>
            </Card>

            <Card className="p-10 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Confidence Ring</h4>
              <div className="h-48 w-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: analysis.confidenceScore * 100 }, { value: (1 - analysis.confidenceScore) * 100 }]}
                      cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={0} dataKey="value" startAngle={90} endAngle={-270}
                    >
                      <Cell fill={analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC ? '#10b981' : '#f43f5e'} />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <span className="text-4xl font-black text-slate-900">{Math.round(analysis.confidenceScore * 100)}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Trust Score</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="secondary" onClick={() => { setAnalysis(null); setImage(null); }} className="px-10 py-4 rounded-2xl flex items-center gap-3">
              <RefreshCw size={20} /> Verify Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeDetection;
