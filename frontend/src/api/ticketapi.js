import api from './axios';

export const createTicket = (payload) => api.post('/tickets', payload);
export const getMyTickets = (params) => api.get('/tickets/my', { params });
export const getAllTickets = (params) => api.get('/tickets', { params });
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const updateTicket = (id, payload) => api.put(`/tickets/${id}`, payload);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);
