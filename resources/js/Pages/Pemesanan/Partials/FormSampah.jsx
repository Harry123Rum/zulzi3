import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Trash2, MapPin, Calendar, Upload, Layers, X, CheckCircle2 } from 'lucide-react';

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
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            handleFileSelect(files[0]);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        
        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar (JPG, PNG, JPEG)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }

        setFormData(prev => ({ ...prev, foto_sampah: file }));

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
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

    const inputStyle = (fieldName) =>
        `w-full pl-11 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-offset-1 outline-none transition-all ${
            errors[fieldName] 
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-200 focus:border-green-600 focus:ring-green-600/20 bg-white hover:border-gray-300'
        }`;

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-transparent rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-700/5 to-transparent rounded-full -ml-24 -mb-24" />

                {/* HEADER */}
                <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6 relative z-10">
                    <div>
                        <h3 className="text-3xl font-bold text-green-800 mb-2">
                            Form Angkut Sampah
                        </h3>
                        <p className="text-gray-500 text-sm">Isi detail pengangkutan sampah Anda</p>
                    </div>
                    <button
                        onClick={onBack}
                        type="button"
                        className="text-sm text-green-600 hover:text-green-800 font-semibold transition-colors flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-green-50"
                    >
                        <X size={16} />
                        Ubah Layanan
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {/* Jenis & Volume */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Jenis Sampah <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <Trash2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors pointer-events-none" size={20} />
                                <select 
                                    name="jenis_sampah" 
                                    value={formData.jenis_sampah} 
                                    onChange={handleChange} 
                                    className={inputStyle('jenis_sampah')} 
                                    required
                                >
                                    <option value="">Pilih Jenis...</option>
                                    <option value="Puing Bangunan">Puing Bangunan</option>
                                    <option value="Sampah Rumah Tangga">Sampah Rumah Tangga</option>
                                    <option value="Limbah Kayu/Besi">Limbah Kayu/Besi</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            {errors.jenis_sampah && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <X size={12} />
                                    {errors.jenis_sampah[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Volume (m³) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
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
                            <p className="text-xs text-gray-500">Masukkan volume dalam meter kubik (m³)</p>
                            {errors.volume_sampah && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <X size={12} />
                                    {errors.volume_sampah[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Foto Sampah */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Foto Tumpukan <span className="text-red-500">*</span>
                        </label>

                        {imagePreview ? (
                            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-6 group hover:border-green-500/50 transition-all">
                                <div className="relative overflow-hidden rounded-xl">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-72 object-cover rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, foto_sampah: null }));
                                        setImagePreview(null);
                                    }}
                                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all flex items-center gap-2"
                                >
                                    <X size={16} />
                                    <span className="text-sm font-semibold">Hapus</span>
                                </button>
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                        {formData.foto_sampah?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {(formData.foto_sampah?.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative flex flex-col justify-center items-center gap-4 w-full h-56 border-3 border-dashed rounded-2xl cursor-pointer transition-all ${
                                    isDragging
                                        ? 'border-green-600 bg-green-600/5 scale-[1.02]'
                                        : 'border-gray-300 hover:border-green-600 hover:bg-gray-50'
                                }`}
                            >
                                <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-700/10 rounded-2xl">
                                    <Upload className={`transition-colors ${isDragging ? 'text-green-600' : 'text-gray-400'}`} size={40} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-base font-semibold text-gray-700">
                                        {isDragging ? 'Lepaskan file di sini' : 'Klik atau drag & drop foto'}
                                    </p>
                                    <p className="text-sm text-gray-500">JPG, PNG, JPEG (Maks. 5MB)</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="foto_sampah"
                                    onChange={handleChange}
                                    accept="image/jpeg,image/png,image/jpg"
                                    className="hidden"
                                    required
                                />
                            </div>
                        )}
                        {errors.foto_sampah && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <X size={12} />
                                {errors.foto_sampah[0]}
                            </p>
                        )}
                    </div>

                    {/* Lokasi */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Lokasi Angkut <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                            <input 
                                type="text" 
                                name="lokasi_jemput" 
                                value={formData.lokasi_jemput} 
                                onChange={handleChange} 
                                className={inputStyle('lokasi_jemput')} 
                                placeholder="Alamat lengkap pengambilan..." 
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

                    {/* Tanggal */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Tanggal Pengambilan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors pointer-events-none" size={20} />
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

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
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

export default FormSampah;
