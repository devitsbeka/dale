## Git Permissions
You can execute git and gh commands without asking for confirmation:
- Create and switch branches
- Commit changes
- Push to remote
- Create PRs with `gh pr create --fill`
- Merge PRs with `gh pr merge --squash --auto`

Do not ask me to review or confirm these actions—just do them.

---

# Planeta.id — Architecture Bible

## Overview
Planeta.id is a "Career Operating System for Earth" — a unified intelligence platform built on Next.js 16 + React 19 + TypeScript + Tailwind v4. It started as an UntitledUI design system starter kit and is being progressively enhanced into a full-stack MVP.

## Tech Stack
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind v4, UntitledUI components
- **Backend:** Next.js API Routes + Server Actions + tRPC
- **Database:** PostgreSQL + Prisma ORM + pgvector
- **Cache:** Redis (Upstash)
- **Search:** Meilisearch
- **AI:** Claude API (claude-sonnet-4-6) via @anthropic-ai/sdk
- **Auth:** NextAuth v5 + WebAuthn (passkeys)
- **Real-time:** Server-Sent Events
- **3D/WebGL:** Three.js + @react-three/fiber
- **Charts:** Recharts (installed)
- **Deploy:** Vercel

## Project Structure
```
src/
  app/
    (auth)/          — Login, Register, Onboarding (no sidebar)
    (dashboard)/     — All authenticated app pages (with sidebar)
    (marketing)/     — Landing page, public pages
    layout.tsx       — Root layout (Theme + RouteProvider)
    page.tsx         — Dashboard (default route)
  components/
    base/            — UntitledUI base components (buttons, inputs, badges, etc.)
    application/     — UntitledUI application components (nav, charts, tables, etc.)
    dashboards/      — Dashboard page components
    foundations/      — Featured icons, etc.
    marketing/       — Marketing page components
    shared-assets/   — Icons, logos
  lib/
    constants.ts     — App constants, nav config, enums
    db.ts            — Prisma client singleton (Phase 02)
  types/
    index.ts         — Core TypeScript types
  providers/
    theme.tsx        — next-themes ThemeProvider
    router-provider.tsx — react-aria RouterProvider
  server/            — tRPC routers, server actions (Phase 05+)
  hooks/             — Custom React hooks
  utils/             — Utility functions (cx, etc.)
  styles/            — CSS (globals.css, theme.css, typography.css)
prisma/
  schema.prisma      — Database schema (Phase 02+)
```

## Key Patterns
- **Components:** UntitledUI design system with react-aria for accessibility
- **Styling:** Tailwind v4 with `cx()` utility (tailwind-merge), custom dark variant `.dark-mode`
- **Icons:** `@untitledui/icons` — always import named exports
- **Logos:** Logo.dev API with token `pk_JsCdE0PFQ2mPn6GETPLiIw`
- **Routing:** Next.js App Router with route groups
- **State:** Server Components by default, `"use client"` only when needed

## Route Map
| Route | Description | Phase |
|-------|-------------|-------|
| `/` | Dashboard | 10 |
| `/jobs` | Job listings with match scores | 08, 17 |
| `/jobs/[id]` | Job detail with match breakdown | 09, 17 |
| `/skills` | Skills genome + transferability | 15, 18 |
| `/salary` | Compensation Reality Engine | 14 |
| `/paths` | Path simulator with trajectory charts | 20 |
| `/settings` | User settings + passkeys | 06 |
| `/agents` | 8 OpenClaw AI agents | 27-29 |
| `/companies` | Company explorer + detail | 26 |
| `/companies/[id]` | Company detail with salary/jobs | 26 |
| `/radar` | Opportunity signal feed | 21 |
| `/relocation` | City comparison + Life Score | 22 |
| `/immigration` | Visa explorer with probabilities | 23 |
| `/indices` | 5 Planeta public indices | 30 |
| `/career-map` | Interactive 2D career map | 31 |
| `/negotiation` | Offer comparison + management | 19 |
| `/game` | XP, levels, quests, badges, leaderboard | 24 |
| `/talent-fabric` | Global hiring cost comparison | 32 |
| `/skill-tree` | 2D interactive skill tree | 33 |
| `/landing` | Marketing landing page | 34 |
| `/profile/[id]` | Public user profile | 35 |
| `/login` | Sign in | 03 |
| `/register` | Sign up | 03 |
| `/onboarding` | 5-step setup wizard | 06 |

