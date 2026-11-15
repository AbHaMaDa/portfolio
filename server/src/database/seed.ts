/**
 * Database seed script — run once to create the initial admin user and populate
 * the portfolio with real data sourced from the CV and GitHub profile.
 *
 * Idempotent: profile/skills/projects are upserted by unique key, and the old
 * demo entries are removed on re-run.
 */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module.js';
import { AdminUser } from '../common/schemas/admin-user.schema.js';
import { Profile } from '../common/schemas/profile.schema.js';
import { Skill } from '../common/schemas/skill.schema.js';
import { Project } from '../common/schemas/project.schema.js';

interface SkillSeed {
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}

interface ProjectSeed {
  title: string;
  slug: string;
  summary: string;
  architectureNotes: string;
  repoUrl: string;
  liveUrl: string;
  thumbnailUrl: string;
  featured: boolean;
  sortOrder: number;
  skills: string[]; // skill names, resolved to _id after skills are seeded
}

// ── Real skills (from CV + GitHub README stack) ──────────────────────────────
// sortOrder is a GLOBAL ordering key: findAll() sorts by it, and the public
// /portfolio endpoint groups skills by category in first-appearance order.
// Keep contiguous blocks per category so category order is deterministic.
const SKILLS: SkillSeed[] = [
  // Backend Development (1–6)
  { name: 'PHP', category: 'Backend Development', proficiency: 90, sortOrder: 1 },
  { name: 'Laravel', category: 'Backend Development', proficiency: 88, sortOrder: 2 },
  { name: 'Object-Oriented Programming', category: 'Backend Development', proficiency: 85, sortOrder: 3 },
  { name: 'NestJS (Node.js)', category: 'Backend Development', proficiency: 80, sortOrder: 4 },
  { name: 'Django (Python)', category: 'Backend Development', proficiency: 75, sortOrder: 5 },
  { name: 'Medusa (Headless Commerce)', category: 'Backend Development', proficiency: 70, sortOrder: 6 },
  // Frontend Development (10–21)
  { name: 'HTML5', category: 'Frontend Development', proficiency: 95, sortOrder: 10 },
  { name: 'CSS3', category: 'Frontend Development', proficiency: 90, sortOrder: 11 },
  { name: 'JavaScript', category: 'Frontend Development', proficiency: 90, sortOrder: 12 },
  { name: 'TypeScript', category: 'Frontend Development', proficiency: 85, sortOrder: 13 },
  { name: 'Tailwind CSS', category: 'Frontend Development', proficiency: 90, sortOrder: 14 },
  { name: 'Bootstrap', category: 'Frontend Development', proficiency: 85, sortOrder: 15 },
  { name: 'SASS', category: 'Frontend Development', proficiency: 80, sortOrder: 16 },
  { name: 'React.js', category: 'Frontend Development', proficiency: 88, sortOrder: 17 },
  { name: 'Next.js', category: 'Frontend Development', proficiency: 80, sortOrder: 18 },
  { name: 'Redux', category: 'Frontend Development', proficiency: 78, sortOrder: 19 },
  { name: 'jQuery', category: 'Frontend Development', proficiency: 75, sortOrder: 20 },
  { name: 'Material UI', category: 'Frontend Development', proficiency: 75, sortOrder: 21 },
  { name: 'Chakra UI', category: 'Frontend Development', proficiency: 80, sortOrder: 22 },
  { name: 'GSAP', category: 'Frontend Development', proficiency: 75, sortOrder: 23 },
  // API & Integration (30–33)
  { name: 'JSON', category: 'API & Integration', proficiency: 90, sortOrder: 30 },
  { name: 'AJAX', category: 'API & Integration', proficiency: 85, sortOrder: 31 },
  { name: 'Postman', category: 'API & Integration', proficiency: 88, sortOrder: 32 },
  { name: 'Swagger', category: 'API & Integration', proficiency: 82, sortOrder: 33 },
  // Databases (40–42)
  { name: 'MySQL', category: 'Databases', proficiency: 88, sortOrder: 40 },
  { name: 'PostgreSQL', category: 'Databases', proficiency: 82, sortOrder: 41 },
  { name: 'phpMyAdmin', category: 'Databases', proficiency: 80, sortOrder: 42 },
  // Core Languages (50–52)
  { name: 'Python', category: 'Core Languages', proficiency: 85, sortOrder: 50 },
  { name: 'C', category: 'Core Languages', proficiency: 80, sortOrder: 51 },
  { name: 'C++', category: 'Core Languages', proficiency: 82, sortOrder: 52 },
  // DevOps & Platforms (60–62)
  { name: 'Docker', category: 'DevOps & Platforms', proficiency: 78, sortOrder: 60 },
  { name: 'WordPress', category: 'DevOps & Platforms', proficiency: 80, sortOrder: 61 },
  { name: 'Odoo', category: 'DevOps & Platforms', proficiency: 72, sortOrder: 62 },
  { name: 'Netlify', category: 'DevOps & Platforms', proficiency: 80, sortOrder: 63 },
  { name: 'Cloudflare', category: 'DevOps & Platforms', proficiency: 75, sortOrder: 64 },
  // Embedded & Robotics (70–73)
  { name: 'Arduino', category: 'Embedded & Robotics', proficiency: 78, sortOrder: 70 },
  { name: 'MATLAB', category: 'Embedded & Robotics', proficiency: 70, sortOrder: 71 },
  { name: 'Proteus', category: 'Embedded & Robotics', proficiency: 72, sortOrder: 72 },
  { name: 'PLC', category: 'Embedded & Robotics', proficiency: 70, sortOrder: 73 },
];

