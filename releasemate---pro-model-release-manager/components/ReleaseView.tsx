
import React from 'react';
import { ChevronLeft, FileDown, Share, User, Mail, Home, Calendar, Shield, CheckCircle2 } from 'lucide-react';
import { ModelRelease, Project } from '../types';
import { jsPDF } from 'jspdf';

interface ReleaseViewProps {
  release: ModelRelease;
  project: Project;
  onBack: () => void;
}

const ReleaseView: React.FC<ReleaseViewProps> = ({ release, project, onBack }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('MODEL RELEASE', margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Project: ${project.name}`, margin, y);
    doc.text(`Date Signed: ${new Date(release.currentDate).toLocaleDateString()}`, 190, y, { align: 'right' });
    y += 15;

    // Model Info
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text('MODEL INFORMATION', margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text(`Name: ${release.modelName}`, margin, y);
    y += 6;
    doc.text(`Email: ${release.email}`, margin, y);
    y += 6;
    doc.text(`Age: ${release.age} (DOB: ${new Date(release.dateOfBirth).toLocaleDateString()})`, margin, y);
    y += 6;
    doc.text(`Address: ${release.address || 'Not provided'}`, margin, y);
    y += 15;

    // Legal Text
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('RELEASE TERMS', margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const splitText = doc.splitTextToSize(project.legalText, 170);
    doc.text(splitText, margin, y);
    y += (splitText.length * 4) + 15;

    // Signatures
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('SIGNATURES', margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text('Model Signature:', margin, y);
    y += 5;
    if (release.signature) {
      doc.addImage(release.signature, 'PNG', margin, y, 60, 20);
      y += 25;
    }

    if (release.isMinor && release.guardianSignature) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.text(`Guardian Signature (${release.guardianName}):`, margin, y);
      y += 5;
      doc.addImage(release.guardianSignature, 'PNG', margin, y, 60, 20);
    }

    doc.save(`Release_${release.modelName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Signed Release</h2>
            <div className="flex items-center gap-2">
               <p className="text-slate-500">ID: {release.id.split('-')[0].toUpperCase()}</p>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase"><CheckCircle2 size={12}/> Legally Signed</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generatePDF}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold transition-all"
          >
            <FileDown size={20} />
            Download PDF
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all">
            <Share size={20} />
            Share
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 text-white p-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">MODEL RELEASE</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Project: {project.name}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black mb-1">Execution Date</p>
            <p className="text-xl font-bold">{new Date(release.currentDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">Model Particulars</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-slate-300 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-black">Full Legal Name</p>
                    <p className="text-lg font-bold text-slate-900 leading-tight">{release.modelName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-slate-300 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-black">Email Address</p>
                    <p className="font-bold text-slate-700">{release.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-slate-300 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-black">Date of Birth</p>
                    <p className="font-bold text-slate-700">{new Date(release.dateOfBirth).toLocaleDateString()} ({release.age} yrs)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="text-slate-300 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-black">Residence</p>
                    <p className="font-medium text-slate-600">{release.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">Signatures</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-black mb-2">Primary Signature (Model)</p>
                  <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-6 shadow-inner flex items-center justify-center">
                    <img src={release.signature} alt="Signature" className="max-h-24 mix-blend-multiply" />
                  </div>
                </div>

                {release.isMinor && (
                  <div className="p-6 bg-amber-50/50 border-2 border-amber-100 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase tracking-widest">
                      <Shield size={16} /> Guardian Verification
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-600 uppercase tracking-wide font-bold mb-1">Guardian Name</p>
                      <p className="text-lg font-bold text-slate-900">{release.guardianName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-600 uppercase tracking-wide font-bold mb-2">Guardian Signature</p>
                      <div className="border border-amber-100 rounded-xl bg-white p-4 flex items-center justify-center shadow-sm">
                        {release.guardianSignature ? (
                           <img src={release.guardianSignature} alt="Guardian Signature" className="max-h-16 mix-blend-multiply" />
                        ) : (
                          <span className="text-xs text-slate-400 italic">Signature Missing</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">Agreement Text</h3>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-serif max-h-[600px] overflow-y-auto italic whitespace-pre-line shadow-inner">
                {project.legalText}
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] text-blue-700 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Legal Status
                </p>
                <p className="text-xs text-blue-900/70">This document was digitally signed and timestamped on execution. The signatures are legally binding acknowledgments of the terms above.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseView;
