<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk LAYANAN (BARU)
 *
 * @property int $id_layanan
 * @property string $nama_layanan
 */
class Layanan extends Model
{
    use HasFactory;

    protected $table = 'layanan';
    protected $primaryKey = 'id_layanan';

    protected $fillable = [
        'nama_layanan',
    ];

    public $timestamps = false; // ERD tidak menunjukkannya

    // --- RELASI SESUAI ERD ---

    /**
     * Relasi ke Pemesanan (Satu Layanan bisa dipilih di banyak Pemesanan)
     */
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_layanan', 'id_layanan');
    }

    // public function armada()
    // {
    //     return $this->hasMany(Armada::class, 'id_layanan', 'id_layanan');
    // }

}