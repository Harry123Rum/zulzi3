<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';
    protected $primaryKey = 'id_pembayaran';

    public $timestamps = true;

    // Daftar kolom yang boleh diisi oleh Controller (Mass Assignment)
    protected $fillable = [
        'id_pemesanan',
        'id_admin',
        'tgl_bayar',
        'jumlah_bayar',
        'metode_bayar',
        'jenis_pembayaran',
        'bukti_transfer',
        'status_pembayaran',
    ];

    // Konversi tipe data otomatis saat diambil dari DB
    protected $casts = [
        'jumlah_bayar' => 'decimal:2',
        'tgl_bayar' => 'date',
    ];

    // --- RELASI ---

    /**
     * Relasi ke tabel Pemesanan
     */
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan', 'id_pemesanan');
    }

    /**
     * Relasi ke tabel User (sebagai Admin)
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'id_admin', 'id_pengguna');
    }

    // --- ACCESSOR (Helper untuk Frontend) ---

    /**
     * Mendapatkan URL lengkap untuk gambar bukti transfer
     * Cara pakai di frontend/controller: $pembayaran->bukti_transfer_url
     */
    public function getBuktiTransferUrlAttribute()
    {
        return $this->bukti_transfer ? asset($this->bukti_transfer) : null;
    }

    /**
     * Mendapatkan status verifikasi (Otomatis cek id_admin)
     * Cara pakai: $pembayaran->status_verifikasi
     */
    public function getStatusVerifikasiAttribute()
    {
        return $this->status_pembayaran ?? 'Menunggu';
    }

    /**
     * Helper format rupiah
     * Cara pakai: $pembayaran->jumlah_bayar_format
     */
    public function getJumlahBayarFormatAttribute()
    {
        return 'Rp ' . number_format($this->jumlah_bayar, 0, ',', '.');
    }

    /**
     * ✨ BARU: Helper untuk cek apakah pembayaran pending (menunggu verifikasi)
     * Cara pakai: $pembayaran->is_pending
     */
    public function getIsPendingAttribute()
    {
        return $this->status_pembayaran === 'Menunggu';
    }

    /**
     * ✨ BARU: Helper untuk cek apakah pembayaran terverifikasi
     * Cara pakai: $pembayaran->is_verified
     */
    public function getIsVerifiedAttribute()
    {
        return $this->status_pembayaran === 'Terverifikasi';
    }

    /**
     * ✨ BARU: Helper untuk cek apakah pembayaran ditolak
     * Cara pakai: $pembayaran->is_rejected
     */
    public function getIsRejectedAttribute()
    {
        return $this->status_pembayaran === 'Ditolak';
    }

    /**
     * ✨ BARU: Helper untuk mendapatkan badge color berdasarkan status
     * Cara pakai: $pembayaran->status_badge_class
     */
    public function getStatusBadgeClassAttribute()
    {
        return match($this->status_pembayaran) {
            'Menunggu' => 'bg-yellow-100 text-yellow-800',
            'Terverifikasi' => 'bg-green-100 text-green-800',
            'Ditolak' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    /**
     * ✨ BARU: Helper untuk mendapatkan label jenis pembayaran
     * Cara pakai: $pembayaran->jenis_pembayaran_label
     */
    public function getJenisPembayaranLabelAttribute()
    {
        return match($this->jenis_pembayaran) {
            'LUNAS' => 'Bayar Penuh',
            'DP' => 'Down Payment',
            'PELUNASAN' => 'Pelunasan',
            default => $this->jenis_pembayaran
        };
    }
}
