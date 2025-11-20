import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Package, Scale, Camera, Truck } from 'lucide-react';

const FormBarang = ({ onBack, onSuccess }) => {
    const [formData, setFormData] = useState({
        layanan: 'barang',
        deskripsi_barang: '',
        est_berat_ton: '',
        id_armada: '',
        foto_barang: null,
        tgl_mulai: '',
        lokasi_jemput: '',
        lokasi_tujuan: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error server');
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
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative z-10">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-bold text-blue-900">Form Angkut Barang</h3>
                    <button
                        onClick={onBack}
                        type="button"
                        className="text-sm text-blue-500 hover:underline z-20 relative"
                    >
                        Ubah Layanan
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* BARANG & BERAT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Barang</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="deskripsi_barang"
                                    value={formData.deskripsi_barang}
                                    onChange={handleChange}
                                    className={inputStyle('deskripsi_barang')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Estimasi Berat (Ton)</label>
                            <div className="relative">
                                <Scale className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    name="est_berat_ton"
                                    value={formData.est_berat_ton}
                                    onChange={handleChange}
                                    step="0.1"
                                    className={inputStyle('est_berat_ton')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* FOTO BARANG - versi aman */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto Barang</label>

                        <label className="flex flex-col justify-center items-center gap-2 w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                            <Camera className="text-gray-400" size={24} />

                            <span className="text-sm text-gray-500">
                                {formData.foto_barang ? formData.foto_barang.name : 'Upload foto barang'}
                            </span>

                            <input
                                type="file"
                                name="foto_barang"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* LOKASI */}
                    <div className="space-y-4 bg-blue-50 p-4 rounded-xl">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-blue-500" size={20} />
                            <input
                                type="text"
                                name="lokasi_jemput"
                                value={formData.lokasi_jemput}
                                onChange={handleChange}
                                placeholder="Lokasi Jemput"
                                className={inputStyle('lokasi_jemput')}
                            />
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-red-500" size={20} />
                            <input
                                type="text"
                                name="lokasi_tujuan"
                                value={formData.lokasi_tujuan}
                                onChange={handleChange}
                                placeholder="Lokasi Tujuan"
                                className={inputStyle('lokasi_tujuan')}
                            />
                        </div>
                    </div>

                    {/* TANGGAL & ARMADA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal</label>
                            <input
                                type="date"
                                name="tgl_mulai"
                                value={formData.tgl_mulai}
                                onChange={handleChange}
                                className={inputStyle('tgl_mulai')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Truk</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select
                                    name="id_armada"
                                    value={formData.id_armada}
                                    onChange={handleChange}
                                    className={inputStyle('id_armada')}
                                >
                                    <option value="">Pilih...</option>
                                    <option value="3">Engkel Box (ID:3)</option>
                                    <option value="4">Pickup (ID:4)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-800 text-white py-4 rounded-xl font-bold hover:bg-blue-900 transition shadow-lg mt-4"
                    >
                        {isLoading ? 'Memproses...' : 'Lanjut Pembayaran'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormBarang;