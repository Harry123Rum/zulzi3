<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Armada; // Pastikan Model Armada di-import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ArmadaController extends Controller
{
    /**
     * Menampilkan daftar semua armada, dengan opsi pencarian.
     */
    public function index(Request $request)
    {
        $query = Armada::query();

        // Handle pencarian
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_armada', 'like', "%{$search}%")
                  ->orWhere('no_plat', 'like', "%{$search}%")
                  ->orWhere('jenis_kendaraan', 'like', "%{$search}%");
            });
        }

        $armada = $query->orderBy('created_at', 'desc')->get();

        return response()->json($armada);
    }

    /**
     * Menyimpan armada baru ke database.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_armada' => 'required|string|max:255',
            'no_plat' => 'required|string|max:20|unique:armada,no_plat',
            'layanan' => 'required|string|max:100',
            'jenis_kendaraan' => 'required|string|max:100',
            'kapasitas' => 'required|string|max:50',
            'harga_sewa_per_hari' => 'required|numeric|min:0',
            'status_ketersediaan' => 'required|in:Tersedia,Digunakan',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $armada = Armada::create($validator->validated());

        return response()->json($armada, 201);
    }

    /**
     * Menampilkan satu data armada (untuk form edit).
     */
    public function show($id_armada)
    {
        $armada = Armada::findOrFail($id_armada);
        return response()->json($armada);
    }

    /**
     * Memperbarui data armada di database.
     */
    public function update(Request $request, $id_armada)
    {
        $armada = Armada::findOrFail($id_armada);

        $validator = Validator::make($request->all(), [
            'nama_armada' => 'required|string|max:255',
            'no_plat' => 'required|string|max:20|unique:armada,no_plat,' . $armada->id_armada . ',id_armada',
            'layanan' => 'required|string|max:100',
            'jenis_kendaraan' => 'required|string|max:100',
            'kapasitas' => 'required|string|max:50',
            'harga_sewa_per_hari' => 'required|numeric|min:0',
            'status_ketersediaan' => 'required|in:Tersedia,Digunakan',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $armada->update($validator->validated());

        return response()->json($armada);
    }

    /**
     * Menghapus data armada dari database.
     */
    public function destroy($id_armada)
    {
        $armada = Armada::findOrFail($id_armada);
        $armada->delete();

        return response()->json(null, 204);
    }
}