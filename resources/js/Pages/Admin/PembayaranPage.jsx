import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ActionButton,
    SearchInput,
    Modal
} from '@/Components/ReusableUI';

const PembayaranPage = ({ setHeaderAction }) => {
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState('');
    const [detailModal, setDetailModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = axios.create({
        baseURL: '/',
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') }
    });

    const fetchPayments = () => {
        setIsLoading(true);
        api.get(`/api/admin/pembayaran?search=${search}`)
            .then(res => {
                console.log('Payment data:', res.data); // Debug log
                setPayments(res.data);
            })
            .catch(err => {
                console.error("Gagal mengambil data pembayaran:", err);
                setPayments([]); // Set empty array on error
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchPayments();
    }, [search]);

    useEffect(() => {
        setHeaderAction(null);
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    const handleVerify = (id, action) => {
        if (!confirm(`Anda yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pembayaran ini?`)) {
            return;
        }

        api.post(`/api/admin/pembayaran/${id}/verify`, { action })
            .then(() => {
                alert(`Pembayaran berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}`);
                setDetailModal(null);
                fetchPayments(); // Refresh data
            })
            .catch(err => {
                console.error("Gagal memverifikasi pembayaran:", err.response?.data || err.message);
                alert("Gagal memverifikasi pembayaran. Cek console untuk detail.");
            });
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getStatusBadge = (payment) => {
        // Cek apakah sudah diverifikasi (id_admin terisi)
        const isVerified = payment.id_admin !== null;
        
        const statusConfig = {
            verified: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800'
        };
        
        return {
            className: isVerified ? statusConfig.verified : statusConfig.pending,
            label: isVerified ? 'Terverifikasi' : 'Menunggu Verifikasi'
        };
    };

    // ✅ Helper untuk mengambil nama pelanggan dari relasi
    const getCustomerName = (payment) => {
        return payment?.pemesanan?.pengguna?.nama || 'N/A';
    };

    return (
        <>
            <div className="mb-6">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari pembayaran (ID, nama pelanggan, metode)..."
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-4">ID Pembayaran</th>
                            <th className="py-4 px-4">ID Pesanan</th>
                            <th className="py-4 px-4">Nama Pelanggan</th>
                            <th className="py-4 px-4">Jumlah</th>
                            <th className="py-4 px-4">Tanggal</th>
                            <th className="py-4 px-4">Metode</th>
                            <th className="py-4 px-4">Jenis</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan="9" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
                        ) : payments.length > 0 ? (
                            payments.map((payment) => {
                                const status = getStatusBadge(payment);
                                return (
                                    <tr key={payment.id_pembayaran} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3.5 px-4 font-medium text-slate-900">#{payment.id_pembayaran}</td>
                                        <td className="py-3.5 px-4 text-slate-600">{payment.id_pemesanan}</td>
                                        <td className="py-3.5 px-4 text-slate-600">{getCustomerName(payment)}</td>
                                        <td className="py-3.5 px-4 text-slate-600 font-medium">{formatRupiah(payment.jumlah_bayar)}</td>
                                        <td className="py-3.5 px-4 text-slate-600">{formatDate(payment.tgl_bayar)}</td>
                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {payment.metode_bayar}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                                payment.jenis_pembayaran === 'DP' 
                                                    ? 'bg-orange-50 text-orange-700 border border-orange-100' 
                                                    : 'bg-green-50 text-green-700 border border-green-100'
                                            }`}>
                                                {payment.jenis_pembayaran}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => setDetailModal(payment)}
                                                className="text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                                                title="Lihat Detail"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="9" className="text-center py-12 text-slate-400 italic">Tidak ada data pembayaran ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Detail Pembayaran" size="lg">
                {detailModal && (
                    <>
                        <div className="p-6">
                            {/* Header Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border border-blue-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">ID Pembayaran</p>
                                        <p className="text-2xl font-bold text-slate-900">#{detailModal.id_pembayaran}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 mb-1">Jumlah Pembayaran</p>
                                        <p className="text-2xl font-bold text-blue-600">{formatRupiah(detailModal.jumlah_bayar)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Detail */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">ID Pesanan</p>
                                    <p className="text-sm font-semibold text-slate-900">{detailModal.id_pemesanan}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Nama Pelanggan</p>
                                    <p className="text-sm font-semibold text-slate-900">{getCustomerName(detailModal)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Tanggal Bayar</p>
                                    <p className="text-sm font-semibold text-slate-900">{formatDate(detailModal.tgl_bayar)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Metode Pembayaran</p>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        {detailModal.metode_bayar}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Jenis Pembayaran</p>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                                        detailModal.jenis_pembayaran === 'DP' 
                                            ? 'bg-orange-50 text-orange-700 border border-orange-100' 
                                            : 'bg-green-50 text-green-700 border border-green-100'
                                    }`}>
                                        {detailModal.jenis_pembayaran}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Status Verifikasi</p>
                                    {(() => {
                                        const status = getStatusBadge(detailModal);
                                        return (
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                {status.label}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Bukti Transfer */}
                            <div className="mt-6">
                                <p className="text-sm font-bold text-slate-700 mb-3">Bukti Pembayaran</p>
                                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                                    {detailModal.bukti_transfer ? (
                                        <img
                                            src={`/storage/${detailModal.bukti_transfer}`}
                                            alt="Bukti Pembayaran"
                                            className="w-full h-auto object-contain max-h-96"
                                        />
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <svg className="w-16 h-16 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm">Tidak ada bukti transfer</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                            <button
                                type="button"
                                onClick={() => setDetailModal(null)}
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Tutup
                            </button>
                            
                            {/* Hanya tampilkan tombol verifikasi jika belum diverifikasi */}
                            {!detailModal.id_admin && (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleVerify(detailModal.id_pembayaran, 'reject')}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Tolak
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleVerify(detailModal.id_pembayaran, 'approve')}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Setujui
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default PembayaranPage;