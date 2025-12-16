<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use App\Models\Pemesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ReviewController extends Controller
{
    public function getPublicReviews()
    {
        try {
            $ulasan = Ulasan::with('pengguna')
                            ->where('is_displayed', true)  // Filter hanya review yang ditampilkan
                            ->latest('tgl_ulasan')
                            ->limit(5)
                            ->get();

            return response()->json([
                'status' => 'success',
                'data' => $ulasan,
                'count' => $ulasan->count()
            ]);
        } catch (\Exception $e) {
            // Jika kolom belum ada, return empty array
            return response()->json([
                'status' => 'success',
                'data' => [],
                'message' => 'Kolom is_displayed mungkin belum di-migrate. Jalankan: php artisan migrate'
            ]);
        }
    }

    public function getReviewTarget($id_pemesanan)
    {
        $pemesanan = Pemesanan::with(['armada', 'supir', 'pengguna', 'layanan'])
            ->find($id_pemesanan);

        if (!$pemesanan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        // Validasi: order harus selesai sebelum bisa direview
        if ($pemesanan->status_pemesanan !== 'Selesai') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan belum selesai. Hanya pesanan selesai yang bisa direview.'
            ], 400);
        }

        // Cek apakah sudah pernah direview
        $existingReview = Ulasan::where('id_pemesanan', $id_pemesanan)->first();
        if ($existingReview) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan ini sudah direview'
            ], 400);
        }

        $data = [
            'id_pemesanan' => $pemesanan->id_pemesanan,
            'id_armada' => $pemesanan->id_armada,
            'id_pengguna' => $pemesanan->id_pengguna,
            'kode_pesanan' => 'ZT-' . str_pad($pemesanan->id_pemesanan, 5, '0', STR_PAD_LEFT),
            'layanan' => $pemesanan->layanan ? $pemesanan->layanan->nama_layanan : 'Layanan',
            'tgl_pesan' => $pemesanan->tgl_pesan ? Carbon::parse($pemesanan->tgl_pesan)->translatedFormat('d F Y') : '-',
            'tgl_selesai' => $pemesanan->tgl_selesai ? Carbon::parse($pemesanan->tgl_selesai)->translatedFormat('d F Y') : '-',
            'rute' => $pemesanan->lokasi_jemput . ' → ' . $pemesanan->lokasi_tujuan,
            'total_biaya' => 'Rp ' . number_format($pemesanan->total_biaya, 0, ',', '.'),
            'nama_armada' => $pemesanan->armada ? $pemesanan->armada->jenis_kendaraan : 'Belum ditentukan',
            'no_plat' => $pemesanan->armada ? $pemesanan->armada->no_plat : '-',
            'nama_supir' => $pemesanan->supir ? $pemesanan->supir->nama : 'Belum ditentukan',
            'no_telepon_supir' => $pemesanan->supir ? $pemesanan->supir->no_telepon : '-',
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_pemesanan' => 'required|integer|exists:pemesanan,id_pemesanan',
            'id_armada' => 'required|exists:armada,id_armada',
            'rating_driver' => 'required|integer|min:1|max:5',
            'rating_kendaraan' => 'required|integer|min:1|max:5',
            'rating_pelayanan' => 'required|integer|min:1|max:5',
            'komentar' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            // Cek pemesanan exist dan status selesai
            $pemesanan = Pemesanan::find($request->id_pemesanan);
            if (!$pemesanan) {
                return response()->json(['status' => 'error', 'message' => 'Pesanan tidak ditemukan'], 404);
            }

            if ($pemesanan->status_pemesanan !== 'Selesai') {
                return response()->json(['status' => 'error', 'message' => 'Hanya pesanan selesai yang bisa direview'], 400);
            }

            // Cek duplikasi review
            $existingReview = Ulasan::where('id_pemesanan', $request->id_pemesanan)->first();
            if ($existingReview) {
                return response()->json(['status' => 'error', 'message' => 'Pesanan ini sudah direview'], 400);
            }

            // Get user ID from auth
            $userId = auth()->id() ?? $pemesanan->id_pengguna;

            $ulasan = Ulasan::create([
                'id_pengguna' => $userId,
                'id_armada' => $request->id_armada,
                'id_pemesanan' => $request->id_pemesanan,
                'rating_driver' => $request->rating_driver,
                'rating_kendaraan' => $request->rating_kendaraan,
                'rating_pelayanan' => $request->rating_pelayanan,
                'komentar' => $request->komentar,
                'tgl_ulasan' => now(),
                'is_displayed' => false, // Default false, admin yang approve
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Ulasan berhasil dikirim! Menunggu persetujuan admin.',
                'data' => $ulasan
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menyimpan ulasan: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $ulasan = Ulasan::with(['pemesanan.armada', 'pengguna'])
                ->find($id);

            if (!$ulasan) {
                return response()->json(['status' => 'error', 'message' => 'Ulasan tidak ditemukan'], 404);
            }

            // Format ulasan data with kode_pesanan
            $ulasanArray = $ulasan->toArray();
            
            // Add kode_pesanan to pemesanan if it exists
            if ($ulasan->pemesanan) {
                $ulasanArray['pemesanan']['kode_pesanan'] = 'ZT-' . str_pad($ulasan->pemesanan->id_pemesanan, 5, '0', STR_PAD_LEFT);
            }

            // TEST MODE: Allow anyone to view ulasan for demo
            return response()->json([
                'status' => 'success',
                'data' => $ulasanArray
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil ulasan: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $ulasan = Ulasan::find($id);

            if (!$ulasan) {
                return response()->json(['status' => 'error', 'message' => 'Ulasan tidak ditemukan'], 404);
            }

            // TEST MODE: Allow anyone to delete ulasan for demo
            $ulasan->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Ulasan berhasil dihapus!'
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus ulasan: ' . $e->getMessage()], 500);
        }
    }
}
