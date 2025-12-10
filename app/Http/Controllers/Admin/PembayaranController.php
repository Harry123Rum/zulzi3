<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PembayaranController extends Controller
{
    /**
     * Menampilkan daftar pembayaran dengan pencarian
     */
    public function index(Request $request)
{
    $search = $request->input('search', '');

    $query = DB::table('pembayaran')
        ->join('pemesanan', 'pembayaran.id_pemesanan', '=', 'pemesanan.id_pemesanan')
        ->join('user', 'pemesanan.id_pengguna', '=', 'user.id_pengguna')
        ->select(
            'pembayaran.id_pembayaran',
            'pembayaran.id_pemesanan',
            'user.nama as nama',
            'pembayaran.jumlah_bayar',
            'pembayaran.tgl_bayar',
            'pembayaran.metode_bayar',
            'pembayaran.jenis_pembayaran',
            'pembayaran.bukti_transfer',
            'pembayaran.id_admin',
            'pembayaran.status_pembayaran'   // <-- WAJIB TAMBAH INI
        );

    if (!empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('pembayaran.id_pemesanan', 'like', "%{$search}%")
              ->orWhere('user.nama', 'like', "%{$search}%")
              ->orWhere('pembayaran.metode_bayar', 'like', "%{$search}%")
              ->orWhere('pembayaran.jenis_pembayaran', 'like', "%{$search}%");
              // Search  bulan
            $q->orWhereRaw("LOWER(MONTHNAME(pembayaran.tgl_bayar)) LIKE ?", ["%" . strtolower($search) . "%"]);

        });
    }

    $pembayaran = $query
        ->orderBy('pembayaran.created_at', 'desc') // urut berdasarkan tanggal terbaru
        ->orderByRaw("CASE
                            WHEN pembayaran.status_pembayaran = 'Menunggu' THEN 1
                            WHEN pembayaran.status_pembayaran = 'Terverfikasi' THEN 2
                            ELSE 3
                        END ASC") // urutkan status khusus
        ->get();

    // Tambahkan informasi tambahan seperti rekening tujuan dan waktu transfer
    $pembayaran = $pembayaran->map(function($item) {

        $item->rekening_tujuan = $this->getRekeningTujuan($item->metode_bayar);

        $item->waktu_transfer = $this->getWaktuTransfer($item->tgl_bayar);

        return $item;
    });

    return response()->json($pembayaran);
}


    /**
     * Menampilkan detail pembayaran
     */
    public function show($id)
    {
        $pembayaran = DB::table('pembayaran')
            ->join('pemesanan', 'pembayaran.id_pemesanan', '=', 'pemesanan.id_pemesanan')
            ->join('user', 'pemesanan.id_pengguna', '=', 'user.id_pengguna')
            ->select(
                'pembayaran.id_pembayaran',
                'pembayaran.id_pemesanan',
                'user.nama as nama',
                'pembayaran.jumlah_bayar',
                'pembayaran.tgl_bayar',
                'pembayaran.metode_bayar',
                'pembayaran.jenis_pembayaran',
                'pembayaran.bukti_transfer',
                'pembayaran.id_admin'
            )
            ->where('pembayaran.id_pembayaran', $id)
            ->first();

        if (!$pembayaran) {
            return response()->json(['message' => 'Pembayaran tidak ditemukan'], 404);
        }

        // Tambahkan info rekening dan waktu
        $pembayaran->rekening_tujuan = $this->getRekeningTujuan($pembayaran->metode_bayar);
        $pembayaran->waktu_transfer = $this->getWaktuTransfer($pembayaran->tgl_bayar);

        return response()->json($pembayaran);
    }

    /**
     * Verifikasi pembayaran (approve/reject)
     */
    public function verify(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject'
        ]);

        $adminId = Auth::id();

        // Ambil pembayaran
        $pembayaran = DB::table('pembayaran')->where('id_pembayaran', $id)->first();

        if (!$pembayaran) {
            return response()->json(['message' => 'Pembayaran tidak ditemukan'], 404);
        }

        // Ambil data pemesanan terkait
        $pemesanan = DB::table('pemesanan')->where('id_pemesanan', $pembayaran->id_pemesanan)->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        if ($request->action === 'approve') {
            // ✨ UPDATE STATUS PEMBAYARAN → Terverifikasi
            DB::table('pembayaran')
                ->where('id_pembayaran', $id)
                ->update([
                    'id_admin' => $adminId,
                    'status_pembayaran' => 'Terverifikasi'
                ]);

            // ✨ TENTUKAN STATUS PEMESANAN BERDASARKAN JENIS PEMBAYARAN
            $newOrderStatus = 'Lunas'; // default

            if ($pembayaran->jenis_pembayaran === 'LUNAS') {
                // Bayar LUNAS langsung → Status "Lunas"
                $newOrderStatus = 'Lunas';

            } elseif ($pembayaran->jenis_pembayaran === 'DP') {
                // Bayar DP → Status "DP Dibayar"
                $newOrderStatus = 'DP Dibayar';

            } elseif ($pembayaran->jenis_pembayaran === 'PELUNASAN') {
                // Bayar Pelunasan → Cek total pembayaran terverifikasi
                $totalTerbayar = DB::table('pembayaran')
                    ->where('id_pemesanan', $pembayaran->id_pemesanan)
                    ->where('status_pembayaran', 'Terverifikasi')
                    ->sum('jumlah_bayar');

                // Jika total terbayar >= total biaya → "Lunas"
                // Jika belum, tetap "DP Dibayar"
                if ($totalTerbayar >= $pemesanan->total_biaya) {
                    $newOrderStatus = 'Lunas';
                } else {
                    $newOrderStatus = 'DP Dibayar';
                }
            }

            DB::table('pemesanan')
                ->where('id_pemesanan', $pembayaran->id_pemesanan)
                ->update(['status_pemesanan' => $newOrderStatus]);

            return response()->json([
                'message' => 'Pembayaran berhasil disetujui',
                'status_pembayaran' => 'Terverifikasi',
                'order_status' => $newOrderStatus
            ]);

        } else {
            // ✨ REJECT: Status pembayaran → "Ditolak"
            // Status pemesanan → "Pembayaran Ditolak"
            DB::table('pembayaran')
                ->where('id_pembayaran', $id)
                ->update([
                    'id_admin' => $adminId,
                    'status_pembayaran' => 'Ditolak'
                ]);

            DB::table('pemesanan')
                ->where('id_pemesanan', $pembayaran->id_pemesanan)
                ->update(['status_pemesanan' => 'Pembayaran Ditolak']);

            return response()->json([
                'message' => 'Pembayaran ditolak',
                'status_pembayaran' => 'Ditolak',
                'order_status' => 'Pembayaran Ditolak'
            ]);
        }
    }


    // FUNGSI DELETE
    public function destroy($id)
    {
        $pembayaran = DB::table('pembayaran')->where('id_pembayaran', $id)->first();

        if (!$pembayaran) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // Hapus file bukti transfer jika ada
        if ($pembayaran->bukti_transfer && file_exists(storage_path('app/public/' . $pembayaran->bukti_transfer))) {
            unlink(storage_path('app/public/' . $pembayaran->bukti_transfer));
        }

        DB::table('pembayaran')->where('id_pembayaran', $id)->delete();

        return response()->json(['message' => 'Pembayaran berhasil dihapus']);
    }

    /**
     * Helper: Dapatkan rekening tujuan berdasarkan metode bayar
     */
    private function getRekeningTujuan($metodeBayar)
    {
        $rekeningMap = [
            'BCA - 1234567890' => 'BCA - 1234567890',
        ];

        return $rekeningMap[$metodeBayar] ?? 'BCA - 1234567890';
    }

    /**
     * Helper: Format waktu transfer dari tanggal bayar
     */
    private function getWaktuTransfer($tglBayar)
    {
        // Misalnya ambil waktu dari timestamp atau set default
        // Untuk sementara return format waktu default
        return date('H:i', strtotime($tglBayar)) . ' WIB';
    }
}
