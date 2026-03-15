# Planeta.id — Career Operating System for Earth

A unified career intelligence platform built with Next.js 16, React 19, TypeScript, and Tailwind v4.

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database
- **Redis** (optional — app degrades gracefully without it)
- **Meilisearch** (optional — for full-text search)

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth sessions |
| `NEXTAUTH_URL` | App URL (default: `http://localhost:3456`) |
| `ANTHROPIC_API_KEY` | Claude API key for AI features |
| `UPSTASH_REDIS_REST_URL` | Redis URL (optional) |
| `UPSTASH_REDIS_REST_TOKEN` | Redis token (optional) |
| `MEILISEARCH_HOST` | Meilisearch URL (optional) |
| `MEILISEARCH_API_KEY` | Meilisearch key (optional) |

### Installation

```bash
# Install dependencies
npm install

# Set up the database schema
npx prisma db push

# Seed with sample data (90+ skills, 120 jobs, 5000 salary points)
npx prisma db seed

# Start the development server (runs on port 3456)
npm run dev
```

Open [http://localhost:3456](http://localhost:3456) to access the app.

### First-Time Access

1. Navigate to `/register` to create an account
2. Complete the 5-step onboarding wizard at `/onboarding`
3. You'll land on the dashboard at `/`

### Useful Commands

```bash
npm run dev          # Start dev server (Turbopack, port 3456)
npm run build        # Production build
npx prisma studio    # Database GUI (browse/edit data)
npx prisma db push   # Push schema changes to database
npx prisma db seed   # Seed sample data
npx playwright test  # Run E2E tests
```

## Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | Overview with career widgets |
| Jobs | `/jobs` | Job listings with match scores |
| Skills | `/skills` | Skills genome + transferability |
| Salary | `/salary` | Compensation explorer |
| Career Map | `/career-map` | Interactive 2D career visualization |
| Skill Tree | `/skill-tree` | Interactive skill prerequisites |
| Path Simulator | `/paths` | Career trajectory charts |
| Companies | `/companies` | Company explorer + health scores |
| AI Agents | `/agents` | 8 specialized career AI agents |
| Settings | `/settings` | Profile + passkey management |

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind v4
- **Backend:** Next.js API Routes + Server Actions + tRPC v11
- **Database:** PostgreSQL + Prisma v6 + pgvector
- **Auth:** NextAuth v5 + WebAuthn (passkeys)
- **AI:** Claude API via @anthropic-ai/sdk
- **Real-time:** Server-Sent Events
- **Cache:** Redis (Upstash)
- **Search:** Meilisearch
- **Charts:** Recharts
- **3D:** Three.js + @react-three/fiber
- **Testing:** Playwright

## License

MIT — see [LICENSE](LICENSE) for details.
