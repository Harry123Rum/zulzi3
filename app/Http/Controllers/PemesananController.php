<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pemesanan;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class PemesananController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'layanan' => 'required|in:rental,barang,sampah',
            'tgl_mulai' => 'required|date',
            'lokasi_jemput' => 'required|string',

            // lokasi_tujuan wajib hanya untuk BARANG
            'lokasi_tujuan' => 'required_if:layanan,barang|string|nullable',

            'id_armada' => 'nullable|integer',
            'lama_rental' => 'nullable|integer',
            'opsi_supir' => 'nullable|string',
            'catatan' => 'nullable|string',

            'deskripsi_barang' => 'nullable|string',
            'est_berat_ton' => 'nullable|numeric',

            'foto_barang' => 'nullable|file|image|max:5120',
            'foto_sampah' => 'nullable|file|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Tentukan ID Layanan (1=rental, 2=barang, 3=sampah)
        $layananId = match ($request->layanan) {
            'rental' => 1,
            'barang' => 2,
            'sampah' => 3,
        };

        // 3. Siapkan data pemesanan
        $data = [
            'id_pengguna' => auth()->id() ?? 1, // fallback
            'id_layanan' => $layananId,
            'tgl_pesan' => Carbon::now()->format('Y-m-d'),
            'tgl_mulai' => $request->tgl_mulai,
            'tgl_selesai' => null,

            'lokasi_jemput' => $request->lokasi_jemput,

            // Lokasi tujuan hanya untuk BARANG
            'lokasi_tujuan' => $request->layanan === 'barang'
                ? ($request->lokasi_tujuan ?? null)
                : null,

            'status_pemesanan' => 'pending_approval',
            'total_biaya' => 0,

            'id_armada' => $request->id_armada ?? null,
            'id_supir' => null,

            'deskripsi_barang' => $request->deskripsi_barang ?? null,
            'est_berat_ton' => $request->est_berat_ton ?? null,

            'jumlah_orang' => null,
            'lama_rental' => $request->lama_rental ?? null,

            'catatan' => $request->catatan ?? null,
        ];

        // 4. Upload file (barang atau sampah)
        $file = $request->file('foto_barang') ?? $request->file('foto_sampah');

        if ($file) {
            $path = $file->store('public/uploads/pemesanan');
            $data['foto_barang'] = Storage::url($path);
        } else {
            $data['foto_barang'] = null;
        }

        // 5. Simpan ke database
        try {
            $pemesanan = Pemesanan::create($data);

            return response()->json([
                'message' => 'Pesanan berhasil dibuat!',
                'data' => $pemesanan
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan: ' . $e->getMessage()
            ], 500);
        }
    }
}
