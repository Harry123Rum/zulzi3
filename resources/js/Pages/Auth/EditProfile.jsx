// resources/js/Pages/Auth/EditProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from '@/Components/ReusableUI'; 
import { ArrowLeft } from 'lucide-react';
import userService from '../../../service/userService.js';

const EditProfile = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    
    const [formData, setFormData] = useState({
        nama: '',
        no_telepon: '',
        email: '',
        //alamat: '',
    });
    
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load user data on mount
    useEffect(() => {
        if (user) {
            setFormData({
                nama: user.nama || '',
                no_telepon: user.no_telepon || '',
                email: user.email || '',
                //alamat: user.alamat || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        try {
            const response = await userService.updateProfile(formData);
            updateUser(response.data);

            setAlert({
                type: 'success',
                message: response.message || 'Profile berhasil diperbarui!',
            });
            
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Update profile error:', error);
            if (error.errors) setErrors(error.errors);

            setAlert({
                type: 'error',
                message: error.message || 'Gagal memperbarui profile.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Komponen Input Custom Sesuai Desain
    const CustomInput = ({ label, name, type = "text", value, onChange, placeholder, error, disabled }) => (
        <div className="mb-6">
            <label className="block text-center text-gray-800 font-medium mb-2" htmlFor={name}>
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`
                    w-full px-6 py-4 rounded-xl border text-center
                    transition-all duration-300 outline-none
                    ${error 
                        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-400 bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                    }
                    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-700'}
                `}
            />
            {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-white px-6 py-8 md:px-20 relative">
            {/* Tombol Kembali */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-6 md:left-20 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
            </button>

            <div className="max-w-2xl mx-auto mt-12">
                {/* Judul Halaman */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-primary-dark mb-2">
                        Edit Profile
                    </h1>
                </div>

                {/* Alert Notification */}
                {alert && (
                    <div className="mb-6">
                        <Alert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full">
                    <CustomInput
                        label="Nama Lengkap"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        error={errors.nama}
                        placeholder="Masukkan Nama Lengkap"
                    />

                    <CustomInput
                        label="No Telepon"
                        name="no_telepon"
                        value={formData.no_telepon}
                        onChange={handleChange}
                        error={errors.no_telepon}
                        placeholder="Masukkan No Telepon"
                    />

                    <CustomInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="Masukkan email"
                        disabled
                    />

                    {/* <CustomInput
                        label="Alamat"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        error={errors.alamat}
                        placeholder="Masukkan Alamat"
                    /> */}

                    <div className="text-center mt-8 mb-6">
                        <p className="text-neutral-gray text-sm md:text-base">
                            Tekan save untuk menyimpan perubahan
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                bg-primary hover:bg-primary-dark text-white font-bold text-xl
                                py-3 px-16 rounded-lg shadow-md transition-all duration-300
                                uppercase tracking-wide
                                ${loading ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {loading ? 'SAVING...' : 'SAVE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;