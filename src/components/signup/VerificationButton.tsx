import React from 'react';
import { Check, X, Loader } from 'lucide-react';

interface VerificationButtonProps {
    onVerify: () => void;
    status: 'pending' | 'loading' | 'verified' | 'failed';
    verifiedName?: string;
}

const VerificationButton: React.FC<VerificationButtonProps> = ({ onVerify, status, verifiedName }) => {
    const getButtonContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <Loader className="animate-spin" size={20} />
                        <span>인증 중...</span>
                    </>
                );
            case 'verified':
                return (
                    <>
                        <Check size={20} />
                        <span>인증 완료: {verifiedName}</span>
                    </>
                );
            case 'failed':
                return (
                    <>
                        <X size={20} />
                        <span>인증 실패 (재시도)</span>
                    </>
                );
            default:
                return <span>PASS 본인인증</span>;
        }
    };

    const getButtonClass = () => {
        const base = 'w-full py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2';

        switch (status) {
            case 'verified':
                return `${base} bg-green-500/20 border-2 border-green-500 text-green-500`;
            case 'failed':
                return `${base} bg-red-500/20 border-2 border-red-500 text-red-500 hover:bg-red-500/30`;
            case 'loading':
                return `${base} bg-white/10 text-text-muted cursor-not-allowed`;
            default:
                return `${base} bg-primary text-black hover:bg-primary-hover`;
        }
    };

    return (
        <button
            onClick={onVerify}
            disabled={status === 'loading' || status === 'verified'}
            className={getButtonClass()}
        >
            {getButtonContent()}
        </button>
    );
};

export default VerificationButton;
