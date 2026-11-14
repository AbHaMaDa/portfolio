import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Github, ExternalLink, Calendar, Star } from 'lucide-react';
import { useProject, usePortfolio } from '../../hooks/usePortfolio';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProject(slug || '');
  const { data: portfolio } = usePortfolio();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-slate-300">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-[#06B6D4] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wider uppercase text-slate-400">Loading Architecture Breakdown...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-slate-300 p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The project you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] text-white font-semibold text-sm transition shadow-lg shadow-orange-500/25"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090B] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-cyan-200">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/10 blur-[140px] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#F97316]/10 blur-[130px] -z-10"
        aria-hidden="true"
      />

      <Navbar profile={portfolio?.profile} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#06B6D4]" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        <article className="space-y-10">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.featured && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/25 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Featured Project
                </span>
              )}
              {project.createdAt && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {project.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] text-white font-semibold text-sm transition shadow-lg shadow-orange-500/25 hover:opacity-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#181820] text-slate-200 font-medium text-sm transition"
                >
                  <Github className="w-4 h-4 text-slate-300" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </header>

          {project.thumbnailUrl && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#121216] shadow-2xl">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {project.skills && project.skills.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.08] shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-3.5">
                Technical Stack & Architecture Components
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill._id || skill.name}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#141418] text-slate-200 border border-white/[0.06]"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.architectureNotes && (
            <section className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-white/[0.08] shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#06B6D4] to-[#8B5CF6]" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  System Architecture & Deep Dive
                </h2>
              </div>
              <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed text-sm sm:text-base">
                <ReactMarkdown>{project.architectureNotes}</ReactMarkdown>
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer profile={portfolio?.profile} />
    </div>
  );
};
