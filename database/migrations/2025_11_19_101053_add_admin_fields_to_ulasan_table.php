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
        Schema::table('ulasan', function (Blueprint $table) {
            // Kolom untuk Tanggapan Admin (Sesuai desain Popup)
            $table->text('tanggapan_admin')->nullable()->after('komentar');

            // Kolom untuk status ditampilkan di landing page (Sesuai kolom Tampilkan)
            $table->boolean('is_displayed')->default(false)->after('tanggapan_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ulasan', function (Blueprint $table) {
            $table->dropColumn(['tanggapan_admin', 'is_displayed']);
        });
    }
};