# Full-Stack Portfolio Application — Architecture & Build Plan

A decoupled full-stack portfolio application built with **React** (public portfolio + protected admin dashboard) and **NestJS** (REST API + JWT authentication + MongoDB/Mongoose), allowing you to add, edit, and reorder skills, projects, and profile details anytime without redeploying code.

## 1. Tech Stack Overview

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript + Vite | Fast SPA for public portfolio and `/admin` dashboard |
| **Styling & Forms** | Tailwind CSS + React Hook Form + Zod | Responsive UI and schema-validated admin forms |
| **State & Caching** | TanStack Query (React Query) | Server-state caching and instant UI refresh on mutations |
| **Backend** | NestJS 12 + TypeScript | Modular controllers, DTO validation, and route guards |
| **Database & ODM** | MongoDB + Mongoose (`@nestjs/mongoose`) | Document storage with schema validation and `.populate()` relations |
| **Authentication** | Passport-JWT + bcrypt | Single-admin login without public registration |
| **Media Storage** | Cloudinary or AWS S3 / Cloudflare R2 | External hosting for project screenshots and resume PDFs |

## 2. Recommended Repository Structure

Organize your workspace as a clean two-folder repository:

```text
my-portfolio/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/                # Axios/Fetch client & TanStack Query hooks
│   │   ├── components/         # Reusable UI, Navbar, ProjectCard, SkillBadge
│   │   ├── pages/
│   │   │   ├── public/         # Home, ProjectDetail
│   │   │   └── admin/          # Login, Dashboard, ProjectEditor, SkillManager
│   │   ├── routes/             # Public routes & ProtectedRoute wrapper
│   │   └── types/              # Shared TypeScript interfaces
│   └── package.json
├── server/                     # NestJS backend
│   ├── src/
│   │   ├── auth/               # AdminUser schema, JWT strategy, login & JwtAuthGuard
│   │   ├── database/           # Seed script (seed.ts) for initial admin & profile
│   │   ├── portfolio/          # Aggregated public GET /portfolio endpoint
│   │   ├── profile/            # Profile schema & CRUD
│   │   ├── projects/           # Project schema & CRUD with populated skill refs
│   │   ├── skills/             # Skill schema & CRUD + ordering
│   │   ├── upload/             # FileInterceptor + Cloudinary/S3 upload service
│   │   └── main.ts             # Global ValidationPipe & CORS configuration
│   └── package.json
└── PORTFOLIO_BUILD_PLAN.md
```

## 3. MongoDB Schema Blueprint (Mongoose)

Define four Mongoose schemas using `@Schema({ timestamps: true })` and `@Prop()` decorators:

1. **AdminUser** (`admin_users` collection)
   * `_id`: ObjectId (auto-generated)
   * `email`: String (`required: true`, `unique: true`, `lowercase: true`)
   * `passwordHash`: String (`required: true`)
   * `createdAt` / `updatedAt`: Date (via `timestamps: true`)

2. **Profile** (`profiles` collection — single-document configuration)
   * `_id`: ObjectId (auto-generated)
   * `fullName`: String (`required: true`)
   * `headline`: String (e.g., *"Full-Stack Software Engineer"*)
   * `bio`: String (Markdown supported)
   * `location`: String
   * `githubUrl`: String
   * `linkedinUrl`: String
   * `resumeUrl`: String
   * `updatedAt`: Date

3. **Skill** (`skills` collection)
   * `_id`: ObjectId (auto-generated)
   * `name`: String (`required: true`, `unique: true`, e.g., *"React"*, *"NestJS"*, *"MongoDB"*)
   * `category`: String (`required: true`, e.g., *"Frontend"*, *"Backend"*, *"DevOps & Tools"*)
   * `proficiency`: Number (1–100 or 1–5)
   * `iconUrl`: String (optional)
   * `sortOrder`: Number (`default: 0`)

4. **Project** (`projects` collection)
   * `_id`: ObjectId (auto-generated)
   * `title`: String (`required: true`)
   * `slug`: String (`required: true`, `unique: true`, URL-friendly identifier)
   * `summary`: String (`required: true`, short card description)
   * `architectureNotes`: String (Markdown for deep technical breakdown)
   * `repoUrl`: String (optional)
   * `liveUrl`: String (optional)
   * `thumbnailUrl`: String (optional)
   * `featured`: Boolean (`default: false`)
   * `sortOrder`: Number (`default: 0`)
   * `skills`: `[{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }]` (referenced Skill IDs, resolved via `.populate('skills')`)
   * `createdAt` / `updatedAt`: Date (via `timestamps: true`)

## 4. REST API Specification

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Verifies admin email/password and issues a signed JWT |
| `GET` | `/api/auth/me` | JWT | Validates current admin session on frontend reload |
| `GET` | `/api/portfolio` | Public | Returns `profile`, grouped `skills`, and populated `projects` in one request |
| `PATCH` | `/api/profile` | JWT | Updates headline, bio, social links, and resume URL |
| `GET` | `/api/projects` | Public | Lists all projects ordered by `featured` and `sortOrder` |
| `GET` | `/api/projects/:slug` | Public | Fetches full details and Markdown notes for a single project |
| `POST` | `/api/projects` | JWT | Creates a new project with an array of `skillIds` |
| `PATCH` | `/api/projects/:id` | JWT | Updates project fields, skill refs, featured status, or order |
| `DELETE` | `/api/projects/:id` | JWT | Deletes a project by MongoDB ObjectId |
| `POST` | `/api/skills` | JWT | Adds a new skill to a category |
| `PATCH` | `/api/skills/:id` | JWT | Updates skill proficiency, category, or `sortOrder` |
| `DELETE` | `/api/skills/:id` | JWT | Removes a skill (and optionally pulls its ID from projects) |
| `POST` | `/api/upload` | JWT | Uploads an image or PDF to Cloudinary/S3 and returns `{ url }` |

