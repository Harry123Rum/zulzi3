<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PemesananController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProfileController;

// Import Admin Controllers
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PesananController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\PenggunaController;

/*
|--------------------------------------------------------------------------
| API Routes - Zulzi Trans Express
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Zulzi Trans Express API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Public)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'sendPasswordResetLink']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth Required)
|--------------------------------------------------------------------------
*/
Route::get('/reviews/public', [ReviewController::class, 'getPublicReviews']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/about', [AboutController::class, 'index']);

// Route Khusus Halaman Review
Route::get('/reviews/target/{id_pemesanan}', [ReviewController::class, 'getReviewTarget']);
Route::post('/reviews', [ReviewController::class, 'store']);

// Route Armada List (Public untuk dropdown)
Route::get('/armada-list', [PemesananController::class, 'getArmadaList']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Require Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // User Data
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Auth Actions
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    });

    // Profile Routes
    Route::prefix('user/profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
    });

    // User Pemesanan (PINDAH KE SINI - HARUS LOGIN)
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);
    Route::get('/user/pemesanan', [PemesananController::class, 'getUserOrders']);

    // User Pembayaran (HARUS LOGIN)
    Route::post('/pembayaran', [PembayaranController::class, 'store']);
    /*
    |--------------------------------------------------------------------------
    | Admin Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->prefix('admin')->group(function () {

        // Dashboard Stats
        Route::get('/dashboard-stats', [DashboardController::class, 'stats']);

        // Pengguna Management
        Route::get('/pengguna', [PenggunaController::class, 'index']);
        Route::delete('/pengguna/{id}', [PenggunaController::class, 'destroy']);

        // Supir Management
        Route::get('/supir', [SupirController::class, 'index']);
        Route::post('/supir', [SupirController::class, 'store']);
        Route::get('/supir/{id}', [SupirController::class, 'show']);
        Route::put('/supir/{id}', [SupirController::class, 'update']);
        Route::delete('/supir/{id}', [SupirController::class, 'destroy']);

    });

Route::middleware('api')->group(function () {
    Route::get('/about', [AboutController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ROUTE BARU UNTUK PEMESANAN (Menerima data dari React)
Route::post('/pemesanan', [PemesananController::class, 'store']);

});
