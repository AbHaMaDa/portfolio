import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, MapPin, Github, Linkedin, Sparkles, Filter } from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SkillBadge } from '../../components/SkillBadge';
import { ProjectCard } from '../../components/ProjectCard';

export const HomePage: React.FC = () => {
  const { data, isLoading, error } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const profile = data?.profile;
  const skills = data?.skills || {};
  const projects = data?.projects || [];

  const categories = useMemo(() => {
    const cats = Object.keys(skills);
    return ['ALL', ...cats];
  }, [skills]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return projects;
    return projects.filter((p) =>
      p.skills?.some((s) => s.category?.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [projects, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300 p-6 text-center">
        <p className="text-red-400 font-medium mb-2">Failed to load portfolio details.</p>
        <p className="text-xs text-slate-500 mb-4">Make sure the backend server is running on port 4000.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar profile={profile} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-28">
        {/* Hero Section */}
        <section id="hero" className="pt-8 sm:pt-16 pb-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for new opportunities</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">{profile?.fullName || 'Developer'}</span>.
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 font-medium mb-6">
              {profile?.headline || 'Full-Stack Software Engineer'}
            </p>

            {profile?.location && (
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{profile.location}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              )}
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        {profile?.bio && (
          <section id="about" className="pt-4 scroll-mt-20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-6 rounded bg-blue-500" />
              About Me
            </h2>
            <div className="prose prose-invert prose-slate max-w-3xl text-slate-300 leading-relaxed text-base">
              <ReactMarkdown>{profile.bio}</ReactMarkdown>
            </div>
          </section>
        )}

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-2 h-6 rounded bg-blue-500" />
              Technical Skills
            </h2>
            <p className="text-sm text-slate-400">Core technologies, libraries, and architectural frameworks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, catSkills]) => (
              <div
                key={category}
                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4 pb-2 border-b border-slate-800">
                  {category}
                </h3>
                <div className="space-y-2.5">
                  {catSkills.map((skill) => (
                    <SkillBadge key={skill._id} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-2 h-6 rounded bg-blue-500" />
                Featured Projects
              </h2>
              <p className="text-sm text-slate-400">Production systems, architecture designs, and open-source work.</p>
            </div>

            {categories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
              No projects found matching the filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  );
};
