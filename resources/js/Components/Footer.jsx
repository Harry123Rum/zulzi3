import React from 'react';
import { Truck, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#001a33] text-white pt-20 pb-10 border-t-4 border-[#00a3e0]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                    
                    {/* BRAND INFO */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#003366]">
                                <Truck size={16} strokeWidth={3} />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight font-sans">ZULZI TRANS</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 pr-4">
                            Mitra transportasi terpercaya Anda. Menyediakan layanan logistik dan perjalanan dengan armada prima dan pelayanan profesional.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 bg-[#ffffff10] rounded-full flex items-center justify-center hover:bg-[#00a3e0] hover:text-white transition-all"><Instagram size={16} /></a>
                            <a href="#" className="w-9 h-9 bg-[#ffffff10] rounded-full flex items-center justify-center hover:bg-[#00a3e0] hover:text-white transition-all"><Facebook size={16} /></a>
                        </div>
                    </div>

                    {/* LAYANAN */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-[#00a3e0]">Layanan Kami</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors no-underline">Sewa Truk Box</a></li>
                            <li><a href="#" className="hover:text-white transition-colors no-underline">Rental Mobil</a></li>
                            <li><a href="#" className="hover:text-white transition-colors no-underline">Bus Pariwisata</a></li>
                            <li><a href="#" className="hover:text-white transition-colors no-underline">Pindahan Rumah</a></li>
                        </ul>
                    </div>

                    {/* LINK CEPAT */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-[#00a3e0]">Link Cepat</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="/" className="hover:text-white transition-colors no-underline">Beranda</a></li>
                            <li><a href="#tentang" className="hover:text-white transition-colors no-underline">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-white transition-colors no-underline">Syarat & Ketentuan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors no-underline">Kebijakan Privasi</a></li>
                        </ul>
                    </div>

                    {/* KONTAK */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-[#00a3e0]">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <Phone size={18} className="text-[#00a3e0] mt-0.5" /> 
                                <span>+62 812 3456 7890<br/><span className="text-xs text-gray-500">Senin - Minggu (24 Jam)</span></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={18} className="text-[#00a3e0] mt-0.5" /> 
                                <span>cs@zulzitrans.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#00a3e0] mt-0.5" /> 
                                <span>Jl. Raya Logistik No. 123,<br/>Jakarta Timur, Indonesia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#ffffff10] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} PT. Zulzi Trans Indonesia. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white no-underline">Privacy Policy</a>
                        <a href="#" className="hover:text-white no-underline">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}