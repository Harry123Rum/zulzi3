import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ActionButton,
    SearchInput,
    Modal
} from '@/Components/ReusableUI';

const PenggunaPage = ({ setHeaderAction }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = axios.create({
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') }
    });

    const fetchUsers = () => {
        setIsLoading(true);
        // UPDATE URL API: Tambahkan /api/ di depan
        api.get(`/api/admin/pengguna?search=${search}`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error("Gagal mengambil data pengguna:", err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    useEffect(() => {
        setHeaderAction(null);
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    const handleDelete = (id) => {
        // UPDATE URL API: Tambahkan /api/ di depan
        api.delete(`/api/admin/pengguna/${id}`)
            .then(() => {
                fetchUsers(); 
                setDeleteConfirm(null);
            })
            .catch(err => {
                console.error("Gagal menghapus:", err);
                alert("Gagal menghapus pengguna.");
            });
    };

    return (
        <>
            <div className="mb-6">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari pengguna (nama, email)..."
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-4">Nama Pengguna</th>
                            <th className="py-4 px-4">Email</th>
                            <th className="py-4 px-4">No. Telepon</th>
                            <th className="py-4 px-4">Role</th>
                            <th className="py-4 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id_pengguna} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-slate-900">{user.nama}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{user.email}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{user.no_telepon}</td>
                                    <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role_pengguna === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role_pengguna}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <ActionButton type="delete" onClick={() => setDeleteConfirm(user)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-12 text-slate-400 italic">Tidak ada data pengguna ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Pengguna">
                <div className="p-6">
                    <p className="text-sm text-slate-600">
                        Anda yakin ingin menghapus pengguna <strong>{deleteConfirm?.nama}</strong>?
                    </p>
                </div>
                <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button type="button" onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg">Batal</button>
                    <button type="button" onClick={() => handleDelete(deleteConfirm.id_pengguna)} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg">Hapus</button>
                </div>
            </Modal>
        </>
    );
};

export default PenggunaPage;