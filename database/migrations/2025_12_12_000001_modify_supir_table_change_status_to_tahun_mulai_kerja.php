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
        Schema::table('supir', function (Blueprint $table) {
            // Hapus kolom status_supir yang tidak terpakai
            $table->dropColumn('status_supir');
            
            // Tambah kolom tahun_mulai_kerja untuk hitung otomatis pengalaman
            $table->year('tahun_mulai_kerja')->after('no_sim');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supir', function (Blueprint $table) {
            // Kembalikan kolom status_supir
            $table->string('status_supir')->after('no_sim');
            
            // Hapus kolom tahun_mulai_kerja
            $table->dropColumn('tahun_mulai_kerja');
        });
    }
};