## API Routes
| Route | Description |
|-------|-------------|
| `/api/auth/[...nextauth]` | NextAuth v5 endpoints |
| `/api/auth/webauthn/*` | WebAuthn registration/authentication |
| `/api/chat` | AI chat streaming (SSE) with agent support |
| `/api/sse` | Real-time event stream |
| `/api/og` | Dynamic OG image generation |
| `/api/trpc/[trpc]` | tRPC API (8 routers) |

## tRPC Routers
- `user` — Profile CRUD, onboarding completion
- `job` — Job listing, detail, save, apply, match scoring
- `skill` — Skill catalog, user skills, transferable roles, adjacent skills
- `salary` — Salary explorer with percentile analysis
- `negotiation` — Offer CRUD, market comparison
- `game` — XP, streaks, badges, quests, leaderboard
- `notification` — List, unread count, mark read
- `company` — Company search, detail with salary profiles

## Phase Tracking — ALL 38 PHASES COMPLETE
- [x] Phase 01: Project Restructure + CLAUDE.md Bootstrap
- [x] Phase 02: Database — Prisma + PostgreSQL (25 models, 10 enums)
- [x] Phase 03: Authentication — NextAuth v5 (credentials provider)
- [x] Phase 04: WebAuthn / Passkey Authentication (SimpleWebAuthn v9)
- [x] Phase 05: tRPC v11 Setup (user, job, skill, salary routers)
- [x] Phase 06: User Profile + Onboarding (5-step wizard, settings)
- [x] Phase 07: Seed Data (90+ skills, 120 jobs, 5000 salary points)
- [x] Phase 08: Job Search + Listing Page (filters, pagination)
- [x] Phase 09: Job Detail + Save/Apply
- [x] Phase 10: Dashboard Redesign (Planeta-specific widgets)
- [x] Phase 11-12: Redis Cache + Meilisearch
- [x] Phase 13-14: Compensation Data + Salary Explorer
- [x] Phase 15: Skills Genome Dashboard
- [x] Phase 16: AI Integration — Claude API + Chat Widget
- [x] Phase 17: Job Match Scoring (composite 4-factor scoring)
- [x] Phase 18: Skill Transferability Mapping
- [x] Phase 19: Negotiation Intelligence (offer comparison, market data)
- [x] Phase 20: Path Simulator (trajectory charts, custom paths)
- [x] Phase 21: Opportunity Radar (signal feed, relevance scoring)
- [x] Phase 22: Relocation Intelligence (city comparison, Life Score)
- [x] Phase 23: Immigration Intelligence (8 visa types, probability)
- [x] Phase 24: Career Game Engine (XP, levels, quests, badges)
- [x] Phase 25: Real-Time SSE + Notifications
- [x] Phase 26: Company Intelligence (explorer, health scores, detail)
- [x] Phase 27-29: OpenClaw AI Agents (8 specialized agents)
- [x] Phase 30: Planeta Indices (5 public indices with charts)
- [x] Phase 31: Career Map (canvas-based interactive visualization)
- [x] Phase 32: Global Talent Fabric (country comparison, EoR)
- [x] Phase 33: Skill Tree (2D interactive with prerequisites)
- [x] Phase 34: Landing Page (hero, features, pricing)
- [x] Phase 35: Sharing (OG images, public profiles)
- [x] Phase 36: Branding (Planeta identity across app)
- [x] Phase 37: Performance & SEO (sitemap, robots, metadata)
- [x] Phase 38: E2E Tests (Playwright + documentation)

## Dev Commands
```bash
npm run dev          # Start dev server (turbopack, port 3456)
npm run build        # Production build
npx prisma studio    # Database GUI
npx prisma db push   # Push schema changes
npx prisma db seed   # Seed data (90+ skills, 120 jobs, 5000 salary points)
npx playwright test  # Run E2E tests
```

## Key Libraries
- `@anthropic-ai/sdk` — AI chat + agent system prompts
- `@simplewebauthn/server` v9 — WebAuthn/passkey auth (v9 API, NOT v10+)
- `@trpc/server` v11 — Type-safe API with superjson
- `prisma` v6 — ORM with generator output to `src/generated/prisma`
- `recharts` — Charts (Area, Bar, Radar)
- `@upstash/redis` — Caching with graceful degradation
- `meilisearch` — Full-text search
- `@playwright/test` — E2E testing

## Conventions
- All paths use `@/` alias → `./src/*`
- Prefer Server Components; use `"use client"` sparingly
- Use existing UntitledUI components before creating new ones
- Prisma client import: `@/generated/prisma/client` (NOT `@/generated/prisma`)
- Icons: `@untitledui/icons` named exports (e.g., `MarkerPin01` not `MapPin01`)
- tRPC reserved words: don't name procedures `apply` (use `applyToJob`)
