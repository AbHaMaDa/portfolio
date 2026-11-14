import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ExternalLink, User, Layers, FolderGit2 } from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { ProfileEditor } from './ProfileEditor';
import { SkillManager } from './SkillManager';
import { ProjectManager } from './ProjectManager';

type Tab = 'profile' | 'skills' | 'projects';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const navigate = useNavigate();
  const { data, isLoading } = usePortfolio();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const allSkillsList = data?.skills ? Object.values(data.skills).flat() : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-base tracking-tight">Admin Dashboard</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
              Live
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-slate-800/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Skills ({allSkillsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects ({data?.projects?.length || 0})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Loading admin data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'profile' && <ProfileEditor profile={data?.profile} />}
            {activeTab === 'skills' && <SkillManager skillsGrouped={data?.skills || {}} />}
            {activeTab === 'projects' && (
              <ProjectManager
                projects={data?.projects || []}
                availableSkills={allSkillsList}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
