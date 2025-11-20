import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Truck, User, FileText } from 'lucide-react';

const FormRental = ({ onBack }) => {
    // State untuk menampung semua input form
    const [formData, setFormData] = useState({
        layanan: 'rental', // Kunci untuk Controller
        id_armada: '',
        tgl_mulai: '',
        lama_rental: 1,
        opsi_supir: 'with_driver',
        catatan: '',
        // Asumsi data user sudah ada atau dikirim dari parent
        lokasi_jemput: 'Cengkareng, Jakarta Barat', // Nilai default mock
        lokasi_tujuan: 'Jakarta', // Nilai default mock
        total_biaya: 0, // Dihitung di backend/admin
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); // Pesan sukses/error
    const [errors, setErrors] = useState({}); // List error validasi dari Laravel

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Hapus error saat user mulai mengetik
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
        setMessage(null);
        setErrors({});

        try {
            // Mengirim data ke endpoint API Laravel yang sudah kita buat
            const response = await axios.post('/api/pemesanan', formData);
            
            // Jika sukses (Status 201 Created)
            setMessage({
                type: 'success',
                text: response.data.message || `Pemesanan ${response.data.order_id} berhasil dibuat.`,
            });
            // Reset form setelah sukses
            setFormData(prev => ({ 
                ...prev, 
                tgl_mulai: '', 
                lama_rental: 1, 
                opsi_supir: 'with_driver', 
                catatan: '' 
            })); 

            // Nanti, arahkan user ke halaman konfirmasi/pembayaran (Step 2)

        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    // Error Validasi dari Laravel
                    setErrors(error.response.data.errors);
                    setMessage({
                        type: 'error',
                        text: 'Terdapat kesalahan pada input form Anda. Silakan cek kembali.',
                    });
                } else {
                    // Error Server Lainnya
                    setMessage({
                        type: 'error',
                        text: error.response.data.error || 'Terjadi kesalahan pada server. Coba lagi nanti.',
                    });
                }
            } else {
                setMessage({
                    type: 'error',
                    text: 'Koneksi gagal. Pastikan server Laravel (php artisan serve) berjalan.',
                });
            }
            console.error('Error saat submit form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi pembantu untuk menampilkan pesan error
    const renderError = (field) => {
        return errors[field] && (
            <p className="text-red-500 text-xs mt-1 italic">{errors[field][0]}</p>
        );
    };

    // Styling untuk input field
    const inputStyle = (fieldName) => `w-full pl-10 p-3 border rounded-xl focus:ring-2 outline-none transition ${
        errors[fieldName] 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:ring-blue-500'
    }`;
    
    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                {/* Header Form */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
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

                {/* AREA PESAN STATUS */}
                {message && (
                    <div className={`p-4 mb-4 rounded-lg text-sm font-medium ${
                        message.type === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Pilih Armada (id_armada) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Armada</label>
                        <div className="relative">
                            <Truck className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select 
                                name="id_armada"
                                value={formData.id_armada}
                                onChange={handleChange}
                                className={inputStyle('id_armada') + ' bg-gray-50'}
                            >
                                <option value="">Pilih jenis mobil...</option>
                                {/* Nanti data ini di-fetch dari API Laravel */}
                                <option value="1">Avanza (ID:1)</option> 
                                <option value="2">Innova Reborn (ID:2)</option>
                                <option value="3">Truk Engkel (ID:3)</option>
                            </select>
                        </div>
                        {renderError('id_armada')}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Tanggal Mulai */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai Sewa</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input 
                                    type="date"
                                    name="tgl_mulai"
                                    value={formData.tgl_mulai}
                                    onChange={handleChange}
                                    className={inputStyle('tgl_mulai')}
                                />
                            </div>
                            {renderError('tgl_mulai')}
                        </div>

                        {/* Durasi Sewa */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Durasi Sewa (Hari)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input 
                                    type="number"
                                    name="lama_rental"
                                    value={formData.lama_rental}
                                    onChange={handleChange}
                                    placeholder="Contoh: 2" 
                                    className={inputStyle('lama_rental')} 
                                />
                            </div>
                            {renderError('lama_rental')}
                        </div>
                    </div>

                    {/* Opsi Supir */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Layanan Supir</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select 
                                name="opsi_supir"
                                value={formData.opsi_supir}
                                onChange={handleChange}
                                className={inputStyle('opsi_supir') + ' bg-white'}
                            >
                                <option value="with_driver">Dengan Supir</option>
                                <option value="lepas_kunci">Lepas Kunci</option>
                            </select>
                        </div>
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Tambahan</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                            <textarea 
                                rows="3" 
                                name="catatan"
                                value={formData.catatan}
                                onChange={handleChange}
                                placeholder="Contoh: Jemput di lobby hotel..." 
                                className={inputStyle('catatan')}
                            ></textarea>
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-1 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Memproses Pesanan...' : 'Lanjut Pembayaran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormRental;