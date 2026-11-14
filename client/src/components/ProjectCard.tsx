import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Star, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="group flex flex-col rounded-2xl bg-[#121216] border border-white/[0.08] hover:border-white/[0.18] hover:shadow-2xl hover:shadow-purple-500/5 overflow-hidden transition-all duration-300">
      {/* Thumbnail */}
      {project.thumbnailUrl && (
        <div className="relative aspect-video overflow-hidden bg-[#09090B]">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />
          {project.featured && (
            <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F97316]/95 backdrop-blur-md text-white text-[11px] font-bold shadow-lg shadow-orange-500/20">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-4 mb-2.5">
          <h3 className="text-xl font-bold text-white group-hover:text-[#06B6D4] transition-colors leading-snug">
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          {!project.thumbnailUrl && project.featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/25 text-[11px] font-semibold shrink-0">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 mb-5 leading-relaxed flex-1">
          {project.summary}
        </p>

        {/* Skill Badges */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.skills.map((skill) => (
              <span
                key={skill._id || skill.name}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#141418] text-slate-300 border border-white/[0.06] font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-sm">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06B6D4] hover:text-white transition-colors group/link"
          >
            <span>Read Architecture</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-3 text-slate-400">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:scale-110 transition p-1"
                title="Source Code"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#F97316] hover:scale-110 transition p-1"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
