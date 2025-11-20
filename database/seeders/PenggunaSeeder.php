<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin
        User::firstOrCreate(
            ['email' => 'admin@zulzitrans.com'],
            [
                'role_pengguna' => 'Admin',
                'nama' => 'Administrator Utama',
                'password' => Hash::make('password123'), // Password default
                'no_telepon' => '081234567890',
                'tgl_daftar' => Carbon::now(),
            ]
        );

        // 2. Buat Akun Customer 1
        User::firstOrCreate(
            ['email' => 'budi@gmail.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Budi Santoso',
                'password' => Hash::make('user123'),
                'no_telepon' => '081298765432',
                'tgl_daftar' => Carbon::now()->subDays(5),
            ]
        );

        // 3. Buat Akun Customer 2
        User::firstOrCreate(
            ['email' => 'siti@yahoo.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Siti Aminah',
                'password' => Hash::make('user123'),
                'no_telepon' => '085678901234',
                'tgl_daftar' => Carbon::now()->subDays(10),
            ]
        );
    }
}