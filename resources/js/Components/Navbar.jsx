import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Truck, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Import useAuth untuk sesi global

// Komponen Navbar tidak lagi menerima props 'auth',
// melainkan mengambil data auth dari useAuth()
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil status otentikasi dari Context
    const { isAuthenticated, user, logout } = useAuth();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // State untuk Dropdown Profile
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);


    // Efek untuk mendeteksi scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fungsi helper untuk menentukan class aktif
    const isActive = (path) => {
        return location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600";
    };

    // Fungsi Logout
    const handleLogout = async () => {
        await logout();
        setIsProfileDropdownOpen(false);
        // Setelah logout, user akan otomatis ter-redirect jika Navbar ada di route yang butuh login
        // Di sini kita biarkan saja, karena ini Navbar Public
    };

    // Komponen Tombol Autentikasi (Digunakan di Desktop dan Mobile)
    const AuthButton = () => {
        // Jika user SUDAH LOGIN
        if (isAuthenticated && user) {

            // Tentukan tujuan redirect berdasarkan Role
            const profilePath = user.role_pengguna === 'admin' ? '/admin' : '/profile';

            return (
                <div
                    className="relative"
                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                    onMouseLeave={() => {
                        setTimeout(() => setIsProfileDropdownOpen(false), 300); // delay 300ms
                    }}
                >
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-md"
                    >
                        {user.nama.split(' ')[0]} {/* Nama Depan User */}
                        <User size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 py-1">
                            {/* Tombol Profile/Dashboard */}
                            <Link
                                to={profilePath}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    setIsProfileDropdownOpen(false);
                                    setTimeout(() => setIsProfileDropdownOpen(false), 300);
                                    setMobileMenuOpen(false); }}
                            >
                                {user.role_pengguna === 'admin' ? 'Dashboard Admin' : 'Lihat Profil'}
                            </Link>

                            {/* Tombol Logout */}
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Jika user BELUM LOGIN
        return (
            <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                onClick={() => setMobileMenuOpen(false)} // Tutup menu mobile jika diklik
            >
                Login Sekarang
            </Link>
        );
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* --- LOGO BERBASIS KODE (Anti-Gagal Render) --- */}
                <Link to="/beranda" className="flex items-center gap-2 text-xl font-extrabold text-[#003366]">
                    <Truck className="w-6 h-6 text-primary" />
                    Zulzi <span className="text-primary">Trans</span>
                </Link>

                {/* --- DESKTOP MENU --- */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/beranda" className={isActive("/beranda")}>Beranda</Link>
                    <Link to="/pemesanan" className={isActive("/pemesanan")}>Pemesanan</Link>
                    <Link to="/tentang-kami" className={isActive("/tentang-kami")}>Tentang Kami</Link>

                    {/* Tombol Auth / Profile */}
                    <AuthButton />
                </div>

                {/* --- MOBILE MENU BUTTON --- */}
                <button
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* --- MOBILE MENU DROPDOWN --- */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute w-full bg-white shadow-xl border-t border-gray-100">
                    <div className="px-6 py-4 flex flex-col space-y-3">
                        {/* Link Mobile */}
                        <Link
                            to="/beranda"
                            className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Beranda
                        </Link>
                        <Link
                            to="/pemesanan"
                            className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pemesanan
                        </Link>
                        <Link
                            to="/tentang-kami"
                            className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Tentang Kami
                        </Link>

                        {/* Tombol Auth Mobile */}
                        <div className="mt-4">
                           <AuthButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
