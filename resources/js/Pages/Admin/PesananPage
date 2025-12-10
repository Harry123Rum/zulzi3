import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ActionButton,
    SearchInput,
    Modal
} from '@/Components/ReusableUI';

const PemesananPage = ({ setHeaderAction }) => {
    const [pemesanan, setPemesanan] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('rental'); // rental, angkutan, sampah
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = axios.create({
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') }
    });

    const fetchPemesanan = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get(`/api/admin/pemesanan`, {
            params: { search, layanan: activeTab },
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Validasi array
        if (Array.isArray(res.data)) {
            setPemesanan(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
            setPemesanan(res.data.data);
        } else {
            setPemesanan([]);
            console.error("API returned non-array:", res.data);
        }
    } catch (err) {
        console.error("Gagal mengambil data pemesanan:", err);
        setPemesanan([]);
    } finally {
        setIsLoading(false);
    }
};

    useEffect(() => {
        fetchPemesanan();
    }, [search, activeTab]);

    useEffect(() => {
        setHeaderAction(null);
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/admin/pemesanan/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPemesanan();
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Gagal menghapus:", err);
            alert("Gagal menghapus pemesanan.");
        }
    };

    const handleVerifikasi = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.put(`/api/admin/pemesanan/${id}/verifikasi`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPemesanan();
        } catch (err) {
            console.error("Gagal verifikasi:", err);
            alert("Gagal verifikasi pemesanan.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Menunggu': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            'Dikonfirmasi': { bg: 'bg-blue-100', text: 'text-blue-800' },
            'Berlangsung': { bg: 'bg-purple-100', text: 'text-purple-800' },
            'Selesai': { bg: 'bg-green-100', text: 'text-green-800' },
            'Dibatalkan': { bg: 'bg-red-100', text: 'text-red-800' }
        };
        const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {status}
            </span>
        );
    };

    const tabs = [
        { key: 'rental', label: 'Layanan Rental' },
        { key: 'angkutan', label: 'Layanan Angkutan' },
        { key: 'sampah', label: 'Layanan Sampah' }
    ];

    return (
        <>
            {/* Search Bar */}
            <div className="mb-6">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari pesanan..."
                />
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-slate-200">
                <div className="flex gap-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === tab.key
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-4">ID</th>
                            <th className="py-4 px-4">Pelanggan</th>
                            <th className="py-4 px-4">Tujuan</th>
                            <th className="py-4 px-4">Keberangkatan</th>
                            <th className="py-4 px-4">Penumpang</th>
                            <th className="py-4 px-4">Harga</th>
                            <th className="py-4 px-4">Sopir</th>
                            <th className="py-4 px-4">Armada</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan="10" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
                        ) : pemesanan.length > 0 ? (
                            pemesanan.map((item) => (
                                <tr key={item.id_pemesanan} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-slate-900">{item.kode_pesanan}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{item.nama_pelanggan}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{item.lokasi_tujuan}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{formatDate(item.tgl_mulai)}</td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                        {activeTab === 'rental' ? `${item.jumlah_orang} orang` :
                                         activeTab === 'angkutan' ? `${item.est_berat_ton} ton` : '-'}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                        {item.harga_diskon ? (
                                            <div className="flex flex-col">
                                                <span className="line-through text-xs text-slate-400">
                                                    {formatCurrency(item.total_biaya)}
                                                </span>
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(item.harga_diskon)}
                                                </span>
                                            </div>
                                        ) : (
                                            formatCurrency(item.total_biaya)
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">{item.nama_supir || '-'}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{item.nama_armada || '-'}</td>
                                    <td className="py-3.5 px-4">{getStatusBadge(item.status_pemesanan)}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {item.status_pemesanan === 'Menunggu' || item.status_pemesanan === 'Dikonfirmasi' ? (
                                                <button
                                                    onClick={() => handleVerifikasi(item.id_pemesanan)}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Verifikasi
                                                </button>
                                            ) : null}
                                            <ActionButton type="delete" onClick={() => setDeleteConfirm(item)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="10" className="text-center py-12 text-slate-400 italic">Tidak ada data pemesanan ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Pemesanan">
                <div className="p-6">
                    <p className="text-sm text-slate-600">
                        Anda yakin ingin menghapus pemesanan <strong>{deleteConfirm?.kode_pesanan}</strong>?
                    </p>
                </div>
                <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(deleteConfirm.id_pemesanan)}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default PemesananPage;
