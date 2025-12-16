<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pemesanan;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB; // Untuk getArmadaList

class PemesananController extends Controller
{
    /**
     * 1. STORE: Menyimpan Pesanan Baru dari User
     */
    public function store(Request $request)
    {
        // Validasi Input
        $validator = Validator::make($request->all(), [
            'layanan' => 'required|in:Sewa Kendaraan,Angkut Barang,Angkut Sampah',
            'tgl_mulai' => 'required|date',
            'lokasi_jemput' => 'required|string',
            // id_armada kita buat nullable agar admin yang menentukan nanti
            'lama_rental' => 'nullable|integer',
            'foto_barang' => 'nullable|file|image|max:10240',
            'foto_sampah' => 'nullable|file|image|max:10240',
            'volume_sampah' => 'nullable|numeric|min:0.1|max:100', // Validasi volume dalam m³
            'est_berat_ton' => 'nullable|numeric|min:0.1|max:50', // Validasi berat dalam ton
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tentukan ID Layanan
        $layananId = match($request->layanan) {
            'Angkut Barang' => 1,
            'Angkut Sampah' => 2,
            'Sewa Kendaraan' => 3,
            default => 1,
        };

        // Logic Deskripsi (Info spesifik per layanan)
        $deskripsi = "";
        if ($request->layanan === 'Sewa Kendaraan') {
            $jumlah = $request->jumlah_orang ?? '-';
            $durasi = $request->lama_rental ?? '-';
            $deskripsi = "Jumlah Penumpang: {$jumlah} orang, Durasi: {$durasi} hari";
        }
        elseif ($request->layanan === 'Angkut Barang') {
            $barang = $request->deskripsi_barang ?? '-';
            $berat = $request->est_berat_ton ?? '-';
            $deskripsi = "Detail Barang: {$barang}, Estimasi Berat: {$berat} ton";
        }
        elseif ($request->layanan === 'Angkut Sampah') {
            $jenis = $request->jenis_sampah ?? '-';
            $volume = $request->volume_sampah ?? '-';
            $deskripsi = "Jenis: {$jenis}, Volume: {$volume} m³";
        }

        // Logic Lokasi Tujuan berdasarkan jenis layanan
        $lokasiTujuan = match($request->layanan) {
            'Angkut Sampah' => 'TPA (Ditentukan Zulzi Trans)', // Sampah tidak butuh input tujuan dari user
            default => $request->lokasi_tujuan ?? $request->lokasi_jemput, // Rental & Barang butuh tujuan
        };

        // Siapkan Data
        $data = [
            'id_pengguna' => auth()->id(), // PERBAIKAN: Hapus fallback, user HARUS login
            'id_layanan' => $layananId,
            'tgl_pesan' => Carbon::now(),
            'tgl_mulai' => $request->tgl_mulai,
            'tgl_selesai' => $request->tgl_selesai ?? null,

            'lokasi_jemput' => $request->lokasi_jemput,
            'lokasi_tujuan' => $lokasiTujuan,

            'status_pemesanan' => 'Menunggu', // Status awal
            'total_biaya' => 0, // Harga 0 menunggu admin

            // PENTING: Set NULL agar Admin yang isi nanti (Dispatcher)
            'id_armada' => null,
            'id_supir' => null,

            'deskripsi_barang' => $deskripsi,
            'est_berat_ton' => $request->est_berat_ton ?? null,
            'volume_sampah' => $request->volume_sampah ?? null,
            'jumlah_orang' => $request->jumlah_orang ?? null,
            'lama_rental' => $request->lama_rental ?? null,
            'foto_barang' => null
        ];

        // Handle Upload Foto
        $file = $request->file('foto_barang') ?? $request->file('foto_sampah');
        if ($file) {
            $path = $file->store('public/uploads/pemesanan');
            $data['foto_barang'] = Storage::url($path);
        }

        // Simpan ke DB
        try {
            $pemesanan = Pemesanan::create($data);
            return response()->json([
                'message' => 'Pesanan berhasil dibuat! Silakan tunggu konfirmasi Admin.',
                'data' => $pemesanan
            ], 201);
        } catch (\Exception $e) {
            Log::error('Order Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server saat menyimpan pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Ambil data pesanan beserta detail Armada, Supir, Pembayaran, Layanan, dan Pengguna
            $pemesanan = Pemesanan::with(['layanan', 'armada', 'supir', 'pembayaran', 'pengguna'])
                ->find($id);

            if (!$pemesanan) {
                return response()->json(['status' => 'error', 'message' => 'Pesanan tidak ditemukan'], 404);
            }

            // Verify user owns this order
            if ($pemesanan->id_pengguna != auth()->id()) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            }

            return response()->json([
                'status' => 'success',
                'data' => $pemesanan
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil pesanan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 2B. STATUS PAGE: Halaman status pemesanan (frontend route)
     * Method ini tidak perlu return JSON, karena semua handled by React Router
     */
    public function status($id)
    {
        // Cukup return view app.blade, React Router akan handle routing
        return view('app');
    }

    /**
     * 3. GET ARMADA LIST: Untuk Dropdown (Opsional)
     */
    public function getArmadaList()
    {
        $armada = DB::table('armada')->where('status_ketersediaan', 'Tersedia')->get();
        return response()->json($armada);
    }

    /**
     * 4. GET USER ORDERS: Ambil semua pemesanan milik user yang login
     */
    public function getUserOrders(Request $request)
    {
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Pagination parameters
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        // Debug: Log user ID
        \Log::info('🔍 Fetching orders for user ID: ' . $userId);

        // Ambil pesanan user dengan relasi dan pagination (termasuk ulasan untuk cek sudah review atau belum)
        $orders = Pemesanan::with(['layanan', 'armada', 'supir', 'pembayaran', 'ulasan'])
            ->where('id_pengguna', $userId)
            ->orderBy('tgl_pesan', 'desc')
            ->paginate($perPage);

        // Debug: Log hasil query
        \Log::info('📦 Found ' . $orders->total() . ' total orders, showing page ' . $page);

        // Map data untuk tambahkan kode_pesanan terformat
        $ordersData = $orders->getCollection()->map(function ($order) {
            $orderArray = $order->toArray();
            $orderArray['kode_pesanan'] = 'ZT-' . str_pad($order->id_pemesanan, 5, '0', STR_PAD_LEFT);
            return $orderArray;
        });

        return response()->json([
            'status' => 'success',
            'data' => $ordersData,
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'from' => $orders->firstItem(),
                'to' => $orders->lastItem()
            ]
        ]);
    }
}
