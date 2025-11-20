import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';
import { CheckCircle } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        try {
            await login(formData);
            setAlert({ type: 'success', message: 'Login berhasil!' });
            setTimeout(() => navigate('/beranda'), 1000); // Arahkan ke dashboard
        } catch (err) {
            console.error('Login error:', err);
            if (err.errors) setErrors(err.errors);
            setAlert({ type: 'error', message: err.message || 'Email atau password salah!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-neutral-white font-sans">
            {/* Bagian Kiri - Form Login */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 bg-white">
                <div className="max-w-md mx-auto w-full">
                    {/* Header Teks */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-primary-dark mb-3">
                            Selamat Datang <br /> Kembali !
                        </h1>
                        <p className="text-neutral-gray text-lg font-medium">
                            Login untuk melanjutkan perjalanan anda
                        </p>
                    </div>

                    {/* Tombol Google (Visual Only) */}
                    <button 
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-[#5CBCE2] hover:bg-[#4aa8cc] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-sm mb-6"
                    >
                        <span className="bg-white p-1 rounded-full">
                             {/* Ikon G sederhana */}
                            <svg className="w-4 h-4 text-[#5CBCE2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                            </svg>
                        </span>
                        Continue with Google
                    </button>

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
                            // Custom styling untuk input agar sesuai UI
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />

                        <div>
                            <FormInput
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Masukkan password"
                                required
                            />
                            <div className="flex justify-end mt-2">
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-neutral-gray hover:text-primary-dark transition-colors"
                                >
                                    Lupa password?
                                </Link>
                            </div>
                        </div>

                        <LoadingButton 
                            type="submit" 
                            loading={loading} 
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

            {/* Bagian Kanan - Branding Banner (Sesuai Gambar Login.png) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center text-white p-12 relative overflow-hidden">
                 {/* Dekorasi Background Circle Soft */}
                 <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>

                <div className="text-center max-w-lg z-10">
                    <h2 className="text-5xl font-extrabold mb-6 leading-tight text-white">
                        Perjalanan Dimulai <br/> dari Sini
                    </h2>
                    <p className="text-lg text-blue-50 mb-10 font-light leading-relaxed">
                        Nikmati kemudahan booking transportasi dari layanan Zulzi Trans!
                    </p>

                    {/* Feature List */}
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