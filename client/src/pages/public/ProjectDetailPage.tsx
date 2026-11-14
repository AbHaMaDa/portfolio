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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300 p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The project you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar profile={portfolio?.profile} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.featured && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Featured Project
                </span>
              )}
              {project.createdAt && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed">
              {project.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium text-sm transition"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </header>

          {project.thumbnailUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {project.skills && project.skills.length > 0 && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Technologies & Architecture Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill._id || skill.name}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.architectureNotes && (
            <section className="pt-4 border-t border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-6">
                System Architecture & Technical Notes
              </h2>
              <div className="prose prose-invert prose-blue max-w-none text-slate-300 leading-relaxed">
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
