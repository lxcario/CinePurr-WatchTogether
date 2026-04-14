# CinePurr 🐱🎬

A cozy, feature-rich **real-time watch-together web app** built for fun. Invite friends, sync video playback, chat, earn XP, open crates, and vibe together — all wrapped in a retro pixel-art aesthetic.

---

## ✨ Feature Highlights

- 🎬 **Synchronized video rooms** — YouTube, MP4, live TV/IPTV, all in perfect sync
- 🎭 **Co-host system** — promote trusted viewers to co-hosts with player controls
- 🔍 **TMDB-powered search** — search movies & TV shows with posters, episode pickers, and season browsing
- 📋 **Personal watchlist** — bookmark TMDB titles directly from the search modal
- 🕰️ **Watch history** — automatic log of every video you've played in a room
- 💬 **Real-time chat** — with emoji reactions, floating video reactions, typing indicators
- 📩 **Direct messages** — private chat between friends, with unread indicators
- 👥 **Friends system** — send/accept requests, see who's online and now watching
- 🎮 **Minigames arcade** — Snake, 2048, Tetris-style, memory, math and more in a Game Boy shell
- 🏆 **XP & leveling** — earn XP for every action, level up, unlock titles
- 🔥 **Daily login streaks** — flame counter, badges at 7 / 30 / 100 days
- 📜 **Daily quests** — 4 rotating tasks per day, each awarding XP
- 🎁 **Crate opener** — loot box rewards: XP, themes, titles, badges
- 🥇 **Leaderboards** — Watch Time, Level, Streak, Messages, Rooms Created
- 👑 **VIP cosmetics** — custom name colours, gradients, glows, badges, profile backgrounds, ID card styles
- 🤖 **AI chatbot** — powered by Google Gemini
- 🎵 **Mini music player** — streams from Piped (YouTube Privacy frontend)
- 📚 **Study room** — Pomodoro timer + focus streaks
- 🐾 **Virtual pet** — interactive Pokémon-style desktop companion
- 🎨 **13 pixel-art themes** — Umbreon, Flareon, Gengar, Sylveon, and more
- 📰 **Film news feed** — latest movie & TV headlines from TMDB

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20.x |
| PostgreSQL | 14+ |
| Redis | 7+ (optional but recommended) |

### Installation

```bash
# 1. Clone and install
git clone https://github.com/lxcario/CinePurr.git
cd CinePurr
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section below)

# 3. Run database migrations
npx prisma migrate deploy
npx prisma generate

# 4. Start the Next.js dev server
npm run dev

# 5. In a second terminal, start the Socket.io server
npm run server
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cinepurr

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Socket server
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

# TMDB (movies/TV search)
TMDB_API_KEY=your_tmdb_key

# Google Gemini AI (chatbot)
GEMINI_API_KEY=your_gemini_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
EMAIL_FROM=noreply@yourdomain.com

# Redis (optional — enables rate limiting & socket scaling)
REDIS_URL=redis://localhost:6379

# Piped instances config (optional)
PIPED_INSTANCES_CONFIG_URL=https://gist.github.com/.../raw/config.json
```

---

## 📁 Project Structure

```
CinePurr/
├── server/                 # Express + Socket.io server (port 4000)
│   └── index.ts
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   ├── room/[roomId]/  # Watch room
│   │   ├── profile/[username]/
│   │   ├── study/          # Pomodoro study room
│   │   ├── games/          # Games hub
│   │   ├── news/           # Film news
│   │   ├── admin/          # Admin panel
│   │   └── api/            # 35+ API route handlers
│   ├── components/
│   │   ├── room/           # Video player, chat, UserList, queue
│   │   ├── engagement/     # XP, streak, quests, leaderboard, activity
│   │   ├── games/          # Minigame components + CrateOpener
│   │   ├── windows/        # StatWindow children (History, Watchlist, etc.)
│   │   ├── home/           # Desktop & mobile home layouts
│   │   └── ui/             # Shared UI primitives
│   ├── hooks/              # useWindowManager, useDebounce, etc.
│   ├── lib/                # Prisma client, auth, utils, i18n, themes
│   └── types/              # Shared TypeScript types
├── prisma/
│   ├── schema.prisma       # 20 database models
│   └── migrations/         # 7 applied migrations
└── public/                 # Static assets, PWA manifest, fonts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Real-time | Socket.io v4 |
| Database | PostgreSQL (Prisma ORM) |
| Auth | NextAuth.js (credentials + email verification) |
| AI | Google Gemini (`@google/generative-ai`) |
| Email | Resend + Nodemailer |
| Job queues | BullMQ |
| Cache / rate-limit | Redis |
| Metrics | Prometheus (`prom-client`) |
| Video | ReactPlayer + YouTube IFrame API |
| Music | Piped API (privacy frontend) |
| Movie metadata | TMDB API |

---

## 📖 Documentation

| File | Description |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, socket events, sync logic |
| [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md) | Complete feature inventory |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Railway, Vercel, Render deployment guides |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [PIPED_INSTANCES_CONFIG.md](./PIPED_INSTANCES_CONFIG.md) | Music player instance config |
| [SECURITY_NOTE.md](./SECURITY_NOTE.md) | Security practices & secret rotation |

---

## 🤝 Contributing

This is a personal project built for fun — PRs and issues are welcome!

---

*Built with ♥ and way too many late nights.*
