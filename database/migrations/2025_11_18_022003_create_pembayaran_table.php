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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id('id_pembayaran'); // Primary Key

            // Foreign Keys
            $table->foreignId('id_pemesanan')
                  ->constrained('pemesanan', 'id_pemesanan')
                  ->onDelete('cascade');

            $table->foreignId('id_admin')
                  ->nullable() // Boleh kosong (sebelum diverifikasi)
                  ->constrained('user', 'id_pengguna')
                  ->onDelete('set null');

            // Detail Pembayaran
            $table->date('tgl_bayar');
            $table->decimal('jumlah_bayar', 15, 2); // sesuai SQL dump
            $table->enum('metode_bayar', ['BCA', 'QRIS']); // pilihan BCA atau QRIS
            $table->enum('jenis_pembayaran', ['DP', 'LUNAS']); // pilihan DP atau LUNAS
            $table->string('bukti_transfer', 255)->nullable();

            //status pembayaran
            $table->enum('status_pembayaran', ['Menunggu', 'Terverifikasi', 'Ditolak'])
                  ->default('Menunggu');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');

        Schema::table('pembayaran', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
