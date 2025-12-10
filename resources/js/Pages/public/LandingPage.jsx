import React, { useState, useEffect, useRef } from 'react';
import { Truck, User, Star, Calendar, CheckCircle, Phone, Zap, Shield, Clock, Users } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { getPublicReviews } from '../../services/reviewService';
import { Alert } from '@/Components/ReusableUI'; // <-- IMPORT ALERT COMPONENT

// Data Armada ditanam langsung di Front-end
const ARMADA_DATA = [
  {
    id_layanan: 1,
    nama_layanan: 'Angkut Barang',
    armada: [
      {
        id_armada: 1,
        no_plat: 'B 1001 ZUL',
        jenis_kendaraan: 'Minibus',
        kapasitas: '19 Orang',
        harga_sewa_per_hari: 800000,
        status_ketersediaan: 'Tersedia',
      },
      {
        id_armada: 2,
        no_plat: 'B 2002 TRANS',
        jenis_kendaraan: 'Truk Box',
        kapasitas: '4 Ton',
        harga_sewa_per_hari: 1200000,
        status_ketersediaan: 'Tersedia',
      },
    ]
  },
  {
    id_layanan: 2,
    nama_layanan: 'Angkut Sampah',
    armada: [
      {
        id_armada: 3,
        no_plat: 'B 3003 ZUL',
        jenis_kendaraan: 'Avanza',
        kapasitas: '7 Orang',
        harga_sewa_per_hari: 450000,
        status_ketersediaan: 'Tersedia',
      },
      {
        id_armada: 4,
        no_plat: 'B 4004 TRANSPORT',
        jenis_kendaraan: 'Canter',
        kapasitas: '3 Ton',
        harga_sewa_per_hari: 600000,
        status_ketersediaan: 'Tersedia',
      },
    ]
  },
  {
    id_layanan: 3,
    nama_layanan: 'Sewa Kendaraan',
    armada: [
      {
        id_armada: 5,
        no_plat: 'B 5005 RENTAL',
        jenis_kendaraan: 'Innova',
        kapasitas: '8 Orang',
        harga_sewa_per_hari: 750000,
        status_ketersediaan: 'Tersedia',
      },
      {
        id_armada: 6,
        no_plat: 'B 6006 ZULZI',
        jenis_kendaraan: 'Elf',
        kapasitas: '16 Orang',
        harga_sewa_per_hari: 950000,
        status_ketersediaan: 'Tersedia',
      },
    ]
  },
];

