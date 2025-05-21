import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');


  const isPublic =
    config.url.includes('/auth/login') ||
    config.url.includes('/auth/register') ||
    config.url.includes('/academia/*') ||
    config.url.includes('/academia/filtro');
    config.url.includes('/academias/*');

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
