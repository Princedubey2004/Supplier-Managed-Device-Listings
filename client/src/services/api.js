
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api');

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
};

export const supplierApi = {
    getDevices: () => api.get('/supplier/devices'),
    createDevice: (data) => api.post('/supplier/devices', data),
    updateDevice: (id, data) => api.put(`/supplier/devices/${id}`, data),
    updateStock: (id, quantity) => api.patch(`/supplier/devices/${id}/stock`, { quantity }),
    createOffer: (id, data) => api.post(`/supplier/devices/${id}/offer`, data),
};

export const employeeApi = {
    getDevices: (params) => api.get('/employee/devices', { params }),
    leaseDevice: (id) => api.post(`/employee/devices/${id}/lease`),
};

export default api;
