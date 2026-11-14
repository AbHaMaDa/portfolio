import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import {
  Plus,
  Trash2,
  Edit,
  Star,
  ExternalLink,
  Github,
  Upload,
  Eye,
  FileCode,
  X,
  AlertCircle,
} from 'lucide-react';
import { portfolioApi } from '../../api/portfolio';
import { Project, Skill } from '../../types';

interface ProjectManagerProps {
  projects: Project[];
  availableSkills: Skill[];
}

interface ProjectFormState {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  architectureNotes: string;
  repoUrl: string;
  liveUrl: string;
  thumbnailUrl: string;
  featured: boolean;
  sortOrder: number;
  skillIds: string[];
}

const emptyProject: ProjectFormState = {
  title: '',
  slug: '',
  summary: '',
  architectureNotes: '',
  repoUrl: '',
  liveUrl: '',
  thumbnailUrl: '',
  featured: false,
  sortOrder: 0,
  skillIds: [],
};

export const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, availableSkills }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormState>(emptyProject);
  const [previewMarkdown, setPreviewMarkdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setFormData(emptyProject);
    setPreviewMarkdown(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setFormData({
      _id: project._id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      architectureNotes: project.architectureNotes || '',
      repoUrl: project.repoUrl || '',
      liveUrl: project.liveUrl || '',
      thumbnailUrl: project.thumbnailUrl || '',
      featured: project.featured || false,
      sortOrder: project.sortOrder || 0,
      skillIds: project.skills?.map((s) => s._id) || [],
    });
    setPreviewMarkdown(false);
    setError(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev._id
        ? prev.slug
        : title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
    }));
  };

  const toggleSkill = (skillId: string) => {
    setFormData((prev) => {
      const exists = prev.skillIds.includes(skillId);
      return {
        ...prev,
        skillIds: exists
          ? prev.skillIds.filter((id) => id !== skillId)
          : [...prev.skillIds, skillId],
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const res = await portfolioApi.uploadFile(file);
      setFormData((prev) => ({ ...prev, thumbnailUrl: res.url }));
    } catch {
      setError('Failed to upload thumbnail image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData._id) {
        await portfolioApi.updateProject(formData._id, formData);
      } else {
        await portfolioApi.createProject(formData);
      }
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save project.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await portfolioApi.updateProject(project._id, { featured: !project.featured });
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    } catch (err: unknown) {
      alert('Failed to update featured status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await portfolioApi.deleteProject(id);
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    } catch (err: unknown) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Projects Showcase</h2>
          <p className="text-xs text-slate-400 mt-1">
            Showcase your projects, technical architecture notes, and referenced skills.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-sm">
            No projects found. Click "New Project" to create your first portfolio project.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(project)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition"
                    title={project.featured ? 'Unmark Featured' : 'Mark Featured'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        project.featured ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                  <h3 className="font-bold text-white text-base">{project.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">
                {project.summary}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {project.skills?.map((s) => (
                  <span
                    key={s._id}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60"
                  >
                    {s.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
                <span className="font-mono">/{project.slug}</span>
                <div className="flex items-center gap-3">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white"
                      title="Live"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {formData._id ? 'Edit Project' : 'Create Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Real-Time Chat Platform"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. real-time-chat-platform"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Summary * (Short card description)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="A concise 1-2 sentence overview of the project and impact..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Skills selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Referenced Skills ({formData.skillIds.length} selected)
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-lg">
                  {availableSkills.map((s) => {
                    const selected = formData.skillIds.includes(s._id);
                    return (
                      <button
                        type="button"
                        key={s._id}
                        onClick={() => toggleSkill(s._id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                          selected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Architecture Notes with Markdown preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Architecture & Technical Breakdown (Markdown supported)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewMarkdown(!previewMarkdown)}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    {previewMarkdown ? (
                      <>
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Edit Markdown</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </>
                    )}
                  </button>
                </div>

                {previewMarkdown ? (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg min-h-[160px] prose prose-invert prose-xs max-w-none text-slate-300">
                    <ReactMarkdown>{formData.architectureNotes || '*No notes entered.*'}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    rows={6}
                    value={formData.architectureNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, architectureNotes: e.target.value })
                    }
                    placeholder="Describe system design, concurrency model, data flow, tradeoffs..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Thumbnail Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Order:</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
                >
                  {loading ? 'Saving...' : formData._id ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
