import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GuestLayout from '@/layouts/GuestLayout';
import { getReviewTarget, submitReview } from '@/services/reviewService';
import { 
    CheckCircle, 
    Truck, 
    Calendar, 
    MapPin, 
    User, 
    Star, 
    Heart,
    ArrowLeft
} from 'lucide-react';

// --- Komponen Bintang Reusable ---
const StarRating = ({ rating, setRating, size = 24, readOnly = false }) => {
    return (
        <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && setRating(star)}
                    className={`transition-all duration-200 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                >
                    <Star 
                        size={size} 
                        // Logic pengisian warna bintang
                        className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-300'}`} 
                    />
                </button>
            ))}
        </div>
    );
};

export default function ReviewPage() {
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [orderData, setOrderData] = useState(null);

    // State Form
    const [form, setForm] = useState({
        rating_driver: 0,
        rating_kendaraan: 0,
        rating_pelayanan: 0,
        komentar: ''
    });

    // Fetch data saat komponen dimuat
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getReviewTarget(id);
                if (response.data.status === 'success') {
                    setOrderData(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data pesanan:", error);
                // Opsional: Tampilkan pesan error visual
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Hitung rata-rata rating
    const averageRating = useMemo(() => {
        const total = form.rating_driver + form.rating_kendaraan + form.rating_pelayanan;
        return total > 0 ? (total / 3).toFixed(1) : "0.0";
    }, [form]);

    // Handle perubahan input form
    const handleRatingChange = (type, value) => {
        setForm(prev => ({ ...prev, [type]: value }));
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!orderData) return;

        setSubmitting(true);

        const payload = {
            id_pemesanan: orderData.id_pemesanan,
            id_armada: orderData.id_armada,
            id_pengguna: orderData.id_pengguna,
            ...form
        };

        try {
            await submitReview(payload);
            alert('Terima kasih! Ulasan Anda berhasil dikirim.');
            navigate('/'); // Kembali ke home setelah sukses
        } catch (error) {
            console.error("Gagal mengirim ulasan:", error);
            alert('Gagal mengirim ulasan. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <GuestLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                </div>
            </GuestLayout>
        );
    }

    // Jika data tidak ditemukan setelah loading selesai
    if (!orderData) {
        return (
            <GuestLayout>
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-6">ID Pesanan yang Anda cari tidak tersedia atau belum selesai.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            {/* HEADER BACKGROUND */}
            <div className="bg-blue-50 py-12 text-center border-b border-blue-100 relative">
                <div className="container mx-auto px-4">
                   <button onClick={() => navigate(-1)} className="absolute left-4 top-4 md:left-10 md:top-10 text-blue-600 flex items-center gap-2 hover:underline text-sm font-medium">
                        <ArrowLeft size={16}/> Kembali ke Daftar Pemesanan
                   </button>
                    <h1 className="text-3xl font-bold text-blue-900 mb-2 mt-6 md:mt-0">Beri Ulasan</h1>
                    <p className="text-blue-600 text-sm md:text-base">Bagikan pengalaman Anda menggunakan layanan ZULZI TRANS</p>
                </div>
            </div>

            {/* CONTENT WRAPPER */}
            <div className="container mx-auto px-4 py-8 max-w-5xl -mt-8 relative z-10 mb-20">
                
                {/* 1. KARTU PESANAN */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    {/* Badge Status */}
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-100">
                        <CheckCircle size={16} />
                        <span>Perjalanan Selesai</span>
                    </div>

                    {/* Info Utama */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 border-b border-dashed border-gray-200">
                        <div className="flex gap-5 items-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Truck size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-xl">{orderData?.nama_armada}</h3>
                                <p className="text-gray-500 text-sm mt-1">Kode Pesanan: <span className="font-mono text-gray-700">{orderData?.kode_pesanan}</span></p>
                                <div className="mt-2">
                                   <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-wide">Perjalanan Selesai</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0 text-right w-full md:w-auto">
                            <div className="text-blue-600 font-bold text-2xl">Rp {orderData?.total_biaya}</div>
                            <div className="text-gray-400 text-xs mt-1 font-medium">Selesai: {orderData?.jam_selesai}</div>
                        </div>
                    </div>

                    {/* Grid Detail (Tanggal, Rute, Driver) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 text-center flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 border-dashed">
                            <div className="text-gray-400 mb-2">
                                <Calendar size={20} />
                            </div>
                            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Tanggal</div>
                            <div className="font-bold text-gray-800">{orderData?.tgl_selesai_formatted}</div>
                        </div>
                        <div className="p-6 text-center flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 border-dashed">
                            <div className="text-gray-400 mb-2">
                                <MapPin size={20} />
                            </div>
                            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Rute</div>
                            <div className="font-bold text-gray-800">{orderData?.rute}</div>
                        </div>
                        <div className="p-6 text-center flex flex-col items-center justify-center">
                            <div className="text-gray-400 mb-2">
                                <User size={20} />
                            </div>
                            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Driver</div>
                            <div className="font-bold text-gray-800">{orderData?.nama_supir}</div>
                        </div>
                    </div>
                </div>

                {/* FORM WRAPPER */}
                <form onSubmit={handleSubmit}>
                    
                    {/* 2. BAGIAN RATING */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
                            <Star className="text-blue-500 fill-blue-500" size={20} />
                            <h3 className="font-bold text-blue-900 text-lg">Berikan Rating</h3>
                        </div>

                        {/* 3 Kolom Rating */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center mb-10">
                            {/* Kualitas Driver */}
                            <div className="flex flex-col items-center group">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4 group-hover:bg-blue-100 transition-colors">
                                    <User size={28} />
                                </div>
                                <label className="font-bold text-gray-800 mb-1">Kualitas Driver</label>
                                <p className="text-xs text-gray-400 mb-4">
                                    {form.rating_driver > 0 ? 'Sudah dinilai' : 'Belum diberi rating'}
                                </p>
                                <StarRating rating={form.rating_driver} setRating={(val) => handleRatingChange('rating_driver', val)} />
                            </div>

                            {/* Kondisi Kendaraan */}
                            <div className="flex flex-col items-center group">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 group-hover:bg-green-100 transition-colors">
                                    <Truck size={28} />
                                </div>
                                <label className="font-bold text-gray-800 mb-1">Kondisi Kendaraan</label>
                                <p className="text-xs text-gray-400 mb-4">
                                    {form.rating_kendaraan > 0 ? 'Sudah dinilai' : 'Belum diberi rating'}
                                </p>
                                <StarRating rating={form.rating_kendaraan} setRating={(val) => handleRatingChange('rating_kendaraan', val)} />
                            </div>

                            {/* Pelayanan Umum */}
                            <div className="flex flex-col items-center group">
                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-4 group-hover:bg-purple-100 transition-colors">
                                    <Heart size={28} />
                                </div>
                                <label className="font-bold text-gray-800 mb-1">Pelayanan Umum</label>
                                <p className="text-xs text-gray-400 mb-4">
                                    {form.rating_pelayanan > 0 ? 'Sudah dinilai' : 'Belum diberi rating'}
                                </p>
                                <StarRating rating={form.rating_pelayanan} setRating={(val) => handleRatingChange('rating_pelayanan', val)} />
                            </div>
                        </div>

                        {/* Rating Keseluruhan Display */}
                        <div className="bg-blue-50/50 rounded-2xl p-8 text-center border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wide mb-3">Rating Keseluruhan</h4>
                            <div className="flex justify-center mb-3">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                            key={star}
                                            size={32} 
                                            className={`${star <= Math.round(averageRating) ? 'fill-blue-400 text-blue-400' : 'fill-gray-200 text-gray-200'}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-4xl font-extrabold text-blue-900 tracking-tight">{averageRating}<span className="text-xl text-gray-400 font-normal ml-1">/ 5.0</span></div>
                        </div>
                    </div>

                    {/* 3. BAGIAN KOMENTAR */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-100 p-1.5 rounded text-blue-600">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <h3 className="font-bold text-blue-900 text-lg">Tulis Ulasan</h3>
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Ceritakan pengalaman Anda</label>
                            <textarea
                                rows="5"
                                value={form.komentar}
                                onChange={(e) => handleRatingChange('komentar', e.target.value)}
                                placeholder="Bagikan pengalaman Anda menggunakan layanan ZULZI TRANS. Apakah driver profesional? Bagaimana kondisi kendaraan? Apakah pelayanan memuaskan?"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none transition-all placeholder-gray-400 leading-relaxed"
                                maxLength={500}
                            ></textarea>
                        </div>
                        <div className="text-right text-xs text-gray-400 font-medium">
                            {form.komentar.length}/500 karakter
                        </div>
                    </div>

                    {/* BUTTONS ACTION */}
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-10 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-200 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || form.rating_driver === 0}
                            className={`px-10 py-4 bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2 transition-all
                                ${submitting || form.rating_driver === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:shadow-xl hover:-translate-y-0.5'}
                            `}
                        >
                            {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                            {!submitting && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                        </button>
                    </div>
                </form>

            </div>
        </GuestLayout>
    );
}