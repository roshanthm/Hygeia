
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { checkAllergyAndDrug } from '../services/geminiService';
import { SafetyCheckResult, Page } from '../types';
import { Search, HeartPulse, X, AlertTriangle, CheckCircle, Info, Activity, Stethoscope, ArrowLeft } from 'lucide-react';

interface SafetyCheckProps {
  onNavigate: (page: Page) => void;
}

const SafetyCheck: React.FC<SafetyCheckProps> = ({ onNavigate }) => {
  const [drugName, setDrugName] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SafetyCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addAllergy = (a: string) => {
    const val = a.trim();
    if (val && !allergies.includes(val)) {
      setAllergies([...allergies, val]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (idx: number) => {
    setAllergies(allergies.filter((_, i) => i !== idx));
  };

  const runCheck = async () => {
    if (!drugName.trim()) {
      setError("Please enter a drug name.");
      return;
    }
    setIsChecking(true);
    setError(null);
    try {
      const data = await checkAllergyAndDrug(drugName, allergies);
      setResult(data);
    } catch (err) {
      setError("Failed to check safety. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Allergy & Drug Interaction Check</h1>
        <p className="text-slate-500 font-medium text-lg">Compare medical ingredients with your personal health profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
        <Card className="p-10 shadow-2xl space-y-10 border-0">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Search size={16} /> Step 1: Medication Name
            </h3>
            <input 
              type="text" 
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xl font-bold placeholder:text-slate-300 transition-all"
              placeholder="e.g. Amoxicillin or Aspirin"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} /> Step 2: Your Allergy Profile
            </h3>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="flex-grow p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-lg font-bold placeholder:text-slate-300 transition-all"
                placeholder="Add allergy (e.g. Penicillin)"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAllergy(allergyInput)}
              />
              <Button onClick={() => addAllergy(allergyInput)} className="rounded-3xl px-8">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {allergies.map((a, i) => (
                <div key={i} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-2xl text-sm font-black flex items-center gap-3 shadow-sm">
                  {a}
                  <button onClick={() => removeAllergy(i)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ))}
              {allergies.length === 0 && (
                <span className="text-slate-400 italic text-sm py-2">No allergies listed.</span>
              )}
            </div>
          </div>

          <div className="pt-6">
            <Button onClick={runCheck} loading={isChecking} className="w-full py-6 text-xl rounded-[2rem] shadow-blue-500/20">
              {isChecking ? 'Processing Medical Data...' : 'Analyze Safety Profile'}
            </Button>
          </div>
        </Card>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-8">
            <div className={`p-10 rounded-[3rem] border-2 shadow-2xl flex flex-col md:flex-row items-center gap-10 ${
              result.status === 'SAFE' ? 'bg-emerald-50 border-emerald-100 shadow-emerald-200/50' :
              result.status === 'RISK' ? 'bg-rose-50 border-rose-100 shadow-rose-200/50' : 
              'bg-amber-50 border-amber-100 shadow-amber-200/50'
            }`}>
              <div className="shrink-0">
                {result.status === 'SAFE' ? (
                  <div className="bg-emerald-500 text-white p-6 rounded-[2.5rem] shadow-xl">
                    <CheckCircle size={50} />
                  </div>
                ) : result.status === 'RISK' ? (
                  <div className="bg-rose-500 text-white p-6 rounded-[2.5rem] shadow-xl animate-pulse">
                    <AlertTriangle size={50} />
                  </div>
                ) : (
                  <div className="bg-amber-500 text-white p-6 rounded-[2.5rem] shadow-xl">
                    <Info size={50} />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h2 className={`text-4xl font-black mb-3 ${
                  result.status === 'SAFE' ? 'text-emerald-900' :
                  result.status === 'RISK' ? 'text-rose-900' : 'text-amber-900'
                }`}>
                  {result.status === 'SAFE' ? 'Safe to Use' : 
                   result.status === 'RISK' ? 'Allergy Risk Detected' : 'Caution Advised'}
                </h2>
                <p className={`text-xl font-bold ${
                  result.status === 'SAFE' ? 'text-emerald-700' :
                  result.status === 'RISK' ? 'text-rose-700' : 'text-amber-700'
                }`}>
                  {result.explanation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-10 space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Stethoscope size={16} /> Clinical Details
                </h4>
                <div>
                  <h5 className="text-2xl font-black text-slate-900 mb-1">{result.drugDetails?.name}</h5>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">{result.drugDetails?.family}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-400">Main Ingredients:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.drugDetails?.ingredients.map((ing, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-xs font-bold">{ing}</span>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-10 space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <HeartPulse size={16} /> Specific Warnings
                </h4>
                <div className="space-y-4">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`mt-1 h-3 w-3 rounded-full shrink-0 ${result.status === 'RISK' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                      <p className="text-slate-700 font-bold leading-tight">{w}</p>
                    </div>
                  ))}
                  {result.warnings.length === 0 && (
                    <p className="text-slate-400 italic font-medium">No specific contraindications found.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        <div className="text-center pt-8 opacity-60">
          <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-xl mx-auto">
            DISCLAIMER: Hygeia is an AI safety tool. Always consult a licensed medical professional or pharmacist before starting any new medication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyCheck;
