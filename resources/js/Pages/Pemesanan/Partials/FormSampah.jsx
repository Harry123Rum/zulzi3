import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, MapPin, Calendar, Camera, Layers, Truck } from 'lucide-react';

const FormSampah = ({ onBack, onSuccess }) => {
    const [formData, setFormData] = useState({
        layanan: 'sampah',
        jenis_sampah: '', 
        perkiraan_volume: '',
        id_armada: '',
        foto_sampah: null,
        tgl_mulai: '',
        lokasi_jemput: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') setFormData(prev => ({ ...prev, [name]: files[0] }));
        else setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key] ?? ''));

        try {
            const response = await axios.post('/api/pemesanan', data);
            if (onSuccess) onSuccess(response.data.data);
        } catch (error) {
            if (error.response?.status === 422) setErrors(error.response.data.errors);
            else alert('Error server');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = (fieldName) => `w-full pl-10 p-3 border rounded-xl focus:ring-2 outline-none transition ${errors[fieldName] ? 'border-red-500' : 'border-gray-200 focus:ring-green-500'}`;

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-bold text-green-800">Form Angkut Sampah</h3>
                    <button onClick={onBack} className="text-sm text-green-600 hover:underline">Ubah Layanan</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Jenis & Volume */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Sampah</label>
                            <div className="relative">
                                <Trash2 className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select name="jenis_sampah" value={formData.jenis_sampah} onChange={handleChange} className={inputStyle('jenis_sampah')}>
                                    <option value="">Pilih Jenis...</option>
                                    <option value="Puing Bangunan">Puing Bangunan</option>
                                    <option value="Sampah Rumah Tangga">Sampah Rumah Tangga</option>
                                    <option value="Limbah Kayu/Besi">Limbah Kayu/Besi</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Volume (m³)</label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input type="text" name="perkiraan_volume" value={formData.perkiraan_volume} onChange={handleChange} className={inputStyle('perkiraan_volume')} placeholder="Contoh: 1 Pickup" />
                            </div>
                        </div>
                    </div>

                    {/* Foto Sampah (FIXED: Added relative class) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto Tumpukan</label>
                        <div className="border-2 border-dashed border-green-200 rounded-xl p-4 text-center relative overflow-hidden hover:bg-green-50 transition cursor-pointer group">
                            <Camera className="mx-auto text-green-500 mb-2" size={24} />
                            <span className="text-sm text-gray-500">{formData.foto_sampah ? formData.foto_sampah.name : 'Upload foto sampah'}</span>
                            
                            {/* Input file full overlay */}
                            <input 
                                type="file" 
                                name="foto_sampah" 
                                onChange={handleChange} 
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" 
                            />
                        </div>
                    </div>

                    {/* Lokasi */}
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Angkut</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input type="text" name="lokasi_jemput" value={formData.lokasi_jemput} onChange={handleChange} className={inputStyle('lokasi_jemput')} placeholder="Alamat lengkap..." />
                        </div>
                    </div>

                    {/* Tanggal & Armada */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input type="date" name="tgl_mulai" value={formData.tgl_mulai} onChange={handleChange} className={inputStyle('tgl_mulai')} />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Truk</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select name="id_armada" value={formData.id_armada} onChange={handleChange} className={inputStyle('id_armada')}>
                                    <option value="">Pilih...</option>
                                    <option value="5">Dump Truck (ID:5)</option>
                                    <option value="4">Pickup Bak (ID:4)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg mt-4">
                        {isLoading ? 'Memproses...' : 'Lanjut Pembayaran'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormSampah;