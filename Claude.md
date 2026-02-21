# Claude.md - QuickNote Frontend

**Last Updated:** February 2026
**Project:** QuickNote Desktop Application (Frontend)
**Developer:** Gabriel Vizcaino
**Repository:** https://github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop

---

## Project Overview

QuickNote Desktop is a React-based note-taking application designed as a quick-note / sticky note tool. It has a dual-mode architecture — it can run as a standalone client-side app (localStorage) or connect to a REST API backend with PostgreSQL.

### Key Feature: Dual-Mode Architecture
- **Demo Mode (localStorage):** No backend needed, perfect for GitHub Pages
- **Full-Stack Mode (API):** Connects to QuickNote API for persistent server-side storage

This demonstrates: environment-based configuration, multiple deployment strategies, service layer abstraction, and separation of concerns.

---

## Tech Stack

- **React 19** — Hooks-based UI (`useState`, `useEffect`, custom hooks)
- **Vite** — Dev server and production bundler
- **JavaScript (ES6+)** — Async/await, modules, destructuring
- **CSS3** — Custom Flexbox/Grid (no framework — intentional)
- **Fetch API** — HTTP requests (no axios)
- **GitHub Actions** — CI/CD for GitHub Pages deployment

### Dependencies
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "vite": "^5.0.0"
}
```

---

## Project Structure

```
QuickNote-Desktop/
├── .github/workflows/
│   └── deploy.yml              # Auto-deploy to GitHub Pages on push to main
├── hooks/
│   └── useNotes.js             # Custom hook — note state and CRUD logic
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header
│   │   ├── Footer.jsx          # App footer
│   │   ├── CreateNote.jsx      # Note creation form (controlled inputs)
│   │   ├── NoteList.jsx        # CSS Grid container for note cards
│   │   └── Note.jsx            # Note card — display + inline edit modes
│   ├── config/
│   │   └── api.js              # Reads env vars, exports USE_BACKEND + API_URL
│   ├── services/
│   │   └── noteService.js      # Data abstraction — localStorage OR API
│   ├── App.jsx                 # Root component — owns note state
│   ├── main.jsx                # React entry point
│   └── styles.css              # Global styles
├── utils/
│   └── localStorage.js         # localStorage read/write helpers
├── .env.example                # Environment variable template
├── .env                        # Local environment (gitignored)
├── index.html                  # HTML entry point
├── vite.config.js              # Base path config for GitHub Pages
└── package.json
```

---

## Architecture & Data Flow

### Component Hierarchy
```
App  (owns note state: notes, loading, error)
├── Header
├── CreateNote        (calls App's addNote handler)
├── NoteList
│   └── Note[]        (calls App's editNote / deleteNote handlers)
└── Footer
```

### Service Layer Pattern

Components never call `fetch()` or `localStorage` directly. All operations go through `noteService`:

```
User Action → Component → noteService → localStorage (demo) OR API (full-stack)
```

Switching modes requires zero component changes — only the env var changes.

### Data Flow (Full-Stack Mode)
1. User action → component event handler
2. Component calls `noteService` method
3. `noteService` makes fetch request to API
4. API returns note data
5. Component updates React state
6. React re-renders UI

### Data Flow (Demo Mode)
1. User action → component event handler
2. Component calls `noteService` method
3. `noteService` reads/writes localStorage
4. Component updates React state
5. React re-renders UI

---

## Environment Configuration

**.env:**
```env
VITE_USE_BACKEND=false
VITE_API_URL=http://localhost:3001/api
```

**src/config/api.js:**
```javascript
export const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

**Key points:**
- Vite requires `VITE_` prefix for client-side variables
- Access via `import.meta.env.VARIABLE_NAME`
- Boolean env vars are strings — must compare with `=== 'true'`
- Never store secrets in `VITE_` variables — they're visible in the browser

---

## Service Layer — noteService.js

```javascript
class NoteService {
  async getAllNotes()        // Get all notes
  async createNote(note)    // Create new note
  async updateNote(id, note) // Update existing note
  async deleteNote(id)      // Delete note
}

export default new NoteService(); // Singleton
```

**deleteNote** returns the deleted note in both modes (API and localStorage) for consistency.

---

## Component Details

### App.jsx
- Owns global note state: `notes`, `loading`, `error`
- Key functions: `loadNotes`, `addNote`, `editNote`, `deleteNote`
- Pattern: async state updates with try/catch, immutable array operations

### CreateNote.jsx
- Controlled inputs for title and content
- Clears form after submission
- Calls parent's `onAdd` handler

### NoteList.jsx
- Receives `notes`, `onDelete`, `onEdit` as props
- Renders CSS Grid of Note cards

### Note.jsx
- Display mode and inline edit mode (`isEditing` state)
- Temp state during edit: `editTitle`, `editContent`
- Delete and edit/save toggle buttons

---

## Validation (Frontend)

The frontend does basic non-empty validation before calling `noteService`. The backend enforces the full rules:
- Title: required, non-empty, max 255 characters
- Content: required, non-empty, max **500 characters** (sticky note intent)

---

## Deployment

### GitHub Pages (Demo Mode)
- Automated via GitHub Actions on push to `main`
- `vite.config.js` must have `base: '/QuickNote-Desktop/'`
- Must use `VITE_USE_BACKEND=false`
- Live: https://gabrielvizcainomusiced-coder.github.io/QuickNote-Desktop/

### Local Full-Stack
```bash
# Terminal 1
cd quicknote-api && docker-compose up

# Terminal 2 — set VITE_USE_BACKEND=true in .env first
npm run dev
```

---

## Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build locally
git push origin main  # Triggers GitHub Actions deploy
```

---

## Testing Strategy

No automated tests for the frontend — testing effort was focused on the backend (37 tests, 100% coverage). Frontend behavior is best verified manually or via E2E tools.

**Future:** React Testing Library for components, Cypress for E2E.

### Manual Checklist

**Demo Mode:**
- [ ] Create a note
- [ ] Edit inline
- [ ] Delete a note
- [ ] Refresh — notes persist
- [ ] Incognito — notes start empty

**Full-Stack Mode:**
- [ ] Backend health: `curl http://localhost:3001/health`
- [ ] Create note — verify POST in Network tab
- [ ] Edit note — verify PUT in backend logs
- [ ] Refresh — notes load from database

**Deployment:**
- [ ] GitHub Actions build passes
- [ ] Live site loads
- [ ] CRUD works on live site
- [ ] No console errors

---

## Common Issues & Solutions

**Env var not taking effect:**
Restart dev server after editing `.env` (Ctrl+C → `npm run dev`)

**Debug config:**
```javascript
console.log('Mode:', import.meta.env.VITE_USE_BACKEND);
console.log('API:', import.meta.env.VITE_API_URL);
```

**CORS error / API not responding:**
```bash
curl http://localhost:3001/health  # verify backend is up
```

**Notes not persisting (localStorage mode):**
Use a normal browser window — incognito may block localStorage.

**GitHub Pages 404:**
Confirm `base: '/QuickNote-Desktop/'` in `vite.config.js`.

---

## Known Limitations (Intentional for Portfolio Scope)

- No authentication (single user)
- No offline support in API mode
- No real-time updates
- No undo/redo
- No auto-save while typing
- Web only (no mobile app)

---

## Future Enhancements

**Near-term:** Loading spinner, delete confirmation dialog, toast notifications, character count in CreateNote form.

**Longer-term:** Markdown support, dark mode, note categories/tags, search/filter, drag-and-drop reordering, keyboard shortcuts, export to file.

---

## Version History

- **v1.0** (Jan 2026) — Initial release: dual-mode architecture, full CRUD, GitHub Pages deployment, service layer pattern, React 19

---

## Notes for AI Assistants

When working on this project:
1. **Check environment mode first** — localStorage or API?
2. **Never bypass noteService** — components must not call fetch/localStorage directly
3. **Follow existing component patterns** — consistent structure throughout
4. **Content limit is 500 characters** — this is intentional (sticky note / quick note design)
5. **Update this file** when making architectural changes
6. **Reference backend Claude.md** for API contract and validation rules

**Preventing Ralph Wiggum Loops:**
This file contains all frontend context. Always read it before suggesting changes that might conflict with the dual-mode architecture or established patterns.

**Last Review Date:** February 2026
**Status:** Production-ready, Interview-ready
**Next Review:** After Movie Explorer completion or any major changes