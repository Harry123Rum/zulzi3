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
 * @property int $tahun_mulai_kerja
 * @property int $pengalaman_tahun (calculated)
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
        'tahun_mulai_kerja',
    ];

    public $timestamps = false; // ERD tidak menunjukkannya

    // --- ACCESSOR: Auto-calculate pengalaman ---

    /**
     * Hitung pengalaman otomatis berdasarkan tahun mulai kerja
     * Cara pakai: $supir->pengalaman_tahun
     */
    public function getPengalamanTahunAttribute()
    {
        if (!$this->tahun_mulai_kerja) {
            return 0;
        }
        return now()->year - $this->tahun_mulai_kerja;
    }

    // --- RELASI SESUAI ERD ---

    /**
     * Relasi ke Pemesanan (Satu Supir bisa ditugaskan ke banyak Pemesanan)
     */
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_supir', 'id_supir');
    }
}