<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArmadaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('armada')->insert([
            [
                'no_plat' => 'B 1001 ZUL',
                // 'nama_armada' dihapus karena kolomnya tidak ada di tabel
                'jenis_kendaraan' => 'Minibus',
                'kapasitas' => '19 Orang',
                'harga_sewa_per_hari' => 800000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Rental',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'no_plat' => 'B 2002 TRANS',
                // 'nama_armada' dihapus
                'jenis_kendaraan' => 'Truk Box',
                'kapasitas' => '4 Ton',
                'harga_sewa_per_hari' => 1200000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Angkutan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Tambahkan data lain jika perlu
        ]);
    }
}