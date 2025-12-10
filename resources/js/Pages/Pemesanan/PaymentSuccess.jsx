import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Home, MessageCircle, User, Phone } from 'lucide-react';

const PaymentSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();

        // Auto-refresh setiap 3 detik untuk update status pembayaran real-time
        const interval = setInterval(() => {
            fetchOrder(true); // silent refresh
        }, 3000);

        return () => clearInterval(interval);
    }, [id]);

    const fetchOrder = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/pemesanan/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data.data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num || 0);
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
    const pembayaranList = Array.isArray(order.pembayaran) ? order.pembayaran : [];

    // Di success page, hanya hitung pembayaran yang Verified
    const verifiedPayments = pembayaranList.filter(p => p.status_pembayaran === 'Verified');
    const totalTerbayar = verifiedPayments.reduce((sum, p) => sum + Number(p.jumlah_bayar || 0), 0);

    // Pisahkan pembayaran DP dan LUNAS (yang Verified)
    const dpPayment = verifiedPayments.find(p => p.jenis_pembayaran === 'DP');
    const lunasPayment = verifiedPayments.find(p => p.jenis_pembayaran === 'LUNAS');

    const supirPhone = order.supir?.no_telepon || '';
    const waLink = supirPhone ? `https://wa.me/62${supirPhone.replace(/^0/, '')}` : '#';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-200 overflow-hidden animate-fade-in-up">
                    {/* Header dengan Gradient */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                            <CheckCircle size={48} className="text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Pembayaran Lunas!</h1>
                        <p className="text-green-100">Semua pembayaran telah terverifikasi. Pesanan Anda akan segera diproses!</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Ringkasan Pembayaran */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                            <h3 className="font-bold text-gray-800 mb-4 text-center">Ringkasan Pembayaran</h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Tagihan</span>
                                    <span className="font-bold text-gray-800">{formatRupiah(totalTagihan)}</span>
                                </div>

                                {/* Tampilkan breakdown jika ada DP */}
                                {dpPayment && (
                                    <>
                                        <div className="border-t border-gray-200 pt-3">
                                            <p className="text-xs text-gray-500 mb-2">Detail Pembayaran:</p>
                                        </div>
                                        <div className="flex justify-between text-sm bg-white rounded-lg p-3 border border-blue-200">
                                            <span className="text-blue-700 flex items-center gap-2">
                                                <CheckCircle size={16} />
                                                DP (Down Payment)
                                            </span>
                                            <span className="font-bold text-blue-700">{formatRupiah(dpPayment.jumlah_bayar)}</span>
                                        </div>
                                    </>
                                )}

                                {lunasPayment && dpPayment && (
                                    <div className="flex justify-between text-sm bg-white rounded-lg p-3 border border-green-200">
                                        <span className="text-green-700 flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            Pelunasan
                                        </span>
                                        <span className="font-bold text-green-700">{formatRupiah(lunasPayment.jumlah_bayar)}</span>
                                    </div>
                                )}

                                {/* Jika langsung lunas (tidak ada DP) */}
                                {lunasPayment && !dpPayment && (
                                    <div className="flex justify-between text-sm bg-white rounded-lg p-3 border border-green-200">
                                        <span className="text-green-700 flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            Pembayaran Lunas
                                        </span>
                                        <span className="font-bold text-green-700">{formatRupiah(lunasPayment.jumlah_bayar)}</span>
                                    </div>
                                )}

                                <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Total Terbayar</span>
                                    <span className="font-bold text-2xl text-green-600">{formatRupiah(totalTerbayar)}</span>
                                </div>
                            </div>

                            {/* Info Pesanan */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Kode Pesanan</p>
                                        <p className="font-mono font-bold text-gray-800">#{order.id_pemesanan}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Tanggal Layanan</p>
                                        <p className="font-bold text-gray-800">{order.tgl_mulai}</p>
                                    </div>
                                    {order.armada && (
                                        <>
                                            <div>
                                                <p className="text-gray-500 text-xs mb-1">Armada</p>
                                                <p className="font-bold text-gray-800">{order.armada.nama_armada}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs mb-1">No. Plat</p>
                                                <p className="font-bold text-gray-800">{order.armada.no_plat}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Supir */}
                        {order.supir && (
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-blue-600" />
                                    Informasi Supir
                                </h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl">
                                        {order.supir.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-lg">{order.supir.nama}</p>
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <Phone size={14} />
                                            {order.supir.no_telepon}
                                        </p>
                                    </div>
                                </div>
                                {supirPhone && (
                                    <button
                                        onClick={() => window.open(waLink, '_blank')}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md"
                                    >
                                        <MessageCircle size={20} />
                                        Hubungi Supir via WhatsApp
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link
                                to="/"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg"
                            >
                                <Home size={20} />
                                Kembali ke Beranda
                            </Link>

                            <Link
                                to="/profile"
                                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                            >
                                <User size={20} />
                                Lihat Riwayat Pesanan
                            </Link>
                        </div>

                        {/* Catatan */}
                        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-800">
                                <span className="font-bold">💡 Catatan:</span> Pesanan Anda akan segera diproses.
                                Supir akan menghubungi Anda untuk koordinasi lebih lanjut. Terima kasih telah menggunakan layanan Zulzi Trans!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
