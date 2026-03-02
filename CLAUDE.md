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
| `/` | Dashboard | 01 (stub) → 10 (real) |
| `/jobs` | Job listings | 08 |
| `/jobs/[id]` | Job detail | 09 |
| `/skills` | Skills genome | 15 |
| `/salary` | Compensation engine | 14 |
| `/paths` | Path simulator | 20 |
| `/settings` | User settings | 06 |
| `/agents` | AI agents hub | 27 |
| `/companies` | Company intel | 26 |
| `/radar` | Opportunity radar | 21 |
| `/relocation` | Relocation intel | 22 |
| `/immigration` | Immigration intel | 23 |
| `/indices` | Planeta indices | 30 |
| `/career-map` | 3D career map | 31 |
| `/negotiation` | Negotiation intel | 19 |
| `/login` | Sign in | 03 |
| `/register` | Sign up | 03 |
| `/onboarding` | Setup wizard | 06 |

## Phase Tracking
- [x] Phase 01: Project Restructure + CLAUDE.md Bootstrap
- [ ] Phase 02: Database — Prisma + PostgreSQL Core Schema
- [ ] Phase 03: Authentication — NextAuth v5
- [ ] Phase 04: WebAuthn / Passkey Authentication
- [ ] Phase 05: tRPC Setup + Base API Layer
- [ ] Phase 06: User Profile + Onboarding Flow
- [ ] Phases 07–38: See implementation plan

## Dev Commands
```bash
npm run dev          # Start dev server (turbopack, port 3456)
npm run build        # Production build
npx prisma studio    # Database GUI (after Phase 02)
npx prisma db push   # Push schema changes
npx prisma db seed   # Seed data (after Phase 07)
```

## Conventions
- All paths use `@/` alias → `./src/*`
- Prefer Server Components; use `"use client"` sparingly
- Use existing UntitledUI components before creating new ones
- Keep CLAUDE.md updated after each phase