## 5. Step-by-Step Implementation Checklist

### Phase 1: Workspace & Backend Setup
- [ ] Create root folder `my-portfolio` and initialize `server` via `npx @nestjs/cli new server`.
- [ ] Install core backend packages: `@nestjs/mongoose mongoose @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer`.
- [ ] Install dev dependencies: `@types/passport-jwt @types/bcrypt @types/multer`.
- [ ] Configure `MONGODB_URI` in `server/.env` (local MongoDB or free MongoDB Atlas cluster) and connect `MongooseModule.forRootAsync(...)` in `AppModule`.
- [ ] Create the 4 Mongoose schemas (`AdminUser`, `Profile`, `Skill`, `Project`).
- [ ] Create `src/database/seed.ts` (using NestJS standalone application context `NestFactory.createApplicationContext`) to hash your admin password with `bcrypt` and insert your initial `AdminUser` and `Profile` documents.

### Phase 2: NestJS Auth & Resource Modules
- [ ] Configure global `ValidationPipe({ whitelist: true, transform: true })` and strict CORS in `src/main.ts`.
- [ ] Build `AuthModule` with `JwtStrategy`, `JwtAuthGuard`, and `POST /auth/login`.
- [ ] Generate and implement CRUD modules (`nest g resource`) injecting models via `@InjectModel(...)`:
  - [ ] `profile` (`PATCH /profile` protected by `JwtAuthGuard`)
  - [ ] `skills` (`POST`, `PATCH`, `DELETE` protected by `JwtAuthGuard`)
  - [ ] `projects` (`POST`, `PATCH`, `DELETE` protected; `GET` public with `.populate('skills')`)
  - [ ] `portfolio` (`GET /portfolio` combining profile, skills, and projects)
- [ ] Build `UploadModule` using `FileInterceptor` + Cloudinary/S3 SDK with file-type and size validation (e.g., max 5MB images/PDFs).

### Phase 3: React Frontend Foundation
- [ ] Scaffold frontend inside `client/` via `npm create vite@latest client -- --template react-ts`.
- [ ] Install frontend packages: `react-router-dom @tanstack/react-query axios react-hook-form zod @hookform/resolvers lucide-react react-markdown`.
- [ ] Configure Tailwind CSS and set up API base URL (`VITE_API_URL`) in `client/.env`.
- [ ] Create an Axios instance that automatically attaches the stored JWT token to `Authorization: Bearer <token>` headers and redirects to `/admin/login` on `401` responses.

### Phase 4: Public Portfolio Pages
- [ ] Build the `usePortfolio()` query hook fetching `GET /api/portfolio`.
- [ ] **Hero & About Section**: Display name, headline, Markdown bio, location, social links, and downloadable resume button.
- [ ] **Skills Matrix**: Group skills dynamically by `category` (Frontend, Backend, DevOps, etc.) with clean badges/proficiency indicators.
- [ ] **Projects Showcase**: Filterable grid by skill tag, highlighting `featured` projects with live demo and GitHub repo links.
- [ ] **Project Detail View (`/projects/:slug`)**: Render `architectureNotes` using `react-markdown` so you can document system architecture and technical decisions.

### Phase 5: Protected Admin Dashboard (`/admin`)
- [ ] Create `/admin/login` form and a `ProtectedRoute` wrapper verifying auth state before rendering admin views.
- [ ] Build **Profile Editor Tab**: Form to update bio, headline, social links, and upload a new resume PDF.
- [ ] Build **Skills Manager Tab**: Inline quick-add form, category selector, edit/delete actions, and sort order controls.
- [ ] Build **Projects Manager Tab**:
  - [ ] Project list with toggleable `featured` star and quick delete.
  - [ ] Create/Edit modal or page with thumbnail drag-and-drop uploader (`POST /api/upload`), multi-select skill checkboxes (sending `_id` values), and live Markdown preview for `architectureNotes`.
- [ ] Ensure every admin mutation calls `queryClient.invalidateQueries({ queryKey: ['portfolio'] })` so changes reflect immediately.

### Phase 6: Testing & Production Deployment
- [ ] Test all protected endpoints without a token to confirm `401 Unauthorized` responses.
- [ ] Create a free cluster on **MongoDB Atlas**, whitelist your server IP (or `0.0.0.0/0` for cloud hosts), and copy the connection string.
- [ ] Deploy the NestJS `server` to Railway or Render and set production environment variables (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `CLOUDINARY_*`).
- [ ] Deploy the React `client` to Vercel or Netlify with `VITE_API_URL` pointing to your live NestJS API.

## 6. Environment Variables Checklist

### `server/.env`
* `PORT=4000`
* `MONGODB_URI="mongodb://localhost:27017/portfolio"`
* `JWT_SECRET="replace-with-strong-random-secret"`
* `JWT_EXPIRES_IN="7d"`
* `FRONTEND_URL="http://localhost:5173"`
* `CLOUDINARY_CLOUD_NAME="..."`
* `CLOUDINARY_API_KEY="..."`
* `CLOUDINARY_API_SECRET="..."`

### `client/.env`
* `VITE_API_URL="http://localhost:4000/api"`
