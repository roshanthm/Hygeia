
import React, { useState, useRef, useCallback } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { analyzeMedicineImage, checkAllergySafety } from '../services/geminiService';
import { DrugAnalysis, AuthenticityStatus, SafetyCheckResult } from '../types';
// Fix: Added ShieldAlert to imports
import { 
  Upload, Camera, X, CheckCircle, AlertTriangle, 
  Info, Loader2, RefreshCw, ChevronRight, User, 
  Stethoscope, FileSearch, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Verify: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DrugAnalysis | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeMedicineImage(image);
      setAnalysis(result);
      if (result.authenticityStatus === AuthenticityStatus.COUNTERFEIT) {
        setStep(3); // Skip allergies for fake drugs
      } else {
        setStep(2);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to analyze the medicine. Please ensure the image is clear and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performSafetyCheck = async () => {
    if (!analysis) return;
    setIsAnalyzing(true);
    try {
      const result = await checkAllergySafety(analysis, allergies);
      setSafetyResult(result);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setError("Failed to perform safety check.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addAllergy = (a: string) => {
    const trimmed = a.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const reset = () => {
    setStep(1);
    setImage(null);
    setAnalysis(null);
    setSafetyResult(null);
    setError(null);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center gap-4 mb-12">
      <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600' : 'text-slate-300'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step === 1 ? 'bg-teal-500 text-white shadow-lg shadow-teal-100' : step > 1 ? 'bg-teal-100 text-teal-600' : 'bg-slate-100'}`}>
          {step > 1 ? <CheckCircle size={16} /> : '1'}
        </div>
        <span className="text-sm font-bold">Image</span>
      </div>
      <div className={`w-12 h-0.5 rounded-full ${step > 1 ? 'bg-teal-200' : 'bg-slate-100'}`}></div>
      <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600' : 'text-slate-300'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step === 2 ? 'bg-teal-500 text-white shadow-lg shadow-teal-100' : step > 2 ? 'bg-teal-100 text-teal-600' : 'bg-slate-100'}`}>
          {step > 2 ? <CheckCircle size={16} /> : '2'}
        </div>
        <span className="text-sm font-bold">Safety Profile</span>
      </div>
      <div className={`w-12 h-0.5 rounded-full ${step > 2 ? 'bg-teal-200' : 'bg-slate-100'}`}></div>
      <div className={`flex items-center gap-2 ${step === 3 ? 'text-teal-600' : 'text-slate-300'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step === 3 ? 'bg-teal-500 text-white shadow-lg shadow-teal-100' : 'bg-slate-100'}`}>
          3
        </div>
        <span className="text-sm font-bold">Review</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {renderStepIndicator()}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl mb-8 flex items-start gap-3">
          <AlertTriangle className="shrink-0" size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="text-center p-12 border-dashed border-2 border-slate-200 hover:border-teal-400 transition-colors group">
            {!image ? (
              <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-teal-500">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Medicine Package</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  Take a clear photo of the packaging, ensuring labels and active ingredients are visible.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
                <Button variant="outline" className="mx-auto">Select Photo</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative inline-block">
                  <img 
                    src={image} 
                    alt="Medicine Scan" 
                    className="max-h-80 rounded-2xl mx-auto shadow-2xl border-4 border-white" 
                  />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute -top-3 -right-3 bg-white text-slate-500 p-2 rounded-full shadow-lg hover:text-rose-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={startAnalysis} 
                    loading={isAnalyzing}
                    className="w-full sm:w-auto"
                  >
                    {isAnalyzing ? 'Analyzing Clinical Data...' : 'Start Safety Analysis'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100">
              <Camera className="text-teal-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Clear Vision</h4>
                <p className="text-xs text-slate-500">Ensure good lighting and avoid reflections on metallic strips.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100">
              <ShieldCheck className="text-teal-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Full Privacy</h4>
                <p className="text-xs text-slate-500">Your images are processed securely and not stored permanently.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ALLERGY PROFILE */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 bg-teal-50 p-6 rounded-[2rem] border border-teal-100">
            <div className="bg-teal-500 text-white p-3 rounded-2xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">Detected: {analysis?.name}</h3>
                <Badge variant="success">Authentic Verified</Badge>
              </div>
              <p className="text-teal-700 text-sm font-medium">Verification Confidence: {((analysis?.confidenceScore || 0) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-slate-400" />
              <h3 className="text-xl font-bold text-slate-800">Your Allergy Profile</h3>
            </div>
            
            <p className="text-slate-500 mb-6">
              To provide safety alerts, please list any known drug allergies or medicinal family sensitivities.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-grow p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="e.g. Penicillin, Sulfa drugs, Ibuprofen..."
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAllergy(allergyInput)}
                />
                <Button onClick={() => addAllergy(allergyInput)}>Add</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, i) => (
                  <div key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-200">
                    {allergy}
                    <button onClick={() => removeAllergy(i)} className="text-slate-400 hover:text-rose-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {allergies.length === 0 && (
                  <div className="text-slate-400 text-sm italic py-2">No allergies listed yet.</div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
              <button 
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 font-bold text-sm"
              >
                Go Back
              </button>
              <Button onClick={performSafetyCheck} loading={isAnalyzing}>
                Complete Safety Review
              </Button>
            </div>
          </Card>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Tip:</strong> If you're not sure about allergies, our AI will provide a general side-effect profile for you to review with your pharmacist.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS DASHBOARD */}
      {step === 3 && analysis && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* HEADER / STATUS */}
          <div className={`p-8 rounded-[2.5rem] shadow-xl border-2 flex flex-col md:flex-row items-center gap-8 ${
            analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? 'bg-rose-50 border-rose-100' :
            safetyResult?.status === 'SAFE' ? 'bg-teal-50 border-teal-100' : 'bg-amber-50 border-amber-100'
          }`}>
            <div className="shrink-0">
              {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? (
                <div className="bg-rose-500 text-white p-5 rounded-3xl shadow-lg shadow-rose-200 animate-pulse">
                  <ShieldAlert size={48} />
                </div>
              ) : safetyResult?.status === 'SAFE' ? (
                <div className="bg-teal-500 text-white p-5 rounded-3xl shadow-lg shadow-teal-200">
                  <CheckCircle size={48} />
                </div>
              ) : (
                <div className="bg-amber-500 text-white p-5 rounded-3xl shadow-lg shadow-amber-200">
                  <AlertTriangle size={48} />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT 
                  ? 'Counterfeit Warning' 
                  : safetyResult?.status === 'SAFE' ? 'Safety Verified' : 'Risk Detected'}
              </h2>
              <p className={`text-lg font-medium ${
                analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT ? 'text-rose-700' :
                safetyResult?.status === 'SAFE' ? 'text-teal-700' : 'text-amber-700'
              }`}>
                {analysis.authenticityStatus === AuthenticityStatus.COUNTERFEIT 
                  ? 'Stop use immediately. This packaging shows signs of being fake.' 
                  : safetyResult?.explanation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DRUG IDENTITY CARD */}
            <Card className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Drug Identity</h3>
                  <h4 className="text-2xl font-black text-slate-900">{analysis.name}</h4>
                </div>
                <div className="text-right">
                  <Badge variant={analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC ? 'success' : 'danger'}>
                    {analysis.authenticityStatus}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">OCR Confidence: {Math.round(analysis.confidenceScore * 100)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Manufacturer</span>
                  <p className="text-sm font-bold text-slate-800">{analysis.manufacturer}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Drug Family</span>
                  <p className="text-sm font-bold text-slate-800">{analysis.drugFamily}</p>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Stethoscope size={16} className="text-teal-500" />
                  Active Ingredients
                </h5>
                <div className="space-y-2">
                  {analysis.activeIngredients.map((ing, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="font-semibold text-slate-700">{ing.name}</span>
                      <span className="text-slate-400 text-sm font-medium">{ing.dosage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* CONFIDENCE & REASONING */}
            <Card className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Authenticity Meter</h3>
              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="h-40 w-40 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Confidence', value: analysis.confidenceScore * 100 },
                          { name: 'Margin', value: (1 - analysis.confidenceScore) * 100 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                      >
                        <Cell fill={analysis.authenticityStatus === AuthenticityStatus.AUTHENTIC ? '#14b8a6' : '#f43f5e'} />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                    <span className="text-2xl font-black text-slate-800">{Math.round(analysis.confidenceScore * 100)}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Analysis</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Analysis Findings</h5>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{analysis.authenticityReasoning}"
                </p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SIDE EFFECTS */}
            <Card>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Common Side Effects</h3>
              <div className="space-y-3">
                {analysis.sideEffects.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0">
                    <span className="text-slate-700 font-medium">{item.effect}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      item.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                      item.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* SAFETY ALERTS */}
            <Card className={safetyResult?.status === 'SAFE' ? 'border-teal-100' : 'border-rose-100 ring-4 ring-rose-50'}>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Medical Alerts</h3>
              <div className="space-y-4">
                {safetyResult?.warnings.map((warning, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-100">
                    <ShieldAlert size={20} className="shrink-0" />
                    <p className="text-sm font-bold leading-tight">{warning}</p>
                  </div>
                ))}
                {safetyResult?.warnings.length === 0 && (
                  <div className="flex gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
                    <CheckCircle size={20} className="shrink-0" />
                    <p className="text-sm font-bold leading-tight">No cross-reactions detected for your profile.</p>
                  </div>
                )}
                <div className="mt-4 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase mb-1">System Conclusion</h5>
                  <p className="text-xs text-slate-600 italic">
                    {safetyResult?.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
            <Button variant="secondary" onClick={reset} className="w-full sm:w-auto">
              <RefreshCw size={18} /> Verify Another Medicine
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Export Safety Report (PDF)
            </Button>
          </div>

          <div className="text-center p-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
              <strong>Medical Disclaimer:</strong> This AI verification is an experimental tool and does not replace professional medical advice, clinical diagnostics, or the expertise of qualified healthcare providers. If you suspect a medication is counterfeit or you experience adverse symptoms, consult a doctor immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
