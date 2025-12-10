<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk Armada
 *
 * @property int $id_armada
 * @property string $nama_armada
 * @property string $no_plat
 * @property string $layanan
 * @property string $jenis_kendaraan
 * @property string $kapasitas
 * @property float $harga_sewa_per_hari
 * @property string $status_ketersediaan
 */
class Armada extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan oleh model.
     *
     * @var string
     */
    protected $table = 'armada';

    /**
     * Primary key untuk model ini.
     *
     * @var string
     */
    protected $primaryKey = 'id_armada';

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'no_plat',
        'layanan',
        'jenis_kendaraan',
        'kapasitas',
        'harga_sewa_per_hari',
        'status_ketersediaan',
    ];

    /**
     * Tipe data untuk atribut.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'harga_sewa_per_hari' => 'float',
    ];
}