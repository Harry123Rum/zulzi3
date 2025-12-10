// resources/js/Pages/Auth/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';
import { CheckCircle, Eye, EyeOff } from 'lucide-react'; // Import ikon mata

const LoginPage = () => {
    const navigate = useNavigate();
    // Ganti 'login' dari useAuth agar bisa menerima 'remember' flag (Asumsi useAuth akan meneruskannya)
    const { login } = useAuth();

    // 1. Tambah state untuk 'remember' dan 'showPassword'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false, // <-- BARU: State untuk Remember Me
    });
    const [showPassword, setShowPassword] = useState(false); // <-- BARU: State untuk toggle password

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle input tipe checkbox (untuk remember)
        const newValue = type === 'checkbox' ? checked : value;

        setFormData({ ...formData, [name]: newValue });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        try {
            // NOTE: Kami berasumsi fungsi login di AuthContext bisa menerima flag 'remember'
            const response = await login(formData);

            // 1. Set notifikasi sukses
            setAlert({ type: 'success', message: 'Login berhasil!' });

            const userRole = response.user?.role_pengguna;

            // 2. TUNDA NAVIGASI agar notifikasi terlihat
            setTimeout(() => {
                if (userRole === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/beranda', { replace: true });
                }
            }, 1500);

        } catch (err) {
            console.error('Login error:', err);
            if (err.errors) setErrors(err.errors);
            setAlert({
                type: 'error',
                message: err.message || 'Email atau password salah!'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-neutral-white font-sans">
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 bg-white">
                <div className="max-w-md mx-auto w-full">
                    {/* ... (Judul & Tombol Google) ... */}

                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-primary-dark mb-3">
                            Selamat Datang <br /> Kembali !
                        </h1>
                        <p className="text-neutral-gray text-lg font-medium">
                            Login untuk melanjutkan perjalanan anda
                        </p>
                    </div>

                    {/* Tombol Google OAuth & Separator... */}
                <a
                    href={`${import.meta.env.VITE_APP_URL || 'http://localhost:8000'}/auth/google`}
                    className="w-full flex items-center justify-center gap-3 bg-[#5CBCE2] hover:bg-[#4aa8cc] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-sm mb-6"
                >
                    <span className="bg-white p-1 rounded-full">
                        <svg className="w-4 h-4 text-[#5CBCE2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                    </span>
                    Continue with Google
                </a>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {alert && (
                        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="Masukkan email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />

                        {/* =================================================== */}
                        {/* ✅ PERUBAHAN: Custom Input untuk Password dengan Toggle */}
                        {/* =================================================== */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-2">
                                <input
                                    type={showPassword ? "text" : "password"} // Ganti tipe input
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Masukkan password"
                                    required
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-300 outline-none ${
                                        errors.password ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200' : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                                    }`}
                                />
                                {/* Tombol Toggle Password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password[0]}</p>}
                        </div>

                        {/* =================================================== */}
                        {/* ✅ BARU: Checkbox "Ingat Saya" dan "Lupa Password" */}
                        {/* =================================================== */}
                        <div className="flex justify-between items-center mt-2">
                            {/* Ingat Saya */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-neutral-gray">
                                    Ingat Saya
                                </label>
                            </div>

                            {/* Lupa Password */}
                            <Link
                                to="/forgot-password"
                                className="text-sm text-neutral-gray hover:text-primary-dark transition-colors"
                            >
                                Lupa password?
                            </Link>
                        </div>
                        {/* =================================================== */}

                        <LoadingButton
                            type="submit"
                            isLoading={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            LOGIN <span className="text-lg">➤</span>
                        </LoadingButton>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-neutral-gray font-medium">
                            Belum memiliki akun?{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:text-primary-dark font-bold transition-colors"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bagian Kanan - Hero Section (Tidak Berubah) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center text-white p-12 relative overflow-hidden">
                 <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>

                 <div className="text-center max-w-lg z-10">
                     <h2 className="text-5xl font-extrabold mb-6 leading-tight text-white">
                         Perjalanan Dimulai <br/> dari Sini
                     </h2>
                     <p className="text-lg text-blue-50 mb-10 font-light leading-relaxed">
                         Nikmati kemudahan booking transportasi dari layanan Zulzi Trans!
                     </p>

                    <div className="space-y-4 text-left inline-block">
                        <div className="flex items-center gap-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                            <span className="text-lg font-medium">Booking Cepat dan Mudah</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                            <span className="text-lg font-medium">Driver berpengalaman</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                            <span className="text-lg font-medium">Layanan pelanggan beroperasi 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
