import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ActionButton,
    SearchInput,
    Modal,
    FormInput,
    FormSelect,
} from '@/Components/ReusableUI';

const PemesananPage = ({ setHeaderAction }) => {
    const [pemesanan, setPemesanan] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('rental'); // rental, angkutan, sampah
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Modal Edit
    const [editItem, setEditItem] = useState(null);
    const [supirList, setSupirList] = useState([]);
    const [armadaList, setArmadaList] = useState([]);
    const [formData, setFormData] = useState({
        id_supir: '',
        id_armada: '',
        total_biaya: '',
        dp_amount: '',
        catatan: ''
    });
    // Kondisi Modal verifikasi
    const verifiedStatuses = ["Dikonfirmasi", "DP Dibayar", "Selesai"];
    const isVerified = verifiedStatuses.includes(editItem?.status_pemesanan);
    const isPaid = editItem?.status_pemesanan === "Lunas";


    const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

    const fetchPemesanan = () => {
        setIsLoading(true);
        api.get(`/api/admin/pemesanan?search=${search}&layanan=${activeTab}`)
            .then(res => {
                setPemesanan(res.data);
            })
            .catch(err => {
                console.error("Gagal mengambil data pemesanan:", err);
            })
            .finally(() => setIsLoading(false));
    };

    // --- Fetch Data Pendukung (Supir & Armada) ---
    const fetchDependencies = () => {
        // Mengambil data supir untuk dropdown
        api.get('/api/admin/supir')
            .then(res => setSupirList(Array.isArray(res.data) ? res.data : res.data.data || []))
            .catch(err => console.error("Gagal ambil supir", err));

        // Mengambil data armada untuk dropdown
        api.get('/api/admin/armada')
            .then(res => setArmadaList(Array.isArray(res.data) ? res.data : res.data.data || []))
            .catch(err => console.error("Gagal ambil armada", err));
    };

    useEffect(() => {
        fetchPemesanan();
        fetchDependencies();
    }, [search, activeTab]);

    useEffect(() => {
        setHeaderAction(null);
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    // Membuka Modal Edit/Verifikasi
    const handleEditClick = (item) => {
        console.log("Item saat edit: ", item);
        // Simpan data item yang akan diedit, termasuk harga lama
        setEditItem(item);

        setFormData({
            id_supir: item.id_supir ? String(item.id_supir) : "",
            id_armada: item.id_armada ? String(item.id_armada) : "",
            total_biaya: item.total_biaya || '',
            dp_amount: item.dp_amount || '',
            catatan: item.deskripsi_barang || ''
        });
    };

    const handleUpdateSubmit = () => {
        if (!editItem) return;

        const payload = {
            id_supir: formData.id_supir,
            id_armada: formData.id_armada,
            total_biaya: Number(formData.total_biaya),
            dp_amount: Number(formData.dp_amount) || null,
            deskripsi_barang: formData.catatan,
            status_pemesanan: 'Dikonfirmasi'
        };

        api.put(`/api/admin/pemesanan/${editItem.id_pemesanan}`, payload)
            .then(() => {
                fetchPemesanan(); // Mengambil ulang data dari database
                setEditItem(null); // tutup modal
            })
            .catch(err => {
                console.error("Gagal update:", err);
                alert("Gagal memperbarui pemesanan.");
            });
    };


    const handleDelete = (id) => {
        api.delete(`/api/admin/pemesanan/${id}`)
            .then(() => {
                fetchPemesanan();
                setDeleteConfirm(null);
            })
            .catch(err => {
                console.error("Gagal menghapus:", err);
                alert("Gagal menghapus pemesanan.");
            });
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
            'Menunggu Verifikasi': { bg: 'bg-purple-100', text: 'text-purple-800' },
            'Pembayaran Ditolak': { bg: 'bg-red-100', text: 'text-red-800'},
            'DP Dibayar': { bg: 'bg-orange-100', text: 'text-orange-800' },
            'Lunas': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
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

    const updateToSelesai = (item) => {
        // Update ke server pakai fetch/axios
        fetch(`/api/admin/pemesanan/${item.id_pemesanan}/verifikasi`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status_pemesanan: "Selesai" }),
        })
        .then(() => {
            // refresh state/UI
            fetchPemesanan();
            setEditItem(null);
        });
    };


    return (
        <>
            {/* Search Bar */}
            <div className="mb-6 relative z-0">
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
                <table className="w-full table-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-2 text-center">ID</th>
                            <th className="py-4 px-2 text-center">Pelanggan</th>
                            <th className="py-4 px-2 text-center">Lokasi Jemput</th>
                            { (activeTab === 'rental' || activeTab === 'angkutan') && (
                            <th className="py-4 px-2 text-center">Tujuan</th>
                            )}
                            <th className="py-4 px-2 text-center">Keberangkatan</th>
                            <th className="py-4 px-2 text-center">
                            {activeTab === 'rental'
                                ? 'Penumpang'
                                : activeTab === 'angkutan'
                                ? 'Muatan'
                                : activeTab === 'sampah'
                                ? 'Volume'
                                : ''}
                            </th>
                            <th className="py-4 px-2 text-center">Harga</th>
                            <th className="py-4 px-2 text-center">Sopir</th>
                            <th className="py-4 px-2 text-center">Armada</th>
                            <th className="py-4 px-2 text-center">Status</th>
                            <th className="py-4 px-2 text-center">Aksi</th>
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
                                    <td className="py-3.5 px-4 text-slate-600">{item.lokasi_jemput}</td>
                                    { (activeTab === 'rental' || activeTab === 'angkutan') && (
                                        <td className="py-3.5 px-4 text-slate-600">{item.lokasi_tujuan}</td>
                                    )}
                                    <td className="py-3.5 px-4 text-slate-600">{formatDate(item.tgl_mulai)}</td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                        {activeTab === 'rental' ? `${item.jumlah_orang} orang` :
                                         activeTab === 'angkutan' ? `${item.est_berat_ton} ton` :
                                         activeTab === 'sampah' ? `${item.volume_sampah} m³` : '-'}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                        {item.harga_lama && item.harga_lama !== item.total_biaya ? (
                                            <div className="flex flex-col">
                                                {/* Harga lama dicoret */}
                                                <span className="line-through text-xs text-slate-400">
                                                    {formatCurrency(item.harga_lama)}
                                                </span>
                                                {/* Harga baru */}
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(item.total_biaya)}
                                                </span>
                                            </div>
                                        ) : (
                                            formatCurrency(item.total_biaya)
                                        )}
                                    </td>


                                    <td className="py-3.5 px-4 text-slate-600">{item.nama_supir || '-'}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{item.jenis_kendaraan || '-'}</td>
                                    <td className="py-3.5 px-4">{getStatusBadge(item.status_pemesanan)}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <ActionButton type="edit2" onClick={() => handleEditClick(item)} />
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

            {/* --- MODAL 1: KONFIRMASI / EDIT PESANAN --- */}
            <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Konfirmasi Pesanan">
                {editItem && (
                    <div className="text-slate-700">

                        {/* BAGIAN 1: INFO PESANAN (READ ONLY) */}
                        {/* Tambahkan p-6 disini agar ada jarak dari tepi modal */}
                        <div className="p-4 sm:p-6 border-b border-slate-100">
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 text-sm">
                                    <span className="text-slate-400 shrink-0">Pesanan:</span>
                                    <span className="font-semibold text-slate-700 text-right">{editItem.kode_pesanan}</span>
                                </div>
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-slate-400 shrink-0">Pelanggan:</span>
                                    <span className="font-semibold text-slate-700 text-right">{editItem.nama_pelanggan}</span>
                                </div>
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-slate-400 shrink-0">Tujuan:</span>
                                    {/* text-right & max-w-[60%] agar jika alamat panjang tetap rapi di kanan */}
                                    <span className="font-semibold text-slate-700 text-right max-w-[60%]">{editItem.lokasi_tujuan}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 shrink-0">Tanggal:</span>
                                    <span className="font-semibold text-slate-700 text-right">{formatDate(editItem.tgl_mulai)}</span>
                                </div>
                            </div>
                        </div>

                        {/* BAGIAN 2: FORM INPUT */}
                        {/* Gunakan p-6 juga disini agar sejajar dengan atas */}
                        <div className="p-4 sm:p-6 space-y-4">
                            <FormSelect
                                label="Sopir"
                                name="id_supir"
                                value={String(formData.id_supir)}
                                onChange={(e) => setFormData({...formData, id_supir: e.target.value})}
                                disabled={isVerified || isPaid}
                            >
                                <option value="">-- Pilih Supir --</option>
                                {supirList.map(supir => (
                                    <option key={supir.id_supir} value={String(supir.id_supir)}>
                                        {supir.nama_lengkap}
                                    </option>
                                ))}
                            </FormSelect>

                            <FormSelect
                                label="Armada"
                                name="id_armada"
                                value={String(formData.id_armada)}
                                onChange={(e) => setFormData({...formData, id_armada: e.target.value})}
                                disabled={isVerified || isPaid}
                            >
                                <option value="">-- Pilih Armada --</option>
                                {armadaList.map(armada => (
                                    <option key={armada.id_armada} value={String(armada.id_armada)}>
                                        {armada.jenis_kendaraan} - {armada.no_plat}
                                    </option>
                                ))}
                            </FormSelect>

                            {/* Harga Info & Edit */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Harga Sementara:</span>
                                    <span className="text-sm font-medium text-slate-800">{formatCurrency(editItem.total_biaya)}</span>
                                </div>
                                <FormInput
                                    label="Harga Total Setelah Negosiasi"
                                    name="total_biaya"
                                    type="number"
                                    value={formData.total_biaya}
                                    onChange={(e) => setFormData({...formData, total_biaya: e.target.value})}
                                    disabled={isVerified || isPaid}
                                    placeholder="Masukkan Harga Total"
                                />
                                <FormInput
                                    label="Nominal DP (Opsional)"
                                    name="dp_amount"
                                    type="number"
                                    value={formData.dp_amount}
                                    onChange={(e) => setFormData({...formData, dp_amount: e.target.value})}
                                    disabled={isVerified || isPaid}
                                    placeholder="Masukkan DP"
                                />
                                <p className="text-xs text-slate-500 italic">
                                    * Kosongkan jika tidak ada DP.
                                </p>
                            </div>

                            {/* Gambar Barang */}
                            {editItem.foto_barang && (
                            <div className="mt-4">
                                <span className="text-sm text-slate-500">Foto Barang:</span>
                                <img
                                src={editItem.foto_barang}
                                alt="Foto Barang"
                                className="mt-2 w-full max-w-xs rounded-lg border border-slate-200"
                                />
                            </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">

                            {/* CASE 1: status DIKONFIRMASI */}
                            {isVerified && !isPaid && (
                                <p className="text-sm font-medium text-green-600 text-center sm:text-left">
                                    Pesanan sudah diverifikasi
                                </p>
                            )}

                            {/* CASE 2: status LUNAS — tampilkan tombol selesai */}
                            {isPaid && (
                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                    <p className="text-sm font-medium text-green-600 text-center sm:text-left">
                                        Pesanan sudah diverifikasi
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => updateToSelesai(editItem)}
                                        className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Selesai
                                    </button>
                                </div>
                            )}

                            {/* CASE 3: status masih MENUNGGU */}
                            {!isVerified && !isPaid && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setEditItem(null)}
                                        className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUpdateSubmit}
                                        className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                                    >
                                        Verifikasi
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Pemesanan">
                <div className="p-4 sm:p-6">
                    <p className="text-sm text-slate-600">
                        Anda yakin ingin menghapus pemesanan dari <strong>{deleteConfirm?.nama_pelanggan}</strong>?
                    </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(deleteConfirm.id_pemesanan)}
                        className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default PemesananPage;
