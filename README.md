# CinePurr WatchTogether

CinePurr is a retro-styled real-time watch-together web app with synchronized rooms, chat, progression systems, minigames, study tools, and social features. This repository is the public hackathon copy prepared for the TestSprite workflow.

## Highlights

- Synchronized watch rooms for YouTube, MP4, and live streams
- Real-time chat, reactions, DMs, and presence
- XP, quests, streaks, crates, leaderboards, and VIP cosmetics
- Study room with Pomodoro and focus tooling
- Pixel-art themes, virtual pet elements, and playful UI surfaces
- Admin tools, analytics, and a separate Socket.IO server
- TestSprite-generated suites and reports in `testsprite_tests/`

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Motion |
| Real-time | Socket.IO v4 |
| Database | PostgreSQL + Prisma 6 |
| Auth | NextAuth |
| Queueing | BullMQ |
| Cache / rate limit | Redis |
| AI | Google Gemini |
| Metrics | Prometheus via `prom-client` |

## Quick Start

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 22.x |
| PostgreSQL | 14+ |
| Redis | 7+ (optional but recommended) |

### Install

```bash
git clone https://github.com/lxcario/CinePurr-WatchTogether.git
cd CinePurr-WatchTogether
npm ci
```

### Configure

```bash
cp .env.example .env
```

Fill in the values you need, especially:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `TMDB_API_KEY`
- `RESEND_API_KEY`

### Run locally

```bash
npx prisma migrate deploy
npm run db:seed
npm run dev
```

In a second terminal:

```bash
npm run server
```

Open `http://localhost:3000`.

## Hackathon Demo Accounts

These accounts are intentionally public and demo-only for the TestSprite hackathon flow. Change or remove them for any real deployment.

| Purpose | Login | Password | Role |
|---|---|---|---|
| Primary admin | `Lucario` | `***REMOVED***` | `FOUNDER` |
| Secondary admin | `Resque` | `***REMOVED***` | `PURR_ADMIN` |
| Non-admin access check | `nonadmin.user@example.com` | `WrongPassword123!` | `USER` |

## Build Notes

- `npm run build` now works as a local validation build even if `DATABASE_URL` or `NEXTAUTH_SECRET` are not set.
- Full runtime behavior still requires real environment variables for auth, persistence, and background features.
- If `DATABASE_URL` is present, the build wrapper runs the migration safety step and `prisma migrate deploy` before compiling.
- Admin broadcast, force-close, and maintenance actions now use `ADMIN_API_KEY` when present and otherwise fall back to `NEXTAUTH_SECRET`, which makes single-machine local setup much less brittle.

## Repository Layout

```text
CinePurr-WatchTogether/
|-- server/                 # Express + Socket.IO server
|-- src/
|   |-- app/                # Next.js routes and API handlers
|   |-- components/         # Room UI, social UI, games, windows, admin
|   |-- hooks/              # Shared client hooks
|   |-- lib/                # Auth, Prisma, analytics, i18n, utilities
|   `-- types/              # Shared types
|-- prisma/                 # 28 models and 9 migrations
|-- tests/                  # Vitest unit and integration tests
|-- testsprite_tests/       # TestSprite plans, suites, and reports
`-- public/                 # Static assets and PWA files
```

## Hackathon Workflow

Current local validation baseline:

- `npx vitest run`
- `npm run build`

Primary public-repo goals for the hackathon:

- Improve TestSprite scenario pass rate
- Reduce setup friction for judges and reviewers
- Fix obvious product regressions in auth, rooms, queueing, and admin flows
- Keep the public repo clean, runnable, and easy to evaluate

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [PIPED_INSTANCES_CONFIG.md](./PIPED_INSTANCES_CONFIG.md)
- [SECURITY_NOTE.md](./SECURITY_NOTE.md)
