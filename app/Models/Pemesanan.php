<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk PEMESANAN (Update dari Pesanan.php)
 *
 * @property int $id_pemesanan
 * @property int $id_pengguna
 * @property int $id_armada
 * @property int $id_layanan
 * @property int $id_supir
 * @property \Carbon\Carbon $tgl_pesan
 * @property \Carbon\Carbon $tgl_mulai
 * @property \Carbon\Carbon $tgl_selesai
 * @property string $lokasi_jemput
 * @property string $lokasi_tujuan
 * @property float $total_biaya
 * @property string $status_pemesanan
 * @property string $deskripsi_barang
 * @property float $est_berat_ton
 * @property string $foto_barang
 * @property int $jumlah_orang
 * @property int $lama_rental
 */
class Pemesanan extends Model
{
    use HasFactory;

    protected $table = 'pemesanan'; // Sesuai ERD
    protected $primaryKey = 'id_pemesanan'; // Sesuai ERD

    /**
     * Atribut yang dapat diisi secara massal.
     * Disesuaikan dengan ERD.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_pengguna',
        'id_armada',
        'id_layanan',
        'tgl_pesan',
        'tgl_mulai',
        'tgl_selesai',
        'lokasi_jemput',
        'lokasi_tujuan',
        'total_biaya',
        'status_pemesanan',
        'id_supir',
        'deskripsi_barang',
        'est_berat_ton',
        'foto_barang',
        'jumlah_orang',
        'lama_rental',
    ];

    /**
     * Tipe data untuk atribut.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tgl_pesan' => 'date',
        'tgl_mulai' => 'date',
        'tgl_selesai' => 'date',
        'total_biaya' => 'float',
        'est_berat_ton' => 'float',
        'jumlah_orang' => 'integer',
        'lama_rental' => 'integer',
    ];

    public $timestamps = false; // ERD tidak menunjukkannya

    // --- RELASI SESUAI ERD ---

    /**
     * Relasi ke Pengguna (Pemesanan ini dimiliki oleh satu Pengguna)
     */
    public function pengguna()
    {
        return $this->belongsTo(User::class, 'id_pengguna', 'id_pengguna');
      
    }

    /**
     * Relasi ke Armada (Pemesanan ini menggunakan satu Armada)
     */
    public function armada()
    {
        return $this->belongsTo(Armada::class, 'id_armada', 'id_armada');
    }

    /**
     * Relasi ke Layanan (Pemesanan ini memiliki satu Layanan)
     */
    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id_layanan');
    }

    /**
     * Relasi ke Supir (Pemesanan ini ditugaskan ke satu Supir)
     */
    public function supir()
    {
        return $this->belongsTo(Supir::class, 'id_supir', 'id_supir');
    }

    /**
     * Relasi ke Pembayaran (Satu Pemesanan memiliki satu Pembayaran)
     */
    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_pemesanan', 'id_pemesanan');
    }

    /**
     * Relasi ke Ulasan (Satu Pemesanan bisa memiliki banyak Ulasan)
     * (ERD menunjukkan Ulasan punya 1 FK ke Pemesanan, jadi relasinya hasMany)
     */
    public function ulasan()
    {
        return $this->hasMany(Ulasan::class, 'id_pemesanan', 'id_pemesanan');
    }
}