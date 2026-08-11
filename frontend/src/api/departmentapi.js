import api from './axios';

export const getDepartments = (params) => api.get('/departments', { params });
export const createDepartment = (payload) => api.post('/departments', payload);
export const updateDepartment = (id, payload) => api.put(`/departments/${id}`, payload);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);
