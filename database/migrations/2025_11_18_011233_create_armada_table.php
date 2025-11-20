<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('armada', function (Blueprint $table) {
            $table->id('id_armada');
            $table->string('no_plat')->unique();
            $table->string('layanan'); 
            $table->string('jenis_kendaraan');
            $table->string('kapasitas');
            $table->decimal('harga_sewa_per_hari', 15, 2); 
            $table->string('status_ketersediaan');
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('armada');
    }
};