import React from 'react';
import Sidebar from '@/Components/Sidebar.jsx';

/**
 * Layout Utama Admin
 * Membungkus semua halaman dengan Sidebar dan struktur header.
 */
const AdminLayout = ({ activePage, onNavigate, meta, headerAction, children }) => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar activePage={activePage} onNavigate={onNavigate} />

            {/* Konten Utama */}
            <main className="flex-1 ml-64 p-8">
                {/* Header Konten */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Hey Admin,</h1>
                    <p className="text-slate-500 text-sm mt-1">Rabu, 8 Oktober, 2025</p>
                </header>

                {/* Wrapper Konten Halaman */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[calc(100vh-150px)]">
                    {/* Header Halaman (di dalam wrapper) */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">{meta.title}</h2>
                            <p className="text-slate-500 text-sm">{meta.subtitle}</p>
                        </div>
                        {/* Area untuk tombol aksi dari halaman anak (misal: "Tambah Armada") */}
                        <div>
                            {headerAction}
                        </div>
                    </div>

                    {/* Isi Halaman */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;