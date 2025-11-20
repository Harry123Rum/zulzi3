import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Truck } from 'lucide-react';

const Navbar = ({ auth }) => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Efek untuk mendeteksi scroll agar navbar punya shadow saat di-scroll
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

    return (
        <nav 
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                
                {/* --- LOGO BERBASIS KODE (Anti-Gagal Render) --- */}
                <Link to="/beranda" className="flex items-center gap-3 group no-underline">
                    {/* Icon Container */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                        <Truck size={22} strokeWidth={2.5} />
                    </div>
                    {/* Text Container */}
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-extrabold text-blue-900 tracking-tight group-hover:text-blue-700 transition-colors">
                            ZULZI TRANS
                        </span>
                        <span className="text-[10px] font-bold text-cyan-600 tracking-[0.15em] mt-0.5">
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
                    {auth?.user ? (
                        <a href="/admin/dashboard" className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition shadow-md flex items-center gap-2">
                            Dashboard
                        </a>
                    ) : (
                        <a href="/login" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:scale-105 transition transform shadow-md">
                            Login
                        </a>
                    )}
                </div>

                {/* --- MOBILE TOGGLE --- */}
                <button 
                    className="md:hidden text-gray-600 hover:text-blue-600 transition"
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
                    
                    {auth?.user ? (
                        <a href="/admin/dashboard" className="bg-blue-900 text-white py-3 rounded-xl font-bold shadow-md mt-2">
                            Dashboard
                        </a>
                    ) : (
                        <a href="/login" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold shadow-md mt-2">
                            Login Sekarang
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;