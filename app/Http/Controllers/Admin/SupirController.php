<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupirController extends Controller
{
    /**
     * Menampilkan daftar semua supir, dengan opsi pencarian.
     */
    public function index(Request $request)
    {
        $query = Supir::query();

        // Handle pencarian
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('no_sim', 'like', "%{$search}%")
                  ->orWhere('no_telepon', 'like', "%{$search}%");
            });
        }

        // Ambil data dan map ke format yang diharapkan frontend
        $supirs = $query->orderBy('nama', 'asc')->get()->map(function ($supir) {
            $pengalaman = is_numeric($supir->status_supir) ? $supir->status_supir : 0;
            
            return [
                'id_supir' => $supir->id_supir,
                'nama_lengkap' => $supir->nama,
                'no_sim' => $supir->no_sim,
                'no_telepon' => $supir->no_telepon,
                'pengalaman_tahun' => (int) $pengalaman,
            ];
        });

        // Pastikan kita mengembalikan array, bahkan jika kosong
        return response()->json($supirs); // $supirs adalah Collection, saat diconvert ke JSON otomatis menjadi array [] jika kosong.
    }

    /**
     * Menyimpan supir baru ke database.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:100',
            'no_sim' => 'required|string|unique:supir,no_sim',
            'no_telepon' => 'required|string|max:15',
            'pengalaman_tahun' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Mapping dari request ke kolom model yang ada
        $supir = Supir::create([
            'nama' => $request->nama_lengkap,
            'no_telepon' => $request->no_telepon,
            'no_sim' => $request->no_sim,
            'status_supir' => $request->pengalaman_tahun, // Simpan pengalaman di status_supir (sementara)
        ]);

        return response()->json($supir, 201);
    }

    /**
     * Menampilkan satu data supir (untuk form edit).
     */
    public function show($id_supir)
    {
        $supir = Supir::findOrFail($id_supir);
        
        // Sesuaikan format output untuk frontend
        return response()->json([
            'id_supir' => $supir->id_supir,
            'nama_lengkap' => $supir->nama,
            'no_sim' => $supir->no_sim,
            'no_telepon' => $supir->no_telepon,
            'pengalaman_tahun' => is_numeric($supir->status_supir) ? (int) $supir->status_supir : 0,
        ]);
    }

    /**
     * Memperbarui data supir di database.
     */
    public function update(Request $request, $id_supir)
    {
        $supir = Supir::findOrFail($id_supir);

        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:100',
            'no_sim' => 'required|string|unique:supir,no_sim,' . $supir->id_supir . ',id_supir',
            'no_telepon' => 'required|string|max:15',
            'pengalaman_tahun' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Mapping dari request ke kolom model yang ada
        $supir->update([
            'nama' => $request->nama_lengkap,
            'no_telepon' => $request->no_telepon,
            'no_sim' => $request->no_sim,
            'status_supir' => $request->pengalaman_tahun, // Simpan pengalaman di status_supir (sementara)
        ]);

        return response()->json($supir);
    }

    /**
     * Menghapus data supir dari database.
     */
    public function destroy($id_supir)
    {
        $supir = Supir::findOrFail($id_supir);
        $supir->delete();

        return response()->json(null, 204);
    }
}