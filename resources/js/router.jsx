// resources/js/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import OAuthCallback from './Pages/Auth/OAuthCallback';

// Import Halaman
import PemesananPage from './Pages/Pemesanan/Index';
import LandingPage from './Pages/public/LandingPage';
import AboutPage from './Pages/AboutPage';
import ReviewForm from './Pages/Review/ReviewForm';
import ReviewSuccess from './Pages/Review/ReviewSuccess';
import ResetPasswordPage from './Pages/Auth/ResetPasswordPage';

// Disini kita daftarkan URL-nya
const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/beranda",
        element: <LandingPage />,
    },
    {
        path: "/tentang-kami",
        element: <AboutPage />,
    },
    {
        path: "/about",
        element: <AboutPage />,
    },
    {
        path: "/pemesanan",
        element: <PemesananPage />,
    },
    {
        path: "/review/success",
        element: <ReviewSuccess />,
    },
    {
        path: "/review/:id",
        element: <ReviewForm />,
    },
    {
        path: '/auth/google/callback',
        element: <OAuthCallback />
    },
    // Nanti tambah path lain disini (misal /login, /admin)
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/forgot-password", // Rute untuk halaman meminta reset link
        element: <ForgotPasswordPage />,
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />,
    },
]);

export default router;
