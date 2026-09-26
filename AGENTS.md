# AGENTS.md

## Cursor Cloud specific instructions

Coffee Break is a fully client-side Vite + React 19 + TypeScript PWA. There is **no backend, database, or external service** — all state persists in the browser's `localStorage`. The only service to run is the Vite dev server.

- Dependencies are installed automatically on VM startup via the update script (`npm install`). No extra system packages are needed.
- Standard commands live in `package.json` and `README.md`. Key ones:
  - Dev server: `npm run dev` → serves at `http://localhost:5173` (this is the only service).
  - Lint: `npm run lint`
  - Build: `npm run build` (runs a `prebuild` hook, `scripts/generate-icons.mjs`, which uses `sharp` to generate PWA icons).
  - GitHub Pages parity preview: `npm run preview:pages` → `http://localhost:4173/coffee-break/` (builds with `GITHUB_PAGES=true` so assets are served under the `/coffee-break/` base path).
- Gotcha: the app's base path differs between plain `npm run dev` (served at `/`) and the Pages build (`/coffee-break/`). When testing links/asset paths that must match production, use `preview:pages`, not `dev`.
- To manually verify the app works end-to-end, add a calendar event and/or play a mini-game; a same-day event surfaces as a reminder on the home screen.
