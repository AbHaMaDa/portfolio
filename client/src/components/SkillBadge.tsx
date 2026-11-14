import React from 'react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
  showProficiency?: boolean;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, showProficiency = true }) => {
  return (
    <div className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#181820] transition-all duration-200">
      <div className="flex items-center gap-2.5 min-w-0">
        {skill.iconUrl ? (
          <img src={skill.iconUrl} alt={skill.name} className="w-5 h-5 object-contain" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] group-hover:scale-125 transition-transform" />
        )}
        <span className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
          {skill.name}
        </span>
      </div>

      {showProficiency && (
        <div className="flex items-center gap-2.5">
          <div className="w-16 sm:w-20 bg-[#09090B] rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
            <div
              className="bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(skill.proficiency, 0), 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 group-hover:text-cyan-400 transition-colors w-7 text-right">
            {skill.proficiency}%
          </span>
        </div>
      )}
    </div>
  );
};