export default function LandingPage(props) {
  const auth = props.auth || {};

  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const [oauthAlert, setOauthAlert] = useState(null); // State untuk OAuth alert
  const isInitialLoad = useRef(true); // Ref untuk tracking initial load

  // Data Armada Statis - Full Hardcode
  const ARMADA_DATA = [
    {
      id_layanan: 1,
      nama_layanan: 'Angkut Barang',
      kategori: 'angkut_barang',
      armada: [
        { id_armada: 1, jenis_kendaraan: 'Pik Up Bak', kapasitas: '1.5 Ton', harga_sewa_per_hari: 850000, gambar: 'pikup bak.jpeg' },
        { id_armada: 2, jenis_kendaraan: 'Pik Up Bok', kapasitas: '1.5 Ton', harga_sewa_per_hari: 850000, gambar: 'pikup bok.jpeg' },
        { id_armada: 3, jenis_kendaraan: 'Tronton Wings Bok', kapasitas: '10.5 Ton', harga_sewa_per_hari: 850000, gambar: 'tronton.jpeg' },
        { id_armada: 4, jenis_kendaraan: 'Truck Trailer', kapasitas: '>20 Ton', harga_sewa_per_hari: 850000, gambar: 'trailer.jpeg' },
        { id_armada: 5, jenis_kendaraan: 'CDD Bak', kapasitas: '4.5 Ton', harga_sewa_per_hari: 850000, gambar: 'cdd bak.jpeg' },
        { id_armada: 6, jenis_kendaraan: 'CDD Bok', kapasitas: '4.5 Ton', harga_sewa_per_hari: 850000, gambar: 'cdd bok.jpeg' },
        { id_armada: 7, jenis_kendaraan: 'CDE (Engkel) Bak', kapasitas: '2.5 Ton', harga_sewa_per_hari: 850000, gambar: 'engkel bak.jpeg' },
        { id_armada: 8, jenis_kendaraan: 'CDE (Engkel) Bok', kapasitas: '2.5 Ton', harga_sewa_per_hari: 850000, gambar: 'engkel bok.jpeg' },
        { id_armada: 9, jenis_kendaraan: 'Fuso Long', kapasitas: '7 Ton', harga_sewa_per_hari: 850000, gambar: 'fuso long.jpeg' },
        { id_armada: 10, jenis_kendaraan: 'Fuso Standar', kapasitas: '7 Ton', harga_sewa_per_hari: 850000, gambar: 'fuso standar.jpeg' },
      ]
    },
    {
      id_layanan: 2,
      nama_layanan: 'Angkut Sampah',
      kategori: 'angkut_sampah',
      armada: [
        { id_armada: 11, jenis_kendaraan: 'CDD DUMT TRUCT', ongkir: 400000, gambar: 'cdd drumt.jpeg' },
        { id_armada: 12, jenis_kendaraan: 'CDE angkut sampah', ongkir: 300000, gambar: 'cde sampah.jpeg' },
      ]
    },
    {
      id_layanan: 3,
      nama_layanan: 'Sewa Kendaraan',
      kategori: 'sewa_kendaraan',
      armada: [
        { id_armada: 13, jenis_kendaraan: 'Mobil Reguler', kapasitas: '4 Orang', harga_sewa_per_hari: 350000, periode: '24 jam', gambar: 'reguler.jpeg' },
        { id_armada: 14, jenis_kendaraan: 'Mobil XL', kapasitas: '6 Orang', harga_sewa_per_hari: 450000, periode: '24 jam', gambar: 'xl.jpeg' },
        { id_armada: 15, jenis_kendaraan: 'Elf', harga_sistem_rute: true, gambar: 'elf.jpeg' },
        { id_armada: 16, jenis_kendaraan: 'Bus Medium', harga_sistem_rute: true, gambar: 'bus.jpeg' },
        { id_armada: 17, jenis_kendaraan: 'CDD Bak Rental Bulanan', harga_sewa_per_hari: 11000000, periode: 'bulanan', gambar: 'cdd bak.jpeg' },
        { id_armada: 18, jenis_kendaraan: 'CDD Bok Rental Bulanan', harga_sewa_per_hari: 12000000, periode: 'bulanan', gambar: 'cdd bok.jpeg' },
        { id_armada: 19, jenis_kendaraan: 'CDE Bak Rental Bulanan', harga_sewa_per_hari: 7000000, periode: 'bulanan', gambar: 'cde bakk.jpeg' },
        { id_armada: 20, jenis_kendaraan: 'Pickup', harga_sewa_per_hari: 4500000, periode: 'bulanan', gambar: 'pikup bak.jpeg' },
      ]
    }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        // Set data armada statis
        setServices(ARMADA_DATA);
        console.log("🚗 Armada Statis Dimuat:", ARMADA_DATA);

        // Fetch reviews dari API
        const reviewResponse = await getPublicReviews();
        const reviewData = reviewResponse.data.data || reviewResponse.data || [];

        const reviews = Array.isArray(reviewData) ? reviewData : [];
        setReviews(reviews);

      } catch (error) {
        console.error("❌ Gagal mengambil data landing page:", error);
        // Fallback: gunakan data armada statis
        setServices(ARMADA_DATA);
        setReviews([]);
        setServices(ARMADA_DATA); // Fallback ke hardcoded jika error
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Auto-rotate features setiap 5 detik
  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(featureTimer);
  }, []);

  // Auto-rotate reviews carousel setiap 5 detik
  useEffect(() => {
    if (reviews.length > 0) {
      const reviewTimer = setInterval(() => {
        setCurrentReviewIndex(prev => (prev + 1) % Math.max(1, Math.ceil(reviews.length / 4)));
      }, 5000);
      return () => clearInterval(reviewTimer);
    }
  }, [reviews.length]);

  // ============================================================
  // ✅ LOGIC BARU: Cek dan Tampilkan Notifikasi OAuth
  // ============================================================
  useEffect(() => {
    if (isInitialLoad.current) {
      const storedAlert = localStorage.getItem('oauth_alert');
      if (storedAlert) {
        try {
          const alertData = JSON.parse(storedAlert);
          setOauthAlert(alertData);

          // Set timer untuk menghilangkan alert setelah 5 detik
          setTimeout(() => setOauthAlert(null), 5000);

        } catch (e) {
          console.error("Failed to parse OAuth alert:", e);
        }
        // Pastikan alert dihapus dari storage setelah dibaca
        localStorage.removeItem('oauth_alert');
      }
      isInitialLoad.current = false;
    }
  }, []);
  // ============================================================

  return (
    <div className="font-sans antialiased text-gray-800 bg-white min-h-screen flex flex-col">

      {/* Panggil Navbar Reusable */}
      <Navbar auth={auth} />

      {/* --- NOTIFIKASI OAUTH DI ATAS HERO --- */}
      {oauthAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md p-4 animate-fade-in-up">
            <Alert
                type={oauthAlert.type}
                message={oauthAlert.message}
                onClose={() => setOauthAlert(null)}
            />
        </div>
      )}
      {/* --- END NOTIFIKASI --- */}

      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-[#f0f9ff] via-white to-blue-50 pt-40 pb-40 overflow-hidden">
        {/* Animated Background Decorations */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-100 rounded-full blur-2xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

        {/* Floating Dots Animation */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-[#00a3e0] rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-[#00a3e0] rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in">
              <p className="text-xs font-bold text-[#00a3e0] tracking-[0.4em] uppercase px-4 py-2 border border-[#00a3e0]/30 rounded-full bg-blue-50/50 backdrop-blur-sm">
                  ✨ Transportasi Premium & Terpercaya
              </p>
            </div>

            <div className="mb-6 overflow-hidden">
              <h1 className="text-6xl md:text-8xl font-black text-[#003366] leading-tight mb-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
                  PERJALANAN
              </h1>
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-[#00a3e0] to-[#0088b8] bg-clip-text text-transparent leading-tight mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  TANPA BATAS
              </h1>
            </div>

            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{animationDelay: '0.3s'}}>
                Layanan logistik dan transportasi penumpang yang mengutamakan kenyamanan,
                keamanan, dan ketepatan waktu. Mitra perjalanan terbaik Anda untuk setiap petualangan.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-5 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <button
                    onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group px-12 py-5 bg-gradient-to-r from-[#003366] to-[#004d99] text-white font-bold rounded-xl hover:shadow-2xl transition-all shadow-lg text-sm uppercase tracking-wider transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Zap size={18} className="group-hover:rotate-12 transition-transform" />
                      Pesan Sekarang
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
                <button className="group px-12 py-5 bg-white text-[#003366] border-2 border-[#003366] font-bold rounded-xl hover:bg-[#003366] hover:text-white transition-all shadow-md text-sm uppercase tracking-wider transform hover:-translate-y-2 hover:scale-105">
                    <Phone size={18} className="inline mr-2" />
                    Hubungi Kami
                </button>
            </div>
        </div>
      </section>

      {/* --- FEATURES SHOWCASE --- */}
      <section className="py-20 bg-gradient-to-b from-white to-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-[#003366] text-center mb-4">Mengapa Memilih Kami?</h2>
          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">Dengan pengalaman bertahun-tahun, kami menawarkan solusi transportasi terbaik</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Zap size={32} />, title: 'Respons Cepat', desc: 'Layanan pelanggan 24/7' },
              { icon: <Shield size={32} />, title: 'Aman & Terpercaya', desc: 'Asuransi penuh coverage' },
              { icon: <Clock size={32} />, title: 'Tepat Waktu', desc: 'Komitmen ketepatan jadwal' },
              { icon: <Users size={32} />, title: 'Tim Profesional', desc: 'Supir berpengalaman' }
            ].map((feature, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFeature(idx)}
                className={`p-8 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  activeFeature === idx
                    ? 'bg-[#00a3e0] text-white shadow-xl -translate-y-2'
                    : 'bg-white border border-gray-100 text-[#003366] hover:bg-[#e0f4ff] hover:border-[#00a3e0] hover:shadow-lg hover:text-[#003366]'
                }`}
              >
                <div className={`mb-4 p-3 rounded-lg w-fit transition-all ${
                  activeFeature === idx ? 'bg-white/30' : 'bg-blue-50'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className={`text-sm ${activeFeature === idx ? 'text-white/90' : 'text-gray-500'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LAYANAN KAMI --- */}
      <section id="layanan" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#003366] mb-4 uppercase tracking-wide">Layanan Kami</h2>
            <div className="w-20 h-1.5 bg-[#00a3e0] mx-auto rounded-full mb-6"></div>
            <p className="text-gray-500 max-w-2xl mx-auto">
                Berbagai pilihan kendaraan dan layanan transportasi untuk memenuhi kebutuhan perjalanan pribadi atau bisnis Anda.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#00a3e0]"></div>
            </div>
          ) : (
            <div className="space-y-20">
              {services.map((service) => (
                <div key={service.id_layanan}>
                  {/* Judul Kategori */}
                  <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4 text-[#003366]">
                        <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#003366]">{service.nama_layanan}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {service.armada && service.armada.map((item) => (
                        <div
                          key={item.id_armada}
                          onMouseEnter={() => setHoveredService(item.id_armada)}
                          onMouseLeave={() => setHoveredService(null)}
                          className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-2 cursor-pointer"
                        >
                            {/* Gambar Armada dengan Gradient Overlay */}
                            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {item.gambar && item.gambar !== '' ? (
                                    <img
                                        src={`/images/${item.gambar}`}
                                        alt={item.jenis_kendaraan}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            // Fallback ke icon jika gambar tidak ditemukan
                                            e.target.style.display = 'none';
                                            if (e.target.nextElementSibling) {
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }
                                        }}
                                    />
                                ) : null}

                                <Truck className="w-24 h-24 text-gray-300 group-hover:text-[#00a3e0] group-hover:scale-125 transition-all duration-500 flex items-center justify-center" style={{display: (!item.gambar || item.gambar === '') ? 'flex' : 'none'}} />

                                {/* Badge Kapasitas - hanya untuk kategori tertentu */}
                                {(service.kategori === 'angkut_barang' || (service.kategori === 'sewa_kendaraan' && item.kapasitas)) && (
                                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#003366] text-xs font-extrabold px-4 py-2 rounded-lg shadow-md uppercase tracking-wider">
                                      {item.kapasitas}
                                  </div>
                                )}
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                                {/* Nama Armada */}
                                <h4 className="text-lg font-bold text-[#003366] mb-3 line-clamp-2 group-hover:text-[#00a3e0] transition-colors">{item.jenis_kendaraan}</h4>

                                {/* Spesifikasi Card - Berbeda per kategori */}
                                {service.kategori === 'angkut_barang' && (
                                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                      <div className="flex items-center gap-2 text-xs text-gray-600">
                                          <span className="font-semibold text-[#003366]">📦 Kapasitas:</span>
                                          <span className="font-bold">{item.kapasitas}</span>
                                      </div>
                                  </div>
                                )}

                                {service.kategori === 'sewa_kendaraan' && item.kapasitas && (
                                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                      <div className="flex items-center gap-2 text-xs text-gray-600">
                                          <span className="font-semibold text-[#003366]">👥 Kapasitas:</span>
                                          <span className="font-bold">{item.kapasitas}</span>
                                      </div>
                                  </div>
                                )}

                                <div className="mt-auto pt-6 border-t border-gray-100">
                                    {/* Harga - Layout berbeda per kategori */}
                                    {service.kategori === 'angkut_barang' && (
                                      <div className="mb-6">
                                          <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Harga Mulai dari</p>
                                          <p className="text-center text-[#003366] font-bold text-xl">
                                              Rp 850.000
                                          </p>
                                      </div>
                                    )}

                                    {service.kategori === 'angkut_sampah' && (
                                      <div className="mb-6">
                                          <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Ongkir Mulai dari</p>
                                          <p className="text-center text-[#003366] font-bold text-xl">
                                              Rp {Number(item.ongkir).toLocaleString('id-ID')}
                                          </p>
                                      </div>
                                    )}

                                    {service.kategori === 'sewa_kendaraan' && (
                                      <div className="mb-6">
                                          {item.harga_sistem_rute ? (
                                            <div className="text-center">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Harga</p>
                                                <p className="text-[#003366] font-bold text-lg">Sesuai Sistem Rute</p>
                                            </div>
                                          ) : (
                                            <div>
                                                <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Harga Mulai dari</p>
                                                <div className="text-center">
                                                    <p className="text-[#003366] font-bold text-xl">
                                                        Rp {Number(item.harga_sewa_per_hari).toLocaleString('id-ID')}
                                                    </p>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        /{item.periode || 'hari'}
                                                    </span>
                                                </div>
                                            </div>
                                          )}
                                      </div>
                                    )}

                                    <a
                                        href={`/pemesanan?service=${encodeURIComponent(service.nama_layanan.toLowerCase().replace(/\s+/g, '-'))}`}
                                        className="w-full bg-gradient-to-r from-[#003366] to-[#004d99] hover:from-[#002244] hover:to-[#003d7a] text-white text-sm font-bold py-4 rounded-xl transition-all uppercase tracking-wide transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95 block text-center"
                                    >
                                        Pesan Sekarang
                                    </a>
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- TESTIMONI --- */}
      <section className="py-24 bg-gradient-to-b from-white via-[#f0f9ff] to-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-[#003366] mb-4 uppercase tracking-wide">Apa Kata Pelanggan Kami</h2>
                <p className="text-gray-500 text-lg">Ulasan asli dari pelanggan yang telah mempercayakan perjalanan mereka kepada Zulzi Trans</p>
            </div>

            {/* Carousel Reviews - 4 Card View */}
            <div className="relative max-w-6xl mx-auto">
              {reviews.length > 0 ? (
                <div className="relative overflow-hidden">
                  {/* Slide Container - Grid 4 Kolom */}
                  <div className="flex transition-transform duration-500 ease-out" style={{
                    transform: `translateX(-${currentReviewIndex * 100}%)`
                  }}>
                    {reviews.map((review, idx) => (
                      <div key={review.id_ulasan || idx} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
                          {/* Show 4 cards at a time, cycling through reviews */}
                          {[0, 1, 2, 3].map((offset) => {
                            const reviewIdx = (idx + offset) % reviews.length;
                            const currentReview = reviews[reviewIdx];
                            return (
                              <div key={`${idx}-${offset}`} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                                {/* Quotation Mark */}
                                <div className="absolute top-4 right-6 text-blue-100/50">
                                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.0548 15.0112 14.2085 16.5138 13.0269C16.0706 13.0677 15.5931 13.0769 15.0168 13.0769C11.9338 13.0769 9.79797 10.8852 9.79797 7.33829C9.79797 3.69649 12.3168 1 15.6821 1C18.7879 1 21.292 3.31832 21.292 6.94752C21.292 12.5892 18.4938 16.5798 14.017 21ZM5.19599 21L5.19599 18C5.19599 16.0548 6.19024 14.2085 7.69277 13.0269C7.24962 13.0677 6.77209 13.0769 6.1958 13.0769C3.11278 13.0769 0.976929 10.8852 0.976929 7.33829C0.976929 3.69649 3.49579 1 6.8611 1C9.96688 1 12.471 3.31832 12.471 6.94752C12.471 12.5892 9.67276 16.5798 5.19599 21Z" /></svg>
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#00a3e0] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {currentReview.pengguna?.nama?.charAt(0) || 'U'}
                                  </div>
                                  <div className="flex-grow">
                                    <h4 className="font-bold text-gray-900 text-sm">{currentReview.pengguna?.nama || 'Pengguna'}</h4>
                                    <div className="flex text-yellow-400 mt-1 gap-0.5">
                                      {[...Array(5)].map((_, i) => {
                                        const avgRating = currentReview.rata_rata ||
                                          Math.round((currentReview.rating_driver + currentReview.rating_kendaraan + currentReview.rating_pelayanan) / 3);
                                        return (
                                          <Star
                                            key={i}
                                            size={12}
                                            fill="currentColor"
                                            className={i < avgRating ? "text-yellow-400" : "text-gray-200"}
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 italic leading-relaxed text-[13px] line-clamp-4">
                                  "{currentReview.komentar}"
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-center items-center gap-4 mt-8">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length)}
                      className="p-3 rounded-full border border-[#00a3e0] text-[#003366] hover:bg-[#00a3e0] hover:text-white transition-all"
                    >
                      ← Sebelumnya
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex gap-2">
                      {reviews.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentReviewIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            currentReviewIndex === idx
                              ? 'bg-[#00a3e0] w-8'
                              : 'bg-gray-300 w-2 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentReviewIndex(prev => (prev + 1) % reviews.length)}
                      className="p-3 rounded-full border border-[#00a3e0] text-[#003366] hover:bg-[#00a3e0] hover:text-white transition-all"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Belum ada ulasan dari pelanggan.</p>
                </div>
              )}
            </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-24 bg-gradient-to-b from-[#f0f9ff] to-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30 -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-25 -ml-48 -mb-48"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 md:p-16 max-w-4xl mx-auto relative overflow-hidden group hover:shadow-3xl transition-all duration-300">
                {/* Inner Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/5 to-[#00a3e0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-[#003366] mb-6 leading-tight">
                        Siap Untuk Mulai Perjalanan Anda?
                    </h2>
                    <p className="text-gray-600 mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Hubungi kami sekarang dan dapatkan penawaran terbaik untuk kebutuhan transportasi Anda. Tim kami siap melayani 24 jam.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-5">
                        <button
                            onClick={() => window.open('https://wa.me/628123456789')}
                            className="group/btn inline-flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-[#00a3e0] to-[#0088b8] hover:from-[#008cc0] hover:to-[#006b93] text-white font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <Phone size={22} className="group-hover/btn:rotate-12 transition-transform" />
                            <span>Hubungi via WhatsApp</span>
                        </button>
                        <button
                            onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center justify-center gap-3 px-12 py-5 border-2 border-[#003366] text-[#003366] font-bold rounded-xl text-lg hover:bg-[#003366] hover:text-white hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            Pesan Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Panggil Footer Reusable */}
      <Footer />
    </div>
  );
}
