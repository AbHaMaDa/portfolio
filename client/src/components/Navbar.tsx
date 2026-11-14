import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, Github, Linkedin, FileText } from 'lucide-react';
import { Profile } from '../types';

interface NavbarProps {
  profile?: Profile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition">
          {profile?.fullName || 'Portfolio'}
          <span className="text-blue-500">.</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          {isHome ? (
            <>
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#skills" className="hover:text-white transition">Skills</a>
              <a href="#projects" className="hover:text-white transition">Projects</a>
            </>
          ) : (
            <Link to="/" className="hover:text-white transition">Home</Link>
          )}

          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
                title="Resume"
              >
                <FileText className="w-5 h-5" />
              </a>
            )}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
