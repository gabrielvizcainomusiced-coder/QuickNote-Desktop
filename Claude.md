# Claude.md - QuickNote Frontend

**Last Updated:** February 2026
**Project:** QuickNote Desktop Application (Frontend)
**Developer:** Gabriel Vizcaino
**Repository:** https://github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop

---

## Project Overview

QuickNote Desktop is a React-based sticky note / quick note application. It has a dual-mode architecture — it can run as a standalone client-side app (localStorage) or connect to a REST API backend with PostgreSQL.

### Key Feature: Dual-Mode Architecture
- **Demo Mode (localStorage):** No backend needed, perfect for GitHub Pages
- **Full-Stack Mode (API):** Connects to QuickNote API for persistent server-side storage

This demonstrates: environment-based configuration, multiple deployment strategies, service layer abstraction, and separation of concerns.

---

## Tech Stack

- **React 19** — Hooks-based UI (`useState`, `useEffect`)
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
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header
│   │   ├── Footer.jsx          # App footer
│   │   ├── BoltIcon.jsx        # SVG icon used in header
│   │   ├── CreateNote.jsx      # Note creation form (controlled inputs)
│   │   ├── NoteList.jsx        # CSS Grid container for note cards
│   │   ├── NoteItem.jsx        # Note card — display + inline edit toggle
│   │   └── EditNote.jsx        # Inline edit form inside NoteItem
│   ├── config/
│   │   └── api.js              # Reads env vars, exports USE_BACKEND + API_URL
│   ├── services/
│   │   └── noteService.js      # Data abstraction — localStorage OR API
│   ├── App.jsx                 # Root component — owns note state
│   ├── main.jsx                # React entry point
│   └── styles.css              # All styles (no inline styles in components)
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
├── CreateNote        (calls App's addNote + onError handlers)
├── NoteList
│   └── NoteItem[]    (calls App's editNote / deleteNote handlers)
│       └── EditNote  (inline edit form, renders inside NoteItem)
└── Footer
```

### Service Layer Pattern

Components never call `fetch()` or `localStorage` directly. All operations go through `noteService`:

```
User Action → Component → noteService → localStorage (demo) OR API (full-stack)
```

Switching modes requires zero component changes — only the env var changes.

### Error Handling Pattern

All errors flow through a single `error` state in `App.jsx` and render via the `.error-banner` CSS class. Components surface errors by calling `props.onError(message)` — they never manage error display themselves.

```
CreateNote validation error → props.onError() → App error state → error-banner UI
API failure → catch block → setError() → App error state → error-banner UI
EditNote validation error → local error state → inline .edit-error UI
```

Note: `EditNote` uses its own local error state since the error needs to appear inline inside the note card, not in the global banner.

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
- Always restart dev server after editing `.env`

---

## Validation Rules

**CreateNote (frontend):**
- Both title AND content required (`||` not `&&`)
- Both must be non-empty after trimming whitespace
- Errors surface via `props.onError()` → global error banner

**EditNote (frontend):**
- Same rules apply on save
- Error renders inline via local `error` state → `.edit-error` class

**Backend enforces:**
- Title max 255 characters
- Content max 500 characters (sticky note intent)
- HTML sanitization (XSS prevention)

---

## Service Layer — noteService.js

```javascript
class NoteService {
  async getAllNotes()         // Get all notes
  async createNote(note)     // Create new note
  async updateNote(id, note) // Update existing note
  async deleteNote(id)       // Delete note — returns deleted note in both modes
}

export default new NoteService(); // Singleton
```

---

## Component Details

### App.jsx
- Owns global state: `notes`, `loading`, `error`
- Key functions: `loadNotes`, `addNote`, `editNote`, `deleteNote`
- Passes `onError={setError}` to `CreateNote` so validation errors use the global banner
- No inline styles — all styles in `styles.css`

### CreateNote.jsx
- Controlled inputs for title and content
- Validates both fields with `||` (both required)
- Calls `props.onError()` for validation failures (no `alert()`)
- Clears form after successful submission

### NoteList.jsx
- Receives `notes`, `onDelete`, `onEdit` as props
- Shows `.empty-state` when no notes exist
- Renders CSS Grid of `NoteItem` cards

### NoteItem.jsx
- Manages `isEditing` state and `capturedHeight` for smooth layout transitions
- Captures note body height before switching to edit mode to prevent layout jump
- Renders `EditNote` when editing, note content when not

### EditNote.jsx
- Temp state (`tempNote`) holds edits without mutating parent state
- Validates both fields before calling `props.onSave()`
- Shows inline `.edit-error` message on validation failure
- Cancel discards changes without saving

---

## CSS Architecture

All styles live in `styles.css`. No inline styles in any component.

**Key classes:**
- `.app`, `.content` — layout structure
- `.notes-container` — CSS Grid for note cards
- `.note`, `.note-body` — note card styles
- `.edit-state`, `.edit-title`, `.edit-content`, `.edit-actions` — inline edit styles
- `.empty-state` — shown when no notes exist
- `.loading-state` — shown during initial data fetch
- `.error-banner`, `.error-dismiss` — global error display
- `.edit-error` — inline validation error in EditNote

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

No automated tests for the frontend — testing effort was focused on the backend (41 tests, 100% coverage). Frontend behavior is verified manually.

**Future:** React Testing Library for components, Cypress for E2E.

### Manual Checklist

**Demo Mode:**
- [ ] Create a note (both fields required)
- [ ] Try submitting with empty title — error banner appears
- [ ] Try submitting with whitespace-only content — error banner appears
- [ ] Edit a note inline
- [ ] Try saving with empty fields — inline error appears
- [ ] Delete a note
- [ ] Refresh — notes persist

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

**Near-term:** Character count in CreateNote form, toast notifications instead of error banner.

**Longer-term:** Markdown support, dark mode, note categories/tags, search/filter, drag-and-drop reordering, keyboard shortcuts, export to file.

---

## Version History

- **v1.2** (Feb 2026) — Codebase assessment cleanup
  - Removed empty `utils/` folder and `storage.js` (unused)
  - Props destructuring improvement noted for future refactor

- **v1.1** (Feb 2026) — Bug fixes and cleanup
  - Fixed validation logic bug (`&&` → `||` in CreateNote)
  - Added save validation to EditNote
  - Replaced `alert()` with consistent error banner pattern
  - Moved all inline styles to CSS
  - Removed empty dead files (FilterBar.jsx, useNotes.js)

- **v1.0** (Jan 2026) — Initial release
  - Dual-mode architecture
  - Full CRUD
  - GitHub Pages deployment
  - Service layer pattern
  - React 19

---

## Notes for AI Assistants

When working on this project:
1. **Check environment mode first** — localStorage or API?
2. **Never bypass noteService** — components must not call fetch/localStorage directly
3. **No inline styles** — all styles belong in `styles.css`
4. **Error handling pattern** — validation errors in CreateNote use `props.onError()`, EditNote uses local state, API errors use `setError()` in App
5. **Both fields required** — validation uses `||` not `&&`
6. **Content limit is 500 characters** — intentional sticky note design
7. **Actual component name** — it's `NoteItem.jsx` not `Note.jsx`
8. **No utils folder** — it was removed, don't recreate it
9. **Update this file** when making architectural changes
10. **Reference backend Claude.md** for API contract and validation rules

**Preventing Ralph Wiggum Loops:**
This file contains all frontend context. Always read it before suggesting changes that might conflict with the dual-mode architecture or established patterns.

**Last Review Date:** February 2026
**Status:** Production-ready, Interview-ready
**Next Review:** After Movie Explorer completion or any major changes