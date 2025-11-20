import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';  

import { 
    ActionButton,
    SearchInput,
    Modal,
    FormInput, // Kita akan menggunakan FormInput untuk Modal
} from '@/Components/ReusableUI'; // Sesuaikan path alias jika berbeda

import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

// =============================================================================
// KOMPONEN MODAL UNTUK TAMBAH/EDIT SUPIR
// =============================================================================
const SupirModal = ({ isOpen, onClose, onSave, supirData, setSupirData, errors }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupirData(prev => ({ ...prev, [name]: value }));
    };

    const modalTitle = supirData.id_supir ? "Edit Data Supir" : "Tambah Supir Baru";
    const submitButtonLabel = supirData.id_supir ? "Perbarui" : "Simpan";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
            <form onSubmit={onSave}>
                <div className="p-6 grid grid-cols-1 gap-4">
                    
                    <FormInput 
                        label="Nama Lengkap"
                        name="nama_lengkap"
                        value={supirData.nama_lengkap}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        error={errors.nama_lengkap ? errors.nama_lengkap[0] : null}
                    />

                    <FormInput 
                        label="Nomor SIM"
                        name="no_sim"
                        value={supirData.no_sim}
                        onChange={handleChange}
                        placeholder="Masukkan nomor SIM"
                        error={errors.no_sim ? errors.no_sim[0] : null}
                    />

                    <FormInput 
                        label="Nomor Telepon"
                        name="no_telepon"
                        value={supirData.no_telepon}
                        onChange={handleChange}
                        placeholder="08XXXXXXXXXX"
                        error={errors.no_telepon ? errors.no_telepon[0] : null}
                    />
                    
                    <FormInput 
                        label="Pengalaman (Tahun)"
                        name="pengalaman_tahun"
                        type="number"
                        value={supirData.pengalaman_tahun}
                        onChange={handleChange}
                        placeholder="Masukkan tahun pengalaman"
                        error={errors.pengalaman_tahun ? errors.pengalaman_tahun[0] : null}
                        min="0"
                    />
                </div>

                {/* Footer Modal yang sesuai dengan Modal reusable */}
                <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg">
                        Batal
                    </button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        {submitButtonLabel}
                    </button>
                </div>
            </form>
        </Modal>
    );
};


