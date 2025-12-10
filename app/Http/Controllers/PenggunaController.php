<?php

namespace App\Http\Controllers;

use App\Models\User; // Perbaikan Namespace (bukan App\User)
use Illuminate\Http\Request;

class PenggunaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->input('search')) {
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        // Ambil data pengguna (bukan admin)
        $users = $query->where('role_pengguna', '!=', 'Admin')
                       ->orderBy('nama')
                       ->get();

        return response()->json($users);
    }

    public function destroy($id_pengguna)
    {
        try {
            $user = User::findOrFail($id_pengguna);
            $user->delete();
            return response()->json(['message' => 'Pengguna berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus pengguna'], 500);
        }
    }
}