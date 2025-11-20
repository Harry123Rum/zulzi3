<?php

namespace App\Http\Controllers;

use App\Models\Layanan; // <-- 1. PANGGIL MODEL-NYA (Layanan.php)
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Menampilkan semua data layanan untuk publik (di landing page).
     */
    public function index()
    {
        $layanan = Layanan::with('armada')->get();
        return response()->json([
            'status' => 'success',
            'data' => $layanan
        ]);
}
}