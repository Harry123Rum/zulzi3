import React, { useState, useEffect } from 'react';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

export default function ReviewForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get :id from /review/1
  const pesananId = id; // Use URL param as pesanan_id
  const [pemesanan, setPemesanan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form state
  const [ratings, setRatings] = useState({
    driver: 0,
    kendaraan: 0,
    pelayanan: 0
  });
  const [komentar, setKomentar] = useState('');
  const [hoveredRating, setHoveredRating] = useState({
    driver: 0,
    kendaraan: 0,
    pelayanan: 0
  });

  useEffect(() => {
    // TEST MODE: No login required for demo
    const token = localStorage.getItem('token');
    setIsLoggedIn(true); // TEST: Always allow

    if (pesananId) {
      fetchPemesanan();
    } else {
      setLoading(false);
    }
  }, [pesananId]);

  const fetchPemesanan = async () => {
    try {
      const response = await fetch(`/api/reviews/target/${pesananId}`);
      if (!response.ok) {
        setError('Pesanan tidak ditemukan');
        setLoading(false);
        return;
      }
      const data = await response.json();
      setPemesanan(data.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data pesanan. Coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (type, value) => {
    setRatings(prev => ({ ...prev, [type]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!komentar.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }

    setSubmitting(true);
    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id_pemesanan: parseInt(pesananId),
          id_armada: pemesanan?.id_armada,
          rating_driver: parseInt(ratings.driver),
          rating_kendaraan: parseInt(ratings.kendaraan),
          rating_pelayanan: parseInt(ratings.pelayanan),
          komentar: komentar.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.komentar?.[0] || 'Gagal menyimpan ulasan');
      }

      // Redirect ke success page dengan ulasan ID
      navigate(`/review-success/${data.data.id_ulasan}`);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan ulasan');
      console.error(err);
      setSubmitting(false);
    }
  };

  const ratingCategory = (label, type) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRatingChange(type, star)}
            onMouseEnter={() => setHoveredRating(prev => ({ ...prev, [type]: star }))}
            onMouseLeave={() => setHoveredRating(prev => ({ ...prev, [type]: 0 }))}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={`${
                star <= (hoveredRating[type] || ratings[type])
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">Rating: {ratings[type]}/5</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin">
          <CheckCircle2 className="w-8 h-8 text-[#5eb3ff]" />
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
            <p className="text-gray-600 mb-6">Anda perlu login untuk memberikan ulasan pada pesanan Anda.</p>
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

  if (!pesananId || !pemesanan) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pemesanan Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">Mohon maaf, data pemesanan yang Anda cari tidak ditemukan.</p>
            <button
              onClick={() => navigate('/beranda')}
              className="px-6 py-2 bg-[#5eb3ff] text-white rounded-lg hover:bg-[#4ca5ff]"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fbff] to-white flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-white fill-white" />
              </div>
              <h1 className="text-4xl font-black text-[#3d9cff] mb-2">Beri Ulasan</h1>
              <p className="text-gray-600">Bagikan pengalaman Anda dengan Zulzi Trans</p>
            </div>

            {/* Pemesanan Info */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-8 mb-8 border-2 border-blue-100">
              <h3 className="text-lg font-bold text-[#3d9cff] mb-4">Detail Pemesanan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Kode Pesanan</p>
                  <p className="font-bold text-gray-800">{pemesanan.kode_pesanan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Armada</p>
                  <p className="font-bold text-gray-800">{pemesanan.armada?.jenis_kendaraan || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pemesanan</p>
                  <p className="font-bold text-gray-800">{new Date(pemesanan.tgl_pemesanan).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Harga</p>
                  <p className="font-bold text-gray-800">Rp {(pemesanan.total_harga || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-8 border-2 border-blue-100">
              {/* Ratings */}
              <div className="space-y-8 mb-8">
                <h3 className="text-lg font-bold text-[#3d9cff]">Rating</h3>
                {ratingCategory('Kualitas Driver', 'driver')}
                {ratingCategory('Kondisi Kendaraan', 'kendaraan')}
                {ratingCategory('Pelayanan Umum', 'pelayanan')}
              </div>

              {/* Komentar */}
              <div className="mb-8">
                <label className="text-sm font-bold text-gray-700 block mb-2">Komentar Ulasan</label>
                <textarea
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda menggunakan layanan Zulzi Trans..."
                  className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-[#5eb3ff] focus:ring-2 focus:ring-[#5eb3ff]/20 resize-none"
                  rows={5}
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-2">{komentar.length}/500 karakter</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/beranda')}
                  className="flex-1 px-6 py-3 border-2 border-[#3d9cff] text-[#3d9cff] font-bold rounded-xl hover:bg-[#3d9cff] hover:text-white transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-br from-[#5eb3ff] to-[#3d9cff] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
