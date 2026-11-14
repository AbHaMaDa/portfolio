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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090B]/85 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Standalone Brand Logo */}
        <Link
          to="/"
          className="flex items-center group transition"
          title="Home"
        >
          <div className="w-10 h-10 rounded-xl bg-[#141418] border border-white/[0.1] p-1 flex items-center justify-center shadow-md shadow-purple-500/10 group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/20 group-hover:scale-105 transition-all duration-300">
            <img src="/logo.svg" alt="AB Logo" className="w-full h-full object-contain" />
          </div>
        </Link>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-5 sm:gap-7 text-sm font-medium text-slate-300">
          {isHome ? (
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a
                href="#about"
                className="hover:text-white transition-colors duration-200 hover:text-cyan-400"
              >
                About
              </a>
              <a
                href="#skills"
                className="hover:text-white transition-colors duration-200 hover:text-cyan-400"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="hover:text-white transition-colors duration-200 hover:text-cyan-400"
              >
                Projects
              </a>
            </div>
          ) : (
            <Link to="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
          )}

          {/* Social Icons & Admin CTA */}
          <div className="flex items-center gap-3 sm:gap-4 md:border-l md:border-white/[0.08] md:pl-6">
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white hover:scale-110 transition p-1"
                title="GitHub"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-[#06B6D4] hover:scale-110 transition p-1"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-[#F97316] hover:scale-110 transition p-1"
                title="Resume"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}

            {/* Distinct Admin Button styled with subtle orange border */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/40 text-orange-400 hover:border-orange-500 hover:bg-orange-500/10 text-xs font-medium transition-all duration-200 shadow-sm shadow-orange-500/10"
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
