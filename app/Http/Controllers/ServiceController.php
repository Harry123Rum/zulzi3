<?php

namespace App\Http\Controllers;

use App\Models\Layanan; // <-- 1. PANGGIL MODEL-NYA (Layanan.php)
use App\Models\Armada;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Menampilkan semua data layanan beserta armada untuk publik (di landing page).
     */
    public function index()
    {
        try {
            // Ambil semua layanan
            $layanan = Layanan::all();
            
            // Untuk setiap layanan, ambil armada yang sesuai dengan nama layanan
            $layananWithArmada = $layanan->map(function ($layer) {
                // Cari armada dengan kolom 'layanan' yang match dengan nama_layanan
                $armadas = Armada::where('layanan', $layer->nama_layanan)->get();
                $layer->armada = $armadas;
                return $layer;
            });

            return response()->json([
                'status' => 'success',
                'data' => $layananWithArmada
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data layanan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
