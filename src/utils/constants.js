export const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:7777'
  : import.meta.env.VITE_API_BASE_URL;
