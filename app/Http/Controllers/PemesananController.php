<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pemesanan;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class PemesananController extends Controller
{
    /**
     * Menerima dan menyimpan data pemesanan dari React.
     */
    public function store(Request $request)
    {
        // PENTING: ID PENGGUNA di-mock karena belum ada sistem login.
        // Ganti dengan: $userId = auth()->id(); jika sudah ada auth
        $userId = 1; 

        // 1. Definisikan Validasi
        $rules = [
            'layanan' => 'required|in:rental,barang,sampah',
            'id_armada' => 'required|integer|exists:armada,id_armada', 
            'tgl_mulai' => 'required|date|after_or_equal:today',
            'lokasi_jemput' => 'required|string|max:255',
            
            // Aturan berdasarkan Layanan (Validasi bersyarat akan ditambahkan di bawah)
            'lama_rental' => 'nullable|integer|min:1',
            'opsi_supir' => 'nullable|in:with_driver,lepas_kunci',
            'lokasi_tujuan' => 'nullable|string|max:255',
            'est_berat_ton' => 'nullable|numeric|min:0.1',
            'deskripsi_barang' => 'nullable|string|max:500',
            'jenis_sampah' => 'nullable|string|max:100',
            'perkiraan_volume' => 'nullable|string|max:100',
            'catatan' => 'nullable|string|max:500',
            'foto_barang' => 'nullable|file|image|max:5120', // File field
            'foto_sampah' => 'nullable|file|image|max:5120', // File field
        ];
        
        $validator = Validator::make($request->all(), $rules);

        // Validasi Bersyarat (Contoh: jika layanan rental, maka lama_rental wajib)
        $validator->sometimes(['lama_rental', 'catatan'], 'required', function ($input) {
            return $input->layanan === 'rental';
        });

        // Validasi Bersyarat Angkut Barang
        $validator->sometimes(['lokasi_tujuan', 'est_berat_ton', 'deskripsi_barang'], 'required', function ($input) {
            return $input->layanan === 'barang';
        });

        // Validasi Bersyarat Angkut Sampah
        $validator->sometimes(['jenis_sampah', 'perkiraan_volume'], 'required', function ($input) {
            return $input->layanan === 'sampah';
        });


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Tentukan ID Layanan
        $layananId = match($request->layanan) {
            'rental' => 1, 
            'barang' => 2,
            'sampah' => 3,
            default => 1,
        };

        // 3. Siapkan Data Dasar
        $data = $validator->validated();
        $data['id_pengguna'] = $userId;
        $data['id_layanan'] = $layananId;
        $data['tgl_pesan'] = Carbon::now()->format('Y-m-d');
        $data['status_pemesanan'] = 'pending_approval';
        $data['total_biaya'] = 0; // Akan diupdate Admin nanti

        // 4. Handle Upload File (Foto Barang/Sampah)
        $fotoKey = ($request->layanan === 'sampah') ? 'foto_sampah' : 'foto_barang';
        
        if ($request->hasFile($fotoKey)) {
            // Upload file ke storage/app/public/pemesanan_foto
            $path = $request->file($fotoKey)->store('public/pemesanan_foto');
            // Simpan URL publik di kolom 'foto_barang' (kolom di Model/Migrasi)
            $data['foto_barang'] = Storage::url($path); 
        } else {
            $data['foto_barang'] = null; // Pastikan kolom NULL jika tidak ada file
        }

        // 5. Atur Nilai Default untuk Kolom Optional (Mengatasi error jika field tidak dikirim React)
        // Kita perlu pastikan semua kolom yang nullable di migrasi ada di payload $data
        $data['tgl_selesai'] = $request->tgl_selesai ?? null;
        $data['id_supir'] = $request->id_supir ?? null;
        $data['jumlah_orang'] = $request->jumlah_orang ?? null;
        
        // Data Angkut Barang
        $data['lokasi_tujuan'] = $request->lokasi_tujuan ?? null;
        $data['deskripsi_barang'] = $request->deskripsi_barang ?? null;
        $data['est_berat_ton'] = $request->est_berat_ton ?? null;

        // Data Angkut Sampah (digunakan di field yang sama)
        // Jika layanan sampah, kita salin isinya ke field deskripsi
        if ($request->layanan === 'sampah') {
            $data['deskripsi_barang'] = 'Jenis Sampah: ' . ($request->jenis_sampah ?? '') . ', Volume: ' . ($request->perkiraan_volume ?? '');
        }
        
        // Data Rental
        $data['lama_rental'] = $request->lama_rental ?? null;
        $data['catatan'] = $request->catatan ?? null;
        
        // Hapus field yang tidak ada di Models/Migrasi (misal: 'layanan', 'opsi_supir', 'foto_sampah', 'jenis_sampah', 'perkiraan_volume')
        unset($data['layanan']);
        unset($data['opsi_supir']);
        unset($data['foto_sampah']);
        unset($data['jenis_sampah']);
        unset($data['perkiraan_volume']);


        // 6. Simpan Data ke Database
        try {
            $pemesanan = Pemesanan::create($data);

            // 7. Respon Sukses
            return response()->json([
                'message' => 'Pemesanan berhasil dicatat. Tunggu konfirmasi Admin.',
                'order_id' => $pemesanan->id_pemesanan,
            ], 201);
        } catch (\Exception $e) {
            // Log error
            return response()->json(['error' => 'Gagal menyimpan pemesanan: ' . $e->getMessage()], 500);
        }
    }
}