import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogIn, UserPlus, Shield, Phone } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

interface AgeGateProps {
    children: React.ReactNode;
}

const AgeGate: React.FC<AgeGateProps> = ({ children }) => {
    // Initialize state based on current user (computed once)
    const [isVerified, setIsVerified] = useState(() => {
        const user = getCurrentUser();
        return !!user;
    });

    // Listen for storage changes (login/logout from other tabs or login redirect)
    useEffect(() => {
        const handleStorageChange = () => {
            const user = getCurrentUser();
            setIsVerified(!!user);
        };

        // Check periodically for login state changes
        const interval = setInterval(handleStorageChange, 500);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleDeny = () => {
        // Redirect to a safe page
        window.location.href = 'https://www.google.com';
    };

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
                        <h1 className="text-white text-xl font-bold mb-1">성인인증 필수</h1>
                        <p className="text-white/80 text-sm">Adult Verification Required</p>
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
                                    청소년보호법에 따라 본인인증을 통한 성인확인이 필수입니다.
                                </p>
                            </div>
                        </div>

                        {/* Verification Notice */}
                        <div className="bg-surface rounded-xl p-4 border border-border">
                            <h3 className="font-bold text-text-main text-sm mb-3 flex items-center gap-2">
                                <Shield size={16} className="text-primary" />
                                성인인증 절차 안내
                            </h3>
                            <div className="space-y-2 text-xs text-text-muted">
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-primary" />
                                    <span>휴대폰 본인인증으로 성인 여부 확인</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield size={14} className="text-green-500" />
                                    <span>회원가입 시 본인인증 1회로 완료</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="text-xs text-text-muted p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="font-medium text-primary mb-1">왜 로그인이 필요한가요?</p>
                            <p>휴대폰 본인인증을 통해 만 19세 이상 성인만 서비스를 이용할 수 있도록 법적 요건을 준수합니다.</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <a
                                href="/login"
                                className="w-full py-4 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                            >
                                <LogIn size={20} />
                                로그인
                            </a>
                            <a
                                href="/signup"
                                className="w-full py-4 px-4 rounded-xl bg-surface border-2 border-primary text-primary font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <UserPlus size={20} />
                                회원가입 (본인인증)
                            </a>
                            <button
                                onClick={handleDeny}
                                className="w-full py-3 px-4 rounded-xl text-text-muted hover:text-text-main transition-colors text-sm"
                            >
                                19세 미만입니다 (나가기)
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-[10px] text-text-light pt-2">
                            LunaAlba는 청소년보호법을 준수하며,<br />
                            본인인증을 통한 성인확인 절차를 시행합니다.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AgeGate;
