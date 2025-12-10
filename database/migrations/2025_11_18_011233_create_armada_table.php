<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('armada', function (Blueprint $table) {
            $table->id('id_armada');
            $table->string('no_plat')->unique();
            
            // Add these two columns
            $table->string('nama_armada'); // Example: Isuzu Elf Long
            $table->string('model')->nullable(); // Example: Minibus
            
            $table->string('jenis_kendaraan'); // Example: Truk, Pickup
            $table->string('kapasitas'); // Example: 2 Ton
            $table->string('status_ketersediaan')->default('Tersedia');
            $table->double('harga_sewa_per_hari', 15, 2);
            
            // Only if your seeder uses 'layanan', add this too. 
            // Based on your error log, the seeder IS trying to insert 'layanan'.
            $table->string('layanan')->nullable(); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('armada');
    }
};