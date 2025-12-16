import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Package, CheckCircle, Clock, XCircle, AlertTriangle, Eye, ArrowLeft, Wallet, Star, Truck } from 'lucide-react';

const ProfilePage = () => {
    const { user, isAuthenticated, updateUser } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' atau 'orders'
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal edit profile
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal detail pesanan
    const [selectedOrder, setSelectedOrder] = useState(null); // Pesanan yang dipilih
    const [selectedStatus, setSelectedStatus] = useState('all'); // Filter status
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        nama: '',
        no_telepon: ''
    });
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    // Load user data ke form saat modal dibuka
    useEffect(() => {
        if (isEditModalOpen && user) {
            setEditForm({
                nama: user.nama || '',
                no_telepon: user.no_telepon || ''
            });
            setEditError('');
        }
    }, [isEditModalOpen, user]);

    // Fetch history pemesanan saat component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Auto-refresh data setiap 5 detik ketika tab orders aktif
    useEffect(() => {
        if (activeTab !== 'orders') return;

        const intervalId = setInterval(() => {
            console.log('🔄 Auto-refreshing orders...');
            fetchOrders(1, false); // Refresh dari halaman pertama, tanpa loading spinner
        }, 5000); // 5 detik

        return () => clearInterval(intervalId); // Cleanup saat unmount atau tab berubah
    }, [activeTab]);

    // Auto-refresh ketika user kembali ke halaman (visibility change)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && activeTab === 'orders') {
                console.log('👁️ Page visible again, refreshing orders...');
                fetchOrders(1, false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [activeTab]);

    const fetchOrders = async (page = 1, append = false) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            // Jangan show loading spinner untuk auto-refresh, hanya untuk initial load
            if (orders.length === 0) {
                setIsLoading(true);
            }
        }

        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/user/pemesanan', {
                params: {
                    page: page,
                    per_page: 10
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                if (append) {
                    // Append mode: tambahkan data baru ke existing orders
                    setOrders(prev => [...prev, ...response.data.data]);
                } else {
                    // Replace mode: set ulang semua orders
                    setOrders(response.data.data);
                }
                setPagination(response.data.pagination);
                console.log('✅ Orders loaded:', response.data.pagination.total, 'total');
            }
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Handle edit form change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsEditLoading(true);
        setEditError('');

        try {
            const token = localStorage.getItem('auth_token');
            // Hanya kirim field yang bisa diubah (tanpa email)
            const dataToSend = {
                nama: editForm.nama,
                no_telepon: editForm.no_telepon
            };

            const response = await axios.put('/api/user/profile', dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                // Update user di context (no reload!)
                if (response.data.data) {
                    updateUser(response.data.data);
                }
                alert('Profil berhasil diperbarui!');
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMsg = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(', ')
                : error.response?.data?.message || 'Gagal memperbarui profil. Silakan coba lagi.';
            setEditError(errorMsg);
        } finally {
            setIsEditLoading(false);
        }
    };

    // Format rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    // Format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Helper: Hitung total terbayar (hanya yang Terverifikasi)
    const getTotalTerbayar = (order) => {
        if (!order.pembayaran || !Array.isArray(order.pembayaran)) return 0;

        return order.pembayaran
            .filter(p => p.status_pembayaran === 'Terverifikasi')
            .reduce((sum, p) => sum + Number(p.jumlah_bayar || 0), 0);
    };

    // Helper: Hitung sisa pembayaran
    const getSisaPembayaran = (order) => {
        return Number(order.total_biaya || 0) - getTotalTerbayar(order);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'Menunggu': { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock },
            'Dikonfirmasi': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            'Menunggu Pembayaran': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            'Menunggu Verifikasi': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            'Pembayaran Ditolak': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
            'DP Dibayar': { bg: 'bg-orange-100', text: 'text-orange-700', icon: AlertTriangle },
            'Lunas': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
            'Selesai': { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
            'Dibatalkan': { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle }
        };

        const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertTriangle };
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                <Icon size={14} />
                {status}
            </span>
        );
    };

    // Render Tab Profile
    const renderProfileTab = () => (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-[#003366]" size={28} />
                Informasi Profil
            </h3>

            <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.nama?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Nama Lengkap</label>
                        <p className="text-lg font-bold text-gray-800">{user?.nama || 'User'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Mail className="text-[#00a3e0]" size={24} />
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Email</label>
                        <p className="text-gray-800 font-medium">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-[#00a3e0]" size={24} />
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Nomor Telepon</label>
                        <p className="text-gray-800 font-medium">{user?.no_telepon || 'Belum diatur'}</p>
                    </div>
                </div>
            </div>

            {/* Button Edit Profile - Untuk Avita */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full md:w-auto px-6 py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow-lg"
                >
                    Edit Profil
                </button>
            </div>
        </div>
    );

    // Render Tab Orders
    const renderOrdersTab = () => {
        // Helper: Group status untuk simplifikasi UI
        const getStatusGroup = (status) => {
            // Group 1: Menunggu admin proses order (belum ada harga)
            if (status === 'Menunggu') return 'menunggu-konfirmasi';

            // Group 2: Admin sudah konfirmasi, menunggu customer bayar atau admin verifikasi bukti bayar
            if (['Dikonfirmasi', 'Menunggu Verifikasi', 'Pembayaran Ditolak'].includes(status)) return 'menunggu-pembayaran';

            // Group 3: Pembayaran sudah diverifikasi, order sedang dikerjakan (koordinasi via WA)
            if (['DP Dibayar', 'Lunas'].includes(status)) return 'sedang-diproses';

            // Group 4: Order selesai
            if (status === 'Selesai') return 'selesai';

            return 'lainnya';
        };

        // Filter orders berdasarkan group status
        const filteredOrders = selectedStatus === 'all'
            ? orders
            : orders.filter(order => getStatusGroup(order.status_pemesanan) === selectedStatus);

        // Status options dengan count - SIMPLIFIED untuk customer
        const statusOptions = [
            { value: 'all', label: 'Semua Pesanan', count: orders.length, icon: Package },
            {
                value: 'menunggu-konfirmasi',
                label: 'Menunggu Konfirmasi',
                count: orders.filter(o => getStatusGroup(o.status_pemesanan) === 'menunggu-konfirmasi').length,
                icon: Clock,
                description: 'Pesanan sedang ditinjau admin'
            },
            {
                value: 'menunggu-pembayaran',
                label: 'Menunggu Pembayaran',
                count: orders.filter(o => getStatusGroup(o.status_pemesanan) === 'menunggu-pembayaran').length,
                icon: AlertTriangle,
                description: 'Siap dibayar atau menunggu verifikasi'
            },
            {
                value: 'sedang-diproses',
                label: 'Sedang Diproses',
                count: orders.filter(o => getStatusGroup(o.status_pemesanan) === 'sedang-diproses').length,
                icon: Package,
                description: 'Pembayaran terverifikasi, pesanan sedang dikerjakan'
            },
            {
                value: 'selesai',
                label: 'Selesai',
                count: orders.filter(o => getStatusGroup(o.status_pemesanan) === 'selesai').length,
                icon: CheckCircle,
                description: 'Pesanan telah selesai'
            }
        ];

        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Package className="text-[#003366]" size={28} />
                        Riwayat Pemesanan
                    </h3>

                    {/* Filter Tabs - SIMPLIFIED */}
                    {!isLoading && orders.length > 0 && (
                        <div className="mb-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {statusOptions.map(option => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => setSelectedStatus(option.value)}
                                            className={`p-4 rounded-xl font-medium transition-all text-left ${
                                                selectedStatus === option.value
                                                    ? 'bg-[#003366] text-white shadow-lg scale-105'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Icon size={18} className={selectedStatus === option.value ? 'text-white' : 'text-[#00a3e0]'} />
                                                <span className="text-xs font-bold">{option.label}</span>
                                            </div>
                                            <div className={`text-2xl font-bold ${selectedStatus === option.value ? 'text-white' : 'text-[#003366]'}`}>
                                                {option.count}
                                            </div>
                                            {option.description && (
                                                <p className={`text-xs mt-1 ${selectedStatus === option.value ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {option.description}
                                                </p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a3e0] mx-auto"></div>
                            <p className="mt-4 text-gray-500">Memuat data...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Package size={64} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">
                                {orders.length === 0 ? 'Belum ada pesanan' : `Tidak ada pesanan dengan status "${selectedStatus}"`}
                            </p>
                            {orders.length === 0 && (
                                <>
                                    <p className="text-sm mt-2">Mulai pesan layanan Zulzi Trans sekarang!</p>
                                    <a href="/pemesanan" className="inline-block mt-6 px-6 py-3 bg-[#00a3e0] text-white font-bold rounded-xl hover:bg-[#0082b3] transition">
                                        Buat Pesanan
                                    </a>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">{filteredOrders.map((order) => {
                                const totalTerbayar = getTotalTerbayar(order);
                                const sisaPembayaran = getSisaPembayaran(order);

                                return (
                                    <div
                                        key={order.id_pemesanan}
                                        className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 bg-white"
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h4 className="font-bold text-gray-800 text-lg">
                                                        {order.layanan?.nama_layanan || 'Layanan'}
                                                    </h4>
                                                    <StatusBadge status={order.status_pemesanan} />
                                                    {order.status_pemesanan === 'DP Dibayar' && (
                                                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-flex items-center gap-1">
                                                            <AlertTriangle size={12} />
                                                            Menunggu Pelunasan
                                                        </span>
                                                    )}
                                                    {/* Badge Sudah Review - Clickable */}
                                                    {order.status_pemesanan === 'Selesai' && order.ulasan && order.ulasan.length > 0 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent card click
                                                                navigate(`/review-success/${order.ulasan[0].id_ulasan}`);
                                                            }}
                                                            className="text-xs text-green-600 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-full inline-flex items-center gap-1 transition cursor-pointer border border-green-200 hover:border-green-300"
                                                        >
                                                            <Eye size={12} />
                                                            Lihat Review
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 font-mono">{order.kode_pesanan || 'ZT-' + String(order.id_pemesanan).padStart(5, '0')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Total Biaya</p>
                                                <p className="font-extrabold text-xl text-[#003366]">
                                                    {order.total_biaya > 0 ? formatRupiah(order.total_biaya) : 'Belum Ditentukan'}
                                                </p>
                                                {order.status_pemesanan === 'DP Dibayar' && order.total_biaya > 0 && (
                                                    <>
                                                        <p className="text-xs text-green-600 mt-1">
                                                            Terbayar: {formatRupiah(totalTerbayar)}
                                                        </p>
                                                        <p className="text-xs text-orange-600 font-bold">
                                                            Sisa: {formatRupiah(sisaPembayaran)}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                {/* Body */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>Tanggal: <strong>{formatDate(order.tgl_mulai)}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span className="truncate">{order.lokasi_jemput}</span>
                                    </div>
                                    {order.armada && (
                                        <div className="flex items-center gap-2 text-gray-600 col-span-2">
                                            <Package size={16} className="text-gray-400" />
                                            <span>Armada: <strong>{order.armada.nama_armada}</strong> ({order.armada.no_plat})</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-400">
                                            Dipesan: {formatDate(order.tgl_pesan)}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsDetailModalOpen(true);
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a3e0] text-white font-bold text-sm rounded-lg hover:bg-[#0082b3] transition"
                                        >
                                            <Eye size={16} />
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}</div>

                            {/* Load More Button */}
                            {pagination.current_page < pagination.last_page && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => fetchOrders(pagination.current_page + 1, true)}
                                        disabled={isLoadingMore}
                                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                                                Memuat...
                                            </>
                                        ) : (
                                            <>
                                                Muat Lebih Banyak ({pagination.total - orders.length} lagi)
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Menampilkan {orders.length} dari {pagination.total} pesanan
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-6 pt-4 max-w-6xl mx-auto">
                <a href="/" className="inline-flex items-center text-[#00a3e0] hover:text-[#003366] text-sm font-medium transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Kembali ke Beranda
                </a>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-[#003366]">Profil Pengguna</h2>
                <p className="text-gray-500 mt-2">Kelola informasi akun & lihat riwayat pemesanan</p>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 inline-flex gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'profile'
                                ? 'bg-[#003366] text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Profil Saya
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'orders'
                                ? 'bg-[#003366] text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Riwayat Pesanan
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto mb-20">
                {activeTab === 'profile' ? renderProfileTab() : renderOrdersTab()}
            </div>

            {/* Modal Edit Profile */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</h3>

                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={editForm.nama}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00a3e0] focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon</label>
                                <input
                                    type="tel"
                                    name="no_telepon"
                                    value={editForm.no_telepon}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00a3e0] focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            {editError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {editError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition"
                                    disabled={isEditLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition disabled:bg-gray-400"
                                    disabled={isEditLoading}
                                >
                                    {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detail Pesanan */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsDetailModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        {/* Header - Compact */}
                        <div className="relative bg-gradient-to-r from-[#0C4371] to-[#5CBCE2] p-4 overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <p className="text-xs uppercase tracking-wider text-white opacity-80 mb-1.5">Detail Pesanan</p>
                                        <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1.5">{selectedOrder.kode_pesanan || 'ZT-' + String(selectedOrder.id_pemesanan).padStart(5, '0')}</h3>
                                        <p className="text-xs text-white opacity-90 flex items-center gap-1.5">
                                            <Package size={12} />
                                            {selectedOrder.layanan?.nama_layanan}
                                        </p>
                                    </div>
                                    <StatusBadge status={selectedOrder.status_pemesanan} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-4 max-h-[calc(90vh-160px)] overflow-y-auto">

                            {/* Info Grid - Compact */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#EFF6FF] p-3 rounded-lg border border-[#BBDEFF]">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Calendar className="text-[#5CBCE2]" size={14} />
                                        <p className="text-xs font-semibold text-[#0C4371] uppercase">Tanggal</p>
                                    </div>
                                    <p className="font-bold text-[#0C4371] text-sm">{formatDate(selectedOrder.tgl_mulai)}</p>
                                </div>
                                <div className="bg-[#ECFEFF] p-3 rounded-lg border border-[#5CBCE2]">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Wallet className="text-[#0C4371]" size={14} />
                                        <p className="text-xs font-semibold text-[#0C4371] uppercase">Total</p>
                                    </div>
                                    <p className="font-extrabold text-[#0C4371] text-base">{formatRupiah(selectedOrder.total_biaya)}</p>
                                </div>
                            </div>

                            {/* Lokasi - Compact */}
                            <div className="bg-[#FAFAFA] border border-[#E1E3E7] rounded-lg p-3">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <MapPin className="text-[#5CBCE2]" size={14} />
                                    <p className="text-xs font-bold text-[#0C4371]">Lokasi Perjalanan</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2 items-start">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-0.5">Jemput</p>
                                            <p className="font-semibold text-[#0C4371] text-xs">{selectedOrder.lokasi_jemput}</p>
                                        </div>
                                    </div>
                                    {selectedOrder.lokasi_tujuan && selectedOrder.lokasi_tujuan !== '-' && (
                                        <>
                                            <div className="flex justify-center">
                                                <div className="w-px h-4 bg-[#E1E3E7]"></div>
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="text-white" size={12} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-0.5">Tujuan</p>
                                                    <p className="font-semibold text-[#0C4371] text-xs">{selectedOrder.lokasi_tujuan}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Armada & Supir - Compact Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Armada */}
                                {selectedOrder.armada && (
                                    <div className="bg-[#FAFAFA] border border-[#E1E3E7] rounded-lg p-3">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Truck className="text-[#5CBCE2]" size={14} />
                                            <p className="text-xs font-bold text-[#0C4371]">Armada</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-10 h-10 bg-[#BBDEFF] rounded-lg flex items-center justify-center">
                                                <Truck size={20} className="text-[#0C4371]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-[#0C4371] text-xs mb-0.5">{selectedOrder.armada.nama_armada}</p>
                                                <p className="text-xs font-mono text-gray-600">{selectedOrder.armada.no_plat}</p>
                                                <span className="text-xs bg-[#5CBCE2] text-white px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
                                                    {selectedOrder.armada.jenis_kendaraan}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Supir */}
                                {selectedOrder.supir && (
                                    <div className="bg-[#FAFAFA] border border-[#E1E3E7] rounded-lg p-3">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <User className="text-[#5CBCE2]" size={14} />
                                            <p className="text-xs font-bold text-[#0C4371]">Supir</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-10 h-10 bg-[#0C4371] rounded-lg flex items-center justify-center text-white font-bold text-base">
                                                {selectedOrder.supir.nama?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-[#0C4371] text-xs mb-0.5">{selectedOrder.supir.nama}</p>
                                                <p className="text-xs text-gray-700 flex items-center gap-1">
                                                    <Phone size={10} className="text-[#5CBCE2]" />
                                                    {selectedOrder.supir.no_telepon}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Deskripsi - Compact */}
                            {selectedOrder.deskripsi_barang && (
                                <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                                    <p className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1">
                                        <span>💬</span> Catatan
                                    </p>
                                    <p className="text-xs text-gray-700 leading-relaxed">"{selectedOrder.deskripsi_barang}"</p>
                                </div>
                            )}

                            {/* Payment & Timeline - Collapsible Compact */}
                            <details className="bg-[#FAFAFA] border border-[#E1E3E7] rounded-lg overflow-hidden">
                                <summary className="cursor-pointer p-3 hover:bg-gray-100 transition flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Wallet className="text-[#5CBCE2]" size={14} />
                                        <span className="font-bold text-[#0C4371] text-xs">Detail Pembayaran & Timeline</span>
                                    </div>
                                    <span className="text-xs text-gray-500">▼</span>
                                </summary>
                                
                                <div className="p-4 pt-0 space-y-4 border-t border-[#E1E3E7]">
                                    {/* Payment info */}
                                    {(selectedOrder.pembayaran?.length > 0 || selectedOrder.status_pemesanan === 'DP Dibayar') && (
                                        <div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Total Biaya</span>
                                                    <span className="font-bold text-[#0C4371]">{formatRupiah(selectedOrder.total_biaya)}</span>
                                                </div>

                                                {(() => {
                                                    const totalTerbayar = getTotalTerbayar(selectedOrder);
                                                    const sisaPembayaran = getSisaPembayaran(selectedOrder);

                                                    return (
                                                        <>
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-gray-600 flex items-center gap-2">
                                                                    <CheckCircle size={12} className="text-green-600" />
                                                                    Sudah Dibayar
                                                                </span>
                                                                <span className="font-bold text-green-600">
                                                                    {formatRupiah(totalTerbayar)}
                                                                </span>
                                                            </div>

                                                            {sisaPembayaran > 0 && (
                                                                <div className="flex justify-between items-center text-sm bg-orange-50 p-2 rounded">
                                                                    <span className="text-orange-700 font-medium flex items-center gap-2">
                                                                        <AlertTriangle size={12} />
                                                                        Sisa Pembayaran
                                                                    </span>
                                                                    <span className="font-bold text-orange-600">
                                                                        {formatRupiah(sisaPembayaran)}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {sisaPembayaran === 0 && totalTerbayar > 0 && (
                                                                <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-2 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                                                    <CheckCircle size={14} />
                                                                    Pembayaran Lunas
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>

                                            {/* Riwayat transaksi */}
                                            {selectedOrder.pembayaran?.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-[#E1E3E7]">
                                                    <p className="text-xs text-gray-600 font-semibold mb-2">Riwayat Transaksi:</p>
                                                    <div className="space-y-2">
                                                        {selectedOrder.pembayaran.map((payment, idx) => (
                                                            <div key={payment.id_pembayaran} className="text-xs bg-white border border-[#E1E3E7] rounded p-2">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="font-semibold text-[#0C4371]">
                                                                        {payment.jenis_pembayaran === 'DP' ? 'DP (Down Payment)' : 
                                                                         payment.jenis_pembayaran === 'PELUNASAN' ? 'Pelunasan' : 
                                                                         'Lunas'}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 rounded-full font-semibold ${
                                                                        payment.status_pembayaran === 'Terverifikasi' ? 'bg-green-100 text-green-700' :
                                                                        payment.status_pembayaran === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                                                        'bg-orange-100 text-orange-700'
                                                                    }`}>
                                                                        {payment.status_pembayaran === 'Terverifikasi' ? 'Berhasil' :
                                                                         payment.status_pembayaran === 'Ditolak' ? 'Ditolak' : 'Pending'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-gray-600">
                                                                    <span>{payment.metode_bayar} • {formatDate(payment.tgl_bayar)}</span>
                                                                    <span className="font-bold text-[#0C4371]">{formatRupiah(payment.jumlah_bayar)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    <div className="pt-3 border-t border-[#E1E3E7]">
                                        <p className="text-xs text-gray-600 font-semibold mb-2">Timeline:</p>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex justify-between p-2">
                                                <span className="text-gray-700">Tanggal Pesanan</span>
                                                <span className="font-semibold text-[#0C4371]">{formatDate(selectedOrder.tgl_pesan)}</span>
                                            </div>
                                            <div className="flex justify-between p-2">
                                                <span className="text-gray-700">Tanggal Mulai</span>
                                                <span className="font-semibold text-[#0C4371]">{formatDate(selectedOrder.tgl_mulai)}</span>
                                            </div>
                                            {selectedOrder.tgl_selesai && (
                                                <div className="flex justify-between p-2">
                                                    <span className="text-gray-700">Tanggal Selesai</span>
                                                    <span className="font-semibold text-[#0C4371]">{formatDate(selectedOrder.tgl_selesai)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </details>

{/* Action Buttons - Compact */}
                <div className="flex gap-2 pt-4 border-t border-[#E1E3E7] mt-4">
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="flex-1 px-4 py-2.5 bg-[#E1E3E7] text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-300 transition"
                                >
                                    Tutup
                                </button>

                                {/* Button untuk status yang bisa bayar/upload pembayaran */}
                                {(['Dikonfirmasi', 'Pembayaran Ditolak', 'DP Dibayar'].includes(selectedOrder.status_pemesanan)) && (() => {
                                    const sisaPembayaran = getSisaPembayaran(selectedOrder);

                                    return (
                                        <button
                                            onClick={() => {
                                                setIsDetailModalOpen(false);
                                                navigate(`/pemesanan/${selectedOrder.id_pemesanan}/status`);
                                            }}
                                            className={`flex-1 px-4 py-2.5 text-white font-bold text-sm rounded-lg transition inline-flex items-center justify-center gap-1.5 ${
                                                selectedOrder.status_pemesanan === 'Pembayaran Ditolak'
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : selectedOrder.status_pemesanan === 'DP Dibayar'
                                                    ? 'bg-orange-600 hover:bg-orange-700'
                                                    : 'bg-[#5CBCE2] hover:bg-[#0C4371]'
                                            }`}
                                        >
                                            {selectedOrder.status_pemesanan === 'Pembayaran Ditolak' && (
                                                <>
                                                    <XCircle size={16} />
                                                    Upload Ulang
                                                </>
                                            )}
                                            {selectedOrder.status_pemesanan === 'DP Dibayar' && (
                                                <>
                                                    <AlertTriangle size={16} />
                                                    Pelunasan
                                                </>
                                            )}
                                            {selectedOrder.status_pemesanan === 'Dikonfirmasi' && (
                                                <>
                                                    <Wallet size={16} />
                                                    Bayar Sekarang
                                                </>
                                            )}
                                        </button>
                                    );
                                })()}

                                {/* Button "Beri Review" untuk order yang Selesai */}
                                {selectedOrder.status_pemesanan === 'Selesai' && (
                                    <>
                                        {selectedOrder.ulasan && selectedOrder.ulasan.length > 0 ? (
                                            <button
                                                onClick={() => {
                                                    setIsDetailModalOpen(false);
                                                    navigate(`/review-success/${selectedOrder.ulasan[0].id_ulasan}`);
                                                }}
                                                className="flex-1 px-4 py-2.5 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 transition inline-flex items-center justify-center gap-1.5"
                                            >
                                                <Eye size={16} />
                                                Lihat Review
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setIsDetailModalOpen(false);
                                                    navigate(`/review-form/${selectedOrder.id_pemesanan}`);
                                                }}
                                                className="flex-1 px-4 py-2.5 bg-yellow-500 text-white font-bold text-sm rounded-lg hover:bg-yellow-600 transition inline-flex items-center justify-center gap-1.5"
                                            >
                                                <Star size={16} />
                                                Beri Review
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default ProfilePage;