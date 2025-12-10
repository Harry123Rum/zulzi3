<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'budi@example.com'], // kunci unik
            [
                'role_pengguna' => 'customer',
                'nama' => 'Budi Santoso',
                'password' => Hash::make('password123'),
                'no_telepon' => '081298765432',
                'tgl_daftar' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'siti@example.com'],
            [
                'role_pengguna' => 'customer',
                'nama' => 'Siti Aminah',
                'password' => Hash::make('password123'),
                'no_telepon' => '081234567891',
                'tgl_daftar' => now(),
            ]
        );
    }
}
