import React, { useState, useEffect } from 'react';
import { Truck, User, Star, Calendar, CheckCircle, Phone } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { getPublicServices } from '../../services/serviceService';
import { getPublicReviews } from '../../services/reviewService';

export default function LandingPage(props) { 
  // props.auth biasanya dikirim otomatis oleh Laravel/Inertia middleware ke page component
  const auth = props.auth || {}; 

  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data real dari API
        const serviceResponse = await getPublicServices();
        const reviewResponse = await getPublicReviews();

        const serviceData = serviceResponse.data.data || serviceResponse.data || [];
        const reviewData = reviewResponse.data.data || reviewResponse.data || [];

        setServices(Array.isArray(serviceData) ? serviceData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (error) {
        console.error("Gagal mengambil data landing page:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); 

  return (
    <div className="font-sans antialiased text-gray-800 bg-white min-h-screen flex flex-col">
      
      {/* Panggil Navbar Reusable */}
      <Navbar auth={auth} />

      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#f0f9ff] pt-36 pb-32 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <p className="text-sm font-bold text-gray-400 tracking-[0.3em] uppercase mb-6">
                Transportasi Premium
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#003366] leading-tight mb-2">
                PERJALANAN
            </h1>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#00a3e0] leading-tight mb-8">
                TANPA BATAS
            </h1>
            
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                Layanan logistik dan transportasi penumpang yang mengutamakan kenyamanan, 
                keamanan, dan ketepatan waktu. Mitra perjalanan terbaik Anda.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
                <button 
                    onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-4 bg-[#003366] text-white font-bold rounded hover:bg-[#002244] transition-all shadow-lg text-sm uppercase tracking-wider transform hover:-translate-y-1"
                >
                    Pesan Sekarang
                </button>
                <button className="px-10 py-4 bg-white text-[#003366] border border-gray-200 font-bold rounded hover:bg-gray-50 transition-all shadow-sm text-sm uppercase tracking-wider">
                    Hubungi Kami
                </button>
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
                        <div key={item.id_armada} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                            {/* Gambar Armada */}
                            <div className="h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                <Truck className="w-20 h-20 text-gray-200 group-hover:text-[#00a3e0] group-hover:scale-110 transition-all duration-500" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#003366] text-xs font-extrabold px-3 py-1.5 rounded shadow-sm uppercase tracking-wider">
                                    {item.kapasitas}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-grow flex flex-col">
                                <h4 className="text-lg font-bold text-[#003366] mb-2 line-clamp-1">{item.jenis_kendaraan}</h4>
                                <p className="text-sm text-gray-400 mb-6 font-medium tracking-wider">{item.no_plat}</p>
                                
                                <div className="mt-auto pt-6 border-t border-dashed border-gray-100">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Mulai dari</p>
                                            <p className="text-[#003366] font-bold text-lg">
                                                Rp {Number(item.harga_sewa_per_hari).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 mb-1 font-medium">/ hari</span>
                                    </div>
                                    
                                    <button className="w-full block text-center bg-[#003366] hover:bg-[#002244] text-white text-sm font-bold py-3 rounded transition-colors uppercase tracking-wide">
                                        Pesan Armada
                                    </button>
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
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-[#003366] mb-4">Apa Kata Pelanggan Kami</h2>
                <p className="text-gray-500">Ulasan asli dari pelanggan yang telah mempercayakan perjalanan mereka.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.length > 0 ? reviews.map((review, idx) => (
                    <div key={review.id_ulasan || idx} className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow">
                        <div className="absolute top-8 right-8 text-gray-100">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.0548 15.0112 14.2085 16.5138 13.0269C16.0706 13.0677 15.5931 13.0769 15.0168 13.0769C11.9338 13.0769 9.79797 10.8852 9.79797 7.33829C9.79797 3.69649 12.3168 1 15.6821 1C18.7879 1 21.292 3.31832 21.292 6.94752C21.292 12.5892 18.4938 16.5798 14.017 21ZM5.19599 21L5.19599 18C5.19599 16.0548 6.19024 14.2085 7.69277 13.0269C7.24962 13.0677 6.77209 13.0769 6.1958 13.0769C3.11278 13.0769 0.976929 10.8852 0.976929 7.33829C0.976929 3.69649 3.49579 1 6.8611 1C9.96688 1 12.471 3.31832 12.471 6.94752C12.471 12.5892 9.67276 16.5798 5.19599 21Z" /></svg>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#005599] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {review.pengguna?.nama?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{review.pengguna?.nama || 'Pengguna'}</h4>
                                <div className="flex text-yellow-400 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" className={i < (review.rating || 5) ? "text-yellow-400" : "text-gray-200"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic leading-relaxed text-[15px]">
                            "{review.komentar}"
                        </p>
                    </div>
                )) : (
                    <div className="col-span-3 text-center text-gray-500">Belum ada ulasan.</div>
                )}
            </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-gray-100 max-w-5xl mx-auto relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#003366] mb-6">Siap Untuk Mulai Perjalanan Anda?</h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
                        Hubungi kami sekarang untuk penawaran terbaik.
                    </p>
                    <button 
                        onClick={() => window.open('https://wa.me/628123456789')} 
                        className="inline-flex items-center gap-3 px-12 py-5 bg-[#00a3e0] hover:bg-[#008cc0] text-white font-bold rounded-full text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                        <Phone size={20} />
                        Hubungi via WhatsApp
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Panggil Footer Reusable */}
      <Footer />
    </div>
  );
}