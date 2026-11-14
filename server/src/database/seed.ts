/**
 * Database seed script — run once to create the initial admin user and profile.
 */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module.js';
import { AdminUser } from '../common/schemas/admin-user.schema.js';
import { Profile } from '../common/schemas/profile.schema.js';
import { Skill } from '../common/schemas/skill.schema.js';
import { Project } from '../common/schemas/project.schema.js';

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

  // ── Initial Profile ──────────────────────────────────────────────────────
  await profileModel.findOneAndUpdate(
    {},
    {
      fullName: 'Abdullah Awadallah',
      headline: 'Full-Stack Software Engineer',
      bio: `I am a dedicated **Full-Stack Software Engineer** based in Cairo, Egypt, passionate about architecting scalable systems, robust REST & GraphQL backends, and responsive, fluid user interfaces.

With deep experience across the **MERN / NestJS** ecosystem, microservices, and modern cloud deployment, I build digital products with strict attention to performance, security, and developer ergonomics.`,
      location: 'Cairo, Egypt',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      resumeUrl: '',
    },
    { upsert: true, new: true },
  );
  console.log('✅ Profile updated for Abdullah Awadallah (Cairo, Egypt).');

  // ── Initial Skills ───────────────────────────────────────────────────────
  const skillCount = await skillModel.countDocuments();
  let createdSkills: any[] = [];
  if (skillCount === 0) {
    createdSkills = await skillModel.insertMany([
      // Frontend
      { name: 'React 19 & Next.js', category: 'Frontend', proficiency: 95, sortOrder: 1 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 92, sortOrder: 2 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 94, sortOrder: 3 },
      { name: 'TanStack Query', category: 'Frontend', proficiency: 90, sortOrder: 4 },
      { name: 'Redux Toolkit / Zustand', category: 'Frontend', proficiency: 88, sortOrder: 5 },
      // Backend
      { name: 'NestJS', category: 'Backend', proficiency: 92, sortOrder: 1 },
      { name: 'Node.js & Express', category: 'Backend', proficiency: 94, sortOrder: 2 },
      { name: 'REST & GraphQL APIs', category: 'Backend', proficiency: 90, sortOrder: 3 },
      { name: 'JWT & OAuth Authentication', category: 'Backend', proficiency: 92, sortOrder: 4 },
      // Database & DevOps
      { name: 'MongoDB & Mongoose', category: 'DevOps & Database', proficiency: 92, sortOrder: 1 },
      { name: 'PostgreSQL & Prisma', category: 'DevOps & Database', proficiency: 86, sortOrder: 2 },
      { name: 'Docker & Microservices', category: 'DevOps & Database', proficiency: 84, sortOrder: 3 },
      { name: 'Redis Caching', category: 'DevOps & Database', proficiency: 82, sortOrder: 4 },
      { name: 'CI/CD & Cloud Deployments', category: 'DevOps & Database', proficiency: 80, sortOrder: 5 },
    ]);
    console.log(`✅ Seeded ${createdSkills.length} core technical skills.`);
  } else {
    createdSkills = await skillModel.find();
  }

  // ── Initial Projects ─────────────────────────────────────────────────────
  const projectCount = await projectModel.countDocuments();
  if (projectCount === 0 && createdSkills.length > 0) {
    const skillMap = new Map(createdSkills.map((s) => [s.name, s._id]));

    await projectModel.insertMany([
      {
        title: 'Enterprise SaaS Cloud Platform',
        slug: 'enterprise-saas-cloud-platform',
        summary:
          'High-throughput multi-tenant SaaS backend with microservices, role-based access control, and real-time event streaming.',
        architectureNotes: `### System Architecture Highlights

- **Decoupled API Architecture:** Built with **NestJS** utilizing modular domain-driven modules, custom interceptors, and strict DTO schema validation.
- **Data Persistence:** **MongoDB** clustered replica set with indexing on hot query paths and **Redis** for distributed session management.
- **Authentication & Security:** Asymmetric JWT signing, token rotation, and fine-grained RBAC guards preventing privilege escalation.
- **Monitoring & Resiliency:** Integrated structured logger and circuit breakers for external third-party integrations.`,
        repoUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sortOrder: 1,
        skills: [
          skillMap.get('NestJS'),
          skillMap.get('TypeScript'),
          skillMap.get('MongoDB & Mongoose'),
          skillMap.get('Docker & Microservices'),
        ].filter(Boolean),
      },
      {
        title: 'Modern Full-Stack E-Commerce & Analytics',
        slug: 'modern-ecommerce-analytics',
        summary:
          'Blazing-fast responsive storefront with real-time inventory management, payment gateway integration, and customer metrics.',
        architectureNotes: `### Architectural Decisions

- **Frontend:** Built with **React** and **Tailwind CSS**, optimized for Core Web Vitals with code-splitting and zero layout shifts.
- **State & Caching:** **TanStack Query** handles optimistic UI updates and instant cache revalidation across mutations.
- **Payment Processing:** Webhook-driven Stripe checkout with idempotent event processing in NestJS.`,
        repoUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sortOrder: 2,
        skills: [
          skillMap.get('React 19 & Next.js'),
          skillMap.get('Node.js & Express'),
          skillMap.get('Tailwind CSS'),
          skillMap.get('TanStack Query'),
        ].filter(Boolean),
      },
    ]);
    console.log('✅ Seeded featured showcase projects.');
  }

  await app.close();
  console.log('🌱 Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
