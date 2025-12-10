// resources/service/authService.js
import api from './api';
import axios from 'axios';

const authService = {
    getCsrfToken: async () => {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
    },

    register: async (data) => {
        try {
            await authService.getCsrfToken();
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    login: async (credentials) => {
        try {
            await authService.getCsrfToken();
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout request error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    // ✅ PERBAIKAN: Tambahkan prefix /auth
    me: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // ✅ BARU: Kirim email lupa password
    forgotPassword: async (data) => {
        try {
            await authService.getCsrfToken();
            const response = await api.post('/auth/forgot-password', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // ✅ BARU: Reset password dengan token
    resetPassword: async (data) => {
        try {
            await authService.getCsrfToken();
            const response = await api.post('/auth/reset-password', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default authService;
