# Claude.md - QuickNote Frontend

## Overview
React frontend for QuickNote with dual-mode support (localStorage or API backend).

## Key Files
- `src/services/noteService.js` - API communication layer
- `src/config/api.js` - Environment configuration
- `.env` - Toggle between localStorage and backend

## Environment Variables
- `VITE_USE_BACKEND=false` - Use localStorage (demo)
- `VITE_USE_BACKEND=true` - Use API backend
- `VITE_API_URL` - Backend API URL

## Related Repository
Backend: github.com/gabrielvizcainomusiced-coder/quicknote-api

See backend Claude.md for full architecture context.