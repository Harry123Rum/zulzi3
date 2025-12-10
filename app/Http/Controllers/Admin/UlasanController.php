<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ulasan;
use App\Models\User; // Digunakan untuk relasi Pengguna
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UlasanController extends Controller
{
    /**
     * Menampilkan daftar ulasan dengan eager loading relasi dan filter.
     */
    public function index(Request $request)
    {
        // Muat relasi yang diperlukan: Pengguna, Pemesanan, dan Layanan dari Pemesanan
        $query = Ulasan::with(['pengguna', 'pemesanan.layanan', 'armada']);
        
        // Handle Pencarian
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('pengguna', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%");
            })->orWhere('komentar', 'like', "%{$search}%");
        }
        
        // Handle Filter Layanan (Rental, Angkutan, Sampah)
        if ($request->has('layanan_filter') && $request->layanan_filter != 'Semua') {
            $layanan = $request->layanan_filter;
            $query->whereHas('pemesanan.layanan', function ($q) use ($layanan) {
                $q->where('nama_layanan', $layanan); 
            });
        }
        
        $ulasanList = $query->orderBy('tgl_ulasan', 'desc')->get()->map(function ($ulasan) {
            
            // Hitung rata-rata rating
            $ratings = [
                $ulasan->rating_driver,
                $ulasan->rating_kendaraan,
                $ulasan->rating_pelayanan
            ];
            $rataRata = round(array_sum($ratings) / 3, 1);
            
            return [
                'id_ulasan' => $ulasan->id_ulasan,
                
                // Menerapkan Optional Chaining (?->) secara konsisten
                'pelanggan_nama' => $ulasan->pengguna?->nama ?? 'N/A',
                'layanan_nama' => $ulasan->pemesanan?->layanan?->nama_layanan ?? 'N/A',
                'armada_no_plat' => $ulasan->armada?->no_plat ?? 'N/A',
                
                'rating_driver' => $ulasan->rating_driver,
                'rating_kendaraan' => $ulasan->rating_kendaraan,
                'rating_pelayanan' => $ulasan->rating_pelayanan,
                'rata_rata' => $rataRata,
                'komentar' => $ulasan->komentar,
                'tgl_ulasan' => $ulasan->tgl_ulasan ? $ulasan->tgl_ulasan->format('d M Y') : 'N/A',
                'tanggapan_admin' => $ulasan->tanggapan_admin,
                'is_displayed' => (bool) $ulasan->is_displayed,
            ];
        });

        // Mengambil total ulasan untuk ditampilkan di header
        $totalUlasan = Ulasan::count(); 
        $displayedUlasan = Ulasan::where('is_displayed', true)->count();

        return response()->json([
            'data' => $ulasanList,
            'total' => $totalUlasan,
            'displayed_count' => $displayedUlasan
        ]);
    }
    
    /**
     * Menampilkan satu data ulasan untuk modal detail.
     */
    public function show($id_ulasan)
    {
        $ulasan = Ulasan::with(['pengguna', 'pemesanan.layanan', 'armada'])->findOrFail($id_ulasan);
        
        // Hitung rata-rata
        $ratings = [
            $ulasan->rating_driver,
            $ulasan->rating_kendaraan,
            $ulasan->rating_pelayanan
        ];
        $rataRata = round(array_sum($ratings) / 3, 1);

        return response()->json([
            'id_ulasan' => $ulasan->id_ulasan,
            
            // Menggunakan Optional Chaining (?->) secara konsisten
            'pelanggan_nama' => $ulasan->pengguna?->nama ?? 'N/A',
            'layanan_nama' => $ulasan->pemesanan?->layanan?->nama_layanan ?? 'N/A',
            
            'rating_driver' => $ulasan->rating_driver,
            'rating_kendaraan' => $ulasan->rating_kendaraan,
            'rating_pelayanan' => $ulasan->rating_pelayanan,
            'rata_rata' => $rataRata,
            'komentar' => $ulasan->komentar,
            'tgl_ulasan' => $ulasan->tgl_ulasan ? $ulasan->tgl_ulasan->format('d M Y') : 'N/A',
            'tanggapan_admin' => $ulasan->tanggapan_admin,
            'is_displayed' => (bool) $ulasan->is_displayed,
        ]);
    }
    
    /**
     * Memperbarui tanggapan admin dan status tampilkan.
     */
    public function update(Request $request, $id_ulasan)
    {
        $ulasan = Ulasan::findOrFail($id_ulasan);

        $validator = Validator::make($request->all(), [
            'tanggapan_admin' => 'nullable|string',
            'is_displayed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ulasan->update($validator->validated());
        return response()->json($ulasan);
    }

    /**
     * Menghapus ulasan.
     */
    public function destroy($id_ulasan)
    {
        $ulasan = Ulasan::findOrFail($id_ulasan);
        $ulasan->delete();

        return response()->json(null, 204);
    }
}