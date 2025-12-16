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
  const [komentarError, setKomentarError] = useState('');
  const [ratingErrors, setRatingErrors] = useState({
    driver: false,
    kendaraan: false,
    pelayanan: false
  });
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
    // Clear error when user selects a rating
    if (ratingErrors[type]) {
      setRatingErrors(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    let hasError = false;
    const newRatingErrors = { driver: false, kendaraan: false, pelayanan: false };
    
    // Check all ratings
    if (ratings.driver === 0) {
      newRatingErrors.driver = true;
      hasError = true;
    }
    if (ratings.kendaraan === 0) {
      newRatingErrors.kendaraan = true;
      hasError = true;
    }
    if (ratings.pelayanan === 0) {
      newRatingErrors.pelayanan = true;
      hasError = true;
    }
    
    // Check komentar
    if (!komentar.trim()) {
      setKomentarError('Komentar wajib diisi');
      hasError = true;
    } else if (komentar.trim().length < 10) {
      setKomentarError('Komentar minimal 10 karakter');
      hasError = true;
    } else {
      setKomentarError('');
    }
    
    setRatingErrors(newRatingErrors);
    
    if (hasError) {
      setError('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setSubmitting(true);
    setError(null); // Clear any previous errors
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

      // Redirect ke success page dengan ulasan ID (path parameter)
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
            type="button"
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
      <div className="flex justify-between items-center">
        <p className={`text-xs transition-colors ${
          ratingErrors[type] ? 'text-red-500 font-medium' : 'text-gray-500'
        }`}>
          {ratingErrors[type] ? '⚠ Wajib beri rating' : `Rating: ${ratings[type]}/5`}
        </p>
        {ratings[type] > 0 && !ratingErrors[type] && (
          <p className="text-xs text-green-600">✓ Terisi</p>
        )}
      </div>
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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fbff] to-white flex flex-col overflow-y-auto">
      <Navbar />

      {/* Main Content - dengan padding-top untuk mengkompensasi navbar fixed */}
      <div className="flex-1 py-12 pt-24">
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
                  <p className="font-bold text-gray-800">{pemesanan.nama_armada || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pemesanan</p>
                  <p className="font-bold text-gray-800">{pemesanan.tgl_pesan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Harga</p>
                  <p className="font-bold text-gray-800">{pemesanan.total_biaya}</p>
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
                  onChange={(e) => {
                    setKomentar(e.target.value);
                    const val = e.target.value.trim();
                    if (komentarError) {
                      if (!val) {
                        setKomentarError('Komentar wajib diisi');
                      } else if (val.length < 10) {
                        setKomentarError('Komentar minimal 10 karakter');
                      } else {
                        setKomentarError('');
                      }
                    }
                  }}
                  placeholder="Ceritakan pengalaman Anda menggunakan layanan Zulzi Trans (minimal 10 karakter)..."
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none resize-none transition-all ${
                    komentarError 
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                      : 'border-blue-100 focus:border-[#5eb3ff] focus:ring-2 focus:ring-[#5eb3ff]/20'
                  }`}
                  rows={5}
                  disabled={submitting}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-xs transition-colors ${komentarError ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {komentarError ? `⚠ ${komentarError}` : `${komentar.length}/500 karakter`}
                  </p>
                  {komentar.trim().length >= 10 && !komentarError && (
                    <p className="text-xs text-green-600">✓ Valid</p>
                  )}
                </div>
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
