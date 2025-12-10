import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentUpload = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Data dari PaymentNew
    const { jenisPembayaran, metodeBayar, nominal, order } = location.state || {};

    const [buktiTransfer, setBuktiTransfer] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect jika tidak ada state
    if (!jenisPembayaran || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Silakan pilih jenis pembayaran terlebih dahulu</p>
                    <button
                        onClick={() => navigate(`/pemesanan/${id}/payment/new`)}
                        className="text-blue-600 hover:underline"
                    >
                        Kembali ke Pilih Pembayaran
                    </button>
                </div>
            </div>
        );
    }

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num || 0);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            // Validasi tipe file
            if (!file.type.startsWith('image/')) {
                alert('File harus berupa gambar');
                return;
            }

            setBuktiTransfer(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setBuktiTransfer(null);
        setPreview(null);
    };

    const handleSubmit = async () => {
        if (!buktiTransfer) {
            alert('Silakan upload bukti transfer terlebih dahulu');
            return;
        }

        console.log('🚀 Starting payment submission...');
        console.log('Data:', {
            id_pemesanan: id,
            jenis_pembayaran: jenisPembayaran,
            jumlah_bayar: nominal,
            metode_bayar: metodeBayar,
            file: buktiTransfer.name
        });

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('auth_token');

            if (!token) {
                alert('Anda harus login terlebih dahulu!');
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('id_pemesanan', id);
            formData.append('jenis_pembayaran', jenisPembayaran);
            formData.append('jumlah_bayar', nominal);
            formData.append('bukti_transfer', buktiTransfer);
            formData.append('metode_bayar', metodeBayar);

            console.log('📤 Sending request to /api/pembayaran...');

            const response = await axios.post('/api/pembayaran', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('✅ Response:', response.data);

            if (response.data.status === 'success') {
                alert('Bukti pembayaran berhasil dikirim! Silakan tunggu verifikasi admin.');
                // Redirect ke halaman status
                navigate(`/pemesanan/${id}/status`);
            } else {
                alert('Gagal mengirim bukti pembayaran. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('❌ Error submitting payment:', error);
            console.error('Error details:', error.response?.data);

            if (error.response?.status === 401) {
                alert('Sesi Anda telah berakhir. Silakan login kembali.');
                navigate('/login');
            } else if (error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                const errorMessage = Object.values(errors).flat().join('\n');
                alert(`Validasi gagal:\n${errorMessage}`);
            } else {
                alert(error.response?.data?.message || 'Gagal mengirim bukti pembayaran. Silakan coba lagi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const bankOptions = {
        'BCA': { name: 'Bank BCA', rekening: '1234567890', atasNama: 'Zulzi Trans' },
        'QRIS': { name: 'QRIS', rekening: 'Scan QR Code', atasNama: 'Zulzi Trans' },
    };

    const selectedBank = bankOptions[metodeBayar] || bankOptions['BCA'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/pemesanan/${id}/payment/new`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Kembali</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Upload Bukti Transfer</h1>
                    <div className="w-20"></div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-lg border p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Bukti Transfer</h2>
                    <p className="text-gray-600 mb-8">Upload bukti transfer Anda untuk verifikasi pembayaran.</p>

                    {/* Info Pembayaran */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <CheckCircle size={20} />
                            Informasi Pembayaran
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Jenis Pembayaran:</span>
                                <span className="font-bold text-gray-800">
                                    {jenisPembayaran === 'DP' ? 'DP (Down Payment)' : 'LUNAS / Pelunasan'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nominal Transfer:</span>
                                <span className="font-bold text-blue-600 text-lg">{formatRupiah(nominal)}</span>
                            </div>
                            <div className="pt-3 border-t border-blue-300">
                                <p className="text-xs text-gray-600 mb-2">
                                    {metodeBayar === 'BCA' ? 'Transfer ke rekening:' : 'Bayar dengan:'}
                                </p>
                                <div className="bg-white rounded-lg p-3 space-y-1">
                                    <p className="font-bold text-gray-800">{selectedBank.name}</p>
                                    {metodeBayar === 'BCA' ? (
                                        <>
                                            <p className="text-lg font-mono font-bold text-blue-600">{selectedBank.rekening}</p>
                                            <p className="text-xs text-gray-500">a.n. {selectedBank.atasNama}</p>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                                <span className="text-4xl">📱</span>
                                            </div>
                                            <p className="text-sm text-gray-600">Scan QR Code untuk membayar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Upload Bukti Transfer</h3>

                        {!buktiTransfer ? (
                            <label className="border-2 border-dashed border-blue-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                                    <Upload size={32} className="text-blue-600" />
                                </div>
                                <p className="font-bold text-gray-800 mb-1">Klik untuk upload foto</p>
                                <p className="text-sm text-gray-500">atau drag & drop file di sini</p>
                                <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG (Max 5MB)</p>
                            </label>
                        ) : (
                            <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-green-300"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-gray-800 mb-1">Bukti Transfer Uploaded ✓</p>
                                                <p className="text-sm text-gray-600">{buktiTransfer.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(buktiTransfer.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleRemoveFile}
                                                className="p-2 hover:bg-red-100 rounded-lg transition"
                                                title="Hapus file"
                                            >
                                                <X size={20} className="text-red-600" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleRemoveFile}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Ganti File
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Catatan */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-sm font-bold text-yellow-800 mb-2">⚠️ Catatan Penting:</p>
                        <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                            <li>Pastikan nominal transfer sesuai dengan yang tertera</li>
                            <li>Foto bukti transfer harus jelas dan terbaca</li>
                            <li>Proses verifikasi membutuhkan waktu 1-24 jam</li>
                            <li>Anda akan menerima notifikasi setelah pembayaran diverifikasi</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/pemesanan/${id}/payment/new`)}
                            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                            disabled={isSubmitting}
                        >
                            Kembali
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!buktiTransfer || isSubmitting}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Kirim Bukti Pembayaran
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentUpload;
