import React from 'react';
import { CheckCircle, Target, Users, Award, Phone } from 'lucide-react';

// Pastikan import ini mengarah ke komponen yang BARU SAJA kita update (Capital C)
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function AboutPage(props) {
  // Ambil auth dari props jika tersedia
  const auth = props.auth || {};

  return (
    <div className="font-sans antialiased text-gray-800 bg-white min-h-screen flex flex-col">

      {/* Navbar Reusable */}
      <Navbar auth={auth} />

      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-[#f0f9ff] via-white to-blue-50 pt-40 pb-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#00a3e0_1px,transparent_1px)] [background-size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,#00a3e0_0.5px,transparent_0.5px)] [background-size:80px_80px] opacity-60"></div>
        </div>

        {/* Floating Dots Animation */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-[#00a3e0] rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-[#00a3e0] rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter animate-slide-up drop-shadow-lg text-[#003366]" style={{animationDelay: '0.1s'}}>
                Tentang Zulzi Trans
            </h1>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-medium" style={{animationDelay: '0.2s'}}>
                Kami bukan sekadar penyedia transportasi, kami adalah mitra perjalanan Anda menuju kesuksesan dan tujuan impian.
            </p>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section className="py-20 bg-gradient-to-b from-white via-[#f8fbff] to-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Image dengan fallback icon */}
                <div className="w-full md:w-1/2">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#a8d8ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                        <img
                            src="/images/zulzi.jpeg"
                            alt="Tim Zulzi Trans"
                            className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden bg-gradient-to-br from-[#f0f9ff] to-blue-50 h-96 w-full flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-700">
                             <div className="text-center">
                                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-full inline-block mb-4">
                                    <Users size={56} className="text-[#5eb3ff]" />
                                </div>
                                <p className="font-bold text-[#5eb3ff] text-lg">Foto Tim / Armada</p>
                                <p className="text-sm text-gray-500 mt-2">Segera ditambahkan</p>
                             </div>
                        </div>
                        <div className="absolute bottom-0 left-0 bg-gradient-to-r from-[#5eb3ff] to-[#a8d8ff] text-white px-8 py-4 rounded-tr-3xl font-bold text-xl shadow-lg">
                            Est. 2018
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-sm font-bold text-[#5eb3ff] uppercase tracking-widest mb-2 drop-shadow-sm">Siapa Kami</h2>
                    <h3 className="text-3xl md:text-4xl font-black text-[#3d9cff] mb-6">Solusi Transportasi Terintegrasi</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                        Zulzi Trans didirikan dengan visi untuk mempermudah mobilitas masyarakat dan logistik bisnis di Indonesia. Berawal dari 2 unit armada, kini kami telah melayani ribuan pelanggan dengan puluhan armada yang siap beroperasi 24 jam.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {[
                            "Respon Cepat",
                            "Harga Transparan",
                            "Armada Prima",
                            "Supir Profesional"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-blue-50 transition-all duration-300">
                                <CheckCircle className="text-[#80c1ff] fill-blue-100 group-hover/item:scale-125 transition-all duration-300" size={20} />
                                <span className="font-bold text-gray-700 group-hover/item:text-[#5eb3ff] transition-colors">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- VISI MISI --- */}
      <section className="py-24 bg-gradient-to-b from-white via-[#f0f7ff] to-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#3d9cff] mb-4">Visi, Misi & Nilai Kami</h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#5eb3ff] via-[#3d9cff] to-[#2b8cff] mx-auto rounded-full shadow-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 - Visi */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-3xl shadow-xl border-2 border-blue-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5eb3ff] rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Target size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-[#3d9cff] mb-4">Visi Kami</h3>
                    <p className="text-gray-700 leading-relaxed text-sm font-medium">
                        Menjadi penyedia jasa pengiriman yang dikenal, karena kecepatan, keamanan, dan keandalannya.
                    </p>
                </div>

                {/* Card 2 - Misi */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-3xl shadow-xl border-2 border-blue-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5eb3ff] rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Users size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-[#3d9cff] mb-4">Misi Kami</h3>
                    <p className="text-gray-700 leading-relaxed text-sm font-medium">
                        Meningkatkan kepuasan pelanggan dengan layanan yang profesional, responsif, dan solusi yang inovatif.
                    </p>
                </div>

                {/* Card 3 - Nilai */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-3xl shadow-xl border-2 border-blue-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5eb3ff] rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Award size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-[#3d9cff] mb-4">Tujuan Kami</h3>
                    <p className="text-gray-700 leading-relaxed text-sm font-medium">
                        Memberikan solusi logistik yang terintegrasi dan kompetitif untuk memenuhi kebutuhan pelanggan.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-gradient-to-b from-white via-[#f0f7ff] to-[#e8f4ff] relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5eb3ff] rounded-full blur-3xl opacity-20 -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3d9cff] rounded-full blur-3xl opacity-15 -ml-40 -mb-40 animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="container mx-auto px-4 text-center relative z-10">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border-2 border-blue-200 p-10 md:p-16 max-w-4xl mx-auto relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                {/* Inner Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3d9cff]/10 to-[#5eb3ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#5eb3ff] rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-[#3d9cff] mb-6 leading-tight drop-shadow-sm">
                        Siap Untuk Mulai Perjalanan Anda?
                    </h2>
                    <p className="text-gray-700 mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Hubungi kami sekarang dan dapatkan penawaran terbaik untuk kebutuhan transportasi Anda. Tim kami siap melayani 24 jam.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-5">
                        <button
                            onClick={() => window.open('https://wa.me/628158822394')}
                            className="group/btn inline-flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-br from-[#5eb3ff] via-[#4caaff] to-[#3d9cff] hover:from-[#7ac2ff] hover:via-[#66b8ff] hover:to-[#5aabff] text-white font-bold rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 active:scale-95"
                        >
                            <Phone size={22} className="group-hover/btn:rotate-12 transition-transform" />
                            <span>Hubungi via WhatsApp</span>
                        </button>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-3 px-12 py-5 border-2 border-[#3d9cff] text-[#3d9cff] font-bold rounded-2xl text-lg hover:bg-[#3d9cff] hover:text-white hover:shadow-xl transition-all transform hover:-translate-y-2 active:scale-95"
                        >
                            Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- LOKASI SECTION --- */}
      <section className="py-24 bg-gradient-to-b from-white via-[#f8fbff] to-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#3d9cff] mb-4">Lokasi Kami</h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#5eb3ff] via-[#3d9cff] to-[#2b8cff] mx-auto rounded-full shadow-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Maps */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-100 group">
                    <div className="aspect-video relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8087651969047!2d107.00449387451652!3d-6.315950893547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698c6c5b1c1c1d%3A0x1c1c1c1c1c1c1c1c!2sZulzi%20Trans!5e0!3m2!1sid!2sid!4v1234567890123"
                            width="100%"
                            height="100%"
                            style={{border: 0}}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                {/* Info */}
                <div>
                    <h3 className="text-3xl font-black text-[#3d9cff] mb-8">Kunjungi Kami</h3>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border-2 border-blue-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#3d9cff] mb-1">Telepon</h4>
                                <p className="text-gray-700">+62 815 8822 394</p>
                                <p className="text-gray-600 text-sm">Senin - Minggu (24 Jam)</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border-2 border-blue-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                <Award size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#3d9cff] mb-1">Alamat</h4>
                                <p className="text-gray-700 text-sm">Jl. KH. Abdul Hamid II No.92D, RT.3/RW.3,</p>
                                <p className="text-gray-700 text-sm">Duri Kosambi, Kecamatan Cengkareng,</p>
                                <p className="text-gray-700 text-sm">Kota Jakarta Barat, DKI Jakarta 11750</p>
                            </div>
                        </div>

                        <button
                            onClick={() => window.open('https://maps.app.goo.gl/4ui6Rfp5LBixK5CUA')}
                            className="w-full px-6 py-4 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] hover:from-[#7ac2ff] hover:to-[#5aabff] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            Buka di Google Maps
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
