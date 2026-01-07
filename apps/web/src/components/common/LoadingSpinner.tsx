// =============================================================================
// 📁 src/components/common/LoadingSpinner.tsx
// 🏷️  로딩 스피너 컴포넌트 - 홈페이지 스타일
// =============================================================================

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text = '로딩 중...',
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-12 h-12 border-3',
        lg: 'w-16 h-16 border-4'
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const spinner = (
        <div className="flex flex-col items-center gap-4">
            {/* 로고 애니메이션 */}
            <div className="relative">
                {/* 외곽 링 */}
                <div className={`
                    ${sizeClasses[size]} 
                    rounded-full 
                    border-primary/20 
                    border-t-primary 
                    animate-spin
                `} />

                {/* 내부 펄스 */}
                <div className={`
                    absolute inset-2 
                    rounded-full 
                    bg-gradient-to-br from-primary/30 to-pink-500/20
                    animate-pulse
                `} />
            </div>

            {/* 텍스트 */}
            {text && (
                <div className="flex items-center gap-1">
                    <span className={`${textSizes[size]} text-text-muted`}>
                        {text}
                    </span>
                    <span className="flex gap-1">
                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    );
};

export default LoadingSpinner;
