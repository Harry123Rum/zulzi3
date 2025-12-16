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

    // Format tanggal ke format Indonesia
    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
            });
        } catch (error) {
            return dateString;
        }
    };

    // Format kode pesanan (sinkron dengan admin: ZT-XXXXX dengan 5 digit)
    const formatKodePesanan = (id) => {
        return `ZT-${String(id).padStart(5, '0')}`;
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

    // Di success page, hanya hitung pembayaran yang Terverifikasi
    const verifiedPayments = pembayaranList.filter(p => p.status_pembayaran === 'Terverifikasi');
    const totalTerbayar = verifiedPayments.reduce((sum, p) => sum + Number(p.jumlah_bayar || 0), 0);

    // Debug: Log semua pembayaran untuk cek
    console.log('📊 All Payments:', pembayaranList);
    console.log('✅ Verified Payments:', verifiedPayments);

    // Pisahkan pembayaran berdasarkan jenis
    const dpPayments = verifiedPayments.filter(p => p.jenis_pembayaran === 'DP');
    const lunasPayments = verifiedPayments.filter(p => p.jenis_pembayaran === 'LUNAS');
    const pelunasanPayments = verifiedPayments.filter(p => p.jenis_pembayaran === 'PELUNASAN');

    const supirPhone = order.supir?.no_telepon || '';
    const waLink = supirPhone ? `https://wa.me/62${supirPhone.replace(/^0/, '')}` : '#';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header Clean */}
                    <div className="bg-green-500 p-8 text-center text-white">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Pembayaran Lunas!</h1>
                        <p className="text-green-50">Semua pembayaran telah terverifikasi. Pesanan Anda akan segera diproses!</p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Ringkasan Pembayaran */}
                        <div className="bg-[#FAFAFA] rounded-xl p-5 mb-5 border border-[#E1E3E7]">
                            <h3 className="font-bold text-[#0C4371] mb-4">Ringkasan Pembayaran</h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Tagihan</span>
                                    <span className="font-bold text-[#0C4371]">{formatRupiah(totalTagihan)}</span>
                                </div>

                                {/* Tampilkan SEMUA pembayaran yang terverifikasi */}
                                {verifiedPayments.length > 0 && (
                                    <>
                                        <div className="border-t border-[#E1E3E7] pt-3 mb-2"></div>
                                        {verifiedPayments.map((payment, idx) => (
                                            <div key={idx} className="flex justify-between text-sm bg-white rounded-lg p-3 border border-[#E1E3E7]">
                                                <span className="text-gray-700 flex items-center gap-2">
                                                    <CheckCircle size={14} className="text-green-600" />
                                                    {payment.jenis_pembayaran === 'DP' ? 'DP (Down Payment)' : 
                                                     payment.jenis_pembayaran === 'PELUNASAN' ? 'Pelunasan' : 
                                                     'Pembayaran Lunas'}
                                                </span>
                                                <span className="font-bold text-green-600">{formatRupiah(payment.jumlah_bayar)}</span>
                                            </div>
                                        ))}
                                    </>
                                )}

                                <div className="border-t border-[#E1E3E7] pt-3 flex justify-between items-center">
                                    <span className="font-bold text-[#0C4371]">Total Terbayar</span>
                                    <span className="font-bold text-xl text-green-600">{formatRupiah(totalTerbayar)}</span>
                                </div>
                            </div>

                            {/* Info Pesanan */}
                            <div className="bg-[#EFF6FF] rounded-lg p-4 border border-[#BBDEFF]">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Kode Pesanan</p>
                                        <p className="font-mono font-bold text-[#0C4371]">{formatKodePesanan(order.id_pemesanan)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Tanggal Layanan</p>
                                        <p className="font-bold text-[#0C4371]">{formatTanggal(order.tgl_mulai)}</p>
                                    </div>
                                    {order.armada && (
                                        <>
                                            <div>
                                                <p className="text-gray-500 text-xs mb-1">Armada</p>
                                                <p className="font-bold text-[#0C4371]">{order.armada.nama_armada}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs mb-1">No. Plat</p>
                                                <p className="font-bold text-[#0C4371]">{order.armada.no_plat}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Supir */}
                        {order.supir && (
                            <div className="bg-[#FAFAFA] rounded-xl p-5 mb-5 border border-[#E1E3E7]">
                                <h3 className="font-bold text-[#0C4371] mb-4 flex items-center gap-2">
                                    <User size={18} className="text-[#5CBCE2]" />
                                    Informasi Supir
                                </h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-[#0C4371] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                        {order.supir.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#0C4371] text-base">{order.supir.nama}</p>
                                        <p className="text-gray-600 text-sm flex items-center gap-2">
                                            <Phone size={12} className="text-[#5CBCE2]" />
                                            {order.supir.no_telepon}
                                        </p>
                                    </div>
                                </div>
                                {supirPhone && (
                                    <button
                                        onClick={() => window.open(waLink, '_blank')}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                                    >
                                        <MessageCircle size={18} />
                                        Hubungi Supir via WhatsApp
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link
                                to="/"
                                className="w-full bg-[#5CBCE2] hover:bg-[#0C4371] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                            >
                                <Home size={18} />
                                Kembali ke Beranda
                            </Link>

                            <Link
                                to="/profile"
                                className="w-full bg-white border border-[#E1E3E7] text-[#0C4371] py-3 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                            >
                                <User size={18} />
                                Lihat Riwayat Pesanan
                            </Link>
                        </div>

                        {/* Catatan */}
                        <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <p className="text-sm text-gray-700">
                                <span className="font-bold text-orange-700">💡 Catatan:</span> Pesanan Anda akan segera diproses.
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