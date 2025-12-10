import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, User, Trash2, AlertCircle, Truck, MessageCircle, Heart } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

export default function ReviewSuccess() {
  const { id } = useParams(); // Get ulasan ID from route param
  const navigate = useNavigate();

  const [ulasan, setUlasan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ulasan data jika ada ID
  useEffect(() => {
    if (id) {
      fetchUlasan();
    } else {
      // Jika tidak ada ID, anggap success tanpa detail
      setLoading(false);
    }
  }, [id]);

  const fetchUlasan = async () => {
    try {
      const response = await axios.get(`/api/reviews/${id}`);
      if (response.data.status === 'success') {
        setUlasan(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching ulasan:', err);
      setError('Gagal memuat detail ulasan');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;

    setDeleting(true);
    try {
      await axios.delete(`/api/reviews/${id}`);
      alert('Ulasan berhasil dihapus');
      navigate('/profile');
    } catch (err) {
      alert('Gagal menghapus ulasan');
      setDeleting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00a3e0] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  };

  const avgRating = ulasan ? (
    (ulasan.rating_driver + ulasan.rating_kendaraan + ulasan.rating_pelayanan) / 3
  ).toFixed(1) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#003366] mb-3">
              Review Berhasil Dikirim!
            </h1>
            <p className="text-gray-600">
              Terima kasih atas ulasan Anda. Feedback Anda sangat berharga untuk meningkatkan kualitas layanan kami.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Review Summary (jika ada ulasan) */}
          {ulasan && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Ulasan Anda</h2>

              {/* Overall Rating */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Rating Keseluruhan</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-1 mb-2">
                      {renderStars(Math.round(avgRating))}
                    </div>
                    <p className="text-3xl font-black text-[#00a3e0]">{avgRating}/5.0</p>
                  </div>
                  <span className="text-sm text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">
                    ✓ Tersimpan
                  </span>
                </div>
              </div>

              {/* Rating Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Truck size={24} className="mx-auto text-[#00a3e0] mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Kualitas Driver</p>
                  <div className="flex justify-center gap-0.5 mb-1">
                    {renderStars(ulasan.rating_driver)}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{ulasan.rating_driver}/5</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <MessageCircle size={24} className="mx-auto text-[#00a3e0] mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Kondisi Kendaraan</p>
                  <div className="flex justify-center gap-0.5 mb-1">
                    {renderStars(ulasan.rating_kendaraan)}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{ulasan.rating_kendaraan}/5</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Heart size={24} className="mx-auto text-[#00a3e0] mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Pelayanan Umum</p>
                  <div className="flex justify-center gap-0.5 mb-1">
                    {renderStars(ulasan.rating_pelayanan)}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{ulasan.rating_pelayanan}/5</p>
                </div>
              </div>

              {/* Comment */}
              <div className="border-t-2 border-gray-100 pt-6">
                <h3 className="font-bold text-gray-800 mb-3">Ulasan Anda:</h3>
                <p className="text-gray-700 leading-relaxed italic">"{ulasan.komentar}"</p>
              </div>

              {/* Admin Response (jika ada) */}
              {ulasan.tanggapan_admin && (
                <div className="mt-6 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-sm font-bold text-blue-900 mb-2">💬 Tanggapan Admin:</p>
                  <p className="text-sm text-blue-800">{ulasan.tanggapan_admin}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in-up">
            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-[#003366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#002244] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <User size={20} />
                Kembali ke Profil
              </button>

              <button
                onClick={() => navigate('/beranda')}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Ke Halaman Utama
              </button>

              {/* Button Hapus (hanya jika ada ulasan) */}
              {ulasan && (
                <button
                  onClick={handleDeleteReview}
                  disabled={deleting}
                  className="w-full border-2 border-red-500 text-red-500 px-6 py-3 rounded-xl font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={20} />
                  {deleting ? 'Menghapus...' : 'Batal Ulasan'}
                </button>
              )}
            </div>

            {/* Info */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Review Anda akan ditampilkan setelah disetujui admin
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