// ── Real projects (CV projects + GitHub repos) ───────────────────────────────
const PROJECTS: ProjectSeed[] = [
  {
    title: 'Stinson',
    slug: 'stinson',
    summary: 'A web-based text application built with JavaScript, deployed on Vercel.',
    architectureNotes: `### Overview

- **Frontend:** Vanilla **JavaScript** single-page app.
- **Deployment:** Hosted on **Vercel** with CI-friendly static builds.

### Links

- Live demo: https://stinson-sable.vercel.app
- Source: https://github.com/AbHaMaDa/Stinson`,
    repoUrl: 'https://github.com/AbHaMaDa/Stinson',
    liveUrl: 'https://stinson-sable.vercel.app',
    thumbnailUrl: '',
    featured: true,
    sortOrder: 1,
    skills: ['JavaScript', 'HTML5', 'CSS3'],
  },
  {
    title: 'Saall',
    slug: 'saall',
    summary: 'A full-stack web application built with Laravel and Blade, deployed on Vercel.',
    architectureNotes: `### Overview

- **Backend:** **Laravel** (PHP) with Blade server-rendered views.
- **Architecture:** Classic MVC — controllers handle business logic, Eloquent ORM manages persistence.
- **Deployment:** Static-friendly hosting on **Vercel**.

### Links

- Live demo: https://saall.vercel.app
- Source: https://github.com/AbHaMaDa/Saall`,
    repoUrl: 'https://github.com/AbHaMaDa/Saall',
    liveUrl: 'https://saall.vercel.app',
    thumbnailUrl: '',
    featured: true,
    sortOrder: 2,
    skills: ['PHP', 'Laravel', 'HTML5', 'CSS3'],
  },
  {
    title: 'CodeChore — Cal App',
    slug: 'codechore-cal-app',
    summary:
      'Scheduling infrastructure for absolutely everyone — professional work at CodeChore (Berlin), developing business websites and e-commerce platforms.',
    architectureNotes: `### Role

**Full-Stack Developer** at CodeChore, Berlin (08/2024 – Present).

### Responsibilities & Achievements

- Developing business websites and **e-commerce** platforms.
- Improving website performance across client projects.
- Architecting scalable backends with **PHP / Laravel** and modern frontends.

### Stack

- **Backend:** PHP, Laravel, REST APIs
- **Frontend:** HTML5, CSS3, JavaScript, Tailwind CSS

### Links

- Company: https://codechore.com`,
    repoUrl: '',
    liveUrl: 'https://codechore.com',
    thumbnailUrl: '',
    featured: true,
    sortOrder: 3,
    skills: ['PHP', 'Laravel', 'JavaScript', 'Tailwind CSS'],
  },
  {
    title: 'Jollity Tours',
    slug: 'jollity-tours',
    summary:
      'Travel platform for exploring Egypt — diving, safari, and beyond adventures.',
    architectureNotes: `### Overview

- A tourism web platform showcasing dive trips, safaris, and travel packages across Egypt.
- Built as part of professional client work, focused on rich visuals and smooth booking-oriented UX.

### Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** PHP / Laravel

### Links

- Live site: https://jollitytours.com/en`,
    repoUrl: '',
    liveUrl: 'https://jollitytours.com/en',
    thumbnailUrl: '',
    featured: true,
    sortOrder: 4,
    skills: ['PHP', 'Laravel', 'HTML5', 'CSS3'],
  },
  {
    title: 'IEEE ZSB Official Website',
    slug: 'ieee-zsb-website',
    summary:
      'The official website of the IEEE Zagazig University Student Branch — built with Next.js, React, and TypeScript for the Computer Society chapter.',
    architectureNotes: `### Overview

- **Framework:** **Next.js 16** (App Router) with **React 19** and **TypeScript**.
- **UI:** **Chakra UI** component system with **GSAP** / Framer Motion animations and **Jotai** state management.
- **Content:** Markdown-driven pages via gray-matter + react-markdown.
- **Deployment:** OpenNext on **Cloudflare** (with Netlify CI badge), custom domain ieee-zsb.org.
- **Role:** Core contributor in the **CS-ZSC** GitHub organization.

### Links

- Live site: https://ieee-zsb.org
- Source: https://github.com/CS-ZSC/www.ieee-zsb.org`,
    repoUrl: 'https://github.com/CS-ZSC/www.ieee-zsb.org',
    liveUrl: 'https://ieee-zsb.org',
    thumbnailUrl: '',
    featured: true,
    sortOrder: 5,
    skills: ['TypeScript', 'React.js', 'Next.js', 'Chakra UI', 'GSAP', 'Cloudflare'],
  },
  {
    title: 'IEEE ZSB Events & Competitions Platform',
    slug: 'ieee-zsb-events',
    summary:
      'Events and competitions gate for the IEEE Zagazig Student Branch — registration, schedules, and QR-coded event access.',
    architectureNotes: `### Overview

- **Framework:** **Next.js 16** with **React 19** and **TypeScript**.
- **UI:** **Chakra UI** + Framer Motion, React Hook Form for registration flows.
- **Features:** Event listings, competition management, and **QR code** generation for check-in (qrcode.react).
- **Deployment:** **Netlify** with CI deploy-status badge, custom domain events.ieee-zsb.org.
- **Role:** Core contributor in the **CS-ZSC** GitHub organization.

### Links

- Live site: https://events.ieee-zsb.org
- Source: https://github.com/CS-ZSC/events.ieee-zsb.org`,
    repoUrl: 'https://github.com/CS-ZSC/events.ieee-zsb.org',
    liveUrl: 'https://events.ieee-zsb.org',
    thumbnailUrl: '',
    featured: true,
    sortOrder: 6,
    skills: ['TypeScript', 'React.js', 'Next.js', 'Chakra UI', 'Netlify'],
  },
  {
    title: 'IEEE ZSB Backend API',
    slug: 'ieee-zsb-api',
    summary:
      'Laravel REST API powering the entire IEEE Zagazig Student Branch platform — admin dashboard, public site, and events gate.',
    architectureNotes: `### Overview

- **Framework:** **Laravel (PHP)** REST API with **L5-Swagger** auto-generated OpenAPI documentation.
- **Scale:** ~107 endpoints across three guarded surfaces:
  - **Dashboard** (48 routes): admin auth, chapters, committees, tracks, goals, news, seasons, roles & permissions, events, competitions, prizes, speakers, sponsors, participants.
  - **EventsGate** (32 routes): public visitor portal for event registration and management.
  - **Site** (27 routes): public content API for the main website.
- **Auth:** Token-based (Sanctum-style Bearer) admin authentication with role/permission checks.
- **Docs:** Interactive Swagger UI at /api/documentation.
- **Role:** Core contributor in the **CS-ZSC** GitHub organization.

### Links

- API docs: https://api.ieee-zsb.org/api/documentation`,
    repoUrl: '',
    liveUrl: 'https://api.ieee-zsb.org/api/documentation',
    thumbnailUrl: '',
    featured: true,
    sortOrder: 7,
    skills: ['PHP', 'Laravel', 'JSON', 'Postman', 'Swagger'],
  },
  {
    title: 'wel3aaaa — Fighting Robot',
    slug: 'wel3aaaa-fighting-robot',
    summary:
      'An autonomous fighting robot built in C++ for a mechatronics competition.',
    architectureNotes: `### Overview

- **Language:** C++
- **Domain:** Embedded / robotics — motor control, sensor fusion, and autonomous decision-making for a fighting-robot competition.

### Links

- Source: https://github.com/AbHaMaDa/wel3aaaa`,
    repoUrl: 'https://github.com/AbHaMaDa/wel3aaaa',
    liveUrl: '',
    thumbnailUrl: '',
    featured: false,
    sortOrder: 1,
    skills: ['C++', 'Arduino'],
  },
  {
    title: 'IEEE RAS Embedded 2025',
    slug: 'ieee-ras-embedded-2025',
    summary:
      'Embedded systems project developed for the IEEE RAS student branch embedded track.',
    architectureNotes: `### Overview

- **Language:** C
- **Domain:** Embedded systems — microcontroller-based design for the IEEE RAS Zagazig embedded competition track, developed with the **IEEE Zagazig Student Branch**.

### Links

- Source: https://github.com/AbHaMaDa/IEEE-RAS-Embeddded-2025`,
    repoUrl: 'https://github.com/AbHaMaDa/IEEE-RAS-Embeddded-2025',
    liveUrl: '',
    thumbnailUrl: '',
    featured: false,
    sortOrder: 2,
    skills: ['C', 'Arduino'],
  },
  {
    title: 'ROBOSNAILS — Robot Car',
    slug: 'robosnails-robot-car',
    summary:
      'An Arduino-powered robot car project combining motor control and sensors.',
    architectureNotes: `### Overview

- **Language:** C++
- **Domain:** Robotics — line-following / obstacle-avoidance style robot car built on Arduino-compatible hardware.

### Links

- Source: https://github.com/AbHaMaDa/ROBOSNAILS`,
    repoUrl: 'https://github.com/AbHaMaDa/ROBOSNAILS',
    liveUrl: '',
    thumbnailUrl: '',
    featured: false,
    sortOrder: 3,
    skills: ['C++', 'Arduino'],
  },
  {
    title: 'TechTitan',
    slug: 'techtitan',
    summary: 'A C++ project exploring systems-level programming.',
    architectureNotes: `### Overview

- **Language:** C++
- Personal/academic project focused on core systems programming concepts.

### Links

- Source: https://github.com/AbHaMaDa/TechTitan`,
    repoUrl: 'https://github.com/AbHaMaDa/TechTitan',
    liveUrl: '',
    thumbnailUrl: '',
    featured: false,
    sortOrder: 4,
    skills: ['C++'],
  },
  {
    title: 'Laravel API Bootcamp',
    slug: 'laravel-api-bootcamp',
    summary:
      'API development training project built with Laravel — routing, controllers, Eloquent, and REST conventions.',
    architectureNotes: `### Overview

- **Framework:** Laravel (PHP)
- **Focus:** REST API design — resource routes, form requests, Eloquent models, API responses.

### Links

- Source: https://github.com/AbHaMaDa/Bootcamp`,
    repoUrl: 'https://github.com/AbHaMaDa/Bootcamp',
    liveUrl: '',
    thumbnailUrl: '',
    featured: false,
    sortOrder: 5,
    skills: ['PHP', 'Laravel', 'Postman', 'Swagger'],
  },
  {
    title: 'Ershad',
    slug: 'ershad',
    summary:
      'A React single-page application bootstrapped with Create React App.',
    architectureNotes: `### Overview

- **Framework:** React (Create React App)
- **Language:** JavaScript
- Component-based UI with standard React tooling (npm scripts, Jest, ESLint).

### Links

- Source: https://github.com/AbHaMaDa/Ershad`,
    repoUrl: 'https://github.com/AbHaMaDa/Ershad',
    liveUrl: '',
    thumbnailUrl: '',
    featured: false,
    sortOrder: 6,
    skills: ['JavaScript', 'React.js', 'CSS3'],
  },
];

