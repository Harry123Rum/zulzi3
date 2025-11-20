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
        Schema::create('pemesanan', function (Blueprint $table) {
            // Primary Key
            $table->id('id_pemesanan');
            
            // Foreign Keys
            $table->unsignedBigInteger('id_pengguna');
            $table->unsignedBigInteger('id_layanan');
            $table->unsignedBigInteger('id_armada')->nullable();
            $table->unsignedBigInteger('id_supir')->nullable();
            
            // Tanggal
            $table->date('tgl_pesan');
            $table->date('tgl_mulai');
            $table->date('tgl_selesai')->nullable();
            
            // Lokasi
            $table->string('lokasi_jemput');
            $table->string('lokasi_tujuan'); // Pastikan hanya satu definisi
            
            // Keuangan & Status
            // ERROR sebelumnya terjadi karena baris ini ada dua kali. 
            // Kita gunakan yang presisi tinggi (15 digit, 2 desimal).
            $table->double('total_biaya', 15, 2)->default(0);
            
            $table->string('status_pemesanan', 20);
            
            // Detail Tambahan (Nullable karena tergantung jenis layanan)
            $table->string('deskripsi_barang')->nullable();
            $table->double('est_berat_ton', 8, 2)->nullable();
            $table->string('foto_barang')->nullable();
            $table->integer('jumlah_orang')->nullable();
            $table->integer('lama_rental')->nullable(); // Dalam hari
            
            $table->timestamps();
            
            // Opsional: Foreign Key Constraints (Aktifkan jika tabel referensi sudah pasti dibuat sebelumnya)
            // $table->foreign('id_pengguna')->references('id')->on('users')->onDelete('cascade');
            // $table->foreign('id_layanan')->references('id_layanan')->on('layanan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemesanan');
    }
};