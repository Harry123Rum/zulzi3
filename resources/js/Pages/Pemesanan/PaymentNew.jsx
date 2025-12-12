import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, CreditCard, Building2, CheckCircle, ChevronRight } from 'lucide-react';

const PaymentNew = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isPelunasan = searchParams.get('type') === 'pelunasan';

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jenisPembayaran, setJenisPembayaran] = useState(isPelunasan ? 'LUNAS' : 'DP');
    const [metodeBayar, setMetodeBayar] = useState('BCA'); // Default BCA

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/pemesanan/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data.data);
        } catch (error) {
            console.error('Error fetching order:', error);
            alert('Gagal memuat data pesanan');
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num || 0);
    };

    const handleNext = () => {
        if (!order) return;

        const totalTagihan = Number(order.total_biaya) || 0;
        const nominalDP = Number(order.dp_amount) || 0;
        const pembayaranList = Array.isArray(order.pembayaran) ? order.pembayaran : [];
        const verifiedPayments = pembayaranList.filter(p => p.status_pembayaran === 'Verified');
        const sudahDibayar = verifiedPayments.reduce((sum, p) => sum + Number(p.jumlah_bayar || 0), 0);
        const sisaPembayaran = Math.max(0, totalTagihan - sudahDibayar);

        const nominal = jenisPembayaran === 'DP' ? nominalDP : sisaPembayaran;

        // Navigate dengan state
        navigate(`/pemesanan/${id}/payment/upload`, {
            state: {
                jenisPembayaran,
                metodeBayar, // 'BCA' atau 'QRIS'
                nominal,
                order
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Pesanan tidak ditemukan</p>
                    <Link to="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
                </div>
            </div>
        );
    }

    const totalTagihan = Number(order.total_biaya) || 0;
    const nominalDP = Number(order.dp_amount) || 0;
    const pembayaranList = Array.isArray(order.pembayaran) ? order.pembayaran : [];

    // Hitung sudah dibayar (HANYA dari pembayaran Terverifikasi)
    const status = order.status_pemesanan;
    const verifiedPayments = pembayaranList.filter(p => p.status_pembayaran === 'Terverifikasi');
    const sudahDibayar = verifiedPayments.reduce((sum, p) => sum + Number(p.jumlah_bayar || 0), 0);
    const sisaPembayaran = Math.max(0, totalTagihan - sudahDibayar);

    const nominalYangHarusDibayar = jenisPembayaran === 'DP' ? nominalDP : sisaPembayaran;

    // Data rekening BCA
    const bankAccount = {
        name: 'Bank BCA',
        rekening: '1234567890',
        atasNama: 'Zulzi Trans'
    };

    // Metode pembayaran options
    const paymentMethods = [
        {
            code: 'BCA',
            name: 'Transfer Bank',
            icon: '🏦',
            description: 'Transfer ke rekening BCA'
        },
        {
            code: 'QRIS',
            name: 'QRIS',
            icon: '📱',
            description: 'Scan QR Code untuk bayar'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/pemesanan/${id}/status`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Kembali</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Konfirmasi Pembayaran</h1>
                    <div className="w-20"></div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-lg border p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Pembayaran</h2>
                    <p className="text-gray-600 mb-8">Silakan pilih jenis pembayaran dan upload bukti.</p>

                    {/* Jenis Pembayaran */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-800 mb-4">Jenis Pembayaran</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Tagihan:</span>
                                <span className="font-bold text-gray-800">{formatRupiah(totalTagihan)}</span>
                            </div>
                            {sudahDibayar > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-600">Sudah Dibayar:</span>
                                    <span className="font-bold text-green-600">- {formatRupiah(sudahDibayar)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm pt-2 border-t border-blue-300">
                                <span className="text-orange-600 font-bold">Sisa Pembayaran:</span>
                                <span className="font-bold text-orange-600">{formatRupiah(sisaPembayaran)}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            {/* DP Option */}
                            <label className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition ${
                                jenisPembayaran === 'DP'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            } ${isPelunasan ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input
                                    type="radio"
                                    name="jenis"
                                    value="DP"
                                    checked={jenisPembayaran === 'DP'}
                                    onChange={(e) => !isPelunasan && setJenisPembayaran(e.target.value)}
                                    disabled={isPelunasan}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-gray-800">DP (Down Payment)</span>
                                        {jenisPembayaran === 'DP' && <CheckCircle size={20} className="text-blue-600" />}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Bayar uang muka terlebih dahulu</p>
                                    <div className="bg-white border border-blue-200 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Yang harus dibayar sekarang:</p>
                                        <p className="text-lg font-bold text-blue-600">{formatRupiah(nominalDP)}</p>
                                    </div>
                                </div>
                            </label>

                            {/* LUNAS Option */}
                            <label className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition ${
                                jenisPembayaran === 'LUNAS'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                                <input
                                    type="radio"
                                    name="jenis"
                                    value="LUNAS"
                                    checked={jenisPembayaran === 'LUNAS'}
                                    onChange={(e) => setJenisPembayaran(e.target.value)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-gray-800">
                                            {isPelunasan ? 'Pelunasan' : 'LUNAS (Full Payment)'}
                                        </span>
                                        {jenisPembayaran === 'LUNAS' && <CheckCircle size={20} className="text-blue-600" />}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {isPelunasan ? 'Bayar sisa pelunasan' : 'Bayar langsung semua tagihan'}
                                    </p>
                                    <div className="bg-white border border-blue-200 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Yang harus dibayar sekarang:</p>
                                        <p className="text-lg font-bold text-blue-600">{formatRupiah(sisaPembayaran)}</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Pilih Metode Pembayaran */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
                        <p className="text-sm text-gray-600 mb-4">Pilih metode pembayaran:</p>

                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.code}
                                    className={`border-2 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition ${
                                        metodeBayar === method.code
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="metode"
                                        value={method.code}
                                        checked={metodeBayar === method.code}
                                        onChange={(e) => setMetodeBayar(e.target.value)}
                                    />
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                        {method.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{method.name}</p>
                                        <p className="text-sm text-gray-600">{method.description}</p>
                                        {method.code === 'BCA' && (
                                            <div className="mt-2 bg-white rounded-lg p-2 text-xs border border-blue-200">
                                                <p className="text-gray-500">Rekening: <span className="font-mono font-bold text-blue-600">{bankAccount.rekening}</span></p>
                                                <p className="text-gray-500">a.n. {bankAccount.atasNama}</p>
                                            </div>
                                        )}
                                    </div>
                                    {metodeBayar === method.code && <CheckCircle size={20} className="text-blue-600" />}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                        <p className="text-sm text-gray-600 mb-3">Yang harus dibayar sekarang:</p>
                        <p className="text-3xl font-bold text-blue-600 mb-4">{formatRupiah(nominalYangHarusDibayar)}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard size={16} />
                            <span>
                                {metodeBayar === 'BCA'
                                    ? `Transfer ke: BCA - ${bankAccount.rekening}`
                                    : 'Scan QR Code di halaman berikutnya'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/pemesanan/${id}/status`)}
                            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                        >
                            Kembali
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex justify-center items-center gap-2"
                        >
                            Konfirmasi & Upload Bukti
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentNew;