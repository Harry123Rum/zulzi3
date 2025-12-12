import React, { useState } from 'react';
import Sidebar from '@/Components/Sidebar.jsx';
import { Menu, X } from 'lucide-react';

/**
 * Layout Utama Admin
 * Membungkus semua halaman dengan Sidebar dan struktur header.
 */
const AdminLayout = ({ activePage, onNavigate, meta, headerAction, children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Format tanggal otomatis
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar 
                activePage={activePage} 
                onNavigate={onNavigate} 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800 text-white p-2 rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Konten Utama */}
            <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                {/* Header Konten */}
                <header className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">Hey Admin,</h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-1">{formattedDate}</p>
                </header>

                {/* Wrapper Konten Halaman */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-100 min-h-[calc(100vh-150px)]">
                    {/* Header Halaman (di dalam wrapper) */}
                    <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-base md:text-lg font-bold text-slate-800">{meta.title}</h2>
                            <p className="text-slate-500 text-xs md:text-sm">{meta.subtitle}</p>
                        </div>
                        {/* Area untuk tombol aksi dari halaman anak (misal: "Tambah Armada") */}
                        <div className="w-full md:w-auto">
                            {headerAction}
                        </div>
                    </div>

                    {/* Isi Halaman */}
                    <div className="p-4 md:p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
