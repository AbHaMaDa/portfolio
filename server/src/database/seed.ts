/**
 * Database seed script — run once to create the initial admin user and profile.
 *
 * Usage:
 *   cd server
 *   npx ts-node --esm src/database/seed.ts
 *
 * Or add to package.json scripts:
 *   "seed": "ts-node --esm src/database/seed.ts"
 */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module.js';
import { AdminUser } from '../common/schemas/admin-user.schema.js';
import { Profile } from '../common/schemas/profile.schema.js';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminModel = app.get<Model<AdminUser>>(getModelToken(AdminUser.name));
  const profileModel = app.get<Model<Profile>>(getModelToken(Profile.name));

  // ── Admin User ───────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? 'admin@portfolio.dev';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';

  const existing = await adminModel.findOne({ email });
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await adminModel.create({ email, passwordHash });
    console.log(`✅ Admin created: ${email} (password: ${password})`);
    console.log(`⚠️  Change the password immediately via the admin dashboard!`);
  }

  // ── Initial Profile ──────────────────────────────────────────────────────
  const profileExists = await profileModel.findOne();
  if (profileExists) {
    console.log('✅ Profile already exists, skipping.');
  } else {
    await profileModel.create({
      fullName: 'Your Name',
      headline: 'Full-Stack Software Engineer',
      bio: 'Welcome to my portfolio! Edit this bio from the admin dashboard.',
      location: 'Your City, Country',
      githubUrl: 'https://github.com/yourusername',
      linkedinUrl: 'https://linkedin.com/in/yourusername',
      resumeUrl: '',
    });
    console.log('✅ Initial profile created.');
  }

  await app.close();
  console.log('🌱 Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
