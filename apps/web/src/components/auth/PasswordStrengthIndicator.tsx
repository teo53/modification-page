// =============================================================================
// 📁 src/components/auth/PasswordStrengthIndicator.tsx
// 🏷️  비밀번호 강도 표시기
// =============================================================================

import React, { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
    password: string;
    showRequirements?: boolean;
}

interface PasswordStrength {
    score: number; // 0-4
    label: string;
    color: string;
    requirements: {
        length: boolean;
        hasLetter: boolean;
        hasNumber: boolean;
        hasSpecial: boolean;
    };
}

const calculateStrength = (password: string): PasswordStrength => {
    const requirements = {
        length: password.length >= 8,
        hasLetter: /[A-Za-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    let score = 0;
    if (requirements.length) score++;
    if (requirements.hasLetter) score++;
    if (requirements.hasNumber) score++;
    if (requirements.hasSpecial) score++;

    // 추가 점수: 길이 12 이상
    if (password.length >= 12) score = Math.min(score + 0.5, 4);

    const labels: Record<number, { label: string; color: string }> = {
        0: { label: '매우 약함', color: '#ef4444' },
        1: { label: '약함', color: '#f97316' },
        2: { label: '보통', color: '#eab308' },
        3: { label: '강함', color: '#22c55e' },
        4: { label: '매우 강함', color: '#16a34a' },
    };

    const { label, color } = labels[Math.floor(score)] || labels[0];

    return { score, label, color, requirements };
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    password,
    showRequirements = true,
}) => {
    const strength = useMemo(() => calculateStrength(password), [password]);

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2">
            {/* 진행 바 */}
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: index < strength.score ? strength.color : '#e5e7eb',
                        }}
                    />
                ))}
            </div>

            {/* 라벨 */}
            <div className="flex justify-between items-center text-xs">
                <span style={{ color: strength.color }} className="font-medium">
                    {strength.label}
                </span>
            </div>

            {/* 요구사항 체크리스트 */}
            {showRequirements && (
                <ul className="text-xs space-y-1 mt-2">
                    <li className={strength.requirements.length ? 'text-green-600' : 'text-gray-400'}>
                        {strength.requirements.length ? '✓' : '○'} 8자 이상
                    </li>
                    <li className={strength.requirements.hasLetter ? 'text-green-600' : 'text-gray-400'}>
                        {strength.requirements.hasLetter ? '✓' : '○'} 영문자 포함
                    </li>
                    <li className={strength.requirements.hasNumber ? 'text-green-600' : 'text-gray-400'}>
                        {strength.requirements.hasNumber ? '✓' : '○'} 숫자 포함
                    </li>
                    <li className={strength.requirements.hasSpecial ? 'text-green-600' : 'text-gray-400'}>
                        {strength.requirements.hasSpecial ? '✓' : '○'} 특수문자 포함 (선택)
                    </li>
                </ul>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;

// 유틸리티 함수 export (백엔드와 동일한 검증 로직)
export const isPasswordValid = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8) {
        return { valid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
    }
    if (!/[A-Za-z]/.test(password)) {
        return { valid: false, message: '비밀번호에 영문자가 포함되어야 합니다.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: '비밀번호에 숫자가 포함되어야 합니다.' };
    }
    return { valid: true, message: '' };
};
