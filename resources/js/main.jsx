import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import halaman Public
import LandingPage from '@/Pages/public/LandingPage';
import AboutPage from '@/Pages/AboutPage';
import ReviewPage from '@/Pages/ReviewPage'; 
import PemesananPage from '@/Pages/Pemesanan/Index';
// import PembayaranPage from '@/Pages/PembayaranPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route Utama: /beranda */}
        <Route path="/beranda" element={<LandingPage />} />
        
        {/* Jika user akses root '/' via navigasi internal React, redirect ke beranda */}
        <Route path="/" element={<Navigate to="/beranda" replace />} />

        {/* Halaman Public Lainnya */}
        <Route path="/tentang-kami" element={<AboutPage />} /> 
        <Route path="/about" element={<AboutPage />} /> 
        
        <Route path="/pemesanan" element={<PemesananPage />} />
        {/* <Route path="/pembayaran" element={<PembayaranPage />} /> */}
        
        <Route path="/review/:id" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);