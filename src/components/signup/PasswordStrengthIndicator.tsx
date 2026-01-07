import React from 'react';

interface PasswordStrengthIndicatorProps {
    password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const strength = passedChecks === 0 ? 0 : passedChecks <= 1 ? 1 : passedChecks <= 2 ? 2 : passedChecks === 3 ? 3 : 4;

    const getStrengthText = () => {
        if (strength === 0) return '매우 약함';
        if (strength === 1) return '약함';
        if (strength === 2) return '보통';
        if (strength === 3) return '강함';
        return '매우 강함';
    };

    const getStrengthColor = () => {
        if (strength <= 1) return 'bg-red-500';
        if (strength === 2) return 'bg-yellow-500';
        if (strength === 3) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${level <= strength ? getStrengthColor() : 'bg-white/10'
                            }`}
                    />
                ))}
            </div>

            {password && (
                <>
                    <p className="text-xs text-text-muted">
                        강도: <span className={`font-bold ${strength >= 3 ? 'text-green-500' : strength === 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {getStrengthText()}
                        </span>
                    </p>

                    <div className="text-xs space-y-1">
                        <p className={checks.length ? 'text-green-500' : 'text-text-muted'}>
                            {checks.length ? '✓' : '○'} 8자 이상
                        </p>
                        <p className={checks.uppercase ? 'text-green-500' : 'text-text-muted'}>
                            {checks.uppercase ? '✓' : '○'} 대문자 포함
                        </p>
                        <p className={checks.number ? 'text-green-500' : 'text-text-muted'}>
                            {checks.number ? '✓' : '○'} 숫자 포함
                        </p>
                        <p className={checks.special ? 'text-green-500' : 'text-text-muted'}>
                            {checks.special ? '✓' : '○'} 특수문자 포함
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;
