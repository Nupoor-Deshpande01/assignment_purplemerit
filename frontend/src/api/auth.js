import api from './axios';

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const logout = async () => {
  return await api.post('/auth/logout');
};

export const getMe = async () => {
  return await api.get('/auth/me');
};

export const refreshToken = async () => {
  return await api.post('/auth/refresh');
};
