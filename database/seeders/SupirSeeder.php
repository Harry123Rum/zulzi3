<?php

namespace Database\Seeders;

use App\Models\Supir; // Pastikan model Supir di-import
use Illuminate\Database\Seeder;

class SupirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data sesuai mockup
        $drivers = [
            [
                'nama' => 'Ahmad Yani',
                'no_sim' => '1234567890123456',
                'no_telepon' => '081234567890',
                // Kita simpan 'Pengalaman (Tahun)' di kolom 'status_supir' sementara
                'status_supir' => 5, 
            ],
            [
                'nama' => 'Budi Santoso',
                'no_sim' => '2345678901234567',
                'no_telepon' => '081234567891',
                'status_supir' => 8, 
            ],
            [
                'nama' => 'Chandra Wijaya',
                'no_sim' => '3456789012345678',
                'no_telepon' => '081234567892',
                'status_supir' => 3, 
            ],
            [
                'nama' => 'Dedi Kurniawan',
                'no_sim' => '4567890123456789',
                'no_telepon' => '081234567893',
                'status_supir' => 10, 
            ],
        ];

        foreach ($drivers as $driver) {
            Supir::firstOrCreate($driver);
        }
    }
}