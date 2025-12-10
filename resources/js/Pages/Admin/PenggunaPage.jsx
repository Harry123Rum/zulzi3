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
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/admin/pengguna`, {
                params: { search },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Pastikan data adalah array
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (response.data.data && Array.isArray(response.data.data)) {
                // Jika data di wrap dalam object {data: [...]}
                setUsers(response.data.data);
            } else {
                setUsers([]);
                console.error("API returned non-array data:", response.data);
            }
        } catch (err) {
            console.error("Gagal mengambil data pengguna:", err);
            setError("Gagal memuat data pengguna. Silakan coba lagi.");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setHeaderAction(null);
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/admin/pengguna/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            fetchUsers(); 
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Gagal menghapus:", err);
            alert("Gagal menghapus pengguna.");
        }
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

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

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
                            <tr>
                                <td colSpan="5" className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <p className="mt-2 text-slate-400">Memuat data...</p>
                                </td>
                            </tr>
                        ) : Array.isArray(users) && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id_pengguna} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-slate-900">{user.nama}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{user.email}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{user.no_telepon}</td>
                                    <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role_pengguna === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
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
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-slate-400 italic">
                                    Tidak ada data pengguna ditemukan.
                                </td>
                            </tr>
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