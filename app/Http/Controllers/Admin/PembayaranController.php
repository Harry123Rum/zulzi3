<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function index(Request $request)
    {
        // ✅ PERBAIKAN: Ganti 'user' jadi 'pengguna'
        $query = Pembayaran::with(['pemesanan.pengguna', 'pemesanan.layanan']);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            
            $query->where(function($q) use ($search) {
                $q->where('id_pembayaran', 'like', "%{$search}%")
                  ->orWhere('metode_bayar', 'like', "%{$search}%"); // Ubah dari metode_pembayaran
                
                // ✅ PERBAIKAN: Ganti 'user' jadi 'pengguna'
                $q->orWhereHas('pemesanan.pengguna', function($uq) use ($search) {
                    $uq->where('nama', 'like', "%{$search}%");
                });
            });
        }

        $data = $query->latest('tgl_bayar')->get(); // Tambahkan orderBy

        return response()->json($data);
    }

    public function show($id)
    {
        // ✅ PERBAIKAN: Ganti 'user' jadi 'pengguna'
        $pembayaran = Pembayaran::with(['pemesanan.pengguna', 'pemesanan.layanan'])->find($id);

        if (!$pembayaran) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($pembayaran);
    }

    public function verify(Request $request, $id)
    {
        $pembayaran = Pembayaran::find($id);
        if (!$pembayaran) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // Logika verifikasi (sesuaikan dengan kebutuhan)
        $action = $request->input('action'); // 'approve' atau 'reject'
        
        if ($action === 'approve') {
            $pembayaran->id_admin = auth()->id() ?? 1; // Set admin yang verifikasi
            $pembayaran->save();

            // Update status pemesanan jika perlu
            if ($pembayaran->pemesanan) {
                $pembayaran->pemesanan->status_pemesanan = 'Selesai';
                $pembayaran->pemesanan->save();
            }
        }

        return response()->json([
            'message' => $action === 'approve' ? 'Pembayaran diverifikasi' : 'Pembayaran ditolak',
            'data' => $pembayaran
        ]);
    }

    public function statistics()
    {
        $total = Pembayaran::sum('jumlah_bayar');
        $count = Pembayaran::count();
        $pending = Pembayaran::whereNull('id_admin')->count();

        return response()->json([
            'total_pendapatan' => $total,
            'total_transaksi' => $count,
            'menunggu_verifikasi' => $pending
        ]);
    }
}