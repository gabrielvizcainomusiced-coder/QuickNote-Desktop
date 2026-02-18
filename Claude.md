# Claude.md - QuickNote Frontend

**Last Updated:** January 19, 2026  
**Project:** QuickNote Desktop Application (Frontend)  
**Developer:** Gabriel Vizcaino  
**Repository:** https://github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop

---

## Project Overview

QuickNote Desktop is a React-based note-taking application with a unique dual-mode architecture. It can operate either as a standalone client-side application (using localStorage) or as a full-stack application connected to a backend API.

### Key Feature: Dual-Mode Architecture
The application uses environment variables to toggle between two operational modes:
- **Demo Mode (localStorage):** Perfect for GitHub Pages deployment, no backend required
- **Full-Stack Mode (API):** Connects to REST API backend with PostgreSQL database

This design demonstrates understanding of:
- Environment-based configuration
- Multiple deployment strategies
- Service layer abstraction
- Separation of concerns

---

## Tech Stack

- **React 19:** Modern UI library with Hooks
- **Vite:** Fast build tool and dev server
- **JavaScript (ES6+):** Modern JavaScript features
- **CSS3:** Custom styling with Flexbox/Grid
- **Fetch API:** HTTP requests to backend

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
├── src/
│   ├── components/
│   │   ├── Header.jsx           # App header/title
│   │   ├── Footer.jsx           # App footer
│   │   ├── CreateNote.jsx       # Note creation form
│   │   ├── NoteList.jsx         # Grid of all notes
│   │   └── Note.jsx             # Individual note card
│   ├── services/
│   │   └── noteService.js       # API/localStorage abstraction
│   ├── config/
│   │   └── api.js              # Environment configuration
│   ├── hooks/
│   │   └── useNotes.js         # Custom React hook (if exists)
│   ├── utils/
│   │   └── localStorage.js     # LocalStorage utilities (if exists)
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── styles.css              # Global styles
├── public/
│   └── index.html              # HTML template
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages deployment
├── .env.example                # Environment template
├── .env                        # Local environment (gitignored)
├── vite.config.js              # Build configuration
└── package.json                # Dependencies & scripts
```

---

## Architecture & Data Flow

### Component Hierarchy
```
App
├── Header
├── CreateNote
│   └── (handles note creation)
├── NoteList
│   └── Note (multiple)
│       └── (handles display, edit, delete)
└── Footer
```

### Data Flow (Full-Stack Mode)

1. **User Action** → Component event handler
2. **Component** → Calls `noteService` method
3. **noteService** → Makes fetch request to API
4. **API Response** → Returns note data
5. **Component** → Updates React state
6. **React** → Re-renders UI with new data

### Data Flow (Demo Mode)

1. **User Action** → Component event handler
2. **Component** → Calls `noteService` method
3. **noteService** → Reads/writes localStorage
4. **Component** → Updates React state
5. **React** → Re-renders UI

---

## Environment Configuration

### Environment Variables

**.env file:**
```env
# Backend Integration Toggle
VITE_USE_BACKEND=false

