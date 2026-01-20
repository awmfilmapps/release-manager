
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Info, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ModelRelease } from '../types';
import { v4 as uuidv4 } from 'uuid';
import SignaturePad from './SignaturePad';
import { getLegalSummary } from '../services/geminiService';

interface ReleaseFormProps {
  projectId: string;
  projectName: string;
  legalText: string;
  onSave: (release: ModelRelease) => void;
  onCancel: () => void;
}

const ReleaseForm: React.FC<ReleaseFormProps> = ({ projectId, projectName, legalText, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    modelName: '',
    dateOfBirth: '',
    address: '',
    email: '',
    guardianName: ''
  });
  const [signature, setSignature] = useState('');
  const [guardianSignature, setGuardianSignature] = useState('');
  const [age, setAge] = useState<number>(0);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Age calculation
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(0);
    }
  }, [formData.dateOfBirth]);

  const fetchSummary = async () => {
    setIsLoadingAi(true);
    const summary = await getLegalSummary(legalText);
    setAiSummary(summary || '');
    setIsLoadingAi(false);
  };

  const isMinor = age > 0 && age < 18;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.modelName || !signature) {
      alert("Please provide the model's name and signature.");
      return;
    }

    // Strict Minor Validation
    if (isMinor) {
      if (!formData.guardianName.trim()) {
        alert("As the model is under 18, a legal guardian's name is required.");
        return;
      }
      if (!guardianSignature) {
        alert("As the model is under 18, a legal guardian's signature is required.");
        return;
      }
    }

    const newRelease: ModelRelease = {
      id: uuidv4(),
      projectId,
      ...formData,
      age,
      currentDate,
      signature,
      guardianSignature: isMinor ? guardianSignature : undefined,
      isMinor,
      createdAt: new Date().toISOString()
    };
    onSave(newRelease);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Model Release</h2>
          <p className="text-blue-600 font-bold uppercase text-xs tracking-widest mt-1">Project: {projectName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Info size={20} className="text-blue-500" />
              Model Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Legal Name *</label>
                <input 
                  type="text" required
                  placeholder="Legal Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={formData.modelName}
                  onChange={e => setFormData({ ...formData, modelName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address *</label>
                <input 
                  type="email" required
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Date of Birth *</label>
                <input 
                  type="date" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Calculated Age</label>
                <div className={`w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold flex items-center gap-2 ${age > 0 ? (isMinor ? 'text-amber-600' : 'text-emerald-600') : 'text-slate-400'}`}>
                  {age > 0 ? (
                    <>
                      {age} years old
                      {isMinor && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] uppercase">Minor</span>}
                    </>
                  ) : '—'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Today's Date</label>
                <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-600">
                  {new Date(currentDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Home Address</label>
              <input 
                type="text"
                placeholder="123 Studio Way, Apt 4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {isMinor && (
              <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl animate-in fade-in zoom-in-95 duration-300 ring-4 ring-amber-50">
                <div className="flex items-center gap-2 text-amber-700 mb-6">
                  <AlertTriangle size={20} className="animate-pulse" />
                  <div>
                    <h4 className="font-bold text-lg">Guardian Consent Required</h4>
                    <p className="text-xs font-medium opacity-80">The model is under 18 years of age. A parent or legal guardian must complete this section.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-amber-800 uppercase tracking-wide">Legal Guardian Full Name *</label>
                    <input 
                      type="text" 
                      required={isMinor}
                      placeholder="Parent or Guardian's Legal Name"
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                      value={formData.guardianName}
                      onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    />
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-inner">
                    <SignaturePad label="Guardian Signature" onCapture={setGuardianSignature} />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <SignaturePad label="Model Signature" onCapture={setSignature} />
            </div>
          </div>
        </div>

        {/* Right Column: Legal Text & AI Assistant */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Release Terms</h3>
              <button 
                onClick={fetchSummary}
                disabled={isLoadingAi}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider disabled:opacity-50"
              >
                <Sparkles size={14} />
                {isLoadingAi ? 'Summarizing...' : 'Simple Summary'}
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar text-sm text-slate-600 leading-relaxed space-y-4">
              {aiSummary ? (
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-900 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                  <p className="font-bold mb-2 flex items-center gap-1">
                    <Sparkles size={14} /> AI Plain-English Summary:
                  </p>
                  <div className="whitespace-pre-line">{aiSummary}</div>
                  <button 
                    onClick={() => setAiSummary('')}
                    className="mt-4 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Show full legal text
                  </button>
                </div>
              ) : (
                <p className="whitespace-pre-line font-serif italic text-slate-500">{legalText}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
             <h4 className="font-bold mb-2">Consent Checklist</h4>
             <ul className="space-y-3 text-sm text-blue-100">
               <li className="flex gap-2">
                 <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">✓</div>
                 I have read and understood the terms.
               </li>
               <li className="flex gap-2">
                 <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">✓</div>
                 I agree to the usage of my likeness.
               </li>
               <li className="flex gap-2">
                 <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">✓</div>
                 I am of legal age or have a guardian present.
               </li>
             </ul>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck size={24} />
            Submit Release
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReleaseForm;
