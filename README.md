# 🎬 CinePurr — Watch Together, Purrfectly Synced

[![Live Demo](https://img.shields.io/badge/Live_Demo-cinepurr.me-brightgreen?style=for-the-badge)](https://cinepurr.me)
[![Demo Video](https://img.shields.io/badge/Demo_Video-YouTube-red?style=for-the-badge&logo=youtube)](YOUR_YOUTUBE_LINK_HERE)


**🌐 Live Demo: [https://cinepurr.me](https://cinepurr.me)**

[![TestSprite Hackathon S2](https://img.shields.io/badge/TestSprite-Hackathon_S2-2E8B57?style=for-the-badge&logo=androidauto)](https://www.testsprite.com/hackathon-s2)

> **A retro pixel-art, real-time watch-together platform** with synchronized rooms, chat, gamification, minigames, study tools, and social features — all wrapped in a Pokémon-themed UI.

> ⚠️ **Disclaimer / Fair Use:** CinePurr is an educational prototype built exclusively for the TestSprite Hackathon S2. This project is strictly non-profit and not intended for commercial operations. All Pokémon assets, characters, and third-party movie streams are used under Fair Use for technical demonstration purposes only. All intellectual property rights belong to their respective original owners (Nintendo, The Pokémon Company, etc.). Any optional donations are strictly voluntary support for the developer's time and are not payments for access to copyrighted content or services.

> 🔒 **Repository Note:** This is a clean, public mirror of the original private development repository. The commit history has been condensed to safely exclude production environment variables, database credentials, and proprietary API keys, while still making the full source code and TestSprite testing artifacts available to the judges.

## 🧪 TestSprite Integration (Hackathon Submission)

This repository is submitted for the **[TestSprite Hackathon S2](https://www.testsprite.com/hackathon-s2)**. To ensure a flawless user experience, CinePurr WatchTogether is fully covered by an AI-driven end-to-end testing suite.

- **Test Suite Directory:** [`testsprite_tests/`](testsprite_tests/) — Contains AI-generated test cases, Playwright scripts, and TestSprite planning artifacts.
- **Committed artifact snapshot:**
  - Frontend plan: **13** prioritized scenarios ([`testsprite_frontend_test_plan.json`](testsprite_tests/testsprite_frontend_test_plan.json))
  - Backend plan: **9** scenarios ([`testsprite_backend_test_plan.json`](testsprite_tests/testsprite_backend_test_plan.json))
  - Generated scripts: **67** `TC*.py` files (multi-round generated set)
  - Standard PRD: [`standard_prd.json`](testsprite_tests/standard_prd.json)
- **Judge guide:** [`testsprite_tests/HACKATHON_EVIDENCE.md`](testsprite_tests/HACKATHON_EVIDENCE.md) and [`testsprite_tests/README.md`](testsprite_tests/README.md)
- **Demo Video:** In progress now. Final `demo.mp4` will be added before submission.

## ✨ What Makes CinePurr Special

CinePurr isn't just another watch-together app. It's a **full social platform** built around the joy of watching content with friends:

- 🎬 **Synchronized Watch Rooms** — Host-authority video sync for YouTube, MP4, and live streams with sub-100ms chat
- 🎮 **6 Built-in Minigames** — Snake, 2048, Tetris, Memory Match, Math Challenge, Abyssal Watch — all inside a Game Boy shell with scanlines
- 🏆 **Full Gamification** — XP, levels, daily quests, login streaks, crates, leaderboards, achievements
- 🐾 **13 Pokémon Themes** — Pikachu, Umbreon, Gengar, Sylveon, and more — each with unique color palettes and sprite mascots
- 🤖 **AI Chatbot** — Google Gemini-powered assistant for help and movie recommendations
- 📚 **Study Room** — Pomodoro timer with focus mode and study streaks
- 🎵 **Mini Music Player** — Stream music via Piped API with persistent mini player
- 👥 **Social Features** — Friends, DMs, groups, activity feed, notifications
- 🛡️ **Admin Panel** — User management, bans, broadcasts, metrics
- 🌍 **i18n** — English + Turkish support
- 📱 **PWA** — Installable, offline fallback, mobile-optimized

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript 5** |
| UI | **React 19** + Tailwind CSS + Motion |
| Real-time | **Socket.IO v4** |
| Database | **PostgreSQL** + Prisma 6 (28 models, 9 migrations) |
| Auth | NextAuth (JWT, bcrypt) |
| Queue | BullMQ |
| Cache | Redis |
| AI | Google Gemini |
| Metrics | Prometheus via `prom-client` |
| Infra | Docker Compose + Nginx + Let's Encrypt SSL |

---

## 🧪 TestSprite Testing Journey

This project uses **TestSprite MCP** for AI-powered end-to-end testing.

### Round 1 (Remote — cinepurr.me)
- **8/30 tests passed (26.6%)**
- Primary blocker: Bot detection on production site blocked automated login
- Auth failures cascaded to 22 downstream test failures

### Round 2 (Local — localhost:3000)
- **12/13 high-priority tests passed (92.3%)**
- Tests executed against local dev server with real PostgreSQL database
- TestSprite identified **3 actionable bugs** which were immediately fixed:
  - ✅ **Fixed:** Missing "Add to Watchlist" button on TMDB movie detail modal
  - ✅ **Fixed:** YouTube queue addition logic not appending to queue state
  - ✅ **Fixed:** Guest access redirect blocking room entry for non-authenticated users

### Current repository snapshot
- Frontend test plan currently tracks **13** prioritized scenarios.
- Backend test plan currently tracks **9** API-focused scenarios.
- The repository currently includes **67** generated `TC*.py` test scripts from multiple TestSprite passes.
- Local temporary execution artifacts are intentionally ignored in git (`testsprite_tests/tmp/`). Proof of execution (12/13 tests passing) is documented in `testsprite_tests/testsprite_dashboard_proof.png`.

### What We Learned
TestSprite's AI agent was remarkably effective at finding real UI gaps — the missing watchlist button was a genuine feature regression that manual testing missed. The blocked tests revealed important UX friction points around guest access and empty-state handling that inform our roadmap.

All tracked TestSprite artifacts are in [`testsprite_tests/`](./testsprite_tests/).

### Local validation (non-TestSprite)
- `npm test -- --run tests/unit tests/integration` currently passes: **17/17 tests**.

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 22.x |
| PostgreSQL | 14+ |
| Redis | 7+ (optional) |

### Install & Run

```bash
git clone https://github.com/lxcario/CinePurr-WatchTogether.git
cd CinePurr-WatchTogether
npm ci
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
npx prisma migrate deploy
npm run db:seed
npm run dev
```

In a second terminal (for real-time features):
```bash
npm run server
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Repository Layout

```
CinePurr-WatchTogether/
├── server/                 # Express + Socket.IO server
├── src/
│   ├── app/                # Next.js routes and API handlers (50+ API routes)
│   ├── components/         # 60+ React components (room, social, games, admin)
│   ├── hooks/              # Shared client hooks
│   ├── lib/                # Auth, Prisma, analytics, i18n, utilities
│   └── types/              # Shared TypeScript types
├── prisma/                 # 28 models and 9 migrations
├── tests/                  # Vitest unit and integration tests
├── testsprite_tests/       # TestSprite AI-generated test cases & reports
└── public/                 # Static assets and PWA files
```

---

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Full technical architecture with diagrams
- [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md) — Complete feature inventory
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Production deployment guide
- [CHANGELOG.md](./CHANGELOG.md) — Migration and upgrade history
- [SECURITY_NOTE.md](./SECURITY_NOTE.md) — Security considerations

---

## 🏗️ Build Notes

- `npm run build` can run as a local validation build without `DATABASE_URL` (build script sets fallbacks).
- On Windows, Prisma can fail with `EPERM ... query_engine-windows.dll.node` if Node processes are holding file locks; stop active Node processes and rerun `npx prisma generate` before building.
- Full runtime requires real environment variables for auth, persistence, and real-time features
- The app uses Webpack for local dev (`next dev --webpack`) to avoid Turbopack OOM issues with 75KB `globals.css`

---

Built with ❤️ and pixel art by [@lxcario](https://github.com/lxcario)

