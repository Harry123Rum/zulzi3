// resources/js/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Import Halaman
import PemesananPage from './Pages/Pemesanan/Index';

// Disini kita daftarkan URL-nya
const router = createBrowserRouter([
    {
        path: "/",
        element: <div className="p-10 text-center"><h1>Halaman Home Belum Dibuat (Klik <a href="/pemesanan" className="text-blue-500 underline">/pemesanan</a>)</h1></div>, 
    },
    {
        path: "/pemesanan",
        element: <PemesananPage />, // Ini halaman yang baru kita buat
    },
    // Nanti tambah path lain disini (misal /login, /admin)
]);

export default router;