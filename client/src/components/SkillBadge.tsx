import React from 'react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
  showProficiency?: boolean;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, showProficiency = true }) => {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
      <div className="flex items-center gap-2.5 min-w-0">
        {skill.iconUrl ? (
          <img src={skill.iconUrl} alt={skill.name} className="w-5 h-5 object-contain" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        )}
        <span className="text-sm font-medium text-slate-200 truncate">{skill.name}</span>
      </div>

      {showProficiency && (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(Math.max(skill.proficiency, 0), 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400">{skill.proficiency}%</span>
        </div>
      )}
    </div>
  );
};
