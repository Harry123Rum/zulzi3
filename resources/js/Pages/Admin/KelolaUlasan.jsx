import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Star, MessageSquare, Info, Trash2, X } from 'lucide-react';

// Reusable Components dari ReusableUI
import {
    ActionButton,
    SearchInput,
    Modal,
    PrimaryButton,
    FormInput,
    StatusBadge 
} from '@/Components/ReusableUI'; 


// =============================================================================
// KOMPONEN PEMBANTU: RATING STAR & BADGE LAYANAN
// =============================================================================

/**
 * Menampilkan rating dalam bentuk bintang.
 * @param {number} rating - Nilai rating (0-5).
 */
const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
        <span className="flex items-center text-amber-500">
            {Array(fullStars).fill(0).map((_, i) => (
                <Star key={`full-${i}`} size={16} fill="currentColor" strokeWidth={0} />
            ))}
            {hasHalfStar && <Star key="half" size={14} fill="currentColor" strokeWidth={0.5} className="w-1/2" />}
            {Array(emptyStars).fill(0).map((_, i) => (
                <Star key={`empty-${i}`} size={14} stroke="currentColor" strokeWidth={1} className="text-gray-300" />
            ))}
        </span>
    );
};

/**
 * Badge Layanan kustom (Rental, Angkutan, Sampah)
 */
const LayananBadge = ({ layanan }) => {
    let styles;
    switch (layanan) {
        case 'Rental':
            styles = 'bg-blue-100 text-blue-700';
            break;
        case 'Angkutan':
            styles = 'bg-green-100 text-green-700';
            break;
        case 'Sampah':
            styles = 'bg-red-100 text-red-700';
            break;
        default:
            styles = 'bg-gray-100 text-gray-700';
            break;
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>{layanan}</span>;
};


// =============================================================================
// KOMPONEN MODAL DETAIL ULASAN & TANGGAPAN ADMIN
// =============================================================================

const UlasanDetailModal = ({ isOpen, onClose, ulasanData, onSave }) => {
    const [formData, setFormData] = useState({});
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (ulasanData) {
            setFormData({
                id_ulasan: ulasanData.id_ulasan,
                tanggapan_admin: ulasanData.tanggapan_admin || '',
                is_displayed: ulasanData.is_displayed,
            });
        }
    }, [ulasanData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        // Kita hanya mengupdate tanggapan dan status tampilkan
        await onSave(formData);
        setLocalLoading(false);
    };

    if (!isOpen || !ulasanData) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Ulasan & Tanggapan" maxWidth="max-w-xl">
            <form onSubmit={handleSave}>
                <div className="p-6 space-y-6">
                    {/* Pelanggan & Layanan */}
                    <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                            <p className="text-sm text-slate-500">Pelanggan</p>
                            <h4 className="text-xl font-semibold text-slate-800">{ulasanData.pelanggan_nama}</h4>
                        </div>
                        <div>
                            <LayananBadge layanan={ulasanData.layanan_nama} />
                        </div>
                    </div>
                    
                    {/* Rating Detail Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {['Supir', 'Kendaraan', 'Pelayanan'].map((kategori, index) => {
                            const ratingKey = ['rating_driver', 'rating_kendaraan', 'rating_pelayanan'][index];
                            const ratingValue = ulasanData[ratingKey];
                            const bgColor = index === 0 ? 'bg-amber-50' : (index === 1 ? 'bg-green-50' : 'bg-violet-50');
                            
                            return (
                                <div key={kategori} className={`p-3 rounded-lg ${bgColor} border border-opacity-50`}>
                                    <p className="text-sm font-medium text-slate-600 mb-1">{kategori}</p>
                                    <div className="flex items-center gap-1">
                                        <RatingStars rating={ratingValue} />
                                        <span className="text-sm font-semibold">{ratingValue}.0/5.0</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rating Keseluruhan */}
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Rating Keseluruhan</p>
                            <span className="text-xl font-bold text-yellow-700">{ulasanData.rata_rata} dari 5.0</span>
                        </div>
                        <span className="text-4xl font-extrabold text-yellow-700 bg-yellow-300 px-4 py-2 rounded-lg">{ulasanData.rata_rata}</span>
                    </div>

                    {/* Tanggal & Ulasan Pelanggan */}
                    <div className="space-y-3">
                        <p className="text-sm text-slate-500">Tanggal Ulasan: {ulasanData.tgl_ulasan}</p>
                        <h5 className="font-semibold text-slate-700">Ulasan Pelanggan</h5>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{ulasanData.komentar}</p>
                        </div>
                    </div>
                    
                    {/* Tanggapan Admin Input */}
                    <div>
                        <h5 className="font-semibold text-slate-700 flex items-center gap-2">
                            <MessageSquare size={18} className="text-slate-600" /> Tanggapan Admin
                        </h5>
                        <textarea
                            name="tanggapan_admin"
                            value={formData.tanggapan_admin}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tulis tanggapan Anda untuk pelanggan..."
                            className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:outline-none"
                        ></textarea>
                        <p className="text-xs text-slate-500 mt-1">
                            Tanggapan akan ditampilkan di landing page jika ulasan diaktifkan.
                        </p>
                    </div>

                </div>

                {/* Footer Aksi */}
                <div className="flex justify-between items-center p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_displayed"
                            name="is_displayed"
                            checked={formData.is_displayed}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_displayed" className="ml-2 text-sm font-medium text-slate-700">
                            Tampilkan di Landing Page
                        </label>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg"
                            disabled={localLoading}
                        >
                            Batal
                        </button>
                        <PrimaryButton icon={Info} type="submit" disabled={localLoading}>
                            {localLoading ? 'Menyimpan...' : 'Simpan Tanggapan'}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
};


