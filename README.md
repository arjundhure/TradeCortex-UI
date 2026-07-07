# TradeCortex UI 📊

React frontend for TradeCortex — AI-powered stock analysis platform.

## Live Demo
Coming soon

## Backend Repo
https://github.com/arjundhure/TradeCortexFinal

## Features
- 🔐 JWT authentication with auto token refresh
- 📊 Interactive stock charts with ML prediction overlay
- ⚡ Real-time price updates via WebSockets
- 📈 Side-by-side stock comparison
- 🎯 EVS gauge visualization
- 📰 News sentiment display
- 🤖 AI Buy/Hold/Sell recommendations
- 📋 Analysis history table

## Tech Stack
- React + Vite
- React Router v6
- TanStack React Query (server state + caching)
- Zustand (auth state management)
- Recharts (interactive charts)
- Axios (JWT interceptors + auto refresh)
- Lucide React (icons)
- WebSockets (live price feeds)

## Pages
| Page | Description |
|------|-------------|
| Login/Signup | JWT auth with investor type selection |
| Dashboard | Welcome screen + quick actions + recent analyses |
| Analyze | Full AI analysis — chart, EVS gauge, sentiment, recommendation |
| Compare | Side-by-side comparison of 2 stocks |
| History | Past analyses table from PostgreSQL |

## Setup
```bash
npm install
npm run dev
```

Make sure the backend is running at `http://localhost:8000` first.

## Architecture
React Query (server cache)
↓
Axios (JWT interceptor) → FastAPI backend
↓
Zustand (auth state) → localStorage (tokens)
↓
WebSocket → live price updates every 30s
## Key Design Decisions
- **React Query** handles all server state — automatic caching, background refetch, loading/error states
- **Zustand** manages auth — lighter than Redux, no boilerplate
- **Axios interceptors** auto-attach JWT and transparently refresh expired tokens
- **Vite proxy** forwards `/api` calls to backend — no CORS issues in development
