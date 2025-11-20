<?php

namespace Database\Seeders;

use App\Models\Ulasan;
use App\Models\User;
use App\Models\Armada;
use App\Models\Layanan;
use App\Models\Pemesanan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UlasanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. PASTIKAN DATA PENGGUNA (CUSTOMERS) ADA
        $customer1 = User::firstOrCreate(
            ['email' => 'andi.wijaya@mail.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Andi Wijaya',
                'password' => Hash::make('password'),
                'no_telepon' => '081111111111',
                'tgl_daftar' => Carbon::now(),
                'email_verified_at' => Carbon::now(),
            ]
        );
        $customer2 = User::firstOrCreate(
            ['email' => 'siti.nurhaliza@mail.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Siti Nurhaliza',
                'password' => Hash::make('password'),
                'no_telepon' => '081222222222',
                'tgl_daftar' => Carbon::now(),
                'email_verified_at' => Carbon::now(),
            ]
        );
        $customer3 = User::firstOrCreate(
            ['email' => 'dewi.lestari@mail.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Dewi Lestari',
                'password' => Hash::make('password'),
                'no_telepon' => '081333333333',
                'tgl_daftar' => Carbon::now(),
                'email_verified_at' => Carbon::now(),
            ]
        );


        // 2. PASTIKAN DATA LAYANAN ADA (PENTING UNTUK FILTER)
        $layananRental = Layanan::firstOrCreate(['nama_layanan' => 'Rental']);
        $layananAngkutan = Layanan::firstOrCreate(['nama_layanan' => 'Angkutan']);
        $layananSampah = Layanan::firstOrCreate(['nama_layanan' => 'Sampah']);


        // 3. PASTIKAN DATA ARMADA ADA (minimal satu untuk relasi)
        $armada1 = Armada::firstOrCreate(
            ['no_plat' => 'B 1001 ZUL'],
            [
                'nama_armada' => 'Isuzu Elf Long',
                'jenis_kendaraan' => 'Minibus',
                'kapasitas' => '19 Orang',
                'harga_sewa_per_hari' => 800000.00,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Rental',
            ]
        );

        // 4. BUAT DATA PEMESANAN (ORDERS) UNTUK RELASI ULASAN
        // Order 1: Rental - Untuk Andi Wijaya (Rating 5.0, Ditampilkan & Ditanggapi)
        $pemesanan1 = Pemesanan::firstOrCreate(
            ['id_pengguna' => $customer1->id_pengguna, 'id_layanan' => $layananRental->id_layanan, 'tgl_pesan' => Carbon::parse('2025-10-10')],
            [
                'id_armada' => $armada1->id_armada,
                'tgl_mulai' => Carbon::parse('2025-10-11'),
                'tgl_selesai' => Carbon::parse('2025-10-12'),
                'lokasi_jemput' => 'Jakarta',
                'lokasi_tujuan' => 'Bandung',
                'total_biaya' => 1600000.00,
                'status_pemesanan' => 'Selesai',
                'lama_rental' => 2,
            ]
        );

        // Order 2: Angkutan - Untuk Siti Nurhaliza (Rating 5.0, Angkutan)
        $pemesanan2 = Pemesanan::firstOrCreate(
            ['id_pengguna' => $customer2->id_pengguna, 'id_layanan' => $layananAngkutan->id_layanan, 'tgl_pesan' => Carbon::parse('2025-10-09')],
            [
                'id_armada' => $armada1->id_armada,
                'tgl_mulai' => Carbon::parse('2025-10-09'),
                'tgl_selesai' => Carbon::parse('2025-10-09'),
                'lokasi_jemput' => 'Tangerang',
                'lokasi_tujuan' => 'Bekasi',
                'total_biaya' => 500000.00,
                'status_pemesanan' => 'Selesai',
                'lama_rental' => 1,
            ]
        );

        // Order 3: Sampah - Untuk Dewi Lestari (Rating 5.0, Sampah)
        $pemesanan3 = Pemesanan::firstOrCreate(
            ['id_pengguna' => $customer3->id_pengguna, 'id_layanan' => $layananSampah->id_layanan, 'tgl_pesan' => Carbon::parse('2025-10-04')],
            [
                'id_armada' => $armada1->id_armada,
                'tgl_mulai' => Carbon::parse('2025-10-05'),
                'tgl_selesai' => Carbon::parse('2025-10-05'),
                'lokasi_jemput' => 'Depok',
                'lokasi_tujuan' => 'Bogor',
                'total_biaya' => 300000.00,
                'status_pemesanan' => 'Selesai',
                'lama_rental' => 1,
            ]
        );


        // 5. BUAT DATA ULASAN (REVIEWS) UNTUK PENGUJIAN
        $reviews = [
            // Ulasan 1: Rental - Rating 5.0 (Ditampilkan & Ditanggapi) -> Tes Modal Detail
            [
                'id_pengguna' => $customer1->id_pengguna,
                'id_armada' => $armada1->id_armada,
                'id_pemesanan' => $pemesanan1->id_pemesanan,
                'rating_driver' => 5, 
                'rating_kendaraan' => 5, 
                'rating_pelayanan' => 5, 
                'komentar' => 'Pelayanan sangat memuaskan! Supir ramah dan armada bersih. Sangat direkomendasikan untuk rental mobil.',
                'tanggapan_admin' => 'Terima kasih atas ulasan positifnya, kami senang Anda puas dengan layanan Rental kami!', 
                'is_displayed' => true, 
                'tgl_ulasan' => Carbon::parse('2025-10-12'), 
            ],
            // Ulasan 2: Angkutan - Rating 5.0 (Belum Ditanggapi) -> Tes Filter Angkutan
            [
                'id_pengguna' => $customer2->id_pengguna,
                'id_armada' => $armada1->id_armada,
                'id_pemesanan' => $pemesanan2->id_pemesanan,
                'rating_driver' => 5, 
                'rating_kendaraan' => 5, 
                'rating_pelayanan' => 5, 
                'komentar' => 'Pengalaman terbaik menggunakan jasa angkutan Zulzi Trans! Cepat dan aman.',
                'tanggapan_admin' => null, 
                'is_displayed' => false, 
                'tgl_ulasan' => Carbon::parse('2025-10-10'), 
            ],
            // Ulasan 3: Sampah - Rating 5.0 (Belum Ditanggapi) -> Tes Filter Sampah
            [
                'id_pengguna' => $customer3->id_pengguna,
                'id_armada' => $armada1->id_armada,
                'id_pemesanan' => $pemesanan3->id_pemesanan,
                'rating_driver' => 5, 
                'rating_kendaraan' => 5, 
                'rating_pelayanan' => 5, 
                'komentar' => 'Layanan pengangkutan sampah sangat memuaskan!',
                'tanggapan_admin' => null, 
                'is_displayed' => false, 
                'tgl_ulasan' => Carbon::parse('2025-10-05'), 
            ],
             // Ulasan 4: Angkutan - Rating Rendah (Tes Fungsi Delete)
             [
                'id_pengguna' => $customer1->id_pengguna,
                'id_armada' => $armada1->id_armada,
                'id_pemesanan' => $pemesanan2->id_pemesanan, 
                'rating_driver' => 3, 
                'rating_kendaraan' => 3, 
                'rating_pelayanan' => 3, 
                'komentar' => 'Pelayanan cukup buruk, ada beberapa masalah kecil di armada.',
                'tanggapan_admin' => null, 
                'is_displayed' => false, 
                'tgl_ulasan' => Carbon::parse('2025-09-28'), 
            ],
        ];

        foreach ($reviews as $review) {
            // Menggunakan updateOrCreate untuk memastikan ulasan unik per pemesanan
            Ulasan::updateOrCreate(
                ['id_pengguna' => $review['id_pengguna'], 'id_pemesanan' => $review['id_pemesanan']],
                $review
            );
        }
    }
}