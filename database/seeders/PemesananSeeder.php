<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pemesanan;
use App\Models\User;
use App\Models\Armada;
use App\Models\Layanan;
use App\Models\Supir;
use Faker\Factory as Faker;

class PemesananSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $users = User::all();
        $armadas = Armada::all();
        $layanans = Layanan::all();
        $supirs = Supir::all();

        if ($users->count() === 0 || $layanans->count() === 0) {
            $this->command->warn("Seeder Pemesanan: Pastikan tabel User dan Layanan sudah ada data.");
            return;
        }

        // Buat masing-masing 2 data untuk id_layanan 1, 2, dan 3
foreach ([1, 2, 3] as $layananId) {
    for ($i = 0; $i < 2; $i++) {

        // Data umum
        $data = [
            'id_pengguna'        => $users->random()->id_pengguna,
            'id_layanan'         => $layananId,
            'tgl_pesan'          => $faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'tgl_mulai'          => $faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'tgl_selesai'        => $faker->dateTimeBetween('+1 month', '+2 month')->format('Y-m-d'),
            'lokasi_jemput'      => $faker->address,
            'lokasi_tujuan'      => $faker->address,
            'status_pemesanan'   => 'Menunggu',
        ];

        // Layanan 1 & 2 → sama formatnya
        if (in_array($layananId, [1, 2])) {
            $data += [
                'total_biaya'      => $faker->randomFloat(2, 300000, 3000000),
                'deskripsi_barang' => $faker->sentence,
                'est_berat_ton'    => $faker->randomFloat(1, 0.1, 5),
                'foto_barang'      => $faker->imageUrl(200, 200, 'cargo'),

                // sisanya NULL
                'jumlah_orang'     => null,
                'lama_rental'      => null,
                'id_armada'        => null,
                'id_supir'         => null,
            ];
        }

        // Layanan 3 → khusus rental
        if ($layananId == 3) {
            $data += [
                'jumlah_orang'     => $faker->numberBetween(1, 10),
                'lama_rental'      => $faker->numberBetween(1, 14),
                'total_biaya'      => $faker->randomFloat(2, 500000, 5000000),

                // sisanya NULL
                'deskripsi_barang' => null,
                'est_berat_ton'    => null,
                'foto_barang'      => null,
                'id_armada'        => null,
                'id_supir'         => null,
            ];
        }

        Pemesanan::create($data);
    }
}

    }
}
