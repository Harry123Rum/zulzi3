<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Menambahkan UNIQUE constraint pada id_pemesanan di tabel ulasan
     * untuk mencegah duplikasi review pada satu pemesanan.
     */
    public function up(): void
    {
        Schema::table('ulasan', function (Blueprint $table) {
            // Tambahkan unique constraint pada id_pemesanan
            // Satu pemesanan hanya boleh direview satu kali
            $table->unique('id_pemesanan', 'ulasan_id_pemesanan_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ulasan', function (Blueprint $table) {
            // Drop unique constraint jika rollback
            $table->dropUnique('ulasan_id_pemesanan_unique');
        });
    }
};
