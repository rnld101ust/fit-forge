import axios from 'axios';

// In the containerized environment the React app talks to the aggregator
// via the VITE_API_URL env variable or falls back to relative /api (proxied)
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

// Inject JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
