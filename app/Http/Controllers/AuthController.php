<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password; // ✅ PERBAIKAN: Import Facade Password untuk Forgot Password
use Illuminate\Validation\ValidationException; // ✅ PERBAIKAN: Import ValidationException (jika dibutuhkan, optional)

class AuthController extends Controller
{
    /**
     * Tampilkan form login (opsional untuk web)
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Register user baru (Customer)
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = User::create([
                'role_pengguna' => 'customer',
                'nama' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'no_telepon' => $request->no_telepon,
                'tgl_daftar' => now(),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil! Selamat datang di Zulzi Trans Express',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                    'role' => $user->role_pengguna,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registrasi gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Cek kredensial
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
                'role' => $user->role_pengguna,
            ],
        ], 200);
    }

    /**
     * Logout user (hapus token saat ini)
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout berhasil',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ambil data user yang sedang login
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ], 200);
    }

    /**
     * Ganti password
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama tidak sesuai',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah',
        ], 200);
    }

    /**
     * Refresh token (opsional)
     */
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $request->user()->currentAccessToken()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Token berhasil di-refresh',
                'data' => [
                    'token' => $token,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Refresh token gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ==========================================
    //  GOOGE OAUTH LOGIC
    // ==========================================

    /**
     * 1. Arahkan User ke Halaman Login Google
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * 2. Terima Data dari Google
     */
    public function handleGoogleCallback()
    {
        try {
            // Ambil data user dari Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Cari user berdasarkan google_id ATAU email
            $user = User::where('google_id', $googleUser->getId())
                        ->orWhere('email', $googleUser->getEmail())
                        ->first();

            if (!$user) {
                // Jika user belum ada, buat baru
                $user = User::create([
                    'role_pengguna' => 'customer',
                    'nama' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(16)),
                    'no_telepon' => null,
                    'tgl_daftar' => now(),
                ]);
            } else {
                // Update google_id jika belum ada
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar()
                    ]);
                }
            }

            // ============================================================
            // PERBAIKAN: Generate Token dan Redirect ke Frontend Callback
            // ============================================================

            // 1. Buat token Sanctum (sama seperti login manual)
            // Hapus token lama yang mungkin ada dari Socialite
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            // 2. Redirect ke halaman callback khusus dengan token dan data user
            // Kita kirim token dan data user yang di-encode
            $userDataEncoded = urlencode(json_encode(new UserResource($user)));

            // NOTE: Kami akan menggunakan logic di /auth/callback untuk memprosesnya
            return redirect('/auth/callback?token=' . $token . '&user=' . $userDataEncoded);

            // ============================================================

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());

            // Jika gagal, redirect ke halaman callback dengan error
            return redirect('/auth/callback?error=' . urlencode('Gagal login dengan Google: ' . $e->getMessage()));
        }
    }

    // ==========================================
    //  FORGOT & RESET PASSWORD LOGIC
    // ==========================================

    /**
     * Kirim link reset password ke email user.
     */
    public function sendPasswordResetLink(Request $request): JsonResponse
    {
        // dd($request->all());
        // 1. Validasi input email
        $request->validate(['email' => 'required|email']);


        // 2. Kirim notifikasi link reset password
        // getBroker() secara default mengambil 'users' (provider) dari config/auth.php
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Link reset password berhasil dikirim ke email Anda.',
            ]);
        }

        // Jika gagal (misal email tidak terdaftar)
        // Laravel secara default memberikan pesan generik untuk keamanan.
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengirim link reset. Email tidak terdaftar.',
        ], 400);
    }

    /**
     * Memproses reset password menggunakan token.
     * Biasanya dipanggil setelah user mengklik link di email.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        // 1. Validasi input (token, email, password, password_confirmation)
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        // 2. Panggil fungsi reset password dari Laravel
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password Anda berhasil diubah.',
            ]);
        }

        // Jika gagal (misal token kadaluarsa/salah)
        return response()->json([
            'success' => false,
            'message' => 'Reset password gagal. Token tidak valid atau kedaluwarsa.',
        ], 400);
    }
}
