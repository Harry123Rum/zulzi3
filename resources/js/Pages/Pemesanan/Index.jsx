import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Stepper from '../../Components/Pemesanan/Stepper';
import FormRental from './Partials/FormRental';
import FormBarang from './Partials/FormBarang';
import FormSampah from './Partials/FormSampah';
import { Car, Truck, Trash2, ArrowLeft } from 'lucide-react';

const PemesananPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State Management
    const [step, setStep] = useState(1); // 1: Form Input
    const [selectedService, setSelectedService] = useState(null);

    // Redirect jika ada data pesanan dari profile
    useEffect(() => {
        if (location.state?.orderData && location.state?.showPayment) {
            navigate(`/pemesanan/${location.state.orderData.id_pemesanan}/status`, { replace: true });
        }
    }, [location, navigate]);

    // Data pilihan layanan dengan deskripsi
    const services = [
        { 
            id: 'rental', 
            title: 'RENTAL MOBIL', 
            desc: 'Sewa kendaraan untuk perjalanan nyaman',
            icon: Car, 
            color: 'bg-blue-400', 
            gradient: 'from-blue-400 to-blue-600',
            borderColor: 'border-blue-400'
        },
        { 
            id: 'barang', 
            title: 'ANGKUT BARANG', 
            desc: 'Layanan pengiriman barang terpercaya',
            icon: Truck, 
            color: 'bg-blue-800', 
            gradient: 'from-blue-700 to-blue-900',
            borderColor: 'border-blue-800'
        },
        { 
            id: 'sampah', 
            title: 'ANGKUT SAMPAH', 
            desc: 'Solusi pengelolaan sampah praktis',
            icon: Trash2, 
            color: 'bg-green-600', 
            gradient: 'from-green-500 to-green-700',
            borderColor: 'border-green-600'
        },
    ];

    // Callback saat form berhasil disubmit - redirect ke halaman status
    const handleOrderSuccess = (data) => {
        navigate(`/pemesanan/${data.id_pemesanan}/status`);
    };

    // Render konten berdasarkan state
    const renderContent = () => {
        // Pilih layanan (tampilan awal)
        if (!selectedService) {
            return (
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 border border-gray-100 animate-fade-in-up relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00a3e0]/10 to-transparent rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full -ml-24 -mb-24"></div>
                        
                        {/* Floating Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-[#00a3e0] rounded-full"></div>
                            <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-[#003366] rounded-lg rotate-45"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="text-center mb-16">
                                <h3 className="text-4xl md:text-5xl font-black text-[#003366] mb-4 uppercase tracking-tight">
                                    Form Pemesanan
                                </h3>
                                <p className="text-gray-500 text-lg">
                                    Silakan memilih jenis layanan yang Anda butuhkan
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {services.map((service, idx) => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        className={`group relative flex flex-col items-center justify-center p-10 rounded-3xl border-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-white border-gray-200 hover:border-[#00a3e0] hover:-translate-y-4 hover:shadow-[#00a3e0]/20 overflow-hidden animate-fade-in-up`}
                                        style={{animationDelay: `${idx * 0.15}s`}}
                                    >
                                        {/* Glow Effect on Hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5`}></div>
                                            <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-3xl blur opacity-20`}></div>
                                        </div>
                                        
                                        <div className="relative z-10 flex flex-col items-center">
                                            {/* Icon Container with Gradient */}
                                            <div className={`relative w-32 h-32 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gradient-to-br ${service.gradient}`}>
                                                {/* Shine Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-3xl transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                <service.icon size={52} strokeWidth={2.5} className="relative z-10" />
                                            </div>
                                            
                                            {/* Text Content */}
                                            <div className="text-center">
                                                <span className="font-black text-gray-800 group-hover:text-[#003366] text-xl transition-colors block mb-2">
                                                    {service.title}
                                                </span>
                                                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                                    {service.desc}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Arrow Indicator dengan Pulse */}
                                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg animate-pulse`}>
                                                <ArrowLeft size={20} className="rotate-180" strokeWidth={3} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // --- STEP 1 (SUB): FORM INPUT SPESIFIK ---
        if (selectedService === 'rental') {
            return <FormRental onBack={() => setSelectedService(null)} onSuccess={handleOrderSuccess} />;
        }
        if (selectedService === 'barang') {
            return <FormBarang onBack={() => setSelectedService(null)} onSuccess={handleOrderSuccess} />;
        }
        if (selectedService === 'sampah') {
            return <FormSampah onBack={() => setSelectedService(null)} onSuccess={handleOrderSuccess} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section dengan Background Gradient - Full Width */}
            <div className="relative pt-32 pb-24 bg-gradient-to-br from-[#f0f9ff] via-white to-blue-50 overflow-hidden">
                {/* Animated Background Decorations */}
                <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-100 rounded-full blur-2xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* Floating Dots Animation */}
                <div className="absolute top-20 left-10 w-3 h-3 bg-[#00a3e0] rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-32 right-20 w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-[#00a3e0] rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    {/* Judul Halaman */}
                    <div className="text-center mb-6">
                        <h1 className="text-5xl md:text-6xl font-black text-[#003366] mb-4 animate-slide-up">
                            Halaman Pemesanan
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
                            Pilih layanan dan lengkapi data pemesanan Anda
                        </p>
                    </div>
                </div>
            </div>

            {/* Konten Utama dengan Background Seamless */}
            <div className="relative bg-gradient-to-b from-blue-50/50 via-white to-gray-50 py-16">
                <div className="container mx-auto px-6 md:px-12">
                    {renderContent()}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default PemesananPage;
