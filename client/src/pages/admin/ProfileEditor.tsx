import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Save, Upload, CheckCircle2, AlertCircle, Sparkles, Check } from 'lucide-react';
import { portfolioApi } from '../../api/portfolio';
import { Profile } from '../../types';

interface ProfileEditorProps {
  profile?: Profile | null;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Profile>>({
    fullName: '',
    headline: '',
    bio: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    resumeUrl: '',
    avatarUrl: '/your-photo.png',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        resumeUrl: profile.resumeUrl || '',
        avatarUrl: profile.avatarUrl || '/your-photo.png',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      await portfolioApi.updateProfile(formData);
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update profile.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setFeedback(null);

    try {
      const res = await portfolioApi.uploadFile(file);
      setFormData((prev) => ({ ...prev, resumeUrl: res.url }));
      setFeedback({ type: 'success', message: 'Resume uploaded! Save changes to apply.' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to upload resume file.' });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setFeedback(null);

    try {
      const res = await portfolioApi.uploadFile(file);
      setFormData((prev) => ({ ...prev, avatarUrl: res.url }));
      setFeedback({ type: 'success', message: 'New portrait uploaded! Click Save Profile to apply.' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to upload portrait image.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const currentAvatar = formData.avatarUrl || '/your-photo.png';

  return (
    <div className="space-y-8">
      {/* ── Portrait / Photo Selector Card ── */}
      <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <Sparkles className="w-5 h-5 text-[#F97316]" />
          <h2 className="text-xl font-bold text-white">Hero 3D Cutout Portrait</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Choose between your uploaded portraits or upload a new cutout transparent PNG directly from the app.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Live Preview Circle */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-[#09090B] border border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase text-slate-500 mb-3 tracking-wider">Live Preview</span>
            <div className="relative w-40 h-40 rounded-full bg-[#141418] border border-white/[0.12] flex items-end justify-center shadow-xl">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#8B5CF6]/30 via-[#F97316]/20 to-[#06B6D4]/30 blur-lg -z-10" />
              <img
                src={currentAvatar}
                alt="Current Portrait Preview"
                className="absolute -top-7 w-[85%] h-[120%] object-contain object-bottom filter grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-300"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-4 truncate max-w-[200px]">
              {currentAvatar}
            </span>
          </div>

          {/* Preset Buttons & Custom Uploader */}
          <div className="md:col-span-8 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Switch Presets
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Preset 1 */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: '/photo-1.png' }))}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  formData.avatarUrl === '/photo-1.png'
                    ? 'bg-[#181820] border-[#06B6D4] shadow-md shadow-cyan-500/10'
                    : 'bg-[#141418] border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#09090B] border border-white/[0.08] overflow-hidden flex items-end justify-center shrink-0">
                  <img src="/photo-1.png" alt="Photo 1" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Photo 1</span>
                    {formData.avatarUrl === '/photo-1.png' && <Check className="w-3.5 h-3.5 text-[#06B6D4]" />}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Dark Coat & Glasses</div>
                </div>
              </button>

              {/* Preset 2 */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: '/photo-2.png' }))}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  formData.avatarUrl === '/photo-2.png' || formData.avatarUrl === '/your-photo.png'
                    ? 'bg-[#181820] border-[#F97316] shadow-md shadow-orange-500/10'
                    : 'bg-[#141418] border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#09090B] border border-white/[0.08] overflow-hidden flex items-end justify-center shrink-0">
                  <img src="/photo-2.png" alt="Photo 2" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Photo 2 (Active)</span>
                    {(formData.avatarUrl === '/photo-2.png' || formData.avatarUrl === '/your-photo.png') && (
                      <Check className="w-3.5 h-3.5 text-[#F97316]" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Developer Hoodie & Penguin</div>
                </div>
              </button>
            </div>

            {/* Custom File Upload Option */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Or Upload Any Custom Cutout Image
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="/your-photo.png, /api/upload/..., or https://..."
                  className="flex-1 px-3 py-2 bg-[#09090B] border border-white/[0.08] rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-[#06B6D4] transition"
                />
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#141418] border border-white/[0.08] hover:border-white/[0.2] text-slate-200 rounded-xl text-xs font-medium transition shrink-0">
                  <Upload className="w-4 h-4 text-[#F97316]" />
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload PNG'}</span>
                  <input
                    type="file"
                    accept="image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Tip: Transparent background PNG or WebP works best for the 3D pop-out circle effect.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Profile Form ── */}
      <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Profile Details & Bio</h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your public personal biography, headline, location, and social links.
          </p>
        </div>

        {feedback && (
          <div
            className={`flex items-center gap-2 p-3.5 rounded-xl text-xs mb-6 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/25 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#06B6D4] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Cairo, Egypt"
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#06B6D4] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Headline *
            </label>
            <input
              type="text"
              required
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. Full-Stack Software Engineer"
              className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#06B6D4] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Bio (Markdown supported)
            </label>
            <textarea
              rows={6}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a few paragraphs about your engineering background, architecture philosophy, and stack..."
              className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#06B6D4] transition font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#06B6D4] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#06B6D4] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Resume PDF URL or Upload
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://... or upload PDF below"
                className="flex-1 px-3.5 py-2.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#06B6D4] transition"
              />
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#141418] border border-white/[0.08] hover:border-white/[0.2] text-slate-200 rounded-xl text-xs font-medium transition shrink-0">
                <Upload className="w-4 h-4 text-[#F97316]" />
                <span>{uploadingResume ? 'Uploading...' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-5 border-t border-white/[0.06]">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] hover:opacity-95 disabled:opacity-50 text-white font-semibold text-sm transition shadow-lg shadow-orange-500/25"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
