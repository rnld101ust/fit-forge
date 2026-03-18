import axios from 'axios';

// Relative /api base — proxied by Vite (dev) or nginx (Docker/K8s)
const api = axios.create({ baseURL: '/' });

// Inject JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
