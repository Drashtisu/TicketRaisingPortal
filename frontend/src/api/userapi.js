import api from './axios';

export const getUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload);
