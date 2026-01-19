// API Configuration
export const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Log configuration on load (helpful for debugging)
console.log('API Configuration:', {
  useBackend: USE_BACKEND,
  apiUrl: API_URL
});