import api from './axios';

export const loginUser = (payload) => api.post('/auth/login', payload);
export const registerUser = (payload) => api.post('/auth/register', payload);
export const getProfile = () => api.get('/auth/profile');
export const logoutUser = () => api.post('/auth/logout');
