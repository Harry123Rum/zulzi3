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

            // WAJIB NULLABLE untuk SAMPAH & RENTAL
            $table->string('lokasi_tujuan')->nullable();

            // Keuangan & Status
            $table->double('total_biaya', 15, 2)->default(0);
            $table->string('status_pemesanan', 20);
            
            // Detail Tambahan (Nullable karena tergantung jenis layanan)
            $table->string('deskripsi_barang')->nullable();
            $table->double('est_berat_ton', 8, 2)->nullable();
            $table->string('foto_barang')->nullable();
            $table->integer('jumlah_orang')->nullable();
            $table->integer('lama_rental')->nullable(); // Dalam hari

            // Tambahan catatan (jika user isi catatan bebas)
            $table->text('catatan')->nullable();

            $table->timestamps();

            // Foreign Key Constraint optional
            // $table->foreign('id_pengguna')->references('id_pengguna')->on('pengguna')->onDelete('cascade');
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
