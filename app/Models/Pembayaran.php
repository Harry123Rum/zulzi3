<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';
    protected $primaryKey = 'id_pembayaran';
    public $incrementing = true;
    public $timestamps = false; // Karena tidak ada created_at dan updated_at

    protected $fillable = [
        'id_pemesanan',
        'id_admin',
        'tgl_bayar',
        'jumlah_bayar',
        'metode_bayar',
        'jenis_pembayaran',
        'bukti_transfer',
    ];

    protected $casts = [
        'jumlah_bayar' => 'decimal:2',
        'tgl_bayar' => 'date',
    ];

    /**
     * Relasi ke Pemesanan
     */
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan', 'id_pemesanan');
    }

    /**
     * Relasi ke Admin (User)
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'id_admin', 'id_pengguna');
    }

    /**
     * Scope untuk pembayaran DP
     */
    public function scopeDP($query)
    {
        return $query->where('jenis_pembayaran', 'DP');
    }

    /**
     * Scope untuk pembayaran Lunas
     */
    public function scopeLunas($query)
    {
        return $query->where('jenis_pembayaran', 'Lunas');
    }

    /**
     * Scope untuk pembayaran menunggu verifikasi
     */
    public function scopeMenungguVerifikasi($query)
    {
        return $query->whereNull('id_admin');
    }

    /**
     * Scope untuk pembayaran terverifikasi
     */
    public function scopeTerverifikasi($query)
    {
        return $query->whereNotNull('id_admin');
    }

    /**
     * Scope berdasarkan metode bayar
     */
    public function scopeByMetode($query, $metode)
    {
        return $query->where('metode_bayar', $metode);
    }

    /**
     * Accessor untuk format rupiah
     */
    public function getJumlahBayarFormatAttribute()
    {
        return 'Rp ' . number_format($this->jumlah_bayar, 0, ',', '.');
    }

    /**
     * Accessor untuk URL bukti transfer
     */
    public function getBuktiTransferUrlAttribute()
    {
        if ($this->bukti_transfer) {
            return asset('storage/' . $this->bukti_transfer);
        }
        return null;
    }

    /**
     * Accessor untuk status verifikasi
     */
    public function getStatusVerifikasiAttribute()
    {
        return $this->id_admin ? 'Terverifikasi' : 'Menunggu';
    }

    /**
     * Check apakah pembayaran sudah terverifikasi
     */
    public function isVerified()
    {
        return !is_null($this->id_admin);
    }

    /**
     * Check apakah pembayaran adalah DP
     */
    public function isDP()
    {
        return $this->jenis_pembayaran === 'DP';
    }

    /**
     * Check apakah pembayaran adalah Lunas
     */
    public function isLunas()
    {
        return $this->jenis_pembayaran === 'Lunas';
    }
}
