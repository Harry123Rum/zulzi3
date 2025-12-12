import React from 'react';
import {
    LayoutDashboard,
    Truck,
    Users,
    ClipboardList,
    CalendarCheck,
    UserCheck,
    Star,
    Settings,
    LogOut
} from 'lucide-react';

/**
 * Sidebar Navigasi
 * Komponen ini me-render menu navigasi di sebelah kiri.
 */
const Sidebar = ({ activePage, onNavigate, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    // Handler logout - hapus token dan redirect
    const handleLogout = () => {
        // Hapus token dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect ke halaman login
        window.location.href = '/login';
    };

    // Handler untuk navigasi dengan auto-close di mobile
    const handleNavClick = (pageId) => {
        onNavigate(pageId);
        if (setIsMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

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
        <>
            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-800 text-white min-h-screen flex flex-col fixed h-full shadow-lg z-50
                transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-center mb-4 mt-12 lg:mt-0">
                    <img 
                        src="/images/white_logo_fix.png" 
                        alt="Zulzi Trans Logo" 
                        className="h-12 md:h-16 w-auto"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 overflow-y-auto">
                    <ul className="space-y-1.5">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleNavClick(item.id)}
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

                {/* Logout Button */}
                <div className="px-4 pb-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium text-slate-400 hover:bg-red-600 hover:text-white"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
