import React, { useState, useEffect, createContext, useContext } from 'react';
import authService from '../../service/authService'; 
import api from '../../service/api'; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // ⚡ Initialize auth from localStorage
        useEffect(() => {
            const initAuth = async () => {
                const token = localStorage.getItem('auth_token');
                const storedUser = localStorage.getItem('user');
                
                console.log('🔐 Initializing auth...', { 
                    hasToken: !!token, 
                    hasStoredUser: !!storedUser 
                });
                
                if (token) {
                    // Set Authorization header
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // ⚡ PRIORITAS 1: Load user dari localStorage dulu (untuk instant UI update)
                    if (storedUser) {
                        try {
                            const userData = JSON.parse(storedUser);
                            setUser(userData);
                            console.log('✅ User loaded from localStorage:', userData.nama);
                        } catch (e) {
                            console.error('❌ Failed to parse stored user:', e);
                        }
                    }
                    
                    // ⚡ PRIORITAS 2: Validate token dengan API
                    try {
                        const res = await authService.me(); 
                        const freshUserData = res.data.data || res.data; 
                        
                        setUser(freshUserData);
                        localStorage.setItem('user', JSON.stringify(freshUserData));
                        console.log('✅ User verified from API:', freshUserData.nama);
                        
                    } catch (error) {
                        console.error('❌ Token invalid or expired:', error);
                        // Clear everything if token is invalid
                        localStorage.removeItem('user');
                        localStorage.removeItem('auth_token');
                        api.defaults.headers.common['Authorization'] = null;
                        setUser(null);
                    }
                } else {
                    console.log('ℹ️ No auth token found');
                }
                
                setLoading(false);
            };

            initAuth();
        }, []);

    // ⚡ Listen to storage changes (untuk sync antar tabs & OAuth callback)
    useEffect(() => {
        const handleStorageChange = (e) => {
            console.log('📦 Storage changed:', e.key);
            
            if (e.key === 'auth_token' && e.newValue) {
                // Token baru ditambahkan (dari OAuth callback)
                const token = e.newValue;
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Load user data
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                        console.log('✅ User updated from storage event:', userData.nama);
                    } catch (e) {
                        console.error('❌ Failed to parse user from storage event:', e);
                    }
                }
            } else if (e.key === 'auth_token' && !e.newValue) {
                // Token dihapus (logout)
                setUser(null);
                api.defaults.headers.common['Authorization'] = null;
                console.log('🚪 User logged out via storage event');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (credentials) => {
        setIsAuthenticating(true); 
        try {
            const response = await authService.login(credentials);
            
            const loginData = response.data.data || response.data;
            const { token, user: userData } = loginData; 
            
            // 1. Simpan ke localStorage
            localStorage.setItem('auth_token', token); 
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 2. Set Authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 3. Update state
            setUser(userData);
            
            console.log('✅ Login successful:', userData.nama);
            
            // 4. Return user data
            return { 
                success: true, 
                user: userData,
                data: loginData
            }; 
            
        } catch(error) {
            console.error('❌ Login failed:', error);
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    };
    
    const register = async (userData) => {
        const response = await authService.register(userData);
        return response;
    };

    const logout = async () => {
        setIsAuthenticating(true);
        try {
            await authService.logout();
        } catch (e) {
            console.error("Logout error", e);
        }
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        api.defaults.headers.common['Authorization'] = null;
        setUser(null);
        setIsAuthenticating(false);
        
        console.log('🚪 User logged out');
    };

    const updateUser = (updatedUser) => {
        console.log('🔄 Updating user:', updatedUser.nama);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        isAuthenticating,
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