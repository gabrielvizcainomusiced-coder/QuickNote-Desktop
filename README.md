# QuickNote Desktop 📝

A note-taking application for desktop browsers built with React and Vite. Demonstrates full-stack integration, service layer architecture, dual-mode operation (localStorage or REST API), and automated CI/CD deployment via GitHub Actions.

🔗 **[View Live Demo](https://gabrielvizcainomusiced-coder.github.io/QuickNote-Desktop/)**

---

## ✨ Features

- **Full CRUD** — Create, edit, and delete notes with instant UI feedback
- **Dual-Mode Architecture** — Runs in localStorage (demo) or full-stack API mode, toggled with a single environment variable
- **Service Layer Pattern** — Components are fully decoupled from the data source; swapping backends requires zero component changes
- **Persistent Storage** — Notes survive page refreshes in both modes
- **Inline Editing** — Notes switch between display and edit mode in place
- **Masonry-Style Layout** — Note cards adapt visually to content length via CSS Grid
- **Automated Deployment** — GitHub Actions builds and deploys to GitHub Pages on every push to `main`
- **No CSS Framework** — Custom Flexbox/Grid layouts demonstrating core CSS fundamentals

---

## 🛠️ Tech Stack

- **React 19** — Hooks-based component architecture (`useState`, `useEffect`, custom hooks)
- **Vite** — Dev server with Hot Module Replacement and optimized production builds
- **JavaScript (ES6+)** — Async/await, modules, destructuring, spread operators
- **CSS3** — Custom styles with Flexbox, Grid, and CSS variables
- **Fetch API** — HTTP requests to backend (no axios dependency)
- **GitHub Actions** — CI/CD pipeline for GitHub Pages deployment

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop.git
cd QuickNote-Desktop

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app runs at `http://localhost:5173`

---

## ⚙️ Dual-Mode Configuration

The app ships with two operating modes controlled entirely by environment variables.

### Demo Mode (default — no backend needed)

Persists notes in `localStorage`. Works out of the box and is what GitHub Pages uses.

```bash
# .env
VITE_USE_BACKEND=false
```

### Full-Stack Mode

Connects to the [QuickNote API](https://github.com/gabrielvizcainomusiced-coder/quicknote-api) for server-side persistence with PostgreSQL.

```bash
# .env
VITE_USE_BACKEND=true
VITE_API_URL=http://localhost:3001/api
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_USE_BACKEND` | `true` = API mode, `false` = localStorage mode | `false` |
| `VITE_API_URL` | Backend API base URL (only used when `VITE_USE_BACKEND=true`) | `http://localhost:3001/api` |

> Vite only exposes variables prefixed with `VITE_` to client-side code. They are accessed via `import.meta.env.VITE_VARIABLE_NAME`. Never put secrets in these variables — they are visible in the browser.

> Boolean env vars come in as strings. The config uses `=== 'true'` to parse them correctly.

---

## 🔌 Running Full-Stack Locally

**Terminal 1 — Start the backend:**

```bash
cd quicknote-api
docker-compose up
```

**Terminal 2 — Start the frontend:**

```bash
# Ensure .env has VITE_USE_BACKEND=true
npm run dev
```

**Verify it's working:**
1. Create a note in the UI
2. Open the browser Network tab — you should see a `POST` to `localhost:3001`
3. Refresh the page — notes persist from the database, not localStorage

See the [QuickNote API repo](https://github.com/gabrielvizcainomusiced-coder/quicknote-api) for full backend setup.

---

## 📁 Project Structure

```
QuickNote-Desktop/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions — auto-deploy to GitHub Pages
├── hooks/
│   └── useNotes.js                 # Custom hook — note state and CRUD logic
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header
│   │   ├── Footer.jsx              # App footer
│   │   ├── CreateNote.jsx          # Note creation form (controlled inputs)
│   │   ├── NoteList.jsx            # CSS Grid container for note cards
│   │   └── Note.jsx                # Note card — display + inline edit modes
│   ├── config/
│   │   └── api.js                  # Reads env vars, exports USE_BACKEND + API_URL
│   ├── services/
│   │   └── noteService.js          # Data abstraction — localStorage OR API
│   ├── App.jsx                     # Root component — owns note state
│   ├── main.jsx                    # React entry point
│   └── styles.css                  # Global styles
├── utils/
│   └── localStorage.js             # localStorage read/write helpers
├── .env.example                    # Environment variable template
├── index.html                      # HTML entry point
├── vite.config.js                  # Base path config for GitHub Pages
└── package.json                    # Dependencies and scripts
```

---

## 🏗️ Architecture

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

Components never touch `fetch()` or `localStorage` directly. All data operations go through `noteService`, which decides the source based on `VITE_USE_BACKEND`:

```
User Action
    ↓
React Component
    ↓
noteService (getAllNotes / createNote / updateNote / deleteNote)
    ↓
localStorage  ←— VITE_USE_BACKEND=false
    OR
QuickNote API ←— VITE_USE_BACKEND=true
```

This means switching between modes — or adding a third data source — requires changes in exactly one file.

### State Management

Note state lives at the `App` level and is passed down as props. Immutable update patterns are used throughout:

```javascript
// Add
setNotes(prev => [newNote, ...prev]);

// Update
setNotes(prev => prev.map(n => n.id === id ? updated : n));

// Delete
setNotes(prev => prev.filter(n => n.id !== id));
```

---

## 🧪 Testing

### Automated Tests

No automated tests are included for the frontend — testing effort was intentionally focused on the backend (37 tests, 100% controller coverage). Visual and interactive behavior is better caught manually or via E2E tools.

**Future additions:** React Testing Library for component tests, Cypress for E2E flows.

### Manual Testing Checklist

**Demo Mode (localStorage):**
- [ ] Create a note
- [ ] Edit a note inline
- [ ] Delete a note
- [ ] Refresh page — notes persist
- [ ] Open in incognito — notes start empty

**Full-Stack Mode (API):**
- [ ] Backend health check: `curl http://localhost:3001/health`
- [ ] Create a note — verify POST in Network tab
- [ ] Edit a note — verify PUT in backend logs
- [ ] Delete a note
- [ ] Refresh — notes load from database

**Deployment:**
- [ ] GitHub Actions build passes
- [ ] Live demo loads at GitHub Pages URL
- [ ] CRUD works in demo mode on live site
- [ ] No console errors

---

## 🚢 Deployment

The app deploys automatically to GitHub Pages via GitHub Actions on every push to `main`. No manual steps needed.

The `vite.config.js` sets `base: '/QuickNote-Desktop/'` so assets resolve correctly in the GitHub Pages subdirectory path.

```bash
# To trigger a deploy, just push:
git push origin main
```

---

## 🐛 Troubleshooting

**Environment variable not taking effect:**
```bash
# After editing .env, always restart the dev server
# Ctrl+C, then:
npm run dev
```

**Debug current config (add to main.jsx temporarily):**
```javascript
console.log('Mode:', import.meta.env.VITE_USE_BACKEND);
console.log('API:', import.meta.env.VITE_API_URL);
```

**API requests failing / CORS error:**
```bash
# 1. Verify backend is up
curl http://localhost:3001/health

# 2. Check .env has the right URL
# 3. Confirm CORS is enabled in the API
```

**Notes not persisting in localStorage mode:**
- Avoid incognito/private windows (localStorage may be blocked)
- Check the browser console for errors
- Verify `VITE_USE_BACKEND=false` in `.env`

**GitHub Pages shows 404:**
- Confirm `base: '/QuickNote-Desktop/'` is set in `vite.config.js`
- Check the Actions tab for build errors

---

## 📝 Version History

- **v1.0** (Jan 2026) — Initial release: React 19, dual-mode architecture, full CRUD, GitHub Pages deployment, service layer pattern

---

## 🔮 Future Enhancements

**Near-term:** Loading spinner, delete confirmation dialog, toast notifications, character count on the create form.

**Longer-term:** Markdown support, dark mode, note categories/tags, search and filter, drag-and-drop reordering, keyboard shortcuts, export to file.

---

## 📚 Related Projects

- [QuickNote API](https://github.com/gabrielvizcainomusiced-coder/quicknote-api) — Express + PostgreSQL backend (100% test coverage, XSS protection, SQL injection prevention, Docker)

---

## 👤 Author

**Gabriel Vizcaino**

- GitHub: [@gabrielvizcainomusiced-coder](https://github.com/gabrielvizcainomusiced-coder)

---

## 📄 License

This project is open source and available under the MIT License.