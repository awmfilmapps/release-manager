
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { FileText, Info, Calendar } from 'lucide-react';

interface ProjectFormProps {
  onSave: (project: Project) => void;
  onCancel: () => void;
  initialProject?: Project;
}

const DEFAULT_LEGAL_TEXT = `I hereby irrevocably grant to the Photographer and those acting with his/her permission and authority, the right and license to use, reuse, publish, and republish photographic pictures of me or in which I may be included, in whole or in part, in conjunction with my own or a fictitious name, or reproductions thereof in color or otherwise, made through any medium at his/her studios or elsewhere, and in any and all media now or hereafter known, for illustration, promotion, art, editorial, advertising, trade, or any other purpose whatsoever. I also consent to the use of any published matter in conjunction therewith.

I hereby waive any right that I may have to inspect or approve the finished product or products and the advertising copy or other matter that may be used in connection therewith or the use to which it may be applied.

I hereby release, discharge and agree to save harmless the Photographer and those acting with his/her permission and authority from any liability by virtue of any blurring, distortion, alteration, optical illusion, or use in composite form, whether intentional or otherwise, that may occur or be produced in the taking of said picture or in any subsequent processing thereof, as well as any publication thereof, including without limitation any claims for libel or invasion of privacy.`;

const ProjectForm: React.FC<ProjectFormProps> = ({ onSave, onCancel, initialProject }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientName: '',
    location: '',
    shootDate: new Date().toISOString().split('T')[0],
    legalText: DEFAULT_LEGAL_TEXT
  });

  useEffect(() => {
    if (initialProject) {
      setFormData({
        name: initialProject.name,
        description: initialProject.description,
        clientName: initialProject.clientName,
        location: initialProject.location,
        shootDate: initialProject.shootDate || new Date().toISOString().split('T')[0],
        legalText: initialProject.legalText
      });
    }
  }, [initialProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const projectData: Project = {
      id: initialProject?.id || uuidv4(),
      ...formData,
      createdAt: initialProject?.createdAt || new Date().toISOString(),
      releases: initialProject?.releases || []
    };
    onSave(projectData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-300 mb-12">
      <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
        {initialProject ? 'Edit Shoot Project' : 'Create New Shoot'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Project Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Summer Fashion Collection 2024"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Shoot Date *</label>
            <div className="relative">
              <input 
                type="date" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={formData.shootDate}
                onChange={e => setFormData({ ...formData, shootDate: e.target.value })}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Client / Company</label>
            <input 
              type="text" 
              placeholder="e.g. Acme Studio"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Location</label>
            <input 
              type="text" 
              placeholder="e.g. Downtown Studio"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Project Notes</label>
          <textarea 
            rows={2}
            placeholder="Internal notes about the shoot..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <FileText size={18} className="text-blue-500" />
              Release Verbiage (Legal Terms)
            </label>
            <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">CUSTOMIZABLE</div>
          </div>
          <p className="text-xs text-slate-500">This text will be presented to every model signing a release for this project. Use the default or paste your own legal language.</p>
          <textarea 
            rows={8}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none font-serif italic text-sm text-slate-600"
            value={formData.legalText}
            onChange={e => setFormData({ ...formData, legalText: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
          >
            {initialProject ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
