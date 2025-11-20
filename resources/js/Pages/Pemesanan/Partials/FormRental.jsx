// resources/js/Pages/Pemesanan/Partials/FormRental.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Truck, User, FileText } from 'lucide-react';

const FormRental = ({ onBack, onSuccess }) => {
    const [formData, setFormData] = useState({
        layanan: 'rental',
        id_armada: '',
        tgl_mulai: '',
        lama_rental: 1,
        opsi_supir: 'with_driver',
        catatan: '',
        lokasi_jemput: 'Cengkareng',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Pastikan numeric tetap number
        const normalized = (type === 'number') ? (value === '' ? '' : Number(value)) : value;
        setFormData(prev => ({ ...prev, [name]: normalized }));
    };

    // Simple client-side validation sebelum submit
    const validateBeforeSubmit = () => {
        const err = {};
        if (!formData.tgl_mulai) err.tgl_mulai = ['Tanggal mulai wajib diisi.'];
        if (!formData.lokasi_jemput) err.lokasi_jemput = ['Lokasi jemput wajib diisi.'];
        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const clientErr = validateBeforeSubmit();
        if (Object.keys(clientErr).length) {
            setErrors(clientErr);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsLoading(true);

        try {
            // Gunakan FormData untuk konsistensi (sama dengan FormBarang/FormSampah)
            const data = new FormData();
            // Append only relevant keys
            data.append('layanan', formData.layanan);
            data.append('id_armada', formData.id_armada ?? '');
            data.append('tgl_mulai', formData.tgl_mulai);
            data.append('lama_rental', formData.lama_rental ?? '');
            data.append('opsi_supir', formData.opsi_supir ?? '');
            data.append('catatan', formData.catatan ?? '');
            data.append('lokasi_jemput', formData.lokasi_jemput ?? '');
            data.append('lokasi_tujuan', '-');
            data.append('deskripsi_barang', '-');
            data.append('est_berat_ton', 0);

            // NOTE: tidak ada foto untuk rental sekarang, tapi FormData tetap aman
            const response = await axios.post('/api/pemesanan', data);
            if (onSuccess) {
                onSuccess(response.data.data);
            }
        } catch (error) {
            // Lebih informatif: tampilkan pesan validasi atau pesan server
            if (error.response) {
                if (error.response.status === 422) {
                    // Validation errors from backend
                    setErrors(error.response.data.errors || {});
                } else {
                    // server error (500) atau lainnya
                    console.error('Server error response:', error.response);
                    const serverMessage = error.response.data?.message || `Server error (status ${error.response.status})`;
                    alert(`Gagal: ${serverMessage}`);
                }
            } else if (error.request) {
                // No response - network / CORS / server didn't reply
                console.error('No response received:', error.request);
                alert('Tidak mendapat respons dari server. Periksa koneksi atau CORS.');
            } else {
                console.error('Request error:', error.message);
                alert(`Terjadi kesalahan: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = (fieldName) =>
        `w-full pl-10 p-3 border rounded-xl focus:ring-2 outline-none transition ${
            errors[fieldName] ? 'border-red-500' : 'border-gray-200 focus:ring-blue-500'
        }`;

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-bold text-blue-900">Form Rental Mobil</h3>
                    <button onClick={onBack} className="text-sm text-blue-500 hover:underline">Ubah Layanan</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Pilih Armada */}
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
                                <option value="1">Avanza (ID:1)</option>
                                <option value="2">Innova Reborn (ID:2)</option>
                            </select>
                        </div>
                        {errors.id_armada && <p className="text-red-500 text-xs mt-1">{errors.id_armada[0]}</p>}
                    </div>

                    {/* Tanggal & Durasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai</label>
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
                            {errors.tgl_mulai && <p className="text-red-500 text-xs mt-1">{errors.tgl_mulai[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Durasi (Hari)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    name="lama_rental"
                                    min="1"
                                    value={formData.lama_rental}
                                    onChange={handleChange}
                                    className={inputStyle('lama_rental')}
                                />
                            </div>
                            {errors.lama_rental && <p className="text-red-500 text-xs mt-1">{errors.lama_rental[0]}</p>}
                        </div>
                    </div>

                    {/* Opsi Supir & Lokasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Jemput</label>
                            <input
                                type="text"
                                name="lokasi_jemput"
                                value={formData.lokasi_jemput}
                                onChange={handleChange}
                                className={inputStyle('lokasi_jemput')}
                                placeholder="Alamat lengkap..."
                            />
                            {errors.lokasi_jemput && <p className="text-red-500 text-xs mt-1">{errors.lokasi_jemput[0]}</p>}
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
                                className={inputStyle('catatan')}
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit */}
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
