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
        // Data sesuai mockup dengan tahun_mulai_kerja
        $drivers = [
            [
                'nama' => 'Ahmad Yani',
                'no_sim' => '1234567890123456',
                'no_telepon' => '081234567890',
                'tahun_mulai_kerja' => 2020, // 5 tahun pengalaman (2025 - 2020)
            ],
            [
                'nama' => 'Budi Santoso',
                'no_sim' => '2345678901234567',
                'no_telepon' => '081234567891',
                'tahun_mulai_kerja' => 2017, // 8 tahun pengalaman (2025 - 2017)
            ],
            [
                'nama' => 'Chandra Wijaya',
                'no_sim' => '3456789012345678',
                'no_telepon' => '081234567892',
                'tahun_mulai_kerja' => 2022, // 3 tahun pengalaman (2025 - 2022)
            ],
            [
                'nama' => 'Dedi Kurniawan',
                'no_sim' => '4567890123456789',
                'no_telepon' => '081234567893',
                'tahun_mulai_kerja' => 2015, // 10 tahun pengalaman (2025 - 2015)
            ],
        ];

        foreach ($drivers as $driver) {
            Supir::firstOrCreate($driver);
        }
    }
}