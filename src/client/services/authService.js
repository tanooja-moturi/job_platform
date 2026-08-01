import api from './api';

export const authService = {
  register: async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  getMe: async () => {
    // Token is automatically attached by the api.js interceptor
    const res = await api.get('/auth/me');
    return res.data;
  },
};

