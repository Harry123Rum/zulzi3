import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '../../../service/api';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { updateUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const userDataEncoded = searchParams.get('user');
            const error = searchParams.get('error');

            // 1. Jika ada error dari backend
            if (error) {
                console.error('❌ OAuth Error:', error);

                const notification = {
                    type: 'error',
                    message: decodeURIComponent(error) || 'Gagal login Google, silakan coba lagi.'
                };
                localStorage.setItem('oauth_alert', JSON.stringify(notification));

                window.location.replace('/login');
                return;
            }

            // 2. Jika data tidak lengkap
            if (!token || !userDataEncoded) {
                console.error('❌ No token or user data received');

                const notification = {
                    type: 'error',
                    message: 'Gagal memproses login. Data otentikasi tidak lengkap.'
                };
                localStorage.setItem('oauth_alert', JSON.stringify(notification));

                window.location.replace('/login');
                return;
            }

            try {
                // Parse user data
                const userData = JSON.parse(decodeURIComponent(userDataEncoded));

                // 3. Simpan token & user data ke localStorage
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // 4. Set Authorization header di Axios instance
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // 5. Update AuthContext
                updateUser(userData);

                // ============================================================
                // ✅ PERBAIKAN 1: Simpan Notifikasi Sukses ke localStorage
                // ============================================================
                const notification = {
                    type: 'success',
                    message: `Login Berhasil! Selamat datang, ${userData.nama.split(' ')[0]}!`
                };
                localStorage.setItem('oauth_alert', JSON.stringify(notification));

                // 6. Redirect keras ke halaman tujuan
                const targetPath = userData.role_pengguna?.toLowerCase() === 'admin' ? '/admin' : '/beranda';

                window.location.replace(targetPath);

            } catch (error) {
                console.error('❌ Failed to process OAuth callback:', error);

                // Clear everything if failed
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                api.defaults.headers.common['Authorization'] = null;

                const notification = {
                    type: 'error',
                    message: 'Terjadi kesalahan saat memproses data user.'
                };
                localStorage.setItem('oauth_alert', JSON.stringify(notification));

                window.location.replace('/login');
            }
        };

        handleCallback();
    }, [searchParams, updateUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">
                    Memproses login...
                </h2>
                <p className="text-gray-500 mt-2">
                    Mohon tunggu sebentar
                </p>
            </div>
        </div>
    );
}