// =============================================================================
// KOMPONEN UTAMA KELOLA SUPIR
// =============================================================================
const KelolaSupir = ({ setHeaderAction }) => {
    const [supirList, setSupirList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [currentSupir, setCurrentSupir] = useState({});
    const [formErrors, setFormErrors] = useState({});
    
    // State untuk konfirmasi hapus
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [supirToDelete, setSupirToDelete] = useState(null);

    // Fungsi untuk mengambil data supir
    const fetchSupir = async () => {
        setLoading(true);
        try {
            // UBAH URL INI ke endpoint API yang benar
            const response = await axios.get('/api/admin/supir', {
                params: { search: searchQuery }
            });

            // Pastikan respons adalah array sebelum menyimpannya
            if (Array.isArray(response.data)) {
                setSupirList(response.data);
            } else {
                // Jika data bukan array (misal: objek kosong atau error), set array kosong
                setSupirList([]);
                console.error("API returned non-array data:", response.data);
            }
            
            setError(null);
        } catch (err) {
            setError("Gagal mengambil data supir. Cek koneksi API.");
            console.error("API Fetch Error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    // Efek untuk memuat data pertama kali dan menangani pencarian
    useEffect(() => {
        // Debounce search input to avoid spamming the API
        const delaySearch = setTimeout(() => {
            fetchSupir();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    // Handler untuk membuka modal
    const handleOpenModal = (type, supir = null) => {
        setModalType(type);
        // Pastikan pengalaman_tahun adalah integer untuk input number
        const defaultData = type === 'add' 
            ? { pengalaman_tahun: '' } 
            : { ...supir, pengalaman_tahun: parseInt(supir.pengalaman_tahun) || '' };
        
        setCurrentSupir(defaultData);
        setIsModalOpen(true);
        setFormErrors({});
    };

    // Handler untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSupir({});
        setFormErrors({});
    };

    // Handler untuk submit form (tambah/edit)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        
        const url = modalType === 'add' 
            ? '/api/admin/supir' 
            : `/api/admin/supir/${currentSupir.id_supir}`;
        
        // Laravel API Resource menggunakan PUT untuk update, tapi React sering menggunakan 'put'
        let method = modalType === 'add' ? 'post' : 'post';

        let payload = { ...currentSupir };

        if (modalType === 'edit') {
            payload = { 
                ...currentSupir, 
                _method: 'PUT' 
            };
        }

        try {
            await axios[method](url, currentSupir);
            fetchSupir();
            handleCloseModal();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors);
            } else {
                setError("Gagal menyimpan data.");
                console.error(err);
            }
        }
    };
    
    // Handler untuk membuka konfirmasi hapus
    const handleDeleteClick = (supir) => {
        setSupirToDelete(supir);
        setShowDeleteConfirm(true);
    };

    // Handler untuk konfirmasi hapus
    const confirmDelete = async () => {
        if (!supirToDelete) return;
        
        try {
            await axios.post(`/api/admin/supir/${supirToDelete.id_supir}`, {
                _method: 'DELETE' 
            });
            
            fetchSupir();
            setShowDeleteConfirm(false);
            setSupirToDelete(null);
        } catch (err) {
            setError("Gagal menghapus data. Cek logs Laravel.");
            console.error("API Delete Error:", err.response ? err.response.data : err.message);
            setShowDeleteConfirm(false);
        }
    };

    // Kirim aksi ke AdminPanel untuk ditampilkan di Header
    useEffect(() => {
        setHeaderAction(
            <button 
                onClick={() => handleOpenModal('add')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all text-sm"
            >
                <Plus size={18} />
                <span>Tambah Supir</span>
            </button>
        );
        // Cleanup function
        return () => setHeaderAction(null);
    }, [setHeaderAction]);


    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            {/* Search Bar */}
            <div className="mb-6">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari supir berdasarkan nama, SIM, atau telepon..."
                />
            </div>

            {/* Tampilan Error */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Tabel Supir */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor SIM</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengalaman</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6">Loading...</td>
                            </tr>
                        ) : supirList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">Data supir tidak ditemukan.</td>
                            </tr>
                        ) : (
                            supirList.map((supir) => (
                                <tr key={supir.id_supir} className="hover:bg-slate-50 transition-colors"> 
                                    <td className="py-3.5 px-4 font-medium text-slate-900">{supir.nama_lengkap}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{supir.no_sim}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{supir.no_telepon}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{supir.pengalaman_tahun} tahun</td>

                                    <td className="py-3.5 px-4 flex justify-center items-center gap-2">
                                        {/* Gunakan ActionButton untuk tombol Edit */}
                                        <ActionButton type="edit" onClick={() => handleOpenModal('edit', supir)} /> 
                                        {/* Gunakan ActionButton untuk tombol Delete */}
                                        <ActionButton type="delete" onClick={() => handleDeleteClick(supir)} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah/Edit */}
            <SupirModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleFormSubmit}
                supirData={currentSupir}
                setSupirData={setCurrentSupir}
                errors={formErrors}
            />

            {/* Modal Konfirmasi Hapus */}
            {showDeleteConfirm && (
                <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Hapus Supir">
                    <div className="p-6">
                        <p className="text-sm text-slate-600">
                            Anda yakin ingin menghapus supir <strong>{supirToDelete?.nama_lengkap}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                        <button type="button" onClick={() => setShowDeleteConfirm(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg">Batal</button>
                        <button type="button" onClick={confirmDelete} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">Hapus</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default KelolaSupir;