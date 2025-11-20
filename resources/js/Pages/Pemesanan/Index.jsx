import React, { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import Stepper from '../../Components/Pemesanan/Stepper';
import FormRental from './Partials/FormRental';
import FormBarang from './Partials/FormBarang';
import FormSampah from './Partials/FormSampah';
import { Car, Truck, Trash2, ArrowLeft } from 'lucide-react';

const PemesananPage = () => {
    const [step, setStep] = useState(1); // 1: Pemesanan, 2: Pembayaran, dst
    const [selectedService, setSelectedService] = useState(null); // null = Tampilkan Pilihan

    // Data tombol layanan
    const services = [
        { id: 'rental', title: 'RENTAL MOBIL', icon: Car, color: 'bg-blue-400', borderColor: 'border-blue-400' },
        { id: 'barang', title: 'ANGKUT BARANG', icon: Truck, color: 'bg-blue-800', borderColor: 'border-blue-800' },
        { id: 'sampah', title: 'ANGKUT SAMPAH', icon: Trash2, color: 'bg-green-600', borderColor: 'border-green-600' },
    ];

    // --- LOGIKA TAMPILAN (CONDITIONAL RENDERING) ---
    const renderContent = () => {
        // 1. Jika belum pilih layanan -> Tampilkan Grid Tombol
        if (!selectedService) {
            return (
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-5xl mx-auto mt-6 border border-gray-100 min-h-[450px] flex flex-col items-center justify-center animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-blue-900 mb-2 uppercase tracking-wide">Form Pemesanan</h3>
                    <p className="text-gray-500 mb-10">Silakan memilih jenis layanan yang Anda butuhkan</p>

                    <div className="w-full max-w-3xl flex flex-wrap justify-center gap-6">
                        {/* Render Tombol Layanan */}
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedService(service.id)}
                                className={`
                                    group flex flex-col items-center justify-center p-6 rounded-2xl border-2 
                                    w-full md:w-[45%] hover:shadow-xl transition-all duration-300 bg-white
                                    border-gray-100 hover:border-opacity-50 hover:${service.borderColor}
                                `}
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 shadow-md transform group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                                    <service.icon size={36} strokeWidth={2} />
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-blue-900 text-lg transition-colors">
                                    {service.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // 2. Jika sudah pilih layanan -> Tampilkan Form Spesifik
        if (selectedService === 'rental') {
            return <FormRental onBack={() => setSelectedService(null)} />;
        }
        if (selectedService === 'barang') {
            return <FormBarang onBack={() => setSelectedService(null)} />;
        }
        if (selectedService === 'sampah') {
            return <FormSampah onBack={() => setSelectedService(null)} />;
        }
    };

    return (
        <MainLayout>
            {/* Header & Navigasi Atas */}
            <div className="mb-6 pt-4 max-w-5xl mx-auto">
                <a href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Kembali ke Beranda
                </a>
            </div>

            {/* Judul Halaman */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-blue-900">Halaman Pemesanan</h2>
                <p className="text-gray-500 mt-2">Lengkapi formulir di bawah untuk menyelesaikan pesanan Anda</p>
            </div>

            {/* Stepper (Indikator Langkah) */}
            <Stepper currentStep={step} />

            {/* Area Konten Utama (Berubah dinamis sesuai state) */}
            <div className="mb-20">
                {renderContent()}
            </div>

        </MainLayout>
    );
};

export default PemesananPage;