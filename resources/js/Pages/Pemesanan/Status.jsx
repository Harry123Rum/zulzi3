import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    CheckCircle, Clock, AlertTriangle, XCircle, Car, User, Home,
    MessageCircle, CreditCard, ChevronLeft, ChevronRight
} from 'lucide-react';

const Status = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch order data
    const fetchOrder = async (silent = false) => {
        if (!silent) setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/pemesanan/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrder(response.data.data);

            // Auto redirect ke success jika lunas
            if (response.data.data.status_pemesanan === 'Lunas' || response.data.data.status_pemesanan === 'Selesai') {
                navigate(`/pemesanan/${id}/payment/success`);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            if (!silent) alert('Gagal memuat data pesanan');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();

        // Auto-refresh setiap 5 detik untuk update status real-time
        const interval = setInterval(() => {
            fetchOrder(true); // silent refresh
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num || 0);
    };

    const adminPhone = "6283195559334";
    
    // Generate WhatsApp message dengan data pesanan
    const generateWAMessage = () => {
        if (!order) return '';
        
        // Ambil nama pelanggan dari user atau order
        const namaPelanggan = order.nama_pelanggan || order.user?.nama || order.pelanggan?.nama || 'Customer';
        
        // Ambil nama layanan - cek apakah object atau string
        let namaLayanan = 'Layanan';
        if (typeof order.layanan === 'string') {
            namaLayanan = order.layanan;
        } else if (order.layanan?.nama_layanan) {
            namaLayanan = order.layanan.nama_layanan;
        } else if (order.nama_layanan) {
            namaLayanan = order.nama_layanan;
        }
        
        const message = `Halo Admin, saya ingin diskusi harga untuk Order #${order.id_pemesanan}

ID Pesanan: ${order.id_pemesanan}
Nama: ${namaPelanggan}
Layanan: ${namaLayanan}

Terima kasih!`;

        return encodeURIComponent(message);
    };
    
    const waLink = `https://wa.me/${adminPhone}?text=${generateWAMessage()}`;

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

    const status = order.status_pemesanan;
    const totalTagihan = Number(order.total_biaya) || 0;
    const nominalDP = Number(order.nominal_dp) || 0;

    // Hitung total yang sudah dibayar (HANYA dari pembayaran yang Terverifikasi)
    const pembayaranList = Array.isArray(order.pembayaran) ? order.pembayaran : [];
    const verifiedPayments = pembayaranList.filter(p => p.status_pembayaran === 'Terverifikasi');
    const sudahDibayar = verifiedPayments.reduce((sum, p) => sum + Number(p.jumlah_bayar || 0), 0);
    const sisaPembayaran = Math.max(0, totalTagihan - sudahDibayar);

    // Tentukan tombol yang muncul
    const showPayButton = status === 'Dikonfirmasi' || status === 'Pembayaran Ditolak';
    const showPelunasanButton = status === 'DP Dibayar';
    const showDiscussButton = status === 'Menunggu';
    const showVerifyMessage = status === 'Menunggu Verifikasi';

    // Status badge styling
    const statusConfig = {
        'Menunggu': { bg: 'bg-orange-50', text: 'text-orange-700', icon: Clock },
        'Dikonfirmasi': { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
        'Menunggu Verifikasi': { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock },
        'Pembayaran Ditolak': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
        'DP Dibayar': { bg: 'bg-blue-50', text: 'text-blue-700', icon: CheckCircle },
        'Lunas': { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
    };

    const currentStatus = statusConfig[status] || statusConfig['Menunggu'];
    const StatusIcon = currentStatus.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                        <ChevronLeft size={20} />
                        <span className="font-medium">Kembali ke Beranda</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Halaman Pemesanan</h1>
                    <div className="w-32"></div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
                    <p className="text-center text-gray-600 mb-6">Lengkapi data pemesanan & lakukan pembayaran</p>

                    <div className="flex items-center justify-center gap-4 mb-6">
                        {/* Step 1: Pemesanan */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
                                <CheckCircle size={24} />
                            </div>
                            <span className="text-xs font-medium text-blue-600">Pemesanan</span>
                        </div>

                        <div className={`h-1 w-16 ${status !== 'Menunggu' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>

                        {/* Step 2: Pembayaran */}
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                ['Dikonfirmasi', 'Menunggu Verifikasi', 'Pembayaran Ditolak', 'DP Dibayar', 'Lunas'].includes(status)
                                ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                                {status === 'Lunas' ? <CheckCircle size={24} /> : <span className="font-bold">2</span>}
                            </div>
                            <span className={`text-xs font-medium ${
                                ['Dikonfirmasi', 'Menunggu Verifikasi', 'Pembayaran Ditolak', 'DP Dibayar', 'Lunas'].includes(status)
                                ? 'text-blue-600' : 'text-gray-400'
                            }`}>Pembayaran</span>
                        </div>

                        <div className={`h-1 w-16 ${status === 'Lunas' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>

                        {/* Step 3: Konfirmasi */}
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                status === 'Lunas' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                                <span className="font-bold">3</span>
                            </div>
                            <span className={`text-xs font-medium ${status === 'Lunas' ? 'text-blue-600' : 'text-gray-400'}`}>Konfirmasi</span>
                        </div>

                        <div className={`h-1 w-16 ${status === 'Selesai' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>

                        {/* Step 4: Selesai */}
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                status === 'Selesai' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                                <span className="font-bold">4</span>
                            </div>
                            <span className={`text-xs font-medium ${status === 'Selesai' ? 'text-green-600' : 'text-gray-400'}`}>Selesai</span>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`${currentStatus.bg} border border-${currentStatus.text.replace('text-', '')} rounded-2xl p-4 mb-6 flex flex-col items-center justify-center gap-2`}>
                    <div className="flex items-center gap-2">
                        <StatusIcon size={20} className={currentStatus.text} />
                        <span className={`font-bold ${currentStatus.text}`}>
                            {status === 'Menunggu' && 'Menunggu Konfirmasi Pemesanan'}
                            {status === 'Dikonfirmasi' && 'Pesanan Dikonfirmasi - Silakan Bayar'}
                            {status === 'Menunggu Verifikasi' && 'Sedang Diverifikasi Admin'}
                            {status === 'Pembayaran Ditolak' && 'Pembayaran Ditolak - Silakan Upload Ulang'}
                            {status === 'DP Dibayar' && 'DP Sudah Dibayar - Silakan Lunasi'}
                            {status === 'Lunas' && 'Pembayaran Lunas'}
                        </span>
                    </div>

                    {/* Subtitle informatif */}
                    {status === 'Menunggu' && (
                        <p className="text-sm text-orange-600">Admin sedang memeriksa detail pesanan Anda</p>
                    )}
                    {status === 'Menunggu Verifikasi' && pembayaranList.length > 0 && (
                        <p className="text-sm text-yellow-600">
                            Pembayaran {pembayaranList[pembayaranList.length - 1].jenis_pembayaran} sebesar {formatRupiah(pembayaranList[pembayaranList.length - 1].jumlah_bayar)}
                        </p>
                    )}
                </div>

                {/* Alert Pembayaran Ditolak */}
                {status === 'Pembayaran Ditolak' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
                        <AlertTriangle className="shrink-0 mt-0.5 text-red-600" size={20}/>
                        <div className="text-sm text-red-700">
                            <p className="font-bold mb-1">Pembayaran Anda Ditolak</p>
                            <p>Mohon periksa kembali nominal atau bukti transfer Anda, lalu upload ulang.</p>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Info Pesanan */}
                    <div className="space-y-6">
                        {/* Info Pemesan */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Informasi Pemesan</h3>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                                <div className="flex gap-2 text-sm">
                                    <User size={16} className="text-gray-400 shrink-0 mt-0.5"/>
                                    <span className="font-medium">Zulzi User (Anda)</span>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <Home size={16} className="text-gray-400 shrink-0 mt-0.5"/>
                                    <span className="truncate">{order.lokasi_jemput}</span>
                                </div>
                            </div>
                        </div>

                        {/* Armada */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Armada Terpilih</h3>
                            {order.armada ? (
                                <div className="border rounded-xl p-4 flex gap-4 items-center">
                                    <div className="w-20 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Car size={32} className="text-gray-400"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{order.armada.nama_armada}</p>
                                        <p className="text-xs text-gray-500">{order.armada.no_plat}</p>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                                            {order.armada.jenis_kendaraan}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm italic bg-gray-50">
                                    <Car className="mx-auto mb-2 opacity-20" size={24}/>
                                    Armada & Harga akan ditentukan setelah diskusi via WhatsApp.
                                </div>
                            )}
                        </div>

                        {/* Supir */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Supir</h3>
                            {order.supir ? (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                            {order.supir.nama.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{order.supir.nama}</p>
                                            <p className="text-xs text-gray-500">{order.supir.no_telepon}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 text-sm italic bg-gray-50">
                                    <User className="mx-auto mb-1 opacity-20" size={20}/>
                                    Supir akan ditentukan oleh Admin.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Ringkasan & Actions */}
                    <div className="space-y-6">
                        {/* Ringkasan Biaya */}
                        <div className="bg-gray-50 rounded-2xl shadow-sm border p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Ringkasan Biaya</h3>

                            <div className="space-y-3 text-sm mb-6 pb-4 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Kode Pesanan</span>
                                    <span className="font-mono font-bold">#{order.id_pemesanan}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tanggal Layanan</span>
                                    <span className="font-medium">{order.tgl_mulai}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-gray-700">Total Tagihan</span>
                                <span className={`font-extrabold text-xl ${totalTagihan > 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                                    {totalTagihan > 0 ? formatRupiah(totalTagihan) : 'Belum Disepakati'}
                                </span>
                            </div>

                            {/* History Pembayaran */}
                            {verifiedPayments.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                    <p className="text-xs font-bold text-blue-800 mb-2">Riwayat Pembayaran:</p>
                                    <div className="space-y-2">
                                        {verifiedPayments.map((p, idx) => (
                                            <div key={idx} className="text-xs text-blue-700 flex justify-between">
                                                <span>✓ {p.jenis_pembayaran}</span>
                                                <span className="font-bold">{formatRupiah(p.jumlah_bayar)}</span>
                                            </div>
                                        ))}
                                        <div className="pt-2 border-t border-blue-300 flex justify-between font-bold text-blue-800">
                                            <span>Total Terbayar:</span>
                                            <span>{formatRupiah(sudahDibayar)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Info DP Dibayar */}
                            {showPelunasanButton && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                    <p className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        DP Anda telah diverifikasi!
                                    </p>
                                    <div className="text-xs text-blue-700 space-y-1">
                                        <div className="flex justify-between">
                                            <span>DP yang sudah dibayar:</span>
                                            <span className="font-bold">{formatRupiah(sudahDibayar)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-orange-600">
                                            <span>Sisa yang harus dibayar:</span>
                                            <span className="text-lg">{formatRupiah(sisaPembayaran)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {/* Tombol Lanjut Bayar */}
                                {showPayButton && (
                                    <button
                                        onClick={() => navigate(`/pemesanan/${id}/payment/new`)}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex justify-center items-center gap-2"
                                    >
                                        {status === 'Pembayaran Ditolak' ? 'Upload Ulang Bukti' : 'Lanjut Pembayaran'}
                                        <ChevronRight size={18}/>
                                    </button>
                                )}

                                {/* Tombol Pelunasan */}
                                {showPelunasanButton && (
                                    <button
                                        onClick={() => navigate(`/pemesanan/${id}/payment/new?type=pelunasan`)}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold shadow-lg transition flex justify-center items-center gap-2 text-lg"
                                    >
                                        <CreditCard size={20}/>
                                        Bayar Sisa Pelunasan ({formatRupiah(sisaPembayaran)})
                                    </button>
                                )}

                                {/* Pesan Menunggu Verifikasi */}
                                {showVerifyMessage && (
                                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center text-sm font-bold animate-pulse">
                                        Sedang diverifikasi Admin...
                                    </div>
                                )}

                                {/* Tombol Diskusi WA */}
                                {showDiscussButton && (
                                    <button
                                        onClick={() => window.open(waLink, '_blank')}
                                        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition flex justify-center items-center gap-2"
                                    >
                                        <MessageCircle size={20} />
                                        Diskusi Harga via WhatsApp
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Status;