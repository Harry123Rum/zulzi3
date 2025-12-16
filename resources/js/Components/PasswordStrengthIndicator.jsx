import React from 'react';
import { Check, X } from 'lucide-react';
import {
    validatePassword,
    getPasswordStrength,
    getPasswordStrengthLabel,
    getPasswordStrengthColor,
    getPasswordStrengthTextColor,
    getPasswordRequirements,
} from '@/utils/passwordValidator';

export const PasswordStrengthIndicator = ({ password = '' }) => {
    const strength = getPasswordStrength(password);
    const label = getPasswordStrengthLabel(strength);
    const barColor = getPasswordStrengthColor(strength);
    const textColor = getPasswordStrengthTextColor(strength);
    const criteria = validatePassword(password);
    const requirements = getPasswordRequirements();

    return (
        <div className="mt-3 space-y-3">
            {/* Strength Bar */}
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600">Kekuatan Password:</span>
                    <span className={`text-xs font-bold ${textColor}`}>
                        {label}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${barColor} transition-all duration-300`}
                        style={{ width: `${strength}%` }}
                    ></div>
                </div>
            </div>

            {/* Requirements Checklist */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-gray-700">Persyaratan Password:</p>
                <div className="space-y-1.5">
                    {requirements.map((req) => (
                        <div key={req.key} className="flex items-center gap-2">
                            {criteria[req.key] ? (
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                            )}
                            <span
                                className={`text-xs ${
                                    criteria[req.key] ? 'text-green-700 line-through' : 'text-gray-600'
                                }`}
                            >
                                {req.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
