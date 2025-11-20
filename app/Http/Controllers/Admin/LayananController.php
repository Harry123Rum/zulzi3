<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Layanan;
use Illuminate\Http\Request;

class LayananController extends Controller
{
    /**
     * Mengambil daftar semua layanan.
     */
    public function index()
    {
        // Ambil semua data layanan, urutkan berdasarkan nama
        $layanan = Layanan::orderBy('nama_layanan', 'asc')->get();
        
        return response()->json($layanan);
    }
}