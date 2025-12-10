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
        Schema::create('ulasan', function (Blueprint $table) {
            $table->id('id_ulasan');

            // Foreign Keys
            $table->foreignId('id_pengguna')->constrained('user', 'id_pengguna')->onDelete('cascade');
            $table->foreignId('id_armada')->constrained('armada', 'id_armada')->onDelete('cascade');
            $table->foreignId('id_pemesanan')->constrained('pemesanan', 'id_pemesanan')->onDelete('cascade');

            // Detail Ulasan
            $table->integer('rating_driver');
            $table->integer('rating_kendaraan');
            $table->integer('rating_pelayanan');
            $table->string('komentar')->nullable();
            $table->date('tgl_ulasan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ulasan');
    }
};