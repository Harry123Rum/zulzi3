import React, { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import Stepper from '../../Components/Pemesanan/Stepper';
import FormRental from './Partials/FormRental';
import FormBarang from './Partials/FormBarang';
import FormSampah from './Partials/FormSampah';
import { Car, Truck, Trash2, ArrowLeft, CheckCircle, Copy, CreditCard } from 'lucide-react';

const PemesananPage = () => {
    const [step, setStep] = useState(1); // 1: Form Input, 2: Ringkasan Payment
    const [selectedService, setSelectedService] = useState(null);
    const [orderData, setOrderData] = useState(null); // Menyimpan data pesanan yang baru dibuat

    // Data tombol layanan
    const services = [
        { id: 'rental', title: 'RENTAL MOBIL', icon: Car, color: 'bg-blue-400', borderColor: 'border-blue-400' },
        { id: 'barang', title: 'ANGKUT BARANG', icon: Truck, color: 'bg-blue-800', borderColor: 'border-blue-800' },
        { id: 'sampah', title: 'ANGKUT SAMPAH', icon: Trash2, color: 'bg-green-600', borderColor: 'border-green-600' },
    ];

    // Fungsi callback saat form sukses disubmit
    const handleOrderSuccess = (data) => {
        setOrderData(data); // Simpan data pesanan
        setStep(2); // Pindah ke Step 2
        window.scrollTo(0, 0); // Scroll ke atas
    };

    const renderContent = () => {
        // --- STEP 2: RINGKASAN PEMBAYARAN (Sesuai Figma) ---
        if (step === 2) {
            return (
                <div className="max-w-3xl mx-auto animate-fade-in-up">
                    {/* Header Sukses */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-600 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-800">Pesanan Berhasil Dibuat!</h3>
                        <p className="text-green-600">ID Pesanan: <span className="font-bold">#{orderData?.id_pemesanan || '---'}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Kolom Kiri: Detail Pesanan */}
                        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-600 rounded-full"></span> Detail Pesanan
                            </h4>
                            
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex justify-between border-b pb-2">
                                    <span>Layanan</span>
                                    <span className="font-bold text-gray-800 uppercase">{selectedService || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span>Tanggal</span>
                                    <span className="font-bold text-gray-800">{orderData?.tgl_mulai || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span>Lokasi Jemput</span>
                                    <span className="font-bold text-gray-800 text-right max-w-[60%]">{orderData?.lokasi_jemput || '-'}</span>
                                </div>
                                {orderData?.total_biaya > 0 ? (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-bold text-lg">Total Biaya</span>
                                        <span className="font-bold text-xl text-blue-600">Rp {Number(orderData.total_biaya).toLocaleString('id-ID')}</span>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-700 text-center text-xs mt-4">
                                        Total biaya sedang dihitung oleh Admin. Silakan tunggu konfirmasi WhatsApp.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Kolom Kanan: Instruksi Pembayaran */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-600"/> Pembayaran
                            </h4>
                            
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                                <p className="text-xs text-gray-500 mb-1">Bank Transfer (BCA)</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg text-gray-800">123-456-7890</span>
                                    <button className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Copy size={16}/></button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">a.n. Zulzi Trans Official</p>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-4">Atau Scan QRIS di bawah ini:</p>
                                <div className="w-32 h-32 bg-gray-200 mx-auto rounded-lg flex items-center justify-center text-gray-400 mb-4">
                                    [QRIS IMG]
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                className="w-full bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition shadow-md mb-2"
                            >
                                Konfirmasi via WhatsApp
                            </button>
                            <button 
                                onClick={() => window.location.href = '/dashboard-user'}
                                className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                            >
                                Cek Status di Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // --- STEP 1: PILIH LAYANAN (Menu Awal) ---
        if (!selectedService) {
            return (
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-5xl mx-auto mt-6 border border-gray-100 min-h-[450px] flex flex-col items-center justify-center animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-blue-900 mb-2 uppercase tracking-wide">Form Pemesanan</h3>
                    <p className="text-gray-500 mb-10">Silakan memilih jenis layanan yang Anda butuhkan</p>
                    <div className="w-full max-w-3xl flex flex-wrap justify-center gap-6">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedService(service.id)}
                                className={`group flex flex-col items-center justify-center p-6 rounded-2xl border-2 w-full md:w-[45%] hover:shadow-xl transition-all duration-300 bg-white border-gray-100 hover:border-opacity-50 hover:${service.borderColor}`}
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 shadow-md transform group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                                    <service.icon size={36} strokeWidth={2} />
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-blue-900 text-lg transition-colors">{service.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // --- STEP 1 (SUB): FORM INPUT (Dengan Callback onSuccess) ---
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
        <MainLayout>
            <div className="mb-6 pt-4 max-w-5xl mx-auto">
                <a href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Kembali ke Beranda
                </a>
            </div>
            {/* Judul Halaman */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-blue-900">Halaman Pemesanan</h2>
                <p className="text-gray-500 mt-2">Lengkapi data pemesanan & lakukan pembayaran</p>
            </div>
            {/* Stepper */}
            <Stepper currentStep={step} />
            
            <div className="mb-20">
                {renderContent()}
            </div>
        </MainLayout>
    );
};

export default PemesananPage;