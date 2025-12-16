/**
 * Password Validator Utility
 * Validasi kekuatan password dengan kriteria:
 * - Minimal 8 karakter
 * - Minimal 1 huruf besar (A-Z)
 * - Minimal 1 huruf kecil (a-z)
 * - Minimal 1 angka (0-9)
 * - Minimal 1 karakter khusus (!@#$%^&*)
 */

export const validatePassword = (password) => {
    const criteria = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    return criteria;
};

export const isPasswordStrong = (password) => {
    const criteria = validatePassword(password);
    return Object.values(criteria).every(Boolean);
};

export const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    const criteria = validatePassword(password);
    const passedCriteria = Object.values(criteria).filter(Boolean).length;
    
    // 0-20% = Very Weak, 20-40% = Weak, 40-60% = Fair, 60-80% = Good, 80-100% = Strong
    return (passedCriteria / 5) * 100;
};

export const getPasswordStrengthLabel = (strength) => {
    if (strength === 0) return 'Belum ada password';
    if (strength < 40) return 'Sangat Lemah';
    if (strength < 60) return 'Lemah';
    if (strength < 80) return 'Cukup Baik';
    if (strength < 100) return 'Baik';
    return 'Sangat Kuat';
};

export const getPasswordStrengthColor = (strength) => {
    if (strength === 0) return 'bg-gray-200';
    if (strength < 40) return 'bg-red-500';
    if (strength < 60) return 'bg-orange-500';
    if (strength < 80) return 'bg-yellow-500';
    if (strength < 100) return 'bg-blue-500';
    return 'bg-green-500';
};

export const getPasswordStrengthTextColor = (strength) => {
    if (strength === 0) return 'text-gray-600';
    if (strength < 40) return 'text-red-600';
    if (strength < 60) return 'text-orange-600';
    if (strength < 80) return 'text-yellow-600';
    if (strength < 100) return 'text-blue-600';
    return 'text-green-600';
};

export const getPasswordRequirements = () => {
    return [
        { label: 'Minimal 8 karakter', key: 'minLength' },
        { label: 'Minimal 1 huruf besar (A-Z)', key: 'hasUpperCase' },
        { label: 'Minimal 1 huruf kecil (a-z)', key: 'hasLowerCase' },
        { label: 'Minimal 1 angka (0-9)', key: 'hasNumber' },
        { label: 'Minimal 1 karakter khusus (!@#$%^&*)', key: 'hasSpecialChar' },
    ];
};
