import api from './axios';

export const getAssignedTickets = (params) => api.get('/agent/tickets', { params });
export const startTicketWork = (id) => api.patch(`/agent/tickets/${id}/start`);
export const addWorkLog = (id, message) => api.post(`/agent/tickets/${id}/work-logs`, { message });
export const resolveAgentTicket = (id, resolution) => api.patch(`/agent/tickets/${id}/resolve`, { resolution });
