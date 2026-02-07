import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { SafetyCheckResult, Page } from '../types';
import { Search, X, AlertTriangle, CheckCircle, Info, ArrowLeft, Pill, Activity, Shield } from 'lucide-react';

interface SafetyCheckProps {
  onNavigate: (page: Page) => void;
}

// MOCK DATABASE FOR PROTOTYPE
const MOCK_DB: Record<string, SafetyCheckResult> = {
  'Amoxicillin': {
    status: 'RISK',
    warnings: ['Contains Penicillin class antibiotics', 'Risk of anaphylaxis if allergic to beta-lactams'],
    explanation: 'High risk of severe allergic reaction due to Penicillin content.',
    drugDetails: {
      name: 'Amoxicillin',
      ingredients: ['Amoxicillin Trihydrate', 'Magnesium Stearate'],
      family: 'Penicillin Antibiotic'
    }
  },
  'Aspirin': {
    status: 'CAUTION',
    warnings: ['May cause stomach bleeding', 'Avoid if allergic to NSAIDs'],
    explanation: 'Use effectively, but monitor if sensitive to NSAIDs or salicylates.',
    drugDetails: {
      name: 'Aspirin',
      ingredients: ['Acetylsalicylic Acid', 'Corn Starch'],
      family: 'NSAID (Non-steroidal anti-inflammatory)'
    }
  },
  'Tylenol': {
    status: 'SAFE',
    warnings: [],
    explanation: 'Generally safe. No common cross-reactions with provided profile.',
    drugDetails: {
      name: 'Tylenol',
      ingredients: ['Acetaminophen'],
      family: 'Analgesic'
    }
  },
  'Ibuprofen': {
    status: 'CAUTION',
    warnings: ['Avoid if allergic to NSAIDs', 'Take with food'],
    explanation: 'Caution advised for users with NSAID sensitivity.',
    drugDetails: {
      name: 'Ibuprofen',
      ingredients: ['Ibuprofen', 'Lactose'],
      family: 'NSAID'
    }
  },
  'Claritin': {
    status: 'SAFE',
    warnings: [],
    explanation: 'Safe for use. Non-drowsy antihistamine.',
    drugDetails: {
      name: 'Claritin',
      ingredients: ['Loratadine'],
      family: 'Antihistamine'
    }
  }
};

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
      setError("Please enter a drug name (e.g., Amoxicillin, Aspirin, Tylenol).");
      return;
    }

    setIsChecking(true);
    setError(null);
    setResult(null);

    // SMIMULATE API DELAY
    setTimeout(() => {
      const dbResult = MOCK_DB[Object.keys(MOCK_DB).find(k => k.toLowerCase() === drugName.trim().toLowerCase()) || ''];

      if (dbResult) {
        // Simple logic to adjust risk based on allergies for the prototype
        let finalResult = { ...dbResult };
        const hasPenicillinAllergy = allergies.some(a => a.toLowerCase().includes('penicillin'));
        const hasNSAIDAllergy = allergies.some(a => a.toLowerCase().includes('nsaid') || a.toLowerCase().includes('aspirin'));

        if (finalResult.drugDetails?.family.includes('Penicillin') && hasPenicillinAllergy) {
          finalResult.status = 'RISK';
          finalResult.explanation = 'CRITICAL: Patient has Penicillin allergy. Do not administer.';
        } else if (finalResult.drugDetails?.family.includes('NSAID') && hasNSAIDAllergy) {
          finalResult.status = 'RISK';
          finalResult.explanation = 'CRITICAL: NSAID Allergy detected.';
        }

        setResult(finalResult);
      } else {
        // Fallback for unknown drugs in prototype
        setResult({
          status: 'CAUTION',
          warnings: ['Drug not in local prototype database', 'Consult pharmacist'],
          explanation: 'This drug is not in the prototype database. Proceed with caution.',
          drugDetails: {
            name: drugName,
            ingredients: ['Unknown'],
            family: 'Unknown'
          }
        });
      }
      setIsChecking(false);
    }, 1200);
  };

  const reset = () => {
    setResult(null);
    setDrugName('');
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-5xl z-10 flex flex-col md:flex-row gap-8 items-start">

        {/* Left Side: Controls */}
        <div className="w-full md:w-1/3 space-y-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-500 hover:text-teal-700 font-medium transition-colors pl-1"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="mb-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Safety Check</h1>
            <p className="text-slate-500 text-sm">Cross-reference drugs with your allergies.</p>
          </div>

          <Card glass className="space-y-6 border-white/40 shadow-xl backdrop-blur-md">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Medication
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-800 placeholder:text-slate-400 font-medium"
                  placeholder="e.g. Amoxicillin"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Allergies
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-800 placeholder:text-slate-400 text-sm"
                  placeholder="Add allergy..."
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAllergy(allergyInput)}
                />
                <button
                  onClick={() => addAllergy(allergyInput)}
                  className="bg-slate-800 text-white px-4 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {allergies.map((a, i) => (
                  <span key={i} className="bg-white/60 border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                    {a}
                    <button onClick={() => removeAllergy(i)} className="hover:text-red-500"><X size={12} /></button>
                  </span>
                ))}
                {allergies.length === 0 && (
                  <span className="text-slate-400 text-xs italic p-1">No allergies added.</span>
                )}
              </div>
            </div>

            <Button
              onClick={runCheck}
              loading={isChecking}
              className="w-full py-3 text-lg shadow-lg shadow-teal-500/20 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none text-white rounded-2xl"
            >
              {isChecking ? 'Analyzing...' : 'Run Safety Analysis'}
            </Button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          </Card>
        </div>

        {/* Right Side: Visualization / Results */}
        <div className="w-full md:w-2/3 min-h-[500px] flex items-center justify-center">
          {!result ? (
            <div className="text-center opacity-40">
              <Shield size={80} className="mx-auto mb-4 text-slate-400 stroke-1" />
              <h3 className="text-xl font-medium text-slate-600">Ready to Analyze</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                Enter a medication to see how it interacts with your allergy profile in real-time.
              </p>
            </div>
          ) : (
            <Card glass className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 p-8 border-white/60 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
              {/* Result Header */}
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 border-b border-white/30 pb-8">
                <div className={`p-4 rounded-2xl shadow-lg ${result.status === 'SAFE' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                    result.status === 'RISK' ? 'bg-rose-500 text-white shadow-rose-500/30' :
                      'bg-amber-500 text-white shadow-amber-500/30'
                  }`}>
                  {result.status === 'SAFE' ? <CheckCircle size={32} /> :
                    result.status === 'RISK' ? <AlertTriangle size={32} /> :
                      <Info size={32} />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className={`text-3xl font-bold ${result.status === 'SAFE' ? 'text-emerald-800' :
                        result.status === 'RISK' ? 'text-rose-800' : 'text-amber-800'
                      }`}>
                      {result.status === 'SAFE' ? 'Safe to Administer' :
                        result.status === 'RISK' ? 'High Risk Detected' : 'Proceed with Caution'}
                    </h2>
                  </div>
                  <p className="text-slate-600 font-medium text-lg leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 backdrop-blur-sm hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-slate-500 uppercase text-xs font-bold tracking-wider">
                    <Pill size={14} /> Drug Composition
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-slate-800">{result.drugDetails?.name}</div>
                    <div className="text-sm font-medium text-slate-500">{result.drugDetails?.family}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {result.drugDetails?.ingredients.map((ing, i) => (
                      <span key={i} className="bg-slate-200/50 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 backdrop-blur-sm hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-slate-500 uppercase text-xs font-bold tracking-wider">
                    <Activity size={14} /> Clinical Warnings
                  </div>
                  {result.warnings.length > 0 ? (
                    <ul className="space-y-2">
                      {result.warnings.map((w, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-sm text-slate-700 font-medium">
                          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${result.status === 'RISK' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                          {w}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="h-full flex items-center text-slate-400 text-sm italic">
                      No specific contraindications found for this profile.
                    </div>
                  )}
                </div>
              </div>

              {/* Background status glow */}
              <div className={`absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[150px] -z-0 opacity-20 pointer-events-none ${result.status === 'SAFE' ? 'bg-emerald-400' :
                  result.status === 'RISK' ? 'bg-rose-400' :
                    'bg-amber-400'
                }`} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyCheck;
