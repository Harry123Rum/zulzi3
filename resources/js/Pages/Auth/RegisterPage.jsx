import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormInput, Alert, LoadingButton } from '@/Components/ReusableUI';
import { PasswordStrengthIndicator } from '@/Components/PasswordStrengthIndicator';
import { isPasswordStrong } from '@/utils/passwordValidator';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        no_telepon: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        // Validasi password strength
        if (!isPasswordStrong(formData.password)) {
            setAlert({ 
                type: 'error', 
                message: 'Password tidak memenuhi kriteria keamanan. Pastikan password memiliki huruf besar, huruf kecil, angka, dan karakter khusus!' 
            });
            setLoading(false);
            return;
        }

        // Validasi password confirmation match
        if (formData.password !== formData.password_confirmation) {
            setAlert({ 
                type: 'error', 
                message: 'Password dan konfirmasi password tidak cocok!' 
            });
            setLoading(false);
            return;
        }

        try {
            const response = await register(formData);
            setAlert({ type: 'success', message: response.message || 'Registrasi berhasil!' });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            console.error('Register error:', error);
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setAlert({ type: 'error', message: error.message || 'Terjadi kesalahan pada sistem.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans bg-neutral-white">
            
            {/* BAGIAN KIRI: BRANDING (Biru) */}
            <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-primary to-primary-dark text-white p-12 flex-col justify-center relative overflow-hidden">
                {/* Abstract Circles */}
                <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 right-[-10%] w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>

                <div className="text-center max-w-lg z-10">
                    <h2 className="text-5xl font-extrabold mb-6 leading-tight text-white">
                        Perjalanan Dimulai <br/> dari Sini
                    </h2>
                    <p className="text-lg text-blue-50 mb-10 font-light leading-relaxed">
                        Nikmati kemudahan booking transportasi dari layanan Zulzi Trans!
                    </p>
                    
                    <div className="space-y-5">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-1 rounded-full mt-1">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                {/* Teks di sini diubah menjadi putih */}
                                <h3 className="font-bold text-lg text-white">Booking Cepat dan Mudah</h3>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-1 rounded-full mt-1">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                {/* Teks di sini diubah menjadi putih */}
                                <h3 className="font-bold text-lg text-white">Driver berpengalaman</h3>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-1 rounded-full mt-1">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                {/* Teks di sini diubah menjadi putih */}
                                <h3 className="font-bold text-lg text-white">Layanan pelanggan beroperasi 24/7</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BAGIAN KANAN: FORM (Putih) */}
            <div className="w-full md:w-7/12 flex flex-col justify-center px-8 md:px-24 py-16 bg-white overflow-y-auto min-h-screen">
                <div className="max-w-lg mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-primary-dark mb-2">
                            Buat Akun Anda!
                        </h1>
                        <p className="text-neutral-gray text-base">
                            Buat akun untuk memulai perjalanan anda
                        </p>
                    </div>

                    {alert && (
                        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormInput
                            label="Nama"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            error={errors.nama && errors.nama[0]}
                            placeholder="Masukkan nama"
                        />

                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email && errors.email[0]}
                            placeholder="Masukkan email"
                        />

                        <FormInput
                            label="No HP"
                            name="no_telepon"
                            value={formData.no_telepon}
                            onChange={handleChange}
                            error={errors.no_telepon && errors.no_telepon[0]}
                            placeholder="Masukkan no HP"
                        />

                        {/* Password Input dengan Toggle dan Strength Indicator */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Masukkan password yang kuat"
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-300 outline-none ${
                                        errors.password ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200' : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                            )}
                            <PasswordStrengthIndicator password={formData.password} />
                        </div>

                        {/* Konfirmasi Password Input dengan Toggle */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                Konfirmasi Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Masukkan ulang password"
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-300 outline-none ${
                                        errors.password_confirmation ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200' : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(prev => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
                            )}
                        </div>

                        <LoadingButton 
                            type="submit" 
                            loading={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md mt-4 flex items-center justify-center gap-2"
                        >
                             Buat Akun <span className="text-lg">➤</span>
                        </LoadingButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-neutral-gray">
                            Sudah punya akun?{' '}
                            <Link 
                                to="/login"
                                className="text-primary-dark font-bold hover:text-primary transition-colors"
                            >
                                Login disini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;