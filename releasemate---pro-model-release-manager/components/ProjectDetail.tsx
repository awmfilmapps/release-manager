
import React, { useState } from 'react';
import { ChevronLeft, Plus, FileText, User, Mail, Calendar, Edit3, Download, Trash2, MapPin, FileDown, Loader2 } from 'lucide-react';
import { Project, ModelRelease } from '../types';
import { jsPDF } from 'jspdf';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onNewRelease: () => void;
  onSelectRelease: (id: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onEdit, onDelete, onNewRelease, onSelectRelease }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    if (project.releases.length === 0) {
      alert("No releases to export.");
      return;
    }

    const headers = ["Model Name", "Email Address", "Signed Date", "Is Minor"];
    const rows = project.releases.map(r => [
      `"${r.modelName.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      r.currentDate,
      r.isMinor ? "Yes" : "No"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${project.name.replace(/[^a-z0-9]/gi, '_')}_contacts.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAllPDFs = () => {
    if (project.releases.length === 0) {
      alert("No releases to export.");
      return;
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const margin = 20;

      project.releases.forEach((release, index) => {
        if (index > 0) doc.addPage();
        let y = 20;

        // Header
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42);
        doc.text('MODEL RELEASE', margin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Project: ${project.name}`, margin, y);
        doc.text(`Date Signed: ${new Date(release.currentDate).toLocaleDateString()}`, 190, y, { align: 'right' });
        y += 15;

        // Model Info
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('MODEL INFORMATION', margin, y);
        y += 8;

        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
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

        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const splitText = doc.splitTextToSize(project.legalText, 170);
        doc.text(splitText, margin, y);
        y += (splitText.length * 3.5) + 15;

        // Signatures
        if (y > 240) { doc.addPage(); y = 20; }
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
          doc.text(`Guardian Signature (${release.guardianName}):`, margin, y);
          y += 5;
          doc.addImage(release.guardianSignature, 'PNG', margin, y, 60, 20);
        }
      });

      doc.save(`${project.name.replace(/\s+/g, '_')}_Releases.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{project.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-slate-500">
              <span className="flex items-center gap-1 text-sm font-medium"><User size={14} /> {project.clientName || 'Private Client'}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1 text-sm font-medium"><MapPin size={14} /> {project.location || 'No Location'}</span>
              {project.shootDate && (
                <>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center gap-1 text-sm font-bold text-blue-600"><Calendar size={14} /> {new Date(project.shootDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExportAllPDFs}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold transition-all border border-blue-100 shadow-sm disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
            <span className="hidden sm:inline">Export All PDFs</span>
          </button>
          <button 
            onClick={handleExportCSV}
            title="Export names and emails to CSV"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all border border-slate-200 shadow-sm"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all border border-slate-200"
          >
            <Edit3 size={18} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button 
            onClick={onDelete}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold transition-all border border-red-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Info Stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
            <h4 className="text-blue-100 font-medium text-sm mb-1">Total Releases</h4>
            <div className="text-4xl font-black mb-4">{project.releases.length}</div>
            <button 
              onClick={onNewRelease}
              className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Plus size={20} />
              Sign New Model
            </button>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-4">Project Description</h4>
            <p className="text-slate-700 leading-relaxed">{project.description || 'No description.'}</p>
          </div>
        </div>

        {/* Releases List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-800">Completed Releases</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{project.releases.length} Records</span>
          </div>
          
          {project.releases.length === 0 ? (
            <div className="bg-slate-100 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <FileText size={48} className="mb-4 opacity-20" />
              <p>No model releases signed yet for this project.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {project.releases.map(release => (
                <button
                  key={release.id}
                  onClick={() => onSelectRelease(release.id)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
                >
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{release.modelName}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 truncate"><Mail size={12} className="shrink-0" /> {release.email}</span>
                      <span className="flex items-center gap-1 shrink-0"><Calendar size={12} className="shrink-0" /> {new Date(release.currentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${release.isMinor ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {release.isMinor ? 'Minor' : 'Adult'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
