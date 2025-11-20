<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Armada;
use App\Models\Layanan;
use App\Models\Supir;

class PemesananSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cari Customer
        $user = User::where('email', 'budi@gmail.com')->first();
        
        // 2. Cari Armada berdasarkan NO PLAT (karena nama_armada tidak ada di DB Anda)
        $armada = Armada::where('no_plat', 'B 7281 WDA')->first(); 

        // 3. Cari Layanan
        $layanan = Layanan::where('nama_layanan', 'Sewa Kendaraan')->first();
        
        // 4. Cari Supir
        $supir = Supir::first();

        // Pastikan data referensi ada sebelum insert
        if ($user && $armada && $layanan && $supir) {
            DB::table('pemesanan')->updateOrInsert(
                [
                    'id_pengguna' => $user->id_pengguna,
                    'tgl_pesan' => Carbon::now()->subDays(5)->format('Y-m-d'),
                ],
                [
                    'id_armada' => $armada->id_armada,
                    'id_layanan' => $layanan->id_layanan,
                    'id_supir' => $supir->id_supir,
                    'tgl_mulai' => Carbon::now()->subDays(3),
                    'tgl_selesai' => Carbon::now()->subDays(1),
                    'lokasi_jemput' => 'Bandung',
                    'lokasi_tujuan' => 'Surabaya',
                    
                    'total_biaya' => 2500000.0, // Format float
                    
                    'status_pemesanan' => 'Selesai',
                    'deskripsi_barang' => null,
                    'est_berat_ton' => null,
                    'foto_barang' => null,
                    'jumlah_orang' => 10,
                    'lama_rental' => 3,
                ]
            );
        }
    }
}
