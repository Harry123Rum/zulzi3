import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, MapPin, Calendar, Camera, Layers } from 'lucide-react';

const FormSampah = ({ onBack }) => {
    const [formData, setFormData] = useState({
        layanan: 'sampah', // Kunci untuk Controller
        jenis_sampah: '', // Menggantikan deskripsi_barang
        perkiraan_volume: '',
        id_armada: '', // Jenis truk
        foto_sampah: null, // File
        tgl_mulai: '',
        lokasi_jemput: '',
        total_biaya: 0, 
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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

        // Gunakan FormData untuk mengirim file
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key] ?? '');
        });

        try {
            const response = await axios.post('/api/pemesanan', data);
            
            setMessage({
                type: 'success',
                text: response.data.message || `Pemesanan Angkut Sampah berhasil dibuat.`,
            });
            // Reset form setelah sukses
            // Nanti, di backend Anda harus menangani upload file foto_sampah
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                    setMessage({ type: 'error', text: 'Terdapat kesalahan pada input form Anda. Silakan cek kembali.' });
                } else {
                    setMessage({ type: 'error', text: error.response.data.error || 'Terjadi kesalahan pada server.' });
                }
            } else {
                setMessage({ type: 'error', text: 'Koneksi gagal. Pastikan server Laravel berjalan.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderError = (field) => errors[field] && (
        <p className="text-red-500 text-xs mt-1 italic">{errors[field][0]}</p>
    );

    const inputStyle = (fieldName) => `w-full pl-10 p-3 border rounded-xl focus:ring-2 outline-none transition ${
        errors[fieldName] 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:ring-green-500'
    }`;
    
    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                {/* Header Form */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-green-800">Form Angkut Sampah</h3>
                        <p className="text-sm text-gray-500">Jasa pembuangan puing & sampah proyek</p>
                    </div>
                    <button onClick={onBack} className="text-sm font-semibold text-green-600 hover:text-green-800 hover:bg-green-50 px-4 py-2 rounded-lg transition">
                        Ubah Layanan
                    </button>
                </div>

                {/* AREA PESAN STATUS */}
                {message && (
                    <div className={`p-4 mb-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Jenis Sampah & Volume */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Sampah</label>
                            <div className="relative">
                                <Trash2 className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select name="jenis_sampah" value={formData.jenis_sampah} onChange={handleChange} className={inputStyle('jenis_sampah') + ' bg-white'}>
                                    <option value="">Pilih Jenis...</option>
                                    <option value="Puing Bangunan">Puing Bangunan</option>
                                    <option value="Sampah Rumah Tangga">Sampah Rumah Tangga</option>
                                    <option value="Limbah Kayu/Besi">Limbah Kayu/Besi</option>
                                </select>
                            </div>
                            {renderError('jenis_sampah')}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Perkiraan Volume (m³)</label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input type="text" name="perkiraan_volume" value={formData.perkiraan_volume} onChange={handleChange} placeholder="Contoh: 1 Pick up" className={inputStyle('perkiraan_volume')} />
                            </div>
                            {renderError('perkiraan_volume')}
                        </div>
                    </div>

                    {/* Foto Sampah (File Input) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto Tumpukan Sampah</label>
                        <div className="border-2 border-dashed border-green-200 rounded-xl p-6 text-center hover:bg-green-50 transition cursor-pointer group">
                            <Camera className="mx-auto text-green-400 group-hover:text-green-600 mb-2" size={32} />
                            <span className="text-sm text-gray-500">
                                {formData.foto_sampah ? formData.foto_sampah.name : 'Upload foto agar kami bisa bawa truk yang sesuai'}
                            </span>
                            <input type="file" name="foto_sampah" onChange={handleChange} className="hidden" />
                        </div>
                        {renderError('foto_sampah')}
                    </div>

                     {/* Lokasi & Tanggal */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Pengangkutan</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input type="text" name="lokasi_jemput" value={formData.lokasi_jemput} onChange={handleChange} placeholder="Alamat lengkap lokasi sampah..." className={inputStyle('lokasi_jemput')} />
                        </div>
                        {renderError('lokasi_jemput')}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rencana Tanggal Angkut</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input type="date" name="tgl_mulai" value={formData.tgl_mulai} onChange={handleChange} className={inputStyle('tgl_mulai')} />
                            </div>
                            {renderError('tgl_mulai')}
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Jenis Truk</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select name="id_armada" value={formData.id_armada} onChange={handleChange} className={inputStyle('id_armada') + ' bg-white'}>
                                    <option value="">Pilih Armada...</option>
                                    <option value="7">Dump Truck Kecil</option>
                                    <option value="8">Dump Truck Besar</option>
                                </select>
                            </div>
                            {renderError('id_armada')}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg transition transform hover:-translate-y-1 disabled:bg-gray-400">
                            {isLoading ? 'Memproses Pesanan...' : 'Lanjut Pembayaran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormSampah;