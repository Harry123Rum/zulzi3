import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Truck, User, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth dari context
import { Modal } from '@/Components/ReusableUI'; // Import Modal untuk pop-up

// ========================================================================================
// KOMPONEN PEMBANTU: ACCESS MODAL (Login Required)
// ========================================================================================
const AccessModal = ({ isOpen, onClose, navigate }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Akses Dibatasi" size="sm">
        <div className="p-6 text-center">
            <User className="w-12 h-12 text-[#003366] mx-auto mb-4" /> 
            <p className="text-base font-semibold text-slate-700 mb-2">
                Login Diperlukan untuk Pemesanan
            </p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Anda harus masuk ke akun Anda terlebih dahulu untuk mengakses halaman Pemesanan dan melanjutkan transaksi.
            </p>
        </div>
        <div className="flex justify-center gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
                Tutup
            </button>
            <button 
                type="button" 
                onClick={() => {
                    onClose();
                    // Mengarahkan ke login dengan state untuk redirect balik ke /pemesanan
                    navigate('/login', { state: { from: '/pemesanan' } });
                }} 
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
                Login Sekarang
            </button>
        </div>
    </Modal>
);

// ========================================================================================
// KOMPONEN PEMBANTU: CONFIRM LOGOUT MODAL
// ========================================================================================
const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Logout" size="sm">
        <div className="p-6 text-center">
            <LogOut className="w-12 h-12 text-red-500 mx-auto mb-4" /> 
            <p className="text-base font-semibold text-slate-700 mb-2">
                Apakah Anda yakin ingin keluar?
            </p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Sesi Anda akan diakhiri dan Anda harus login kembali.
            </p>
        </div>
        <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
                Batal
            </button>
            <button 
                type="button" 
                onClick={onConfirm} 
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md"
            >
                Ya, Logout
            </button>
        </div>
    </Modal>
);


// Komponen Navbar tidak lagi menerima props 'auth', 
// melainkan mengambil data auth dari useAuth()
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. Ambil status otentikasi dari Context
    const { isAuthenticated, user, logout } = useAuth(); 
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // State untuk Modals BARU
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
        // Menggunakan startsWith untuk mencocokkan sub-rute (misal /pemesanan/status)
        return location.pathname.startsWith(path) 
               ? "text-blue-600 font-bold" 
               : "text-gray-600 hover:text-blue-600";
    };

    // Handler untuk tombol Pemesanan
    const handlePemesananClick = (e) => {
        if (e) e.preventDefault();
        setMobileMenuOpen(false); 
        
        if (!isAuthenticated) {
            setIsAccessModalOpen(true); 
        } else {
            navigate('/pemesanan');
        }
    };

    // Handler untuk menampilkan Modal Konfirmasi Logout
    const handleLogoutClick = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
        setIsProfileDropdownOpen(false);
        setIsLogoutModalOpen(true); 
    };

    // Fungsi Konfirmasi Logout - dipanggil dari ConfirmLogoutModal
    const handleConfirmLogout = async () => {
        setIsLogoutModalOpen(false); 
        await logout(); // Panggil logout (yang akan set auth_alert)
        
        // Redirect ke /beranda agar notifikasi sukses di LandingPage muncul
        navigate('/beranda'); 
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
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl transition-colors shadow-md"
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
                            
                            {/* Tombol Logout - Memanggil Handler Modal Konfirmasi */}
                            <button 
                                onClick={handleLogoutClick} 
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mx-1"
                            >
                                <div className="flex items-center gap-2">
                                    <LogOut size={18} className="text-red-600" />
                                    <span>Logout</span>
                                </div>
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
        <>
            <nav 
                className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-white shadow-md py-3' : 'bg-gradient-to-br from-[#f0f9ff] via-white to-blue-50 py-4 border-b border-[#00a3e0]/20'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    
                    {/* --- LOGO DENGAN GAMBAR (Original User Code) --- */}
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
                        <Link to="/beranda" className={`${location.pathname === '/beranda' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'} transition text-sm uppercase tracking-wide`}>
                            Beranda
                        </Link>
                        {/* Panggil Handler untuk Pemesanan */}
                        <button 
                            onClick={handlePemesananClick}
                            className={`no-underline transition text-sm uppercase tracking-wide ${location.pathname.startsWith('/pemesanan') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            Pemesanan
                        </button>
                        <Link to="/about" className={`${location.pathname.startsWith('/about') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'} transition text-sm uppercase tracking-wide`}>
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
                        {/* Panggil Handler untuk Pemesanan */}
                        <button 
                            onClick={handlePemesananClick} 
                            className="w-full text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50"
                        >
                            Pemesanan
                        </button>
                        <Link 
                            to="/about" 
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
            
            {/* MODALS */}
            <AccessModal 
                isOpen={isAccessModalOpen} 
                onClose={() => setIsAccessModalOpen(false)} 
                navigate={navigate}
            />
            <ConfirmLogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default Navbar;