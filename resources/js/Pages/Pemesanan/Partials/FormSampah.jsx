import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, MapPin, Calendar, Camera, Layers } from 'lucide-react';

const FormSampah = ({ onBack, onSuccess }) => {
    // State form
    const [formData, setFormData] = useState({
        layanan: 'Angkut Sampah',
        jenis_sampah: '',
        volume_sampah: '',
        foto_sampah: null,
        tgl_mulai: '',
        lokasi_jemput: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));

            // Generate preview untuk gambar
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const data = new FormData();
        // Masukkan semua data state ke FormData
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        // Untuk sampah, lokasi_tujuan disamakan dengan lokasi_jemput
        data.append('lokasi_tujuan', formData.lokasi_jemput);

        try {
            const response = await axios.post('/api/pemesanan', data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (onSuccess) onSuccess(response.data.data);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 401) {
                alert('Anda harus login terlebih dahulu!');
                window.location.href = '/login';
            } else {
                console.error('Error:', error);
                alert('Terjadi kesalahan server. Silakan coba lagi.');
            }
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Sampah <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Trash2 className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select name="jenis_sampah" value={formData.jenis_sampah} onChange={handleChange} className={inputStyle('jenis_sampah')} required>
                                    <option value="">Pilih Jenis...</option>
                                    <option value="Puing Bangunan">Puing Bangunan</option>
                                    <option value="Sampah Rumah Tangga">Sampah Rumah Tangga</option>
                                    <option value="Limbah Kayu/Besi">Limbah Kayu/Besi</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Volume (m³) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    name="volume_sampah"
                                    value={formData.volume_sampah}
                                    onChange={handleChange}
                                    className={inputStyle('volume_sampah')}
                                    placeholder="Contoh: 5 atau 2.5"
                                    step="0.1"
                                    min="0.1"
                                    max="100"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-1">Masukkan volume dalam meter kubik (m³)</p>
                            {errors.volume_sampah && <p className="text-red-500 text-xs mt-1">{errors.volume_sampah[0]}</p>}
                        </div>
                    </div>

                    {/* Foto Sampah */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto Tumpukan <span className="text-red-500">*</span></label>
                        {imagePreview ? (
                            <div className="relative bg-green-50 rounded-xl border-2 border-green-200 p-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-64 object-contain rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, foto_sampah: null }));
                                        setImagePreview(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 shadow-md"
                                >
                                    Hapus
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">{formData.foto_sampah?.name}</p>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-green-200 rounded-xl p-4 text-center relative overflow-hidden hover:bg-green-50 transition cursor-pointer group">
                                <Camera className="mx-auto text-green-500 mb-2" size={24} />
                                <span className="text-sm text-gray-500">Upload foto sampah</span>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, JPEG (Max 5MB)</p>

                                <input
                                    type="file"
                                    name="foto_sampah"
                                    onChange={handleChange}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                    accept="image/jpeg,image/png,image/jpg"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Lokasi */}
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Angkut <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input type="text" name="lokasi_jemput" value={formData.lokasi_jemput} onChange={handleChange} className={inputStyle('lokasi_jemput')} placeholder="Alamat lengkap pengambilan..." required />
                        </div>
                    </div>

                    {/* Tanggal */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input type="date" name="tgl_mulai" value={formData.tgl_mulai} onChange={handleChange} className={inputStyle('tgl_mulai')} required />
                        </div>
                        {errors.tgl_mulai && <p className="text-red-500 text-xs mt-1">{errors.tgl_mulai[0]}</p>}
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg mt-4">
                        {isLoading ? 'Sedang Memproses...' : 'Buat Pesanan & Tunggu Konfirmasi'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormSampah;
