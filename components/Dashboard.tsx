
import React from 'react';
import { Folder, Clock, Users, ChevronRight, Trash2, Calendar } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onSelectProject, onNewProject, onDeleteProject }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Projects</h2>
          <p className="text-slate-500 mt-1">Manage your shoots and track completed model releases.</p>
        </div>
        <button 
          onClick={onNewProject}
          className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all"
        >
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No projects yet</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Create your first shoot project to start collecting model release forms.</p>
          <button 
            onClick={onNewProject}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="relative group">
              <button
                onClick={() => onSelectProject(project.id)}
                className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Folder size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 text-sm font-bold">
                    <Calendar size={14} />
                    {project.shootDate ? new Date(project.shootDate).toLocaleDateString() : 'No Date'}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">{project.description || 'No description provided.'}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} />
                    <span className="text-sm font-bold">{project.releases.length} Releases</span>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" size={20} />
                </div>
              </button>
              
              {/* Quick Delete Overlay */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id);
                }}
                className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title="Delete Project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
