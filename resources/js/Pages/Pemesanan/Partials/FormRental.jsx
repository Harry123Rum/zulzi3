import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Truck, User, FileText } from 'lucide-react';

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
        `w-full pl-10 p-3 border rounded-xl focus:ring-2 outline-none transition ${
            errors[fieldName] ? 'border-red-500' : 'border-gray-200 focus:ring-blue-500'
        }`;

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

                {/* Header Form */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-blue-900">Form Rental Mobil</h3>
                        <p className="text-sm text-gray-500">Isi detail penyewaan kendaraan Anda</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-sm font-semibold text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                    >
                        Ubah Layanan
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Jumlah Orang */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Orang <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="number"
                                name="jumlah_orang"
                                min="1"
                                max="20"
                                value={formData.jumlah_orang}
                                onChange={handleChange}
                                className={inputStyle('jumlah_orang')}
                                placeholder="Masukkan jumlah penumpang"
                                required
                            />
                        </div>
                        {errors.jumlah_orang && <p className="text-red-500 text-xs mt-1">{errors.jumlah_orang[0]}</p>}
                        <p className="text-xs text-gray-500 mt-1">Jumlah penumpang yang akan menggunakan kendaraan</p>
                    </div>

                    {/* Tanggal & Durasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="date"
                                    name="tgl_mulai"
                                    value={formData.tgl_mulai}
                                    onChange={handleChange}
                                    className={inputStyle('tgl_mulai')}
                                    required
                                />
                            </div>
                            {errors.tgl_mulai && <p className="text-red-500 text-xs mt-1">{errors.tgl_mulai[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Durasi (Hari) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    name="lama_rental"
                                    min="1"
                                    value={formData.lama_rental}
                                    onChange={handleChange}
                                    className={inputStyle('lama_rental')}
                                    placeholder="Misal: 1 atau 3 hari"
                                    required
                                />
                            </div>
                            {errors.lama_rental && <p className="text-red-500 text-xs mt-1">{errors.lama_rental[0]}</p>}
                        </div>
                    </div>

                    {/* Lokasi Jemput */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Jemput <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="lokasi_jemput"
                            value={formData.lokasi_jemput}
                            onChange={handleChange}
                            className={inputStyle('lokasi_jemput')}
                            placeholder="Alamat lengkap..."
                            required
                        />
                        {errors.lokasi_jemput && <p className="text-red-500 text-xs mt-1">{errors.lokasi_jemput[0]}</p>}
                    </div>

                    {/* Tombol Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-1 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Memproses...' : 'Lanjut Pembayaran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormRental;
