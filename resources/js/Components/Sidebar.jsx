import React from 'react';
import {
    LayoutDashboard,
    Truck,
    Users,
    ClipboardList,
    CalendarCheck,
    UserCheck,
    Star,
    Settings
} from 'lucide-react';

/**
 * Sidebar Navigasi
 * Komponen ini me-render menu navigasi di sebelah kiri.
 */
const Sidebar = ({ activePage, onNavigate }) => {
    // Definisikan item menu
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'armada', label: 'Armada', icon: Truck },
        { id: 'pengguna', label: 'Pengguna', icon: Users },
        { id: 'pembayaran', label: 'Verifikasi Pembayaran', icon: ClipboardList },
        { id: 'pesanan', label: 'Pesanan & Jadwal', icon: CalendarCheck },
        { id: 'supir', label: 'Kelola Supir', icon: UserCheck },
        { id: 'ulasan', label: 'Kelola Ulasan', icon: Star },
    ];

    return (
        <aside className="w-64 bg-slate-800 text-white min-h-screen flex flex-col fixed h-full shadow-lg">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3.5 mb-4">
                <div className="bg-teal-400 p-2 rounded-full h-10 w-10 flex items-center justify-center shadow-inner">
                    <span className="font-bold text-white text-xl">Z</span>
                </div>
                <span className="text-lg font-semibold tracking-wide text-gray-100">Zulzi Trans</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
                <ul className="space-y-1.5">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                className={`
                                    w-full flex items-center gap-3.5 px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium
                                    ${activePage === item.id
                                        ? 'bg-sky-500 text-white shadow-md'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'}
                                `}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Settings at bottom */}
            <div className="p-4 border-t border-slate-700">
                <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white text-sm transition-colors">
                    <Settings size={18} />
                    <span>Pengaturan</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
