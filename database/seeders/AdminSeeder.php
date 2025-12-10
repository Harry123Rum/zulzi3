<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'role_pengguna' => 'admin',
            'nama' => 'Administrator Zulzi Trans',
            'email' => 'admin@zulzitrans.com',
            'password' => Hash::make('admin123'),
            'no_telepon' => '081234567890',
            'tgl_daftar' => now(),
        ]);
    }
}
