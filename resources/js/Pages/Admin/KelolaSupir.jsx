import React, { useState, useEffect } from 'react';
import axios from 'axios';  

import { 
    ActionButton,
    SearchInput,
    Modal,
    FormInput,
} from '@/Components/ReusableUI';

import { Plus } from 'lucide-react';

// Modal Tambah/Edit Supir
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
                        value={supirData.nama_lengkap || ''}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        error={errors.nama_lengkap ? errors.nama_lengkap[0] : null}
                    />

                    <FormInput 
                        label="Nomor SIM"
                        name="no_sim"
                        value={supirData.no_sim || ''}
                        onChange={handleChange}
                        placeholder="Masukkan nomor SIM"
                        error={errors.no_sim ? errors.no_sim[0] : null}
                    />

                    <FormInput 
                        label="Nomor Telepon"
                        name="no_telepon"
                        value={supirData.no_telepon || ''}
                        onChange={handleChange}
                        placeholder="08XXXXXXXXXX"
                        error={errors.no_telepon ? errors.no_telepon[0] : null}
                    />
                    
                    <FormInput 
                        label="Pengalaman (Tahun)"
                        name="pengalaman_tahun"
                        type="number"
                        value={supirData.pengalaman_tahun || ''}
                        onChange={handleChange}
                        placeholder="Masukkan tahun pengalaman"
                        error={errors.pengalaman_tahun ? errors.pengalaman_tahun[0] : null}
                        min="0"
                    />
                </div>

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

// Komponen Utama
const KelolaSupir = ({ setHeaderAction }) => {
    const [supirList, setSupirList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [currentSupir, setCurrentSupir] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [supirToDelete, setSupirToDelete] = useState(null);

    // Fetch data supir dengan Authorization header
    const fetchSupir = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/admin/supir', {
                params: { search: searchQuery },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Validasi response
            if (Array.isArray(response.data)) {
                setSupirList(response.data);
            } else if (response.data.data && Array.isArray(response.data.data)) {
                setSupirList(response.data.data);
            } else {
                setSupirList([]);
                console.error("API returned non-array data:", response.data);
            }
        } catch (err) {
            setError("Gagal mengambil data supir. Silakan coba lagi.");
            setSupirList([]);
            console.error("API Fetch Error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchSupir();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    // Handler Modal
    const handleOpenModal = (type, supir = null) => {
        setModalType(type);
        const defaultData = type === 'add' 
            ? { nama_lengkap: '', no_sim: '', no_telepon: '', pengalaman_tahun: '' } 
            : { ...supir, pengalaman_tahun: parseInt(supir.pengalaman_tahun) || '' };
        
        setCurrentSupir(defaultData);
        setIsModalOpen(true);
        setFormErrors({});
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSupir({});
        setFormErrors({});
    };

    // Submit Form dengan Authorization header
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        try {
            if (modalType === 'add') {
                await axios.post('/api/admin/supir', currentSupir, { headers });
            } else {
                await axios.put(`/api/admin/supir/${currentSupir.id_supir}`, currentSupir, { headers });
            }
            
            fetchSupir();
            handleCloseModal();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors || {});
            } else {
                setError("Gagal menyimpan data.");
                console.error(err);
            }
        }
    };
    
    // Delete Handler
    const handleDeleteClick = (supir) => {
        setSupirToDelete(supir);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!supirToDelete) return;
        
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/admin/supir/${supirToDelete.id_supir}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            fetchSupir();
            setShowDeleteConfirm(false);
            setSupirToDelete(null);
        } catch (err) {
            setError("Gagal menghapus data.");
            console.error("API Delete Error:", err.response ? err.response.data : err.message);
            setShowDeleteConfirm(false);
        }
    };

    // Set Header Action
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

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

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
                                <td colSpan="5" className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <p className="mt-2 text-slate-400">Memuat data...</p>
                                </td>
                            </tr>
                        ) : Array.isArray(supirList) && supirList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-gray-500">
                                    Data supir tidak ditemukan.
                                </td>
                            </tr>
                        ) : (
                            supirList.map((supir) => (
                                <tr key={supir.id_supir} className="hover:bg-slate-50 transition-colors"> 
                                    <td className="py-3.5 px-6 font-medium text-slate-900">{supir.nama_lengkap}</td>
                                    <td className="py-3.5 px-6 text-slate-600">{supir.no_sim}</td>
                                    <td className="py-3.5 px-6 text-slate-600">{supir.no_telepon}</td>
                                    <td className="py-3.5 px-6 text-slate-600">{supir.pengalaman_tahun} tahun</td>
                                    <td className="py-3.5 px-6 flex justify-center items-center gap-2">
                                        <ActionButton type="edit" onClick={() => handleOpenModal('edit', supir)} /> 
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