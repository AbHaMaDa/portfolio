import React from 'react';
import { Profile } from '../types';

interface FooterProps {
  profile?: Profile | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {profile?.fullName || 'Portfolio'}. All rights reserved.
        </p>
        <p className="flex items-center gap-1">
          Built with React, NestJS & MongoDB
        </p>
      </div>
    </footer>
  );
};
