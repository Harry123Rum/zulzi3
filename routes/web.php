<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\LayananController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\Admin\UlasanController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\Admin\PembayaranController;
use App\Http\Controllers\Admin\PemesananController;
use App\Http\Controllers\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes - Google OAuth Routes
|--------------------------------------------------------------------------
*/

// ⚡ PENTING: Route ini harus di ATAS catch-all route
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// ✅ BARU: Rute bernama untuk Reset Password (Diperlukan oleh Laravel Mailer)
Route::get('/reset-password/{token}', function ($token) {
    // Ambil FRONTEND_URL dari .env
    $frontendUrl = env('APP_URL', 'http://localhost:8000');

    // Redirect ke halaman reset password di frontend
    return redirect($frontendUrl . '/reset-password?token=' . $token . '&email=' . request('email'));
})->name('password.reset');


// =====================================================
// API ROUTES
// =====================================================
Route::prefix('api/admin')->group(function () {
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);

    // Layanan
    Route::get('/layanan', [LayananController::class, 'index']);

    // FIX: Pindahkan Pengguna ke sini agar bisa diakses via /api/admin/pengguna
    Route::get('/pengguna', [PenggunaController::class, 'index']);
    Route::delete('/pengguna/{id_pengguna}', [PenggunaController::class, 'destroy']);

    Route::apiResource('armada', ArmadaController::class)->parameters(['armada' => 'id_armada']);
    Route::apiResource('supir', SupirController::class)->parameters(['supir' => 'id_supir']);
    Route::apiResource('ulasan', UlasanController::class)
        ->only(['index', 'show', 'update', 'destroy'])
        ->parameters(['ulasan' => 'id_ulasan']);

    Route::get('/pembayaran', [PembayaranController::class, 'index']);
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('/pembayaran/{id}/verify', [PembayaranController::class, 'verify']);
    Route::get('/pembayaran/statistics/all', [PembayaranController::class, 'statistics']);
    Route::delete('/pembayaran/{id}', [PembayaranController::class, 'destroy']);

    Route::get('/pemesanan', [PemesananController::class, 'index']);
    Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::put('/pemesanan/{id}', [PemesananController::class, 'update']);
    Route::delete('/pemesanan/{id}', [PemesananController::class, 'destroy']);
    Route::put('/pemesanan/{id}/verifikasi', [PemesananController::class, 'verifikasi']);
    Route::put('/pemesanan/{id}/assign', [PemesananController::class, 'assignSupirArmada']);
});

// =====================================================
// AUTH ROUTES
// =====================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// =====================================================
// FRONTEND ROUTES (REACT)
// =====================================================

// GROUP A: ADMIN & AUTH (Load view 'admin' -> resources/js/app.jsx)
Route::get('/login', function () { return view('admin'); })->name('login');
Route::get('/register', function () { return view('admin'); });
Route::get('/forgot-password', function () { return view('admin'); });
Route::get('/edit-profile', function () { return view('admin'); });

// Route Admin Panel (menangkap /admin dan /admin/...)
Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*')->name('admin.panel');

// GROUP B: PUBLIC LANDING (Load view 'app' -> resources/js/main.jsx)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');

/*
|--------------------------------------------------------------------------
| Catch-all Route untuk React Router
|--------------------------------------------------------------------------
*/
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
