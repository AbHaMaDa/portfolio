import { apiClient } from './client';
import { PortfolioData, Profile, Skill, Project, AuthResponse, AdminUser } from '../types';

export const portfolioApi = {
  // Public
  getPortfolio: async (): Promise<PortfolioData> => {
    const { data } = await apiClient.get<PortfolioData>('/portfolio');
    return data;
  },
  getProjectBySlug: async (slug: string): Promise<Project> => {
    const { data } = await apiClient.get<Project>(`/projects/${slug}`);
    return data;
  },

  // Auth
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },
  getMe: async (): Promise<AdminUser> => {
    const { data } = await apiClient.get<AdminUser>('/auth/me');
    return data;
  },

  // Profile (Admin)
  updateProfile: async (profile: Partial<Profile>): Promise<Profile> => {
    const { data } = await apiClient.patch<Profile>('/profile', profile);
    return data;
  },

  // Skills (Admin)
  createSkill: async (skill: Omit<Skill, '_id' | 'createdAt' | 'updatedAt'>): Promise<Skill> => {
    const { data } = await apiClient.post<Skill>('/skills', skill);
    return data;
  },
  updateSkill: async (id: string, skill: Partial<Skill>): Promise<Skill> => {
    const { data } = await apiClient.patch<Skill>(`/skills/${id}`, skill);
    return data;
  },
  deleteSkill: async (id: string): Promise<{ deleted: boolean }> => {
    const { data } = await apiClient.delete<{ deleted: boolean }>(`/skills/${id}`);
    return data;
  },

  // Projects (Admin)
  createProject: async (project: {
    title: string;
    slug: string;
    summary: string;
    architectureNotes?: string;
    repoUrl?: string;
    liveUrl?: string;
    thumbnailUrl?: string;
    featured?: boolean;
    sortOrder?: number;
    skillIds?: string[];
  }): Promise<Project> => {
    const { data } = await apiClient.post<Project>('/projects', project);
    return data;
  },
  updateProject: async (
    id: string,
    project: Partial<{
      title: string;
      slug: string;
      summary: string;
      architectureNotes?: string;
      repoUrl?: string;
      liveUrl?: string;
      thumbnailUrl?: string;
      featured?: boolean;
      sortOrder?: number;
      skillIds?: string[];
    }>
  ): Promise<Project> => {
    const { data } = await apiClient.patch<Project>(`/projects/${id}`, project);
    return data;
  },
  deleteProject: async (id: string): Promise<{ deleted: boolean }> => {
    const { data } = await apiClient.delete<{ deleted: boolean }>(`/projects/${id}`);
    return data;
  },

  // Upload
  uploadFile: async (file: File): Promise<{ url: string; message?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<{ url: string; message?: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
