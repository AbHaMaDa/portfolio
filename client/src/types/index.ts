export interface Profile {
  _id?: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  avatarUrl?: string;
  updatedAt?: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  architectureNotes?: string;
  repoUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  featured: boolean;
  sortOrder: number;
  skills: Skill[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioData {
  profile: Profile | null;
  skills: Record<string, Skill[]>;
  projects: Project[];
}

export interface AuthResponse {
  access_token: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