// Demo entries from the previous seed — removed on re-run so they don't linger.
const DEMO_PROJECT_SLUGS = ['enterprise-saas-cloud-platform', 'modern-ecommerce-analytics'];
const DEMO_SKILL_NAMES = [
  'React 19 & Next.js',
  'NestJS',
  'TanStack Query',
  'Redux Toolkit / Zustand',
  'Node.js & Express',
  'REST & GraphQL APIs',
  'JWT & OAuth Authentication',
  'MongoDB & Mongoose',
  'PostgreSQL & Prisma',
  'Docker & Microservices',
  'Redis Caching',
  'CI/CD & Cloud Deployments',
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminModel = app.get<Model<AdminUser>>(getModelToken(AdminUser.name));
  const profileModel = app.get<Model<Profile>>(getModelToken(Profile.name));
  const skillModel = app.get<Model<Skill>>(getModelToken(Skill.name));
  const projectModel = app.get<Model<Project>>(getModelToken(Project.name));

  // ── Admin User ───────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? 'admin@portfolio.dev';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';

  const existingAdmin = await adminModel.findOne({ email });
  if (existingAdmin) {
    console.log(`✅ Admin already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await adminModel.create({ email, passwordHash });
    console.log(`✅ Admin created: ${email} (password: ${password})`);
  }

  // ── Profile (from CV) ────────────────────────────────────────────────────
  await profileModel.findOneAndUpdate(
    {},
    {
      fullName: 'Abdallah Awadalla',
      headline: 'Full-Stack Web Developer',
      bio: `A backend-focused **Full-Stack Developer** with deep expertise in **PHP (Laravel)** to architect highly scalable and robust systems, complemented by strong proficiency in the **MERN** stack for building dynamic full-stack applications, and the capability to deliver clean, pragmatic solutions using **Python (Django)**.

Deeply passionate about core software engineering principles — **RESTful API** design, database optimization, **MVC** architecture, and secure system design. Currently working as a Full-Stack Developer at **CodeChore** in Berlin, building business websites and e-commerce platforms.

Member of **GDG On-Campus Zagazig** (Back-End Web Developer) and **IEEE Zagazig SB** (Full-Stack), with hands-on experience in embedded systems and robotics.`,
      location: 'Zagazig, Egypt',
      githubUrl: 'https://github.com/AbHaMaDa',
      linkedinUrl: 'https://linkedin.com/in/abdallah-awadallah-4331a7298',
      resumeUrl: '',
      avatarUrl: '',
    },
    { upsert: true, returnDocument: 'after' },
  );
  console.log('✅ Profile updated for Abdallah Awadalla.');

  // ── Skills ───────────────────────────────────────────────────────────────
  // Remove previous demo skills (and detach them from any project referencing them)
  for (const name of DEMO_SKILL_NAMES) {
    const stale = await skillModel.findOne({ name });
    if (stale) {
      await projectModel.updateMany({}, { $pull: { skills: stale._id } });
      await skillModel.deleteOne({ _id: stale._id });
    }
  }

  const skillMap = new Map<string, Types.ObjectId>();
  for (const s of SKILLS) {
    const doc = await skillModel.findOneAndUpdate(
      { name: s.name },
      { $set: { category: s.category, proficiency: s.proficiency, sortOrder: s.sortOrder } },
      { upsert: true, returnDocument: 'after' },
    );
    skillMap.set(s.name, doc!._id as Types.ObjectId);
  }
  console.log(`✅ Seeded ${SKILLS.length} skills.`);

  // ── Projects ─────────────────────────────────────────────────────────────
  await projectModel.deleteMany({ slug: { $in: DEMO_PROJECT_SLUGS } });

  for (const p of PROJECTS) {
    const skillIds = p.skills
      .map((name) => skillMap.get(name))
      .filter((id): id is Types.ObjectId => Boolean(id));

    await projectModel.findOneAndUpdate(
      { slug: p.slug },
      {
        $set: {
          title: p.title,
          summary: p.summary,
          architectureNotes: p.architectureNotes,
          repoUrl: p.repoUrl,
          liveUrl: p.liveUrl,
          thumbnailUrl: p.thumbnailUrl,
          featured: p.featured,
          sortOrder: p.sortOrder,
          skills: skillIds,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }
  console.log(`✅ Seeded ${PROJECTS.length} projects.`);

  await app.close();
  console.log('🌱 Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
