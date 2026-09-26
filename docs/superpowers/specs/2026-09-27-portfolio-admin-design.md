# Portfolio Admin Panel — Design Spec

## Overview

An admin panel that auto-fetches GitHub repos from `rumanmushtaq`, uses Google Gemini AI to generate professional project descriptions, and lets the admin publish/unpublish projects via a toggle. Published projects are exposed through a public REST API (`/api/projects`) consumed by the existing 3D portfolio site.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** Ant Design 5 (mobile responsive)
- **Database:** MongoDB Atlas via Mongoose
- **Auth:** NextAuth.js (credentials — single admin)
- **AI:** Google Gemini 2.0 Flash (free tier)
- **External API:** GitHub REST API v3
- **Language:** TypeScript

## Architecture

```
GitHub API ──→ Admin Panel ──→ MongoDB Atlas
  (fetch repos)    │              │
                   │  Gemini AI   │
                   │  (generate   │
                   │  descriptions)│
                   │              │
                   └──→ REST API ──→ 3D Portfolio
                       /api/projects   (fetches published projects)
```

### Core Flow

1. Admin opens dashboard → app calls GitHub API to list all public repos for `rumanmushtaq`
2. Repos not yet in MongoDB show as "New" in the repos table
3. Admin clicks "Import" on a repo → app fetches README via GitHub API, sends repo metadata + README to Gemini
4. Gemini generates: display title, professional description (2-3 sentences), tech stack tags, category
5. Project saved to MongoDB with `published: false`
6. Admin reviews/edits the AI-generated content, then toggles `published: true`
7. Published projects available at `GET /api/projects` — the 3D portfolio fetches this endpoint

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_USERNAME` | GitHub username (`rumanmushtaq`) |
| `GITHUB_TOKEN` | GitHub PAT for higher rate limits (optional for public repos) |
| `GEMINI_API_KEY` | Google Gemini API key (free tier) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | NextAuth secret for session encryption |
| `NEXTAUTH_URL` | App URL for NextAuth |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password (hashed at startup) |

## Database Schema

### `projects` Collection

```typescript
{
  githubId: number;           // GitHub repo ID (unique identifier)
  name: string;               // repo name (e.g. "university-library-jsm-main")
  fullName: string;           // "rumanmushtaq/repo-name"
  githubUrl: string;          // "https://github.com/rumanmushtaq/repo-name"
  homepage: string | null;    // live demo URL from GitHub
  title: string;              // display title (editable, AI-generated)
  description: string;        // project description (editable, AI-generated)
  techStack: string[];        // ["Next.js", "MongoDB", "TypeScript"]
  category: string;           // "Web App" | "AI/ML" | "Mobile" | "Library" | "Other"
  thumbnail: string | null;   // custom thumbnail URL
  featured: boolean;          // pin to top of portfolio (default: false)
  published: boolean;         // visible on public API (default: false)
  order: number;              // sort order for portfolio display
  githubStars: number;        // synced from GitHub on import
  language: string;           // primary language from GitHub
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Public (no auth)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/projects` | Returns published projects sorted by order, featured first. Consumed by the 3D portfolio. |

**Response format:**
```json
{
  "projects": [
    {
      "title": "BookWise Library",
      "description": "A university library management system...",
      "techStack": ["Next.js", "PostgreSQL", "TypeScript"],
      "category": "Web App",
      "githubUrl": "https://github.com/rumanmushtaq/...",
      "homepage": "https://bookwise.vercel.app",
      "thumbnail": null,
      "featured": true,
      "language": "TypeScript",
      "githubStars": 5
    }
  ]
}
```

### Admin (NextAuth protected)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/admin/repos` | Fetch all GitHub repos + their import status |
| `POST` | `/api/admin/projects/import` | Import a repo: fetch README, call Gemini, save to MongoDB |
| `PATCH` | `/api/admin/projects/[id]` | Update project (edit fields, publish/unpublish, feature) |
| `DELETE` | `/api/admin/projects/[id]` | Remove a project from the database |
| `POST` | `/api/admin/projects/[id]/regenerate` | Re-generate AI description via Gemini |

## Admin Panel Pages

### 1. Login (`/admin/login`)
- AntD Form with email and password fields
- NextAuth credentials provider
- Redirect to dashboard on success

### 2. Dashboard (`/admin`)
- Stat cards (AntD Statistic): Total GitHub Repos, Imported, Published, Featured
- Quick action buttons: "Sync Repos", "View Portfolio API"
- Recent activity list

### 3. GitHub Repos (`/admin/repos`)
- AntD Table listing all GitHub repos
- Columns: Name, Language, Stars, Last Updated, Status badge (New / Imported)
- "Import" button on unimported repos → triggers Gemini AI generation
- Search input to filter by name
- Filter by language
- Mobile: switches to AntD Card list layout on screens < 768px

### 4. Projects (`/admin/projects`)
- AntD Table of all imported projects
- Columns: Title, Category, Tech Stack (AntD Tags), Published (AntD Switch), Featured (AntD Switch), Actions (Edit/Delete)
- Click row to navigate to edit page
- Sort by drag handle (reorder for portfolio display)
- Mobile: responsive card layout on small screens

### 5. Edit Project (`/admin/projects/[id]`)
- AntD Form with fields:
  - Title (Input)
  - Description (TextArea)
  - Category (Select dropdown)
  - Tech Stack (Select mode="tags")
  - Thumbnail URL (Input)
  - Homepage URL (Input)
  - Published (Switch)
  - Featured (Switch)
- "Regenerate with AI" button → re-calls Gemini
- Save button
- Delete button with confirmation modal

### Layout
- AntD Pro Layout with collapsible sidebar
- Sidebar links: Dashboard, GitHub Repos, Projects
- Header with admin name and logout
- Hamburger menu on mobile — sidebar collapses to drawer
- AntD's built-in responsive breakpoints handle mobile layout

## AI Integration (Gemini)

### Prompt Template

When importing a repo, send to Gemini 2.0 Flash:

```
You are a professional portfolio writer. Given this GitHub repository information, generate portfolio content.

Repository: {name}
Description: {github_description}
Language: {language}
Topics: {topics}
README (first 2000 chars): {readme_content}

Respond in JSON:
{
  "title": "Professional display title (not the repo name)",
  "description": "2-3 sentence professional description highlighting what it does, key technologies, and its purpose",
  "techStack": ["Technology1", "Technology2", ...],
  "category": "Web App" | "AI/ML" | "Mobile" | "Library" | "Other"
}
```

### Rate Limits (Free Tier)
- 15 requests per minute
- 1 million tokens per day
- No cost

## Mobile Responsiveness

AntD 5 provides built-in responsive behavior:
- **Tables** → Card list on mobile (custom render via `responsive` prop or media query switch)
- **Sidebar** → Collapses to hamburger drawer
- **Forms** → Stack vertically, full-width inputs
- **Stat cards** → Stack in single column
- **Breakpoint:** 768px for table → card switch

## Scope

### In Scope
- Admin panel with AntD (login, dashboard, repos, projects, edit)
- GitHub API integration (fetch repos, fetch README)
- Gemini AI description generation
- MongoDB Atlas via Mongoose
- NextAuth credentials authentication (single admin)
- Public REST API for portfolio consumption (`/api/projects`)
- Mobile responsive admin panel
- All configuration via environment variables

### Out of Scope
- The 3D portfolio site itself (already exists separately)
- Image upload/storage (thumbnail is a URL field)
- Multiple admin users
- GitHub webhooks for auto-sync (manual import)
- Analytics or visitor tracking
- Comments or contact form
