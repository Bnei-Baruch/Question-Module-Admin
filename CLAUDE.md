# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs React dev server on :3000 + Express on :2200 concurrently)
npm start

# Production build (cleans dist, then builds React bundle)
npm run build

# Frontend only (React dev server)
npm run frontend

# Backend only (Express with nodemon)
npm run dev-server

# Docker image build
npm run docker:build
```

There are no tests in this codebase. devDependencies include Jest/Enzyme but no test files exist.

## Architecture

Full-stack JS app: React + Redux frontend, Express + MongoDB backend, Socket.io for real-time sync.

### Frontend (`src/`)

```
index.js → configureStore → Root.js (Redux + OIDC + Router) → App.js (routes)
```

Routes map to role-based views:
- `/organizer` → `Orginazer.js` — main admin UI (2-column: unreviewed | approved)
- `/speaker` → `Speaker.js` — broadcast interface
- `/rav` → `Rav.js` — moderator/rabbi view with bulk operations
- `/tags` → `Tags.js` — tag management

Redux store shape:
```js
{
  oidc: { user },          // OIDC auth state (redux-oidc)
  questions: [...],        // All questions array
  user: { serialUserId },  // App-specific user data
  notification: {},        // Toast/dialog messages
  busyIndicator: { count } // Loading spinner ref count
}
```

`src/utils/data.js` is the Axios API layer. `src/utils/socket.js` sets up all Socket.io event listeners that dispatch Redux actions directly.

### Backend (`server/`)

`devBackendServer.js` (dev) / `server.js` (prod) initialize Express on port 2200. MongoDB via Mongoose (v4). Socket.io broadcasts mutations to all connected clients except the sender.

API endpoints (all POST in `server/apis.js`):
- `/api/ask` — submit question, auto-translate to Hebrew via Google Translate, broadcast `newQuestion`
- `/api/getQuestions` — fetch all questions
- `/api/feed` — questions from last 4 hours
- `/api/questionAction` — update question state (approve/discard/read/broadcast order)

`server/db.js` defines 3 Mongoose models: `Question`, `User`, `Tag`.

`server/cfg.js` maps 500+ geographic room name prefixes to ~10 region groups — this is used to group participants by region in the Organizer view.

### Question Lifecycle

1. Submit → POST `/api/ask` → Google Translate (→ Hebrew) → save to MongoDB
2. Server broadcasts `newQuestion` via Socket.io → all admin clients add to Redux state
3. Organizer approves → Redux action → POST `/api/questionAction` → server broadcasts
4. Translation edits are debounced 300ms before hitting the DB/socket

Question fields that drive the UI state machine:
- `approvedForBroadcast` — approved for answering
- `broadcastOrderingIndex` — position in broadcast queue
- `hasBeenRead` — admin has viewed it
- `hasBeenAsked` — answered during the live event
- `discard` — hidden/deleted
- `translation.he` — Hebrew translation (auto-generated)

### Auth

OpenID Connect via `redux-oidc` + `oidc-client`. `src/utils/userManager.js` configures the OIDC client. `public/silent_renew.html` handles token refresh. Protected routes check `oidc.user` in Redux state before rendering.

### Real-time Events (Socket.io)

Client listens for: `newQuestion`, `markQuestionAsRead`, `discardQuestion`, `approvedForBroadcast`, `updateQuestionTranslation`, `broadcastOrder`, `hasBeenAsked`, `clearAll`

Each event triggers a corresponding Redux dispatch via `src/utils/socket.js`.

## Key Configuration

- Frontend proxy to backend: `"proxy": "http://localhost:2200"` in `package.json`
- `config-overrides.js` — react-app-rewired config (enables hot module reloading)
- MongoDB connection string is hardcoded in `server/db.js`
- Backend port: `process.env.PORT` or 2200
- DB auto-cleanup: removes questions older than 4 hours, runs hourly
- Frontend auto-refresh: every 5 minutes
