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
        $ulasan = Ulasan::with('pengguna') 
                        ->latest('tgl_ulasan') 
                        ->limit(5)            
                        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $ulasan
        ]);
    }

    public function getReviewTarget($id_pemesanan)
    {
        $pemesanan = Pemesanan::with(['armada', 'supir', 'pengguna'])
            ->find($id_pemesanan);

        if (!$pemesanan) {
            return response()->json(['status' => 'error', 'message' => 'Pesanan tidak ditemukan'], 404);
        }

        $data = [
            'id_pemesanan' => $pemesanan->id_pemesanan,
            'id_armada' => $pemesanan->id_armada,
            'id_pengguna' => $pemesanan->id_pengguna,
            'kode_pesanan' => 'ZT-2025-' . str_pad($pemesanan->id_pemesanan, 6, '0', STR_PAD_LEFT),
            'tgl_selesai_formatted' => Carbon::parse($pemesanan->tgl_selesai)->translatedFormat('d F Y'),
            'jam_selesai' => '13:30 WIB',
            'rute' => $pemesanan->lokasi_jemput . ' → ' . $pemesanan->lokasi_tujuan,
            'total_biaya' => number_format($pemesanan->total_biaya, 0, ',', '.'),
            
            // PENTING: Menggunakan jenis_kendaraan karena kolom nama_armada tidak ada di tabel
            'nama_armada' => $pemesanan->armada ? $pemesanan->armada->jenis_kendaraan : 'Armada Tidak Dikenal',
            
            'nama_supir' => $pemesanan->supir ? $pemesanan->supir->nama : 'Supir Tidak Dikenal',
            'foto_armada' => null,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_pemesanan' => 'required|exists:pemesanan,id_pemesanan',
            'id_armada' => 'required|exists:armada,id_armada',
            'id_pengguna' => 'required|exists:user,id_pengguna',
            'rating_driver' => 'required|integer|min:1|max:5',
            'rating_kendaraan' => 'required|integer|min:1|max:5',
            'rating_pelayanan' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            $ulasan = Ulasan::create([
                'id_pengguna' => $request->id_pengguna,
                'id_armada' => $request->id_armada,
                'id_pemesanan' => $request->id_pemesanan,
                'rating_driver' => $request->rating_driver,
                'rating_kendaraan' => $request->rating_kendaraan,
                'rating_pelayanan' => $request->rating_pelayanan,
                'komentar' => $request->komentar,
                'tgl_ulasan' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Ulasan berhasil dikirim!',
                'data' => $ulasan
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menyimpan ulasan: ' . $e->getMessage()], 500);
        }
    }
}