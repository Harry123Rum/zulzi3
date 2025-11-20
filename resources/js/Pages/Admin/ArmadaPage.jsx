import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    PrimaryButton,
    ActionButton,
    SearchInput,
    StatusBadge,
    Modal,
    FormInput,
    FormSelect
} from '@/Components/ReusableUI';
import { Plus } from 'lucide-react';

const ArmadaPage = ({ setHeaderAction }) => {
    const [armadaList, setArmadaList] = useState([]);
    const [layananList, setLayananList] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Menggunakan axios global yang sudah diset di bootstrap.js atau local instance
    // Pastikan baseURL sesuai. Jika route ada di web.php (prefix 'api/admin'), 
    // maka path relatif '/api/admin/armada' sudah benar.
    const api = axios.create({
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') }
    });

    const fetchArmada = () => {
        api.get(`/api/admin/armada?search=${search}`)
            .then(res => {
                // PERBAIKAN ERROR: Pastikan data yang diterima adalah array sebelum di-set
                const data = Array.isArray(res.data) ? res.data : [];
                setArmadaList(data);
            })
            .catch(err => {
                console.error("Gagal fetch armada:", err);
                setArmadaList([]); // Set empty array on error to prevent .map crash
            });
    };

    const fetchLayanan = () => {
        api.get('/api/admin/layanan') // Pastikan endpoint ini mengembalikan JSON array
            .then(res => setLayananList(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error("Gagal fetch layanan:", err));
    };

    useEffect(() => {
        fetchArmada();
    }, [search]);

    useEffect(() => {
        fetchLayanan();
    }, []);

    useEffect(() => {
        setHeaderAction(
            <PrimaryButton onClick={() => openModal('add')} icon={Plus}>
                Tambah Armada
            </PrimaryButton>
        );
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    const openModal = (mode, data = {}) => {
        setModalMode(mode);
        setFormData(mode === 'add' ? { 
            status_ketersediaan: 'Tersedia',
            layanan: '',
            no_plat: '',
            jenis_kendaraan: '',
            kapasitas: '',
            harga_sewa_per_hari: ''
        } : { ...data });
        setErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setErrors({});

        const url = modalMode === 'add' ? '/api/admin/armada' : `/api/admin/armada/${formData.id_armada}`;
        // Gunakan POST untuk create, PUT untuk update
        const method = modalMode === 'add' ? 'post' : 'put';

        api[method](url, formData)
            .then(() => {
                fetchArmada();
                closeModal();
            })
            .catch(err => {
                if (err.response && err.response.status === 422) {
                    setErrors(err.response.data.errors);
                } else {
                    console.error("Error simpan:", err);
                    alert("Gagal menyimpan data. Cek koneksi atau validasi server.");
                }
            });
    };

    const handleDelete = (id) => {
        api.delete(`/api/admin/armada/${id}`)
            .then(() => {
                fetchArmada();
                setDeleteConfirm(null);
            })
            .catch(err => console.error("Gagal hapus:", err));
    };

    return (
        <>
            <div className="mb-6">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari armada (plat, jenis)..."
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-4">Nomor Polisi</th>
                            <th className="py-4 px-4">Layanan</th>
                            <th className="py-4 px-4">Jenis</th>
                            <th className="py-4 px-4">Kapasitas</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                        {/* PERBAIKAN: Cek armadaList ada dan memiliki panjang */}
                        {armadaList && armadaList.length > 0 ? armadaList.map((item) => (
                            <tr key={item.id_armada} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3.5 px-4 font-medium text-slate-900">{item.no_plat}</td>
                                <td className="py-3.5 px-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        {item.layanan}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4">{item.jenis_kendaraan}</td>
                                <td className="py-3.5 px-4">{item.kapasitas}</td>
                                <td className="py-3.5 px-4"><StatusBadge status={item.status_ketersediaan} /></td>
                                <td className="py-3.5 px-4 text-right space-x-2 flex justify-end">
                                    <ActionButton type="edit" onClick={() => openModal('edit', item)} />
                                    <ActionButton type="delete" onClick={() => setDeleteConfirm(item)} />
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="text-center py-12 text-slate-400 italic">Tidak ada data armada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'Tambah Armada' : 'Edit Armada'}>
                <form onSubmit={handleSave}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormInput 
                            label="Nomor Polisi" 
                            name="no_plat" 
                            value={formData.no_plat} 
                            onChange={handleFormChange} 
                            error={errors.no_plat?.[0]} 
                            placeholder="B 1234 XYZ" 
                        />
                        
                        <FormSelect 
                            label="Layanan" 
                            name="layanan" 
                            value={formData.layanan} 
                            onChange={handleFormChange} 
                            error={errors.layanan?.[0]}
                        >
                            <option value="">-- Pilih Layanan --</option>
                            {layananList && layananList.length > 0 ? (
                                layananList.map((l) => (
                                    <option key={l.id_layanan} value={l.nama_layanan}>
                                        {l.nama_layanan}
                                    </option>
                                ))
                            ) : (
                                <>
                                    {/* Fallback jika layananList kosong */}
                                    <option value="Rental">Rental</option>
                                    <option value="Angkutan">Angkutan</option>
                                    <option value="Sampah">Sampah</option>
                                </>
                            )}
                        </FormSelect>

                        <FormInput label="Jenis Kendaraan" name="jenis_kendaraan" value={formData.jenis_kendaraan} onChange={handleFormChange} error={errors.jenis_kendaraan?.[0]} placeholder="Truk Box" />
                        <FormInput label="Kapasitas" name="kapasitas" value={formData.kapasitas} onChange={handleFormChange} error={errors.kapasitas?.[0]} placeholder="2 Ton" />
                        <FormInput label="Harga Sewa / Hari" name="harga_sewa_per_hari" type="number" value={formData.harga_sewa_per_hari} onChange={handleFormChange} error={errors.harga_sewa_per_hari?.[0]} placeholder="0" />
                        
                        <div className="md:col-span-2">
                            <FormSelect label="Status Ketersediaan" name="status_ketersediaan" value={formData.status_ketersediaan} onChange={handleFormChange} error={errors.status_ketersediaan?.[0]}>
                                <option value="Tersedia">Tersedia</option>
                                <option value="Digunakan">Digunakan</option>
                                <option value="Perbaikan">Perbaikan</option>
                            </FormSelect>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                        <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Batal</button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">Simpan Data</button>
                    </div>
                </form>
            </Modal>

            {/* DELETE MODAL */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Konfirmasi Hapus">
                <div className="p-6">
                    <p className="text-sm text-slate-600">Hapus armada <strong>{deleteConfirm?.no_plat}</strong>?</p>
                </div>
                <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button type="button" onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg">Batal</button>
                    <button type="button" onClick={() => handleDelete(deleteConfirm.id_armada)} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg">Hapus</button>
                </div>
            </Modal>
        </>
    );
};

export default ArmadaPage;