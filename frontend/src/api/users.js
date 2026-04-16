import api from './axios';

export const getUsers = async (params) => {
  return await api.get('/users', { params });
};

export const getUserById = async (id) => {
  return await api.get(`/users/${id}`);
};

export const createUser = async (data) => {
  return await api.post('/users', data);
};

export const updateUser = async (id, data) => {
  return await api.put(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};
