import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FormInput, Alert, LoadingButton } from '@/Components/ReusableUI';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import authService from '../../../service/authService';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Ambil email dan token dari URL query params
    const emailFromUrl = searchParams.get('email') || '';
    const tokenFromUrl = searchParams.get('token') || '';

    const [formData, setFormData] = useState({
        email: emailFromUrl,
        token: tokenFromUrl,
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isResetSuccess, setIsResetSuccess] = useState(false);

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

        try {
            const response = await authService.resetPassword(formData);

            setAlert({
                type: 'success',
                message: response.message || 'Password berhasil direset!'
            });
            setIsResetSuccess(true);

            // Redirect ke halaman login setelah 3 detik
            setTimeout(() => navigate('/login'), 3000);

        } catch (error) {
            console.error('Reset password error:', error);

            const errorData = error.response?.data || error;

            if (errorData.errors) {
                setErrors(errorData.errors);
            }

            setAlert({
                type: 'error',
                message: errorData.message || 'Reset password gagal. Token mungkin tidak valid.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!tokenFromUrl || !emailFromUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-xl shadow-lg p-10 max-w-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600">Link reset password tidak valid atau kedaluwarsa.</p>
                    <Link to="/login" className="text-primary hover:underline mt-4 inline-block">Kembali ke Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-primary-dark mb-2">
                            Reset Password
                        </h1>
                        <p className="text-neutral-gray">
                            Masukkan password baru untuk akun: <span className="font-bold text-primary-dark">{emailFromUrl}</span>
                        </p>
                    </div>

                    {alert && (
                        <div className="mb-6">
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                            />
                        </div>
                    )}

                    {isResetSuccess ? (
                        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl text-green-800">
                            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3"/>
                            <p className="font-semibold">Password berhasil direset!</p>
                            <p className="text-sm mt-1">Anda akan diarahkan ke halaman login.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Hidden fields untuk token dan email */}
                            <input type="hidden" name="email" value={formData.email} />
                            <input type="hidden" name="token" value={formData.token} />

                            <FormInput
                                label="Password Baru"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password && errors.password[0]}
                                placeholder="Masukkan password baru"
                                required
                            />

                            <FormInput
                                label="Konfirmasi Password Baru"
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                error={errors.password_confirmation && errors.password_confirmation[0]}
                                placeholder="Ulangi password baru"
                                required
                            />

                            <LoadingButton
                                type="submit"
                                isLoading={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg shadow-md transition-all"
                            >
                                Reset Password
                            </LoadingButton>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
