# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at localhost:3000
npm run build      # Production build to dist/
npm run preview    # Preview production build
npx eslint src/    # Lint source files
```

No test framework is configured.

## Architecture

**Stack:** React 19 + Vite 5, Firebase (Auth + Firestore), Tailwind CSS v4, custom router (no React Router).

**Request flow:**
```
URL hash change → Router → Middleware guards → Page component
                                ↓
                    AuthState / AppState (pub-sub)
                                ↓
                    src/services/ → Firebase
```

### Custom Router (`src/router/`)

The router is hash-based (`window.location.hash`). Routes are defined in `routes.js` with async middleware arrays. The critical reason for a custom router: `requireAuth` must await Firebase initialization before redirecting — React Router can't do this out of the box.

Middleware guards: `requireAuth`, `requireEmailVerified`, `requireAdmin`.

### State (`src/state/`)

Two global stores using a lightweight pub/sub pattern (`subscribe`, `setState`, `getState`):
- **AuthState** — user, loading, theme; initializes via `onAuthStateChanged`; real-time ban enforcement via `onSnapshot` on `users/{uid}`
- **AppState** — petType (`'dog'|'cat'`), currentPage; persisted in localStorage

### Services (`src/services/`)

**Rule:** Pages and components never import Firebase directly. All Firestore/Auth access goes through services.

Key services: `content.service.js` (content CRUD + in-memory cache), `profile.service.js`, `list.service.js`, `user.service.js`, `auth/auth.service.js`.

### Firestore Schema

- `users/{uid}` — `{ email, role: 'user'|'admin', status: 'active'|'banned', createdAt }`
- `users/{uid}/profiles` — `{ name, species: 'dog'|'cat', avatar, isDefault }`
- `content` — `{ title, description, thumbnail, videoUrl, category: 'movie'|'series'|'doc', genre, species: 'dog'|'cat', featured, trending, original, rating }`

### Component Organization (`src/components/`)

- `modals/` — `ContentDetailModal.jsx` (detail overlay triggered from cards)
- `features/` — reusable feature blocks: `CategoryRow`, `FilterSidebar`, `MovieCard`, `ProfileCard`, `VideoCard`, `VideoGrid`, `VideoPlayer`, `ThumbnailCard`, `ProfileFormModal`
- `templates/` — page-level layout templates (e.g. `CategoryPageTemplate`)
- `layout/`, `common/`, `ui/` — structural and shared primitives

### Pages (`src/pages/`)

Organized by domain: `dashboard/`, `home/`, `categories/`, `movies/`, `player/`, `account/`, `admin/`. Flat pages (`LoginPage.js`, `RegisterPage.js`, etc.) sit directly under `pages/`.

## Environment

Copy `.env.example` → `.env` and fill the 6 `VITE_FIREBASE_*` variables. The app validates all variables at startup and throws a descriptive error if any are missing.

## Admin & Seeding

To promote a user to admin, uncomment `setAdminRole()` in `src/main.js`, run the dev server once, then re-comment. Same pattern for `seedDatabase()` / `populateDatabase()`.

## Code Style

ESLint enforces: semicolons, single quotes, 2-space indent, no `var`. Prettier: `printWidth: 100`, `trailingComma: 'none'`.
