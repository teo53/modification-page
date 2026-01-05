import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

const AGE_VERIFIED_KEY = 'lunaalba_age_verified';

interface AgeGateProps {
    children: React.ReactNode;
}

const AgeGate: React.FC<AgeGateProps> = ({ children }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verified = localStorage.getItem(AGE_VERIFIED_KEY);
        if (verified === 'true') {
            setIsVerified(true);
        }
        setIsLoading(false);
    }, []);

    const handleVerify = () => {
        localStorage.setItem(AGE_VERIFIED_KEY, 'true');
        setIsVerified(true);
    };

    const handleDeny = () => {
        // Redirect to a safe page or close
        window.location.href = 'https://www.google.com';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isVerified) {
        return <>{children}</>;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl border border-border max-w-md w-full overflow-hidden shadow-2xl"
                >
                    {/* Header with 19+ Badge */}
                    <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-center">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-red-600 font-black text-3xl">19</span>
                        </div>
                        <h1 className="text-white text-xl font-bold mb-1">청소년 이용 불가</h1>
                        <p className="text-white/80 text-sm">Age Restricted Content</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Warning Message */}
                        <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="text-text-main text-sm font-medium mb-1">
                                    본 서비스는 만 19세 이상의 성인만 이용 가능합니다.
                                </p>
                                <p className="text-text-muted text-xs">
                                    청소년보호법에 따라 19세 미만의 청소년은 이용할 수 없습니다.
                                </p>
                            </div>
                        </div>

                        {/* Legal Notice */}
                        <div className="text-xs text-text-muted space-y-2 p-4 bg-surface rounded-lg">
                            <p className="font-medium text-text-main">이용 동의 사항:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>본인은 만 19세 이상의 성인입니다.</li>
                                <li>성인 인증을 거짓으로 할 경우 법적 책임을 질 수 있습니다.</li>
                                <li>본 사이트의 이용약관 및 개인정보처리방침에 동의합니다.</li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={handleDeny}
                                className="py-3 px-4 rounded-xl bg-surface border border-border text-text-main font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                19세 미만
                            </button>
                            <button
                                onClick={handleVerify}
                                className="py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} />
                                19세 이상
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-[10px] text-text-light pt-2">
                            "19세 이상" 버튼을 클릭하면 성인임을 확인하며,<br />
                            본 사이트의 이용약관에 동의하는 것으로 간주됩니다.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AgeGate;
