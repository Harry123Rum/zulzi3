import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Truck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth dari context

// Komponen Navbar tidak lagi menerima props 'auth', 
// melainkan mengambil data auth dari useAuth()
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. Ambil status otentikasi dari Context
    const { isAuthenticated, user, logout } = useAuth(); 
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // State untuk Dropdown Profile
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [closeTimeout, setCloseTimeout] = useState(null);

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

    // Handler untuk membuka dropdown
    const handleMouseEnter = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
        setIsProfileDropdownOpen(true);
    };

    // Handler untuk menutup dropdown dengan delay
    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsProfileDropdownOpen(false);
        }, 300); // Delay 300ms sebelum menutup
        setCloseTimeout(timeout);
    };

    // Komponen Tombol Autentikasi (Digunakan di Desktop dan Mobile)
    const AuthButton = () => {
        // Jika user SUDAH LOGIN
        if (isAuthenticated && user) {
            
            // Tentukan tujuan redirect berdasarkan Role (case-insensitive)
            const userRole = user.role_pengguna?.toLowerCase();
            const profilePath = userRole === 'admin' ? '/admin' : '/profile';

            return (
                <div 
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-md"
                    >
                        {user.nama.split(' ')[0]} {/* Nama Depan User */}
                        <User size={18} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <div 
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 py-1"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Tombol Profile/Dashboard */}
                            <Link 
                                to={profilePath} 
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mx-1"
                                onClick={() => { setIsProfileDropdownOpen(false); setMobileMenuOpen(false); }}
                            >
                                {userRole === 'admin' ? 'Dashboard Admin' : 'Lihat Profil'}
                            </Link>
                            
                            {/* Tombol Logout */}
                            <button 
                                onClick={handleLogout} 
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mx-1"
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
                isScrolled ? 'bg-white shadow-md py-3' : 'bg-gradient-to-br from-[#f0f9ff] via-white to-blue-50 py-4 border-b border-[#00a3e0]/20'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                
                {/* --- LOGO DENGAN GAMBAR --- */}
                <Link to="/beranda" className="flex items-center gap-3 group no-underline">
                    {/* Logo Image */}
                    <div className="h-10 transform group-hover:scale-110 transition-transform duration-300">
                        <img 
                            src="/images/logozulzi.png" 
                            alt="Zulzi Trans Logo" 
                            className="h-full object-contain"
                        />
                    </div>
                    {/* Text Container */}
                    <div className="flex flex-col leading-none hidden sm:flex">
                        <span className="text-lg font-extrabold text-blue-900 tracking-tight group-hover:text-blue-700 transition-colors">
                            ZULZI TRANS
                        </span>
                        <span className="text-[9px] font-bold text-cyan-600 tracking-[0.15em]">
                            CEPAT, AMAN, TERPERCAYA
                        </span>
                    </div>
                </Link>

                {/* --- DESKTOP MENU --- */}
                <div className="hidden md:flex items-center gap-8 font-medium">
                    <Link to="/beranda" className={`${isActive('/beranda')} transition text-sm uppercase tracking-wide`}>
                        Beranda
                    </Link>
                    <Link to="/pemesanan" className={`${isActive('/pemesanan')} transition text-sm uppercase tracking-wide`}>
                        Pemesanan
                    </Link>
                    <Link to="/tentang-kami" className={`${isActive('/tentang-kami')} transition text-sm uppercase tracking-wide`}>
                        Tentang Kami
                    </Link>
                </div>

                {/* --- AUTH BUTTONS --- */}
                <div className="hidden md:flex items-center gap-4">
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
            <div className={`md:hidden absolute w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-6 gap-4 text-center">
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
                    
                    <div className="mt-4">
                        <AuthButton />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;