// =============================================================================
// KOMPONEN UTAMA KELOLA ULASAN
// =============================================================================

const KelolaUlasan = ({ setHeaderAction }) => {
    const [ulasanData, setUlasanData] = useState({ data: [], total: 0, displayed_count: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('Semua');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });

    const filterOptions = ['Semua', 'Rental', 'Angkutan', 'Sampah'];

    // Ambil token CSRF untuk Axios POST/PUT/DELETE
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const fetchUlasan = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/ulasan', {
                params: { 
                    search: searchQuery,
                    layanan_filter: filter
                }
            });

            if (response.data && Array.isArray(response.data.data)) {
                setUlasanData(response.data);
            } else {
                setUlasanData({ data: [], total: 0, displayed_count: 0 });
            }
            setError(null);
        } catch (err) {
            setError("Gagal mengambil data ulasan. Pastikan seeder sudah terisi.");
            console.error("API Ulasan Fetch Error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filter]);

    // Efek untuk fetch data saat search atau filter berubah
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchUlasan();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [fetchUlasan]);
    
    // Custom Action for Header (Menampilkan info total ulasan)
    useEffect(() => {
        setHeaderAction(
            <div className="text-sm font-medium text-slate-600 p-2 bg-slate-100 rounded-lg shadow-inner">
                Ditampilkan di Landing: {ulasanData.displayed_count} dari {ulasanData.total} Ulasan
            </div>
        );
        return () => setHeaderAction(null);
    }, [setHeaderAction, ulasanData]);


    // Handler untuk membuka modal detail
    const handleOpenDetailModal = async (ulasan) => {
        // Fetch detail data untuk memastikan data paling baru
        setLoading(true);
        try {
            const response = await axios.get(`/api/admin/ulasan/${ulasan.id_ulasan}`);
            setDetailModal({ isOpen: true, data: response.data });
        } catch (err) {
            setError("Gagal memuat detail ulasan.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handler untuk menyimpan tanggapan dari modal
    const handleSaveResponse = async (formData) => {
        try {
            const payload = { 
                tanggapan_admin: formData.tanggapan_admin,
                is_displayed: formData.is_displayed,
                _method: 'PUT' // Method Spoofing
            };
            
            await axios.post(`/api/admin/ulasan/${formData.id_ulasan}`, payload);
            setDetailModal({ isOpen: false, data: null });
            fetchUlasan(); // Refresh list
        } catch (err) {
            setError("Gagal menyimpan tanggapan.");
            console.error(err);
        }
    };
    
    // Handler untuk aksi Hapus
    const handleDeleteUlasan = async (ulasanId) => {
        if (!confirm(`Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        try {
            await axios.post(`/api/admin/ulasan/${ulasanId}`, {
                _method: 'DELETE' // Method Spoofing
            });
            fetchUlasan(); // Refresh list
        } catch (err) {
            setError("Gagal menghapus ulasan.");
            console.error(err);
        }
    };

    // Handler untuk aksi Toggle Tampilkan (Di dalam tabel)
    const handleToggleDisplay = async (ulasan) => {
        try {
             const payload = { 
                is_displayed: !ulasan.is_displayed, // Toggle status
                _method: 'PUT'
            };
            // Kita hanya mengirim kolom yang kita update
            await axios.post(`/api/admin/ulasan/${ulasan.id_ulasan}`, payload);
            fetchUlasan(); // Refresh list
        } catch (err) {
            setError("Gagal memperbarui status tampilkan.");
            console.error(err);
        }
    };


    return (
        <>
            {/* Header sudah ditangani oleh AdminPanel dan useEffect */}
            
            {/* Filter dan Search */}
            <div className="mb-6 space-y-4">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari ulasan berdasarkan nama atau komentar..."
                />
                
                {/* Filter Tabs */}
                <div className="flex space-x-2 p-1 bg-slate-50 rounded-lg border w-fit">
                    {filterOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                                ${filter === opt ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tampilan Error */}
            {error && <div className="text-red-500 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

            {/* Tabel Ulasan */}
            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-4 min-w-[120px]">Pelanggan</th>
                            <th className="py-4 px-4">Layanan</th>
                            <th className="py-4 px-4 text-center min-w-80px">Supir</th>
                            <th className="py-4 px-4 text-center min-w-80px">Kendaraan</th> 
                            <th className="py-4 px-4 text-center min-w-80px">Layanan</th>
                            <th className="py-4 px-4 text-center">Rata-rata</th>
                            <th className="py-4 px-4 min-w-[200px]">Ulasan</th>
                            <th className="py-4 px-4 min-w-[100px]">Tanggal</th>
                            <th className="py-4 px-4 text-center">Tanggapan</th>
                            <th className="py-4 px-4 text-center">Tampilkan</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="10" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
                        ) : ulasanData.data.length > 0 ? (
                            ulasanData.data.map((ulasan) => (
                                <tr key={ulasan.id_ulasan} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-slate-900">{ulasan.pelanggan_nama}</td>
                                    <td className="py-3.5 px-4">
                                        <LayananBadge layanan={ulasan.layanan_nama} />
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <RatingStars rating={ulasan.rating_driver} />
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <RatingStars rating={ulasan.rating_kendaraan} />
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <RatingStars rating={ulasan.rating_pelayanan} />
                                    </td>
                                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">{ulasan.rata_rata}</td>
                                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">{ulasan.komentar}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{ulasan.tgl_ulasan}</td>
                                    
                                    {/* Kolom Tanggapan */}
                                    <td className="py-3.5 px-4 text-center">
                                        <button 
                                            onClick={() => handleOpenDetailModal(ulasan)}
                                            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                                                ulasan.tanggapan_admin 
                                                    ? 'bg-sky-500 text-white hover:bg-sky-600' 
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {ulasan.tanggapan_admin ? 'Sudah' : 'Belum'}
                                        </button>
                                    </td>

                                    {/* Kolom Tampilkan Toggle */}
                                    <td className="py-3.5 px-4 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={ulasan.is_displayed} 
                                                onChange={() => handleToggleDisplay(ulasan)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="10" className="text-center py-12 text-slate-400 italic">Tidak ada ulasan ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Tips Mengelola Ulasan */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                    <h5 className="font-semibold text-blue-800">Tips Mengelola Ulasan</h5>
                    <p className="text-sm text-blue-700">
                        Pilih ulasan dengan rating tinggi dan komentar yang detail untuk ditampilkan di landing page. Ulasan yang baik dapat meningkatkan kepercayaan calon pelanggan.
                    </p>
                </div>
            </div>


            {/* Modal Detail & Tanggapan */}
            <UlasanDetailModal 
                isOpen={detailModal.isOpen}
                onClose={() => setDetailModal({ isOpen: false, data: null })}
                ulasanData={detailModal.data}
                onSave={handleSaveResponse}
            />
        </>
    );
};

export default KelolaUlasan;