# API URL (only used when VITE_USE_BACKEND=true)
VITE_API_URL=http://localhost:3001/api
```

### Configuration File

**src/config/api.js:**
```javascript
export const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('API Configuration:', {
  useBackend: USE_BACKEND,
  apiUrl: API_URL
});
```

**Key Points:**
- Vite requires `VITE_` prefix for client-side variables
- Access via `import.meta.env.VARIABLE_NAME`
- Boolean values are strings, must compare with `=== 'true'`
- Console log helps debug configuration

---

## Service Layer

### noteService.js - Abstraction Layer

This file abstracts the data source (localStorage vs API) so components don't need to know which is being used.

**Key Methods:**
```javascript
class NoteService {
  async getAllNotes()           // Get all notes
  async createNote(note)        // Create new note
  async updateNote(id, note)    // Update existing note
  async deleteNote(id)          // Delete note
}
```

**Pattern:**
```javascript
async getAllNotes() {
  if (USE_BACKEND) {
    // Fetch from API
    const response = await fetch(`${API_URL}/notes`);
    return response.json();
  }
  
  // Fallback to localStorage
  return JSON.parse(localStorage.getItem('notes') || '[]');
}
```

**Benefits:**
- Components don't know about data source
- Easy to switch between modes
- Single place to update API logic
- Can add caching/optimizations here

---

## Component Details

### App.jsx - Main Component

**Responsibilities:**
- Manages global note state
- Handles loading and error states
- Orchestrates data operations
- Passes props to child components

**State Management:**
```javascript
const [notes, setNotes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Key Functions:**
```javascript
async function loadNotes()        // Load notes on mount
async function addNote(note)      // Create new note
async function editNote(id, note) // Update note
async function deleteNote(id)     // Delete note
```

**Pattern: Async State Updates**
```javascript
async function addNote(newNote) {
  try {
    const createdNote = await noteService.createNote(newNote);
    setNotes(prevNotes => [createdNote, ...prevNotes]);
  } catch (err) {
    setError('Failed to create note');
  }
}
```

---

### CreateNote.jsx

**Purpose:** Form for creating new notes

**State:**
- `title` - Note title
- `content` - Note content

**Key Points:**
- Controlled components (value tied to state)
- Form validation (non-empty fields)
- Calls parent's `onAdd` function
- Clears form after submission

---

### NoteList.jsx

**Purpose:** Display grid of note cards

**Receives Props:**
- `notes` - Array of note objects
- `onDelete` - Delete handler function
- `onEdit` - Edit handler function

**Styling:**
- Responsive grid layout
- Masonry-style (notes adjust to content length)
- Gap between cards

---

### Note.jsx

**Purpose:** Individual note card display and editing

**Features:**
- Display mode (shows title and content)
- Edit mode (inline editing)
- Delete button
- Edit/Save toggle

**State:**
- `isEditing` - Toggle edit mode
- `editTitle` - Temp title while editing
- `editContent` - Temp content while editing

---

## Deployment

### GitHub Pages (Demo Mode)

**Configuration:**
```javascript
// vite.config.js
export default {
  base: '/QuickNote-Desktop/', // Must match repo name
}
```

**Deployment:**
- Automated via GitHub Actions
- Triggered on push to `main` branch
- Builds with Vite
- Deploys to `gh-pages` branch
- Must use `VITE_USE_BACKEND=false` for demo

**Live Demo:** https://gabrielvizcainomusiced-coder.github.io/QuickNote-Desktop/

---

### Local Development (Full-Stack Mode)

**Prerequisites:**
1. Backend API running: `cd quicknote-api && docker-compose up`
2. Frontend env configured: `VITE_USE_BACKEND=true`

**Start Development Server:**
```bash
npm run dev
# Opens on http://localhost:5173
```

**Testing Full-Stack:**
1. Create a note in the UI
2. Check browser Network tab (should see POST to localhost:3001)
3. Refresh page (note persists from database)
4. Check backend logs (should show request)

---

## Development Workflow

### Making Changes

1. **Start backend** (if using API mode):
   ```bash
   cd quicknote-api
   docker-compose up
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

3. **Make changes** to components

4. **Test in browser** (auto-reloads with Vite)

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

---

## Common Issues & Solutions

### "API Configuration shows useBackend: false but I want true"
**Cause:** .env file not updated or dev server not restarted  
**Solution:** 
1. Edit `.env` → `VITE_USE_BACKEND=true`
2. Restart dev server (Ctrl+C, then `npm run dev`)

### "Network request failing / CORS error"
**Cause:** Backend not running or wrong API URL  
**Solution:**
1. Check backend: `curl http://localhost:3001/health`
2. Verify `.env` has correct `VITE_API_URL`
3. Check backend has CORS enabled

### "Notes not persisting after refresh (localStorage mode)"
**Cause:** Browser privacy settings or incognito mode  
**Solution:** 
- Use normal browser window
- Check browser doesn't block localStorage
- Check browser console for errors

### "GitHub Pages shows 404"
**Cause:** Base path not configured  
**Solution:** Ensure `vite.config.js` has correct `base` path matching repo name

---

## Key React Concepts Used

### Hooks

**useState:**
```javascript
const [notes, setNotes] = useState([]);
// notes = current value
// setNotes = function to update it
```

**useEffect:**
```javascript
useEffect(() => {
  loadNotes(); // Runs after component mounts
}, []); // Empty array = run once
```

**Custom Hooks (if used):**
```javascript
const { notes, addNote, deleteNote } = useNotes();
// Encapsulates note management logic
```

### Props

**Passing data down:**
```javascript
<CreateNote onAdd={addNote} />
// Child receives onAdd as prop
```

**Receiving in child:**
```javascript
function CreateNote({ onAdd }) {
  // Can call onAdd(newNote)
}
```

### State Updates

**Immutable patterns:**
```javascript
// Add to array
setNotes([newNote, ...prevNotes]);

// Remove from array
setNotes(notes.filter(n => n.id !== id));

// Update in array
setNotes(notes.map(n => n.id === id ? updated : n));
```

---

## Styling Approach

### Custom CSS (No Framework)

**Why no framework:**
- Learning CSS fundamentals
- Full control over design
- Smaller bundle size
- No external dependencies

**Key CSS Features Used:**
- Flexbox for layout
- CSS Grid for note grid
- CSS Variables for theming (if used)
- Responsive design with media queries
- Transitions for smooth UX

**Pattern:**
```css
.note-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
```

---

## Performance Considerations

### Current Optimizations
- Vite's fast HMR (Hot Module Replacement)
- Lazy loading not needed (small app)
- LocalStorage for instant demo
- Minimal re-renders (proper state updates)

### Future Optimizations
- React.memo for Note components
- Virtualization for large note lists
- Debounced search
- Service Worker for offline support

---

## Related Backend API

**Repository:** https://github.com/gabrielvizcainomusiced-coder/quicknote-api

**API Endpoints Used:**
- `POST /api/notes` - Create note
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

**Expected Response Format:**
```javascript
{
  id: 1,
  title: "Note Title",
  content: "Note content here",
  created_at: "2026-01-19T04:47:19.038Z",
  updated_at: "2026-01-19T04:47:19.038Z"
}
```

---

## Testing Strategy

### Manual Testing Checklist

**Demo Mode (localStorage):**
- [ ] Create a note
- [ ] Edit a note
- [ ] Delete a note
- [ ] Refresh page (notes persist)
- [ ] Clear browser data (notes disappear)

**Full-Stack Mode (API):**
- [ ] Backend running and healthy
- [ ] Create note (check Network tab)
- [ ] Edit note (check API logs)
- [ ] Delete note
- [ ] Refresh page (notes from database)
- [ ] Check browser console (no errors)

**Deployment:**
- [ ] GitHub Pages build succeeds
- [ ] Live site loads
- [ ] Can create notes (localStorage)
- [ ] Styling looks correct
- [ ] Responsive on mobile

### No Automated Tests Yet

**Why:**
- Focus on backend testing (more critical)
- Frontend is simple and visual
- Manual testing sufficient for portfolio

**Future Testing:**
- React Testing Library
- Jest for component tests
- Cypress for E2E tests

---

## Interview Talking Points

### Architecture Decision
> "I designed this frontend with a dual-mode architecture using a service layer abstraction. This allows the same codebase to work as either a standalone demo on GitHub Pages or as a full-stack application connected to a REST API. The decision to use environment variables demonstrates understanding of configuration management and deployment strategies."

### Technology Choices
> "I chose React for its component-based architecture and modern Hooks API. Vite was selected for its fast development experience and optimized production builds. I intentionally avoided CSS frameworks to demonstrate understanding of core CSS concepts like Flexbox and Grid."

### Service Layer Pattern
> "The noteService abstraction layer decouples the UI from the data source. Components don't know if they're talking to localStorage or an API - they just call noteService methods. This makes it easy to swap data sources and demonstrates separation of concerns."

### State Management
> "For this application size, React's built-in useState and useEffect are sufficient. I used lifting state up to manage notes at the App level, then passed data and handlers down as props. For larger applications, I'd consider Context API or Redux."

---

## Learning Outcomes

Building this frontend taught:
- React Hooks (useState, useEffect)
- Component composition and props
- Async/await with fetch API
- Environment variable configuration
- Service layer patterns
- Responsive CSS layouts
- Vite build tooling
- GitHub Pages deployment
- Error handling in React

---

## Future Enhancements

### Short Term
- Add loading spinner component
- Better error messages
- Confirmation dialog for delete
- Toast notifications
- Character count in CreateNote

### Long Term
- Rich text editor (Markdown support)
- Dark mode toggle
- Note categories/tags
- Search and filter
- Drag-and-drop reordering
- Keyboard shortcuts
- Export notes to file

---

## Known Limitations

- No authentication (single user)
- No offline support in API mode
- No real-time updates (polling required)
- No undo/redo
- No auto-save while typing
- No mobile app (web only)

These are intentional scope decisions for a portfolio project.

---

## Browser Support

**Tested On:**
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

**Requirements:**
- Modern browser with ES6+ support
- localStorage API support
- Fetch API support

---

## Scripts Reference

```bash
# Development
npm run dev          # Start dev server (port 5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
git push origin main # Triggers GitHub Actions deploy
```

---

## Environment Setup for New Developers

1. **Clone repository:**
   ```bash
   git clone https://github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop.git
   cd QuickNote-Desktop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **For full-stack mode:**
   - Clone and start backend API first
   - Set `VITE_USE_BACKEND=true` in .env
   - Restart dev server

---

## Debugging Tips

### React DevTools
- Install React DevTools browser extension
- Inspect component tree
- View props and state
- Track re-renders

### Console Debugging
```javascript
console.log('API Config:', { USE_BACKEND, API_URL });
console.log('Notes:', notes);
console.log('Error:', error);
```

### Network Tab
- Check API requests/responses
- Verify correct endpoints called
- Check request/response bodies
- Look for CORS errors

### Common Console Messages
```
API Configuration: { useBackend: false, apiUrl: "..." }
// Shows current mode on app load
```

---

## Version History

- **v1.0** (Jan 2026): Initial release
  - Dual-mode architecture
  - Full CRUD functionality
  - GitHub Pages deployment
  - Backend integration

---

## Credits

- **Developer:** Gabriel Vizcaino
- **Mentor Guidance:** Architecture and deployment strategies
- **AI Assistant:** Claude (code generation and learning)

---

## Contact & Links

- **Frontend Repo:** github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop
- **Backend Repo:** github.com/gabrielvizcainomusiced-coder/quicknote-api
- **Live Demo:** gabrielvizcainomusiced-coder.github.io/QuickNote-Desktop/
- **GitHub:** @gabrielvizcainomusiced-coder

---

## Notes for AI Assistants

When working on this project:
1. **Check environment mode first** - localStorage or API?
2. **Maintain service layer abstraction** - don't bypass noteService
3. **Follow existing component patterns** - consistent structure
4. **Update this file** when making architectural changes
5. **Reference backend Claude.md** for API contract details

**Preventing Ralph Wiggum Loops:**
This file contains all frontend context. Always reference it before suggesting changes that might conflict with the dual-mode architecture or established patterns.

---

**Last Review Date:** January 19, 2026  
**Next Review:** After Movie Explorer completion or any major changes