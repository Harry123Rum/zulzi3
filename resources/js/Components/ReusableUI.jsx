import React from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

// ==================== FORM COMPONENTS ====================

/**
 * FormInput - Input teks standar
 */
export const FormInput = ({ 
    label, name, value, onChange, error, type = 'text', placeholder = '', 
    disabled = false, required = false, ...props 
}) => {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                {...props}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};

/**
 * FormSelect - Dropdown menu standar
 */
export const FormSelect = ({ 
    label, name, value, onChange, error, children, 
    disabled = false, required = false 
}) => {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                {children}
            </select>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};

/**
 * FormTextarea - Textarea standar
 */
export const FormTextarea = ({ 
    label, name, value, onChange, error, placeholder = '', 
    rows = 4, disabled = false, required = false 
}) => {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};

// ==================== DISPLAY & ACTION COMPONENTS ====================

export const StatCard = ({ label, value, subtext, icon: Icon, iconBgColor = 'bg-indigo-600' }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                    {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
                </div>
                {Icon && (
                    <div className={`${iconBgColor} p-4 rounded-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

export const PrimaryButton = ({ onClick, icon: Icon, children, type = 'button', disabled = false, className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

export const SecondaryButton = ({ onClick, icon: Icon, children, type = 'button', disabled = false, className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

/**
 * LoadingButton - Penting untuk Login Page
 */
export const LoadingButton = ({ isLoading, children, loadingText = 'Memproses...', type = 'submit', className = '', ...props }) => {
    return (
        <button
            type={type}
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingText}
                </>
            ) : children}
        </button>
    );
};

export const ActionButton = ({ type, onClick, title }) => {
    const config = {
        edit: { icon: Edit2, className: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50', title: title || 'Edit' },
        delete: { icon: Trash2, className: 'text-red-600 hover:text-red-800 hover:bg-red-50', title: title || 'Hapus' }
    };
    const { icon: Icon, className, title: btnTitle } = config[type];

    return (
        <button onClick={onClick} title={btnTitle} className={`p-2 rounded-lg transition-all duration-200 ${className}`}>
            <Icon className="w-5 h-5" />
        </button> 
    );
};

export const SearchInput = ({ value, onChange, placeholder = 'Cari data...' }) => {
    return (
        <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
        </div>
    );
};

export const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('tersedia') || s.includes('aktif') || s.includes('selesai')) return 'bg-green-100 text-green-800';
        if (s.includes('proses') || s.includes('pending') || s.includes('digunakan')) return 'bg-yellow-100 text-yellow-800';
        if (s.includes('tidak') || s.includes('nonaktif') || s.includes('batal') || s.includes('perbaikan')) return 'bg-red-100 text-red-800';
        return 'bg-blue-100 text-blue-800';
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

// ==================== MODAL COMPONENT (FIXED) ====================

/**
 * Modal - Jendela pop-up.
 * FIXED: Menggunakan 'bg-black/50' agar background transparan (tidak hitam pekat).
 */
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop: Menggunakan opacity Tailwind yang benar */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all z-10`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==================== UTILS ====================

export const Alert = ({ type = 'info', message, onClose }) => {
    const types = {
        success: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800' },
        error: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800' },
        warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800' },
        info: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800' }
    };
    const { bg, border, text } = types[type];

    return (
        <div className={`${bg} ${border} ${text} border-l-4 p-4 rounded-lg mb-4 flex items-center justify-between`}>
            <p className="font-medium">{message}</p>
            {onClose && <button onClick={onClose} className="ml-4 text-xl font-bold hover:opacity-70">×</button>}
        </div>
    );
};

export const Loading = ({ message = 'Loading...' }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">{message}</p>
    </div>
);

export const Table = ({ headers, children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
        </table>
    </div>
);

export const EmptyState = ({ message = 'Tidak ada data', icon: Icon }) => (
    <div className="flex flex-col items-center justify-center py-12">
        {Icon && <Icon className="w-16 h-16 text-gray-300 mb-4" />}
        <p className="text-gray-500 text-lg">{message}</p>
    </div>
);