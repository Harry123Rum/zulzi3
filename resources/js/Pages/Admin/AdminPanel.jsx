import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import DashboardPage from '@/Pages/Admin/DashboardPage.jsx';
import ArmadaPage from '@/Pages/Admin/ArmadaPage.jsx';
import PenggunaPage from '@/Pages/Admin/PenggunaPage.jsx';
import PembayaranPage from '@/Pages/Admin/PembayaranPage.jsx';
import PesananPage from '@/Pages/Admin/PesananPage.jsx';
import KelolaSupir from '@/Pages/Admin/KelolaSupir.jsx';
import KelolaUlasan from '@/Pages/Admin/KelolaUlasan.jsx';

/**
 * Ini adalah komponen App utama yang bertindak sebagai router
 * untuk menampilkan halaman yang sesuai berdasarkan state.
 */
const AdminPanel = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [headerAction, setHeaderAction] = useState(null);

    // Cek URL saat pertama kali load untuk menentukan halaman aktif
    useEffect(() => {
        // Ambil path setelah /admin/
        const path = window.location.pathname.split('/admin/')[1] || 'dashboard';
        // Hapus trailing slash jika ada
        setActivePage(path.replace(/\/$/, ''));
    }, []);

    // Handle navigasi saat menu sidebar di-klik
    const handleNavigate = (pageId) => {
        setActivePage(pageId);
        // Update URL di browser tanpa me-reload halaman
        window.history.pushState(null, '', `/admin/${pageId}`);
    };

    // Render halaman yang sesuai
    const renderPage = () => {
        const props = { setHeaderAction }; // Prop untuk dikirim ke setiap halaman

        switch (activePage) {
            case 'dashboard':
                return <DashboardPage {...props} />;
            case 'armada':
                return <ArmadaPage {...props} />;
            case 'pengguna':
                return <PenggunaPage {...props} />;
            case 'pembayaran':
                return <PembayaranPage {...props} />;
            case 'pesanan' :
                return <PesananPage {...props} />;
            case 'supir':
                return <KelolaSupir {...props} />;
            case 'ulasan':
                return <KelolaUlasan {...props} />;
            default:
                return <div className="p-10 text-center text-gray-400">Halaman "{activePage}" belum dibuat.</div>;
        }
    };

    // Metadata untuk header
    const getPageMeta = () => {
        switch (activePage) {
            case 'dashboard':
                return { title: 'Dashboard', subtitle: 'Selamat datang di panel admin' };
            case 'armada':
                return { title: 'Pengelolaan Armada', subtitle: 'Kelola data armada kendaraan Anda' };
            case 'pengguna':
                return { title: 'Pengelolaan Pengguna', subtitle: 'Kelola data pengguna sistem' };
            case 'pembayaran':
                return { title: 'Verifikasi Pembayaran', subtitle: 'Verifikasi Pembayaran dari Pelanggan' };
            case 'pesanan' :
                return {title : 'Pengelolaan Pesanan dan Jadwal', subtitle: 'Kelola Pesanan dan Jadwal Perjalanan'};
            case 'supir':
                return { title: 'Pengelolaan Supir', subtitle: 'Kelola data supir untuk armada' };
            case 'ulasan':
                return { title: 'Manajemen Ulasan', subtitle: 'Kelola ulasan pelanggan untuk landing page' };
            default:
                return { title: 'Halaman Tidak Ditemukan', subtitle: '' };
        }
    };

    return (
        <AdminLayout
            activePage={activePage}
            onNavigate={handleNavigate}
            meta={getPageMeta()}
            headerAction={headerAction}
        >
            {renderPage()}
        </AdminLayout>
    );
};

export default AdminPanel;
