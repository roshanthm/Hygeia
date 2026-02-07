import React, { useState, useRef } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { analyzeAuthenticity } from '../services/geminiService';
import { DrugAnalysis, AuthenticityStatus, Page } from '../types';
import { Upload, X, ShieldCheck, RefreshCw, AlertTriangle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface FakeDetectionProps {
  onNavigate: (page: Page) => void;
}

const FakeDetection: React.FC<FakeDetectionProps> = ({ onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DrugAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample images for testing
  const SAMPLES = [
    {
      id: 'f1',
      name: 'Test Counterfeit',
      desc: 'Sample with quality issues',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhlYmViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+W0ZBS0UgQU1PWElYSUxMSU4gTEFCRUxdPC90ZXh0Pjwvc3ZnPg=='
    },
    {
      id: 'r1',
      name: 'Test Authentic',
      desc: 'Standard quality sample',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWFmN2Y1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+W09SSUdJTkFMIEFTUElSSU4gTEFCRUxdPC90ZXh0Pjwvc3ZnPg=='
    }
  ];

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

  const reset = () => {
    setAnalysis(null);
    setImage(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium transition-colors mb-8"
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Medicine Authenticity Check</h1>
        <p className="text-slate-600">Upload a medicine image for AI-powered verification</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {!analysis ? (
        <div className="space-y-8">
          {/* Upload Section */}
          <Card className="text-center p-8 rounded-3xl">
            {!image ? (
              <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="bg-slate-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Medicine Image</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Take a clear photo of the medicine packaging or strip
                </p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                <Button variant="outline" className="rounded-xl px-6">Choose File</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative inline-block">
                  <img src={image} alt="Medicine" className="max-h-64 rounded-2xl mx-auto border border-slate-200 shadow-md" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 bg-white text-slate-400 p-2 rounded-full shadow-lg hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <Button onClick={() => startAnalysis()} loading={isAnalyzing} className="rounded-xl px-8">
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
              </div>
            )}
          </Card>

          {/* Sample Images */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Or try a sample:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => loadSample(sample.url)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-teal-400 hover:shadow-md transition-all disabled:opacity-50 group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{sample.name}</h4>
                    <p className="text-xs text-slate-500">{sample.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Result Banner */}
          <div className={`p-6 rounded-3xl flex items-center gap-5 ${analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT
              ? 'bg-red-50 border border-red-200'
              : analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
            <div className={`p-4 rounded-2xl shadow-lg ${analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT
                ? 'bg-red-500 text-white shadow-red-500/20'
                : 'bg-emerald-500 text-white shadow-emerald-500/20'
              }`}>
              {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT
                ? <AlertTriangle size={32} />
                : <ShieldCheck size={32} />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? 'Counterfeit Detected' : 'Authentic Medicine'}
                </h2>
                <Badge variant={analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC ? 'success' : 'danger'}>
                  {analysis.authenticityStatus}
                </Badge>
              </div>
              <p className={`text-base font-medium ${analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? 'text-red-700' : 'text-emerald-700'
                }`}>
                {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT
                  ? 'High probability of non-standard production. Stop use immediately.'
                  : 'Packaging matches official manufacturing standards.'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 p-8 space-y-6 rounded-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Drug Name</h4>
                  <p className="text-xl font-bold text-slate-900">{analysis.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Manufacturer</h4>
                  <p className="text-lg font-medium text-slate-700">{analysis.manufacturer}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Analysis</h4>
                <div className="bg-slate-50 p-5 rounded-2xl text-slate-600 text-sm italic border border-slate-100 leading-relaxed">
                  "{analysis.authenticityReasoning}"
                </div>
              </div>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center rounded-3xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Confidence Score</h4>
              <div className="h-40 w-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: analysis.confidenceScore * 100 }, { value: (1 - analysis.confidenceScore) * 100 }]}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={75} dataKey="value" startAngle={90} endAngle={-270}
                    >
                      <Cell fill={analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC ? '#10b981' : '#ef4444'} />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{Math.round(analysis.confidenceScore * 100)}%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center pt-6">
            <Button variant="secondary" onClick={reset} className="rounded-xl px-10 py-3">
              <RefreshCw size={18} /> Verify Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeDetection;
