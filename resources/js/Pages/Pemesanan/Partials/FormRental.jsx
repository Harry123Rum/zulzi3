import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, MapPin, X, CheckCircle2 } from 'lucide-react';

const FormRental = ({ onBack, onSuccess }) => {
    // State untuk menampung semua input form
    const [formData, setFormData] = useState({
        layanan: 'Sewa Kendaraan',
        jumlah_orang: 1, // GANTI: dari id_armada jadi jumlah_orang
        tgl_mulai: '',
        lama_rental: 1,
        lokasi_jemput: 'Cengkareng, Jakarta Barat',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // --- PERBAIKAN UTAMA: TIDAK ADA LAGI USE EFFECT UNTUK MEMANGGIL API ---

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Pastikan input angka tetap menjadi tipe number
        const normalized = (type === 'number') ? (value === '' ? '' : Number(value)) : value;

        setFormData(prev => ({ ...prev, [name]: normalized }));

        // Hapus pesan error saat user mulai mengetik ulang
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // Siapkan data untuk dikirim ke Backend
            const data = new FormData();
            data.append('layanan', formData.layanan);
            data.append('jumlah_orang', formData.jumlah_orang); // GANTI: Kirim jumlah_orang
            data.append('tgl_mulai', formData.tgl_mulai);
            data.append('lama_rental', formData.lama_rental);
            data.append('lokasi_jemput', formData.lokasi_jemput);

            // Isi nilai default untuk field yang tidak dipakai
            data.append('lokasi_tujuan', '-');

            // Kirim ke API
            const response = await axios.post('/api/pemesanan', data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            // Jika sukses, panggil fungsi onSuccess dari parent (Index.jsx)
            if (onSuccess) {
                onSuccess(response.data.data);
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    // Error Validasi (Misal: Tanggal kosong)
                    setErrors(error.response.data.errors || {});
                } else if (error.response.status === 401) {
                    alert('Anda harus login terlebih dahulu!');
                    window.location.href = '/login';
                } else {
                    // Error Server (Misal: Database mati)
                    alert(`Gagal: ${error.response.data.message || 'Terjadi kesalahan server'}`);
                }
            } else {
                alert('Tidak dapat terhubung ke server.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Helper untuk styling input biar rapi
    const inputStyle = (fieldName) =>
        `w-full pl-11 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-offset-1 outline-none transition-all ${
            errors[fieldName] 
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white hover:border-gray-300'
        }`;

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-600/5 to-transparent rounded-full -ml-24 -mb-24" />

                {/* Header Form */}
                <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6 relative z-10">
                    <div>
                        <h3 className="text-3xl font-bold text-blue-700 mb-2">
                            Form Rental Mobil
                        </h3>
                        <p className="text-gray-500 text-sm">Isi detail penyewaan kendaraan Anda</p>
                    </div>
                    <button
                        onClick={onBack}
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-blue-50"
                    >
                        <X size={16} />
                        Ubah Layanan
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                    {/* Jumlah Orang */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Jumlah Orang <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                type="number"
                                name="jumlah_orang"
                                min="1"
                                max="20"
                                value={formData.jumlah_orang}
                                onChange={handleChange}
                                className={inputStyle('jumlah_orang')}
                                placeholder="1"
                                required
                            />
                        </div>
                        {errors.jumlah_orang && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <X size={12} />
                                {errors.jumlah_orang[0]}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">Jumlah penumpang yang akan menggunakan kendaraan</p>
                    </div>

                    {/* Tanggal & Durasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Tanggal Mulai <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" size={20} />
                                <input
                                    type="date"
                                    name="tgl_mulai"
                                    value={formData.tgl_mulai}
                                    onChange={handleChange}
                                    className={inputStyle('tgl_mulai')}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            {errors.tgl_mulai && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <X size={12} />
                                    {errors.tgl_mulai[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Durasi (Hari) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="number"
                                    name="lama_rental"
                                    min="1"
                                    value={formData.lama_rental}
                                    onChange={handleChange}
                                    className={inputStyle('lama_rental')}
                                    placeholder="1"
                                    required
                                />
                            </div>
                            {errors.lama_rental && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <X size={12} />
                                    {errors.lama_rental[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Lokasi Jemput */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Lokasi Jemput <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                type="text"
                                name="lokasi_jemput"
                                value={formData.lokasi_jemput}
                                onChange={handleChange}
                                className={inputStyle('lokasi_jemput')}
                                placeholder="Cengkareng, Jakarta Barat"
                                required
                            />
                        </div>
                        {errors.lokasi_jemput && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <X size={12} />
                                {errors.lokasi_jemput[0]}
                            </p>
                        )}
                    </div>

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                Buat Pesanan & Tunggu Konfirmasi
                                <CheckCircle2 className="group-hover:translate-x-1 transition-transform" size={20} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormRental;
