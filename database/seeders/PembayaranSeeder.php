<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pembayaran;
use App\Models\User;
use Carbon\Carbon;

class PembayaranSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil admin (wajib ada)
        $admin = User::where('role_pengguna', 'Admin')->first();

        // Jika tidak ada admin, buat admin default
        if (!$admin) {
            $admin = User::create([
                'role_pengguna' => 'Admin',
                'nama' => 'Administrator Utama',
                'email' => 'admin@zulzitrans.com',
                'password' => bcrypt('password123'),
                'no_telepon' => '081234567890',
                'tgl_daftar' => Carbon::now(),
            ]);
        }

        // === PEMBAYARAN SAMPLE === //

        Pembayaran::create([
            'id_pemesanan'     => 1,
            'id_admin'         => $admin->id_pengguna,
            'tgl_bayar'        => Carbon::now()->subDays(1),
            'jumlah_bayar'     => 1500000, // 1.5 juta
            'metode_bayar'     => 'BCA',
            'jenis_pembayaran' => 'DP',
            'bukti_transfer'   => 'transfer_1.jpg',
        ]);

        Pembayaran::create([
            'id_pemesanan'     => 2,
            'id_admin'         => $admin->id_pengguna,
            'tgl_bayar'        => Carbon::now(),
            'jumlah_bayar'     => 2500000, // 250 juta
            'metode_bayar'     => 'QRIS',
            'jenis_pembayaran' => 'LUNAS',
            'bukti_transfer'   => 'transfer_2.jpg',
        ]);

        Pembayaran::create([
            'id_pemesanan'     => 3,
            'id_admin'         => $admin->id_pengguna,
            'tgl_bayar'        => Carbon::now()->subDays(3),
            'jumlah_bayar'     => 50000000, // 50 juta
            'metode_bayar'     => 'BCA',
            'jenis_pembayaran' => 'DP',
            'bukti_transfer'   => 'transfer_3.png',
        ]);

        echo "PembayaranSeeder berhasil dijalankan.\n";
    }
}
