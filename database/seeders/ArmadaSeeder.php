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
        // Pastikan array ini memiliki key 'nama_armada' dan 'model'
        // sesuai dengan struktur tabel yang baru kita ubah.
        $data = [
            [
                'id_armada' => 1,
                'no_plat' => 'B 1001 LRG',
                'nama_armada' => 'Toyota Avanza', // <--- Tambahan Baru
                'model' => 'MPV Standard',        // <--- Tambahan Baru
                'jenis_kendaraan' => 'Mobil Passanger',
                'kapasitas' => '4 Seat',
                'harga_sewa_per_hari' => 350000,
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_armada' => 2,
                'no_plat' => 'B 2002 XLR',
                'nama_armada' => 'Toyota Innova',
                'model' => 'MPV Large',
                'jenis_kendaraan' => 'Mobil Passanger',
                'kapasitas' => '6 Seat',
                'harga_sewa_per_hari' => 500000,
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_armada' => 3,
                'no_plat' => 'B 9001 TRK',
                'nama_armada' => 'Mitsubishi Colt Diesel',
                'model' => 'Engkel Box',
                'jenis_kendaraan' => 'Truk',
                'kapasitas' => '2 Ton',
                'harga_sewa_per_hari' => 700000,
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_armada' => 4,
                'no_plat' => 'B 9002 PKP',
                'nama_armada' => 'Suzuki Carry',
                'model' => 'Pickup Bak',
                'jenis_kendaraan' => 'Pickup',
                'kapasitas' => '1.5 Ton',
                'harga_sewa_per_hari' => 400000,
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_armada' => 5,
                'no_plat' => 'B 9003 DMP',
                'nama_armada' => 'Hino Dutro',
                'model' => 'Dump Truck',
                'jenis_kendaraan' => 'Dump Truck',
                'kapasitas' => '5 Ton',
                'harga_sewa_per_hari' => 1200000,
                'status_ketersediaan' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('armada')->insert($data);
    }
}