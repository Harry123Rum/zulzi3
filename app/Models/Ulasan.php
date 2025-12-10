<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk ULASAN (BARU)
 *
 * @property int $id_ulasan
 * @property int $id_pengguna
 * @property int $id_armada
 * @property int $id_pemesanan
 * @property int $rating_driver
 * @property int $rating_kendaraan
 * @property int $rating_pelayanan
 * @property string $komentar
 * @property \Carbon\Carbon $tgl_ulasan
 */
class Ulasan extends Model
{
    use HasFactory;

    protected $table = 'ulasan';
    protected $primaryKey = 'id_ulasan';

    protected $fillable = [
        'id_pengguna',
        'id_armada',
        'id_pemesanan',
        'rating_driver',
        'rating_kendaraan',
        'rating_pelayanan',
        'komentar',
        'tanggapan_admin',
        'is_displayed',
        'tgl_ulasan',
    ];

    protected $casts = [
        'rating_driver' => 'integer',
        'rating_kendaraan' => 'integer',
        'rating_pelayanan' => 'integer',
        'tgl_ulasan' => 'date',
        'is_displayed' => 'boolean',
    ];

    public $timestamps = false; // ERD tidak menunjukkannya

    // --- RELASI SESUAI ERD ---

    /**
     * Relasi ke Pengguna (Ulasan ini dibuat oleh satu Pengguna)
     */
    public function pengguna()
    {
        return $this->belongsTo(User::class, 'id_pengguna', 'id_pengguna');
      
    }

    /**
     * Relasi ke Armada (Ulasan ini untuk satu Armada)
     */
    public function armada()
    {
        return $this->belongsTo(Armada::class, 'id_armada', 'id_armada');
    }

    /**
     * Relasi ke Pemesanan (Ulasan ini terkait satu Pemesanan)
     */
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan', 'id_pemesanan');
    }
}