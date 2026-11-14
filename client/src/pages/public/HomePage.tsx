import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Download,
  MapPin,
  Github,
  Linkedin,
  Filter,
  Code2,
  Terminal,
  Cpu,
} from 'lucide-react';
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
      p.skills?.some((s) => s.category?.toLowerCase() === selectedCategory.toLowerCase()),
    );
  }, [projects, selectedCategory]);

  const fullName = profile?.fullName || 'Abdullah Awadallah';
  const headline = profile?.headline || 'Full-Stack Software Engineer';
  const location = profile?.location || 'Cairo, Egypt';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-slate-300">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-[#06B6D4] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wider uppercase text-slate-400">Loading Portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-slate-300 p-6 text-center">
        <p className="text-[#F43F5E] font-medium mb-2">Failed to load portfolio.</p>
        <p className="text-xs text-slate-500">Please make sure the backend server is running on port 4000.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090B] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-cyan-200 overflow-hidden">
      {/* ── Ambient Radial Glows (60-30-10 Palette) ── */}
      {/* Top Left Neon Purple Glow (15% opacity) */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/15 blur-[140px] -z-10"
        aria-hidden="true"
      />
      {/* Top Right Vibrant Orange Glow (10% opacity) */}
      <div
        className="pointer-events-none absolute top-20 -right-40 w-[550px] h-[550px] rounded-full bg-[#F97316]/10 blur-[130px] -z-10"
        aria-hidden="true"
      />
      {/* Center Subtle Cyan Accent Glow */}
      <div
        className="pointer-events-none absolute top-[900px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#06B6D4]/5 blur-[150px] -z-10"
        aria-hidden="true"
      />

      <Navbar profile={profile} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-28 sm:space-y-36">
        {/* ── 1. Hero Section (Equal 2-Column Split Layout) ── */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl gap-8 sm:gap-12 lg:gap-8 items-center pt-4 sm:pt-8">
          {/* Left Column */}
          <div className="flex flex-col items-start text-left">
            {/* Live Status Indicator Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141418] border border-white/[0.08] shadow-sm mb-6 sm:mb-8 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F43F5E]" />
              </span>
              <span className="text-xs font-medium text-slate-300 tracking-wide">
                Available for new opportunities
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.12]">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                {fullName}
              </span>
              .
            </h1>

            {/* Subtitle in Vibrant Orange & Location */}
            <div className="space-y-2 mb-8">
              <p className="text-xl sm:text-2xl font-bold text-[#F97316] tracking-tight">
                {headline}
              </p>
              <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-[#06B6D4] shrink-0" />
                <span>{location}</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-10 w-full sm:w-auto">
              {/* Primary CTA Button: Vibrant Orange to Coral Red */}
              <a
                href={profile?.resumeUrl || '#about'}
                download={Boolean(profile?.resumeUrl)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] text-white font-semibold text-sm hover:opacity-95 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>

              {/* GitHub Glass Button */}
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#181820] text-slate-200 font-medium text-sm transition-all duration-200"
                >
                  <Github className="w-4 h-4 text-slate-300" />
                  <span>GitHub</span>
                </a>
              )}

              {/* LinkedIn Glass Button */}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#181820] text-slate-200 font-medium text-sm transition-all duration-200"
                >
                  <Linkedin className="w-4 h-4 text-[#06B6D4]" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>

            {/* Quick Stats Bar (3-Column Card) */}
            <div className="w-full bg-[#141418] border border-white/[0.08] rounded-2xl p-4 sm:p-5 grid grid-cols-3 divide-x divide-white/[0.08] shadow-xl">
              <div className="px-3 sm:px-4 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#F97316] tracking-tight">
                  10+
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-400 mt-0.5">
                  Projects Built
                </div>
              </div>

              <div className="px-3 sm:px-4 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#06B6D4] tracking-tight">
                  15+
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-400 mt-0.5">
                  Tech Stack
                </div>
              </div>

              <div className="px-3 sm:px-4 text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-extrabold text-[#8B5CF6] tracking-tight truncate">
                  Full MERN
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-400 mt-0.5">
                  & API Architecture
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scaled Up 3D Pop-out Portrait Frame */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative group flex items-center justify-center w-full pt-10 sm:pt-14">
              {/* Subtle ambient Purple (#8B5CF6) and Orange (#F97316) outer glow */}
              <div
                className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-[#8B5CF6]/30 via-[#F97316]/20 to-[#8B5CF6]/30 blur-2xl sm:blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Decorative Subtle Orbit Ring */}
              <div
                className="absolute -inset-2 sm:-inset-3 rounded-full border border-dashed border-white/[0.08] pointer-events-none -z-10 animate-[spin_50s_linear_infinite]"
                aria-hidden="true"
              />

              {/* Dark Circular Frame (#141418) scaled up to match text height */}
              <div className="relative w-80 h-80 sm:w-[400px] sm:h-[400px] lg:w-[460px] lg:h-[460px] rounded-full bg-[#141418] border border-white/[0.12] shadow-2xl flex items-end justify-center overflow-visible">
                {/* 3D Pop-out Portrait Image with zoom & framing */}
                <img
                  src={profile?.avatarUrl || '/your-photo.png'}
                  alt={fullName}
                  className="absolute -top-6 sm:-top-8 lg:-top-10 w-[95%] h-[105%] object-cover object-top scale-105 filter grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-110 transition-all duration-500 ease-out select-none pointer-events-none drop-shadow-2xl"
                  onError={(e) => {
                    // Graceful fallback if custom image is missing
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />

                {/* Modern Fallback Silhouette if image file fails to load */}
                <div
                  style={{ display: 'none' }}
                  className="w-full h-full rounded-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#141418] to-[#09090B]"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-2">
                    AA
                  </div>
                  <span className="text-sm text-slate-400 font-medium">{fullName}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. About Me Section ── */}
        {profile?.bio && (
          <section id="about" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#F97316] via-[#F43F5E] to-[#8B5CF6]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                About Me
              </h2>
            </div>

            <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed text-base sm:text-lg">
                <ReactMarkdown>{profile.bio}</ReactMarkdown>
              </div>

              {/* Highlights pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141418] border border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-[#F97316]">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Full-Stack Craft</div>
                    <div className="text-[11px] text-slate-400">Frontend to Microservices</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141418] border border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-[#06B6D4]">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Clean Code</div>
                    <div className="text-[11px] text-slate-400">TypeScript & Scalable Patterns</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141418] border border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-[#8B5CF6]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">High Performance</div>
                    <div className="text-[11px] text-slate-400">Optimized DB & Responsive UI</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. Technical Skills Section ── */}
        <section id="skills" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#06B6D4] to-[#3B82F6]" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Technical Skills
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Core competencies, architectural frameworks, and developer toolchain.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(skills).map(([category, catSkills]) => (
              <div
                key={category}
                className="flex flex-col p-6 rounded-2xl bg-[#121216] border border-white/[0.08] shadow-xl hover:border-white/[0.15] transition-all duration-300"
              >
                <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/[0.06]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#06B6D4]">
                    {category}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {catSkills.length} Technologies
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {catSkills.map((skill) => (
                    <SkillBadge key={skill._id} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Featured Projects Section ── */}
        <section id="projects" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#F97316] to-[#F43F5E]" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Featured Projects
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Production systems, full-stack architectures, and technical deep-dives.
                </p>
              </div>
            </div>

            {/* Category Filters */}
            {categories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-[#F97316] to-[#F43F5E] text-white shadow-md shadow-orange-500/20'
                        : 'bg-[#141418] text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-[#121216] border border-white/[0.08] text-slate-500 text-sm">
              No projects found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
