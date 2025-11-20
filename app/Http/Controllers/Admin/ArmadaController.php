<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Armada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ArmadaController extends Controller
{
    public function index(Request $request)
    {
        $query = Armada::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                // Hapus pencarian nama_armada
                $q->where('no_plat', 'like', "%{$search}%")
                  ->orWhere('jenis_kendaraan', 'like', "%{$search}%")
                  ->orWhere('layanan', 'like', "%{$search}%");
            });
        }

        $armada = $query->orderBy('created_at', 'desc')->get();

        return response()->json($armada);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Hapus validasi nama_armada
            'no_plat' => 'required|string|max:20|unique:armada,no_plat',
            'layanan' => 'required|string|max:100',
            'jenis_kendaraan' => 'required|string|max:100',
            'kapasitas' => 'required|string|max:50',
            'harga_sewa_per_hari' => 'required|numeric|min:0',
            'status_ketersediaan' => 'required|in:Tersedia,Digunakan,Perbaikan',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $armada = Armada::create($validator->validated());

        return response()->json($armada, 201);
    }

    public function update(Request $request, $id_armada)
    {
        $armada = Armada::findOrFail($id_armada);

        $validator = Validator::make($request->all(), [
            // Hapus validasi nama_armada
            'no_plat' => 'required|string|max:20|unique:armada,no_plat,' . $armada->id_armada . ',id_armada',
            'layanan' => 'required|string|max:100',
            'jenis_kendaraan' => 'required|string|max:100',
            'kapasitas' => 'required|string|max:50',
            'harga_sewa_per_hari' => 'required|numeric|min:0',
            'status_ketersediaan' => 'required|in:Tersedia,Digunakan,Perbaikan',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $armada->update($validator->validated());

        return response()->json($armada);
    }

    public function destroy($id_armada)
    {
        $armada = Armada::findOrFail($id_armada);
        $armada->delete();
        return response()->json(null, 204);
    }
}