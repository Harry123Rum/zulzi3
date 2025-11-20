<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Layanan;

class LayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['nama_layanan' => 'Angkut Barang'],
            ['nama_layanan' => 'Angkut Sampah'],
            ['nama_layanan' => 'Sewa Kendaraan'],
        ];

        foreach ($data as $item) {
            // Menggunakan firstOrCreate untuk menghindari duplikasi data saat seeder dijalankan berulang kali
            Layanan::firstOrCreate(
                ['nama_layanan' => $item['nama_layanan']], 
                $item
            );
        }
    }
}