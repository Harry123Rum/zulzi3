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
        Schema::table('pemesanan', function (Blueprint $table) {
            // Ubah kolom total_biaya menjadi DECIMAL(10, 2)
            // Ini mendukung nilai hingga 9.999.999.999,99
            $table->decimal('total_biaya', 10, 2)->change(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pemesanan', function (Blueprint $table) {
            // Mengubah kembali ke double(15, 2)
            $table->double('total_biaya', 15, 2)->change();
        });
    }
};