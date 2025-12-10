<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk SUPIR (BARU)
 *
 * @property int $id_supir
 * @property string $nama
 * @property string $no_telepon
 * @property string $no_sim
 * @property string $status_supir
 */
class Supir extends Model
{
    use HasFactory;

    protected $table = 'supir';
    protected $primaryKey = 'id_supir';

    protected $fillable = [
        'nama',
        'no_telepon',
        'no_sim',
        'status_supir',
    ];

    public $timestamps = false; // ERD tidak menunjukkannya

    // --- RELASI SESUAI ERD ---

    /**
     * Relasi ke Pemesanan (Satu Supir bisa ditugaskan ke banyak Pemesanan)
     */
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_supir', 'id_supir');
    }
}