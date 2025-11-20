// resources/js/context/AuthContext.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import authService from '../../service/authService'; // Pastikan path import benar

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user');
            
            if (token && storedUser) {
                try {
                    // Opsional: Verifikasi token ke server
                    // const res = await authService.me();
                    // setUser(res.data); 
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Session invalid:', error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('auth_token');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        // authService akan melempar error jika gagal, yang akan ditangkap oleh LoginPage
        const response = await authService.login(credentials);
        setUser(response.data.user);
        return response;
    };
    
    const register = async (userData) => {
        // authService akan melempar error jika gagal, yang akan ditangkap oleh RegisterPage
        const response = await authService.register(userData);
        // setUser(response.data.user);
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}