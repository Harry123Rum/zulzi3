<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * PENTING: Hapus file migrasi 'create_users_table.php' bawaan Anda.
     */
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id('id_pengguna');
            $table->string('role_pengguna', 10); // 'Admin' atau 'Customer'
            $table->string('nama', 100);
            $table->string('email')->unique();
            $table->string('password');
            $table->string('no_telepon', 15);
            $table->date('tgl_daftar');
            $table->timestamp('email_verified_at')->nullable(); // Disarankan untuk Laravel Auth
            $table->rememberToken(); // Disarankan untuk Laravel Auth
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengguna');
    }
};