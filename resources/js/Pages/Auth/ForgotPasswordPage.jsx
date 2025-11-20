import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        try {
            // TODO: Implement forgot password API
            // const response = await authService.forgotPassword({ email });
            
            setAlert({
                type: 'success',
                message: 'Link reset password telah dikirim ke email Anda!'
            });

        } catch (error) {
            console.error('Forgot password error:', error);
            
            if (error.errors) {
                setErrors(error.errors);
            }
            
            setAlert({
                type: 'error',
                message: error.message || 'Gagal mengirim link reset password.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    <Link 
                        to="/login"
                        className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Kembali ke Login</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-primary-dark mb-2">
                            Lupa Password?
                        </h1>
                        <p className="text-neutral-gray">
                            Masukkan email Anda untuk menerima link reset password
                        </p>
                    </div>

                    {alert && (
                        <Alert 
                            type={alert.type} 
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            placeholder="Masukkan email"
                            required
                        />

                        <LoadingButton
                            type="submit"
                            loading={loading}
                            className="w-full"
                        >
                            Kirim Link Reset Password
                        </LoadingButton>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;