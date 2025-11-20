<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
            PenggunaSeeder::class,
            LayananSeeder::class,
            ArmadaSeeder::class,
            SupirSeeder::class,
            PemesananSeeder::class,
            UlasanSeeder::class,
        ]);
    }
}