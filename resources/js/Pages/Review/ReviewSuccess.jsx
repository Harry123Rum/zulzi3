import React, { useState, useEffect } from 'react';
import { CheckCircle, MessageCircle, Truck, Heart, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

export default function ReviewSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Get query params
  const ulasanId = searchParams.get('ulasan_id'); // Get ?ulasan_id=1 from URL
  const [ulasan, setUlasan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // TEST MODE: No login required for demo
    const token = localStorage.getItem('token');
    setIsLoggedIn(true); // TEST: Always allow
    
    if (ulasanId) {
      fetchUlasan();
    } else {
      setLoading(false);
    }
  }, [ulasanId]);

  const fetchUlasan = async () => {
    try {
      const response = await fetch(`/api/ulasan/${ulasanId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) {
        setError('Ulasan tidak ditemukan');
        setLoading(false);
        return;
      }
      const data = await response.json();
      setUlasan(data.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data ulasan. Coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;

    setDeleting(true);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      
      const response = await fetch(`/api/ulasan/${ulasanId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Gagal menghapus ulasan');
      
      // Redirect ke beranda
      navigate('/beranda');
    } catch (err) {
      setError(err.message || 'Gagal menghapus ulasan');
      console.error(err);
      setDeleting(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10b981'; // green
    if (rating >= 3) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#d1d5db' }}>
        ★
      </span>
    )).reduce((prev, curr) => [prev, ' ', curr]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin">
          <CheckCircle className="w-8 h-8 text-[#5eb3ff]" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Silakan Login Terlebih Dahulu</h2>
            <p className="text-gray-600 mb-6">Anda perlu login untuk melihat ulasan Anda.</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-[#5eb3ff] text-white rounded-lg hover:bg-[#4ca5ff]"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ulasan) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ulasan Tidak Ditemukan</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const avgRating = (
    (ulasan.rating_driver + ulasan.rating_kendaraan + ulasan.rating_pelayanan) / 3
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f0f7ff] to-[#e8f4ff] flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-black text-[#3d9cff] mb-2">Ulasan Berhasil Dikirim!</h1>
              <p className="text-gray-600">Terima kasih atas feedback Anda untuk ZULZI TRANS</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Rating Summary Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl p-8 mb-8 border-2 border-blue-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Ulasan Anda</h2>
              
              {/* Overall Rating */}
              <div className="bg-gradient-to-r from-[#5eb3ff]/10 to-[#3d9cff]/10 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Rating Keseluruhan</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-2 mb-2">
                      {renderStars(Math.round(avgRating))}
                    </div>
                    <p className="text-3xl font-black text-[#3d9cff]">{avgRating}/5.0</p>
                  </div>
                  <p className="text-sm text-green-600 font-bold">Berhasil Disimpan ✓</p>
                </div>
              </div>

              {/* Rating Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Driver Rating */}
                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100 text-center">
                  <div className="flex justify-center mb-2">
                    <Truck size={24} className="text-[#3d9cff]" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Kualitas Driver</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {renderStars(ulasan.rating_driver)}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{ulasan.rating_driver}/5</p>
                </div>

                {/* Vehicle Rating */}
                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100 text-center">
                  <div className="flex justify-center mb-2">
                    <MessageCircle size={24} className="text-[#3d9cff]" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Kondisi Kendaraan</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {renderStars(ulasan.rating_kendaraan)}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{ulasan.rating_kendaraan}/5</p>
                </div>

                {/* Service Rating */}
                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100 text-center">
                  <div className="flex justify-center mb-2">
                    <Heart size={24} className="text-[#3d9cff]" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Pelayanan Umum</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {renderStars(ulasan.rating_pelayanan)}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{ulasan.rating_pelayanan}/5</p>
                </div>
              </div>

              {/* Comment Section */}
              <div className="border-t-2 border-blue-100 pt-6">
                <h3 className="font-bold text-gray-800 mb-3">Ulasan Anda:</h3>
                <p className="text-gray-700 leading-relaxed italic">"{ulasan.komentar}"</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Detail Perjalanan yang Diulas</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Truck size={24} className="text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Kendaraan</p>
                  <p className="font-bold text-gray-800">{ulasan.armada?.jenis_kendaraan || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Kode Pesanan</p>
                  <p className="font-bold text-[#3d9cff] text-sm">{ulasan.pemesanan?.kode_pesanan}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Tanggal</p>
                  <p className="font-bold text-gray-800">{new Date(ulasan.tgl_ulasan).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {/* Feedback Note */}
              <div className="bg-gradient-to-r from-[#5eb3ff]/10 to-green-100 rounded-2xl p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-green-700">✓ Ulasan Anda tersimpan dengan aman!</span> Tim kami akan meninjau ulasan Anda untuk memastikan kualitas layanan kami terus meningkat.
                </p>
              </div>

              {/* Admin Response Section */}
              {ulasan.tanggapan_admin && (
                <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                  <p className="text-sm font-bold text-blue-900 mb-2">💬 Tanggapan Admin:</p>
                  <p className="text-sm text-blue-800">{ulasan.tanggapan_admin}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/beranda')}
                className="flex-1 px-6 py-3 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Kembali ke Beranda
              </button>
              <button
                onClick={handleDeleteReview}
                disabled={deleting}
                className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={20} />
                Batal Ulasan
              </button>
            </div>

            {/* Info Text */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Anda dapat menghapus atau mengubah ulasan Anda kapan saja dari halaman profil.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}