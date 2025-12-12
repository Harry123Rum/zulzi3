<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pembayaran;
use App\Models\Pemesanan; // Import Model Pemesanan
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PembayaranController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'id_pemesanan' => 'required|exists:pemesanan,id_pemesanan',
            'jumlah_bayar' => 'required|numeric|min:1',
            'metode_bayar' => 'required|in:BCA,QRIS',
            'jenis_pembayaran' => 'required|in:DP,LUNAS',
            'bukti_transfer' => 'required|file|image|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Upload Bukti
        $path = null;
        if ($request->hasFile('bukti_transfer')) {
            $path = $request->file('bukti_transfer')->store('public/uploads/pembayaran');
            $path = Storage::url($path);
        }

        // 2B. Cek apakah ini upload ulang (status = Pembayaran Ditolak)
        $pemesanan = Pemesanan::find($request->id_pemesanan);
        if ($pemesanan->status_pemesanan === 'Pembayaran Ditolak') {
            // Hapus pembayaran yang ditolak (Rejected)
            Pembayaran::where('id_pemesanan', $request->id_pemesanan)
                ->where('jenis_pembayaran', $request->jenis_pembayaran)
                ->where('status_pembayaran', 'Ditolak')
                ->delete();
        }

        // 3. Simpan ke Tabel Pembayaran
        try {
            $pembayaran = Pembayaran::create([
                'id_pemesanan' => $request->id_pemesanan,
                'tgl_bayar' => now(),
                'jumlah_bayar' => $request->jumlah_bayar,
                'metode_bayar' => $request->metode_bayar,
                'jenis_pembayaran' => $request->jenis_pembayaran,
                'bukti_transfer' => $path,
                'status_pembayaran' => 'Menunggu', // Default Menunggu
                'id_admin' => null,
            ]);

            // --- PERUBAHAN: UPDATE STATUS PEMESANAN ---
            // Agar status berubah dari 'Dikonfirmasi' atau 'Pembayaran Ditolak' -> 'Menunggu Verifikasi'
            $pemesanan->status_pemesanan = 'Menunggu Verifikasi';
            $pemesanan->save();
            // ------------------------------------------

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayaran berhasil dikirim! Menunggu verifikasi Admin.',
                'data' => $pembayaran
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menyimpan pembayaran', 'error' => $e->getMessage()], 500);
        }
    }
}