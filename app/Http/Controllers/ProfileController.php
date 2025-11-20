<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Get user profile
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ]);
    }

    /**
     * Update user profile
     */
    public function update(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nama' => ['required', 'string', 'max:100'],
            'no_telepon' => ['required', 'string', 'max:15', 'regex:/^[0-9]+$/'],
            'alamat' => ['nullable', 'string', 'max:255'],
        ], [
            'nama.required' => 'Nama lengkap wajib diisi',
            'nama.max' => 'Nama maksimal 100 karakter',
            'no_telepon.required' => 'No HP wajib diisi',
            'no_telepon.regex' => 'No HP hanya boleh berisi angka',
            'no_telepon.max' => 'No HP maksimal 15 digit',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        
        $user->update([
            'nama' => $request->nama,
            'no_telepon' => $request->no_telepon,
            'alamat' => $request->alamat,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile berhasil diperbarui',
            'data' => new UserResource($user),
        ]);
    }
}