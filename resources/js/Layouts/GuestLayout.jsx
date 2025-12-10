// resources/js/layouts/GuestLayout.jsx

import React, { useState } from "react";
import { Menu, X, Facebook, Instagram, Twitter } from "lucide-react";

export default function GuestLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <a href="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-blue-900 leading-tight">ZULZI TRANS</span>
                                <span className="text-xs text-blue-600">Travel with Trust</span>
                            </div>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a 
                                href="/"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                            >
                                Beranda
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                            </a>

                            <a 
                                href="#"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                            >
                                Pemesanan
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                            </a>

                            <a 
                                href="/about"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                            >
                                Tentang Kami
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                            </a>

                            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                Login
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col gap-4">
                                <a 
                                    href="/" 
                                    className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 hover:bg-blue-50 rounded transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Beranda
                                </a>

                                <a 
                                    href="#" 
                                    className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 hover:bg-blue-50 rounded transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Pemesanan
                                </a>

                                <a 
                                    href="/about"
                                    className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 hover:bg-blue-50 rounded transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Tentang Kami
                                </a>

                                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md">
                                    Login
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 mt-16">
                <div className="container mx-auto px-4">

                    <div className="grid md:grid-cols-4 gap-8 mb-8">

                        {/* Company */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-xl">ZULZI TRANS</h3>
                            </div>

                            <p className="text-blue-200 text-sm leading-relaxed mb-4">
                                Penyedia layanan transportasi terpercaya untuk perjalanan Anda. Kami siap melayani dengan sepenuh hati.
                            </p>

                            <div className="flex gap-3">
                                <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Layanan */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Layanan Kami</h4>
                            <ul className="space-y-3 text-blue-200">
                                <li><a href="#" className="hover:text-white hover:pl-2 transition-all inline-block">→ Sewa Armada</a></li>
                                <li><a href="#" className="hover:text-white hover:pl-2 transition-all inline-block">→ Antar Jemput</a></li>
                                <li><a href="#" className="hover:text-white hover:pl-2 transition-all inline-block">→ Paket Wisata</a></li>
                                <li><a href="#" className="hover:text-white hover:pl-2 transition-all inline-block">→ Transportasi Karyawan</a></li>
                            </ul>
                        </div>

                        {/* Link Cepat */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Link Cepat</h4>
                            <ul className="space-y-3 text-blue-200">
                                <li><a href="/" className="hover:text-white hover:pl-2 transition-all inline-block">→ Beranda</a></li>
                                <li><a href="/about" className="hover:text-white hover:pl-2 transition-all inline-block">→ Tentang Kami</a></li>
                                <li><a href="#" className="hover:text-white hover:pl-2 transition-all inline-block">→ Pemesanan</a></li>
                                <li><a href="#" className="hover:text-white hover:pl-2 transition-all inline-block">→ Testimoni</a></li>
                            </ul>
                        </div>

                        {/* Kontak */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Kontak Kami</h4>
                            <ul className="space-y-3 text-blue-200">
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>info@zulzitrans.com</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>+62 123 4567 890</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Jl. Raya Transportasi No.123<br />Jakarta, Indonesia 12345</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom */}
                    <div className="border-t border-blue-700/50 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-blue-200 text-sm text-center md:text-left">
                                &copy; 2025 Zulzi Trans. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-blue-200 text-sm">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-white transition-colors">FAQ</a>
                            </div>
                        </div>
                    </div>

                </div>
            </footer>

        </div>
    );
}
