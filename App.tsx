
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, FolderOpen, FileText, ChevronLeft, LayoutDashboard, Settings, Info, WifiOff } from 'lucide-react';
import { Project, ModelRelease, ViewState } from './types';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import ReleaseForm from './components/ReleaseForm';
import ReleaseView from './components/ReleaseView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('releasemate_data');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading data", e);
      }
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('releasemate_data', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setView('dashboard');
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setView('project-detail');
  };

  const deleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project and all its signed releases? This action cannot be undone.")) {
      setProjects(prev => prev.filter(p => p.id !== id));
      setView('dashboard');
      setSelectedProjectId(null);
    }
  };

  const addRelease = (release: ModelRelease) => {
    setProjects(prev => prev.map(p => {
      if (p.id === release.projectId) {
        return { ...p, releases: [release, ...p.releases] };
      }
      return p;
    }));
    setView('project-detail');
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    setView('project-detail');
  };

  const handleReleaseSelect = (id: string) => {
    setSelectedReleaseId(id);
    setView('view-release');
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);
  const currentRelease = currentProject?.releases.find(r => r.id === selectedReleaseId);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">ReleaseMate</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Model Release Pro</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setView('new-project')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'new-project' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Plus size={20} />
            <span className="font-medium">New Project</span>
          </button>
        </nav>

        <div className="p-6 mt-auto">
          {!isOnline && (
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
              <WifiOff size={14} />
              Offline Mode
            </div>
          )}
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400">Signed Releases</p>
            <p className="text-xl font-bold">{projects.reduce((acc, p) => acc + p.releases.length, 0)}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20 pt-[env(safe-area-inset-top)]">
           <div className="flex flex-col">
             <h1 className="text-xl font-bold text-blue-400">ReleaseMate</h1>
             {!isOnline && <span className="text-[10px] text-amber-400 font-bold uppercase tracking-tighter">Offline</span>}
           </div>
           <button 
             onClick={() => setView('dashboard')}
             className="p-2 text-slate-300 hover:bg-slate-800 rounded-full"
           >
             <LayoutDashboard size={24} />
           </button>
        </header>

        <div className="max-w-5xl w-full mx-auto p-4 md:p-8 pb-32">
          {view === 'dashboard' && (
            <Dashboard 
              projects={projects} 
              onSelectProject={handleProjectSelect} 
              onNewProject={() => setView('new-project')}
              onDeleteProject={deleteProject}
            />
          )}

          {view === 'project-detail' && currentProject && (
            <ProjectDetail 
              project={currentProject} 
              onBack={() => setView('dashboard')}
              onEdit={() => setView('edit-project')}
              onDelete={() => deleteProject(currentProject.id)}
              onNewRelease={() => setView('new-release')}
              onSelectRelease={handleReleaseSelect}
            />
          )}

          {view === 'new-project' && (
            <ProjectForm 
              onSave={addProject} 
              onCancel={() => setView('dashboard')} 
            />
          )}

          {view === 'edit-project' && currentProject && (
            <ProjectForm 
              initialProject={currentProject}
              onSave={updateProject} 
              onCancel={() => setView('project-detail')} 
            />
          )}

          {view === 'new-release' && currentProject && (
            <ReleaseForm 
              projectId={currentProject.id}
              projectName={currentProject.name}
              legalText={currentProject.legalText}
              onSave={addRelease}
              onCancel={() => setView('project-detail')}
            />
          )}

          {view === 'view-release' && currentRelease && (
            <ReleaseView 
              release={currentRelease}
              project={currentProject!}
              onBack={() => setView('project-detail')}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      {view === 'dashboard' && (
        <button 
          onClick={() => setView('new-project')}
          className="md:hidden fixed bottom-10 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90 z-30 mb-[env(safe-area-inset-bottom)]"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
};

export default App;
