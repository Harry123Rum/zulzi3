// resources/service/authService.js
import api from './api';
import axios from 'axios'; // Import axios murni untuk call ke luar baseURL api (csrf)

const authService = {
    // Request CSRF Cookie (PENTING)
    getCsrfToken: async () => {
        // Kita gunakan instance axios baru atau setting manual ke root URL (bukan /api)
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
    },

    register: async (data) => {
        try {
            // 1. Ambil CSRF Token dulu
            await authService.getCsrfToken();
            
            // 2. Hit endpoint register
            const response = await api.post('/auth/register', data);
            
            // HAPUS ATAU KOMENTARI BAGIAN INI AGAR TIDAK AUTO-LOGIN
            /* if (response.data.success) {
                localStorage.setItem('auth_token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            } 
            */
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    login: async (credentials) => {
        try {
            await authService.getCsrfToken();
            
            const response = await api.post('/auth/login', credentials);
            
            if (response.data.success) {
                localStorage.setItem('auth_token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    me: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default authService;