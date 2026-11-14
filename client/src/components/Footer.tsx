import React from 'react';
import { Profile } from '../types';

interface FooterProps {
  profile?: Profile | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const name = profile?.fullName || 'Abdullah Awadallah';

  return (
    <footer className="border-t border-white/[0.08] bg-[#09090B] py-12 mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p className="flex items-center gap-1.5 font-medium">
          <span>© {new Date().getFullYear()}</span>
          <span className="text-slate-300">{name}</span>
          <span>• All rights reserved.</span>
        </p>
        <p className="flex items-center gap-2 text-slate-400">
          <span>Built with React, NestJS & MongoDB</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
          <span>Strict Dark Theme</span>
        </p>
      </div>
    </footer>
  );
};
