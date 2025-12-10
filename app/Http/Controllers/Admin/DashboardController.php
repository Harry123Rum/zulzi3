<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// use App\Models\Fleet; // Uncomment setelah Anda membuat model
// use App\Models\Order; // Uncomment setelah Anda membuat model
// use App\Models\Payment; // Uncomment setelah Anda membuat model
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Mengambil data statistik untuk dashboard admin.
     */
    public function getStats(Request $request)
    {
        // --- DATA MOCK (TIRUAN) ---
        // Ganti ini dengan query database asli Anda
        
        $totalFleet = 12; // Ganti dengan: Fleet::count();
        $fleetAvailable = 8; // Ganti dengan: Fleet::where('status', 'available')->count();
        
        $ordersThisMonth = 48; // Ganti dengan: Order::whereMonth('created_at', Carbon::now()->month)->count();
        $ordersInProgress = 12; // Ganti dengan: Order::where('status', 'in_progress')->count();

        $pendingPayments = 8; // Ganti dengan: Payment::where('status', 'pending')->count();
        $pendingVerification = 8; // Ganti dengan: Payment::where('status', 'pending')->count();

        $recentOrders = [
            ['id' => 'ORD-001', 'customer' => 'Citra Dewi', 'route' => 'Bandung', 'date' => '15 Okt 2025'],
            ['id' => 'ORD-002', 'customer' => 'Doni Pratama', 'route' => 'Yogyakarta', 'date' => '20 Okt 2025'],
            ['id' => 'ORD-003', 'customer' => 'Eka Putri', 'route' => 'Bali', 'date' => '10 Okt 2025'],
        ];
        // Ganti dengan: 
        // $recentOrders = Order::with('customer') // Asumsi ada relasi
        //     ->orderBy('created_at', 'desc')
        //     ->take(3)
        //     ->get()
        //     ->map(function($order) {
        //         return [
        //             'id' => $order->order_code, // ganti sesuai kolom Anda
        //             'customer' => $order->customer->name, // ganti sesuai relasi Anda
        //             'route' => $order->destination_city, // ganti sesuai kolom Anda
        //             'date' => $order->created_at->format('d M Y'),
        //         ];
        //     });
        
        // -------------------------

        return response()->json([
            'totalFleet' => $totalFleet,
            'fleetAvailable' => $fleetAvailable,
            'ordersThisMonth' => $ordersThisMonth,
            'ordersInProgress' => $ordersInProgress,
            'pendingPayments' => $pendingPayments,
            'pendingVerification' => $pendingVerification,
            'recentOrders' => $recentOrders,
        ]);
    }
}