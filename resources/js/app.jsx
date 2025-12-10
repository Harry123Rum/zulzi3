import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';

// ********************************************
// PERBAIKAN: Import AdminRouteGuard
// Pastikan path ini benar sesuai lokasi file baru Anda
// ********************************************
import AdminRouteGuard from './Components/AdminRouteGuard.jsx';

// Import Pages
import LoginPage from './Pages/Auth/LoginPage.jsx';
import RegisterPage from './Pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage.jsx';
import EditProfile from './Pages/Auth/EditProfile.jsx';
import AdminPanel from './Pages/Admin/AdminPanel.jsx';

import '../css/app.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* ===================================== */}
                    {/* ROUTE OTENTIKASI (Public, Bebas Akses)*/}
                    {/* ===================================== */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    
                    {/* ===================================== */}
                    {/* ROUTE KHUSUS USER (Private - Customer/Admin) */}
                    {/* ===================================== */}
                    {/* Gunakan AdminRouteGuard, tapi set isAdminOnly=false.
                        Artinya: User harus LOGIN, tapi role apapun (customer/admin) boleh. */}
                    <Route
                        path="/edit-profile"
                        element={<AdminRouteGuard element={<EditProfile />} isAdminOnly={false} />}
                    />

                    {/* ===================================== */}
                    {/* ROUTE ADMIN (Admin Only)              */}
                    {/* ===================================== */}
                    {/* Gunakan AdminRouteGuard dengan isAdminOnly=true.
                        Artinya: User harus LOGIN DAN role-nya WAJIB 'admin'.
                        Jika bukan admin, akan di-redirect ke /beranda. */}
                    <Route
                        path="/admin/*"
                        element={<AdminRouteGuard element={<AdminPanel />} isAdminOnly={true} />}
                    />

                    {/* Default Redirect: Arahkan ke /login jika tidak ada route yang cocok */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const root = document.getElementById('app');
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
