import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Star, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="group flex flex-col rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden transition-all duration-200">
      {project.thumbnailUrl && (
        <div className="relative aspect-video overflow-hidden bg-slate-950">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {project.featured && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-amber-500/90 text-slate-950 text-xs font-semibold shadow">
              <Star className="w-3.5 h-3.5 fill-current" />
              Featured
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          {!project.thumbnailUrl && project.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
          {project.summary}
        </p>

        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.skills.map((skill) => (
              <span
                key={skill._id || skill.name}
                className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-sm">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition"
          >
            <span>Read Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-3 text-slate-400">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
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
                className="hover:text-white transition"
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
