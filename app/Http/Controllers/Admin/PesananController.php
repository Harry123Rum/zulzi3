<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PemesananController extends Controller
{
    /**
     * Menampilkan daftar pemesanan
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $layanan = $request->input('layanan', 'rental'); // rental, angkutan, sampah

        // Mapping layanan ke nama layanan di database
        $layananMap = [
            'rental' => 'Rental',
            'angkutan' => 'Angkutan',
            'sampah' => 'Sampah'
        ];

        $query = DB::table('pemesanan')
            ->join('user', 'pemesanan.id_pengguna', '=', 'user.id_pengguna')
            ->join('layanan', 'pemesanan.id_layanan', '=', 'layanan.id_layanan')
            ->leftJoin('supir', 'pemesanan.id_supir', '=', 'supir.id_supir')
            ->leftJoin('armada', 'pemesanan.id_armada', '=', 'armada.id_armada')
            ->select(
                'pemesanan.id_pemesanan',
                DB::raw("CONCAT('RNT-', LPAD(pemesanan.id_pemesanan, 3, '0')) as kode_pesanan"),
                'user.nama as nama_pelanggan',
                'pemesanan.lokasi_jemput',
                'pemesanan.lokasi_tujuan',
                'pemesanan.tgl_pesan',
                'pemesanan.tgl_mulai',
                'pemesanan.tgl_selesai',
                'pemesanan.total_biaya',
                'pemesanan.status_pemesanan',
                'pemesanan.jumlah_orang',
                'pemesanan.est_berat_ton',
                'pemesanan.lama_rental',
                'supir.nama as nama_supir',
                'armada.nama_armada',
                'layanan.nama_layanan'
            )
            ->where('layanan.nama_layanan', 'LIKE', '%' . $layananMap[$layanan] . '%');

        // Filter pencarian
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('user.nama', 'LIKE', "%{$search}%")
                    ->orWhere('pemesanan.lokasi_tujuan', 'LIKE', "%{$search}%")
                    ->orWhere('pemesanan.lokasi_jemput', 'LIKE', "%{$search}%")
                    ->orWhere('supir.nama', 'LIKE', "%{$search}%")
                    ->orWhere('armada.nama_armada', 'LIKE', "%{$search}%")
                    ->orWhere(DB::raw("CONCAT('RNT-', LPAD(pemesanan.id_pemesanan, 3, '0'))"), 'LIKE', "%{$search}%");
            });
        }

        $pemesanan = $query->orderBy('pemesanan.tgl_pesan', 'desc')->get();

        // Tambahkan harga diskon jika ada (contoh logika diskon)
        $pemesanan->transform(function ($item) {
            // Contoh: Jika status berlangsung, berikan diskon 10%
            if ($item->status_pemesanan === 'Berlangsung') {
                $item->harga_diskon = $item->total_biaya * 0.9;
            } else {
                $item->harga_diskon = null;
            }
            return $item;
        });

        return response()->json($pemesanan);
    }

    /**
     * Menampilkan detail pemesanan
     */
    public function show($id)
    {
        $pemesanan = DB::table('pemesanan')
            ->join('user', 'pemesanan.id_pengguna', '=', 'user.id_pengguna')
            ->join('layanan', 'pemesanan.id_layanan', '=', 'layanan.id_layanan')
            ->leftJoin('supir', 'pemesanan.id_supir', '=', 'supir.id_supir')
            ->leftJoin('armada', 'pemesanan.id_armada', '=', 'armada.id_armada')
            ->select(
                'pemesanan.*',
                'user.nama as nama_pelanggan',
                'user.email',
                'user.no_telepon',
                'supir.nama as nama_supir',
                'armada.nama_armada',
                'layanan.nama_layanan'
            )
            ->where('pemesanan.id_pemesanan', $id)
            ->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        return response()->json($pemesanan);
    }

    /**
     * Membuat pemesanan baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_pengguna' => 'required|exists:user,id_pengguna',
            'id_layanan' => 'required|exists:layanan,id_layanan',
            'id_armada' => 'nullable|exists:armada,id_armada',
            'id_supir' => 'nullable|exists:supir,id_supir',
            'tgl_pesan' => 'required|date',
            'tgl_mulai' => 'required|date',
            'tgl_selesai' => 'required|date|after_or_equal:tgl_mulai',
            'lokasi_jemput' => 'required|string|max:255',
            'lokasi_tujuan' => 'required|string|max:255',
            'total_biaya' => 'required|numeric|min:0',
            'status_pemesanan' => 'required|string|max:20',
            'deskripsi_barang' => 'nullable|string',
            'est_berat_ton' => 'nullable|numeric',
            'foto_barang' => 'nullable|string',
            'jumlah_orang' => 'nullable|integer',
            'lama_rental' => 'nullable|integer',
        ]);

        $id = DB::table('pemesanan')->insertGetId($validated);

        return response()->json([
            'message' => 'Pemesanan berhasil dibuat',
            'id_pemesanan' => $id
        ], 201);
    }

    /**
     * Mengupdate pemesanan
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id_armada' => 'nullable|exists:armada,id_armada',
            'id_supir' => 'nullable|exists:supir,id_supir',
            'tgl_mulai' => 'sometimes|date',
            'tgl_selesai' => 'sometimes|date|after_or_equal:tgl_mulai',
            'lokasi_jemput' => 'sometimes|string|max:255',
            'lokasi_tujuan' => 'sometimes|string|max:255',
            'total_biaya' => 'sometimes|numeric|min:0',
            'status_pemesanan' => 'sometimes|string|max:20',
            'deskripsi_barang' => 'nullable|string',
            'est_berat_ton' => 'nullable|numeric',
            'foto_barang' => 'nullable|string',
            'jumlah_orang' => 'nullable|integer',
            'lama_rental' => 'nullable|integer',
        ]);

        $affected = DB::table('pemesanan')
            ->where('id_pemesanan', $id)
            ->update($validated);

        if ($affected === 0) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Pemesanan berhasil diupdate']);
    }

    /**
     * Verifikasi pemesanan (ubah status)
     */
    public function verifikasi($id)
    {
        $pemesanan = DB::table('pemesanan')->where('id_pemesanan', $id)->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        // Logika perubahan status
        $newStatus = match ($pemesanan->status_pemesanan) {
            'Menunggu' => 'Dikonfirmasi',
            'Dikonfirmasi' => 'Berlangsung',
            'Berlangsung' => 'Selesai',
            default => $pemesanan->status_pemesanan
        };

        DB::table('pemesanan')
            ->where('id_pemesanan', $id)
            ->update(['status_pemesanan' => $newStatus]);

        return response()->json([
            'message' => 'Status pemesanan berhasil diupdate',
            'new_status' => $newStatus
        ]);
    }

    /**
     * Menghapus pemesanan
     */
    public function destroy($id)
    {
        $affected = DB::table('pemesanan')->where('id_pemesanan', $id)->delete();

        if ($affected === 0) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Pemesanan berhasil dihapus']);
    }

    /**
     * Assign supir dan armada ke pemesanan
     */
    public function assignSupirArmada(Request $request, $id)
    {
        $validated = $request->validate([
            'id_supir' => 'required|exists:supir,id_supir',
            'id_armada' => 'required|exists:armada,id_armada',
        ]);

        $affected = DB::table('pemesanan')
            ->where('id_pemesanan', $id)
            ->update([
                'id_supir' => $validated['id_supir'],
                'id_armada' => $validated['id_armada'],
            ]);

        if ($affected === 0) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Supir dan armada berhasil di-assign']);
    }
}
