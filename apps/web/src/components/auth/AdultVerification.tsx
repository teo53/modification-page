import React, { useState } from 'react';
import { Smartphone, CreditCard, User, X } from 'lucide-react';
import { login, loginWithApi, USE_API_AUTH, getCurrentUser } from '../../utils/auth';
import Signup from '../../pages/Signup';

// 성인인증 여부를 로컬 스토리지에 저장 (세션 스토리지에서 변경)
const ADULT_VERIFIED_KEY = 'lunaalba_adult_verified';
const ADULT_VERIFIED_TIMESTAMP = 'lunaalba_adult_verified_time';

// 개발 환경 자동 우회 설정 (환경 변수로 제어 가능)
const DEV_AUTO_BYPASS = import.meta.env.VITE_DEV_ADULT_BYPASS !== 'false';

export const isAdultVerified = (): boolean => {
    // 개발 환경에서 자동 우회 (환경 변수로 비활성화 가능)
    const isDev = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        import.meta.env.DEV;

    if (isDev && DEV_AUTO_BYPASS) {
        return true; // 개발 환경에서는 자동 인증 (VITE_DEV_ADULT_BYPASS=false로 비활성화)
    }

    // 이미 로그인된 사용자는 자동으로 성인인증 통과
    const currentUser = getCurrentUser();
    if (currentUser) {
        // 로그인된 사용자는 자동으로 성인인증 처리
        setAdultVerified();
        return true;
    }

    // localStorage에서 확인 (브라우저 닫아도 유지)
    const verified = localStorage.getItem(ADULT_VERIFIED_KEY);
    const timestamp = localStorage.getItem(ADULT_VERIFIED_TIMESTAMP);

    if (!verified || !timestamp) return false;

    // 세션 유효시간: 7일 (24시간에서 연장)
    const verifiedTime = parseInt(timestamp);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (now - verifiedTime > sevenDays) {
        localStorage.removeItem(ADULT_VERIFIED_KEY);
        localStorage.removeItem(ADULT_VERIFIED_TIMESTAMP);
        return false;
    }

    return verified === 'true';
};

export const setAdultVerified = () => {
    localStorage.setItem(ADULT_VERIFIED_KEY, 'true');
    localStorage.setItem(ADULT_VERIFIED_TIMESTAMP, Date.now().toString());
};

interface AdultVerificationProps {
    onVerified: () => void;
}

const AdultVerification: React.FC<AdultVerificationProps> = ({ onVerified }) => {
    // 회원가입 모달 상태
    const [showSignupModal, setShowSignupModal] = useState(false);

    // 회원 로그인 상태
    const [memberType, setMemberType] = useState<'business' | 'personal'>('business');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 비회원 인증용
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // 휴대폰 인증 코드 전송
    const handleSendCode = () => {
        if (!phone || phone.length < 10) {
            setError('올바른 휴대폰 번호를 입력해주세요.');
            return;
        }

        setIsCodeSent(true);
        setCountdown(180);
        setError('');

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // 휴대폰 인증 확인 - 실제 SMS 인증 서비스 연동 필요
    const handlePhoneVerify = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setError('인증번호 6자리를 입력해주세요.');
            return;
        }

        // TODO: 실제 SMS 인증 서비스 연동 (예: NHN Cloud, Twilio, etc.)
        // 현재는 인증 서비스 미연동 상태이므로 기능 비활성화
        setError('휴대폰 인증 서비스 준비 중입니다. 회원 로그인을 이용해주세요.');
        return;
    };

    // 회원 로그인 - 실제 인증 시스템 사용
    const handleLogin = async () => {
        if (!userId || !password) {
            setError('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 실제 인증 시스템 사용
            let result;
            // Demo account fail-safe: API call first, fallback to mock if network error for this specific user
            if (USE_API_AUTH) {
                result = await loginWithApi(userId, password);
            } else {
                result = login(userId, password);
            }

            if (result.success) {
                setAdultVerified();
                onVerified();
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    // 아이핀 인증 (데모)
    const handleIpinVerify = () => {
        // 실제로는 아이핀 인증 팝업 연동
        alert('아이핀 인증 서비스 준비 중입니다.');
    };

    const handleExit = () => {
        window.location.href = 'https://www.google.com';
    };

    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center p-4 overflow-auto font-sans">
            <div className="max-w-4xl w-full">
                {/* Header - 19금 경고 */}
                <div className="text-center mb-6 md:mb-8 relative px-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-900/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="relative inline-flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5">
                        {/* 19 아이콘 */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#8B0000] flex items-center justify-center shadow-[0_0_15px_rgba(139,0,0,0.2)] bg-black/50 shrink-0">
                            <span className="text-3xl md:text-4xl font-extrabold text-[#C62828] tracking-tighter">19</span>
                        </div>
                        <div className="text-center md:text-left space-y-1">
                            <p className="text-gray-400 text-[10px] md:text-xs tracking-wide leading-tight">청소년 유해매체물</p>
                            <p className="text-[#E53935] font-bold text-sm md:text-lg">청소년보호법의 규정에 의하여</p>
                            <p className="text-white font-bold text-base md:text-2xl tracking-tight leading-tight">만 19세 미만의 청소년은<br className="md:hidden" /> 이용할 수 없습니다</p>
                        </div>
                    </div>
                </div>

                {/* Main Content - 2 Column */}
                <div className="bg-[#1a1a1a]/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        {/* 좌측: 비회원 로그인 */}
                        <div className="p-4 sm:p-6 md:p-10 relative">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                                <div className="p-2 rounded-lg bg-gray-800/50 text-gray-400">
                                    <Smartphone size={20} />
                                </div>
                                <h2 className="text-base sm:text-xl font-bold text-white">비회원 인증</h2>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleIpinVerify}
                                    className="w-full group relative overflow-hidden rounded-xl bg-gray-800/50 border border-white/5 p-4 hover:bg-gray-800 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                                            <span className="text-gray-300 group-hover:text-white font-medium transition-colors">아이핀 인증</span>
                                        </div>
                                        <span className="text-gray-600 group-hover:text-gray-400 text-sm">→</span>
                                    </div>
                                </button>

                                <div className="bg-gray-800/30 border border-white/5 rounded-xl p-5 space-y-4">
                                    <p className="text-sm text-gray-400 font-medium mb-2">휴대폰 본인인증</p>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder="휴대폰 번호 (- 없이 입력)"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#C62828]/50 focus:ring-1 focus:ring-[#C62828]/50 focus:outline-none transition-all"
                                            maxLength={11}
                                        />
                                    </div>

                                    {!isCodeSent ? (
                                        <button
                                            onClick={handleSendCode}
                                            className="w-full bg-[#B71C1C] text-white font-bold py-3.5 rounded-lg hover:bg-[#C62828] transition-all shadow-lg shadow-black/20"
                                        >
                                            인증번호 받기
                                        </button>
                                    ) : (
                                        <>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                                                        placeholder="인증번호 6자리"
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-center text-lg tracking-widest text-white focus:border-[#C62828]/50 focus:outline-none"
                                                        maxLength={6}
                                                    />
                                                    {countdown > 0 && (
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EF5350] font-medium text-sm tabular-nums">
                                                            {formatCountdown(countdown)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={handlePhoneVerify}
                                                className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
                                            >
                                                인증 완료
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 우측: 회원 로그인 */}
                        <div className="p-4 sm:p-6 md:p-10 bg-black/20">
                            <div className="flex items-center justify-between mb-4 sm:mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gray-800/50 text-gray-400">
                                        <User size={20} />
                                    </div>
                                    <h2 className="text-base sm:text-xl font-bold text-white">회원 로그인</h2>
                                </div>
                                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                                    <button
                                        onClick={() => setMemberType('business')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${memberType === 'business'
                                            ? 'bg-[#B71C1C] text-white shadow-md'
                                            : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        업소회원
                                    </button>
                                    <button
                                        onClick={() => setMemberType('personal')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${memberType === 'personal'
                                            ? 'bg-[#B71C1C] text-white shadow-md'
                                            : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        개인회원
                                    </button>
                                </div>
                            </div>

                            {/* 로그인 폼 */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 ml-1">아이디</label>
                                    <input
                                        type="text"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#C62828]/50 focus:outline-none transition-colors"
                                        placeholder="아이디를 입력하세요"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 ml-1">비밀번호</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#C62828]/50 focus:outline-none transition-colors"
                                            placeholder="비밀번호"
                                        />
                                        <button
                                            onClick={handleLogin}
                                            disabled={loading}
                                            className="bg-[#B71C1C] text-white font-bold px-6 py-3.5 rounded-lg hover:bg-[#C62828] transition-colors shadow-lg shadow-black/20 whitespace-nowrap disabled:opacity-50"
                                        >
                                            {loading ? '로그인 중...' : '로그인'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 소셜 로그인 */}
                            {memberType === 'personal' && (
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-xs text-gray-500 text-center mb-4">간편 로그인 / 회원가입</p>
                                    <div className="flex justify-center gap-3">
                                        <button className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-105 transition-transform">
                                            <span className="font-bold text-lg">f</span>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
                                            <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 회원가입 링크 */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowSignupModal(true)}
                                    className="text-gray-500 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white/50 pb-0.5"
                                >
                                    아직 회원이 아니신가요? <span className="text-[#EF5350]">회원가입 하기</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="bg-[#B71C1C]/10 border-t border-[#B71C1C]/20 px-6 py-4 text-center animate-pulse">
                            <span className="text-[#EF5350] text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Footer - 만19세 미만 나가기 */}
                    <div className="bg-black/40 border-t border-white/5 py-5 text-center transition-colors hover:bg-black/60">
                        <button
                            onClick={handleExit}
                            className="text-gray-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            만 19세 미만 나가기
                        </button>
                    </div>
                </div>

                {/* 하단 법적 고지 */}
                <div className="mt-8 text-center space-y-2 opacity-60">
                    <p className="text-xs text-gray-500">청소년보호법 제16조(표시의무), 제17조(청소년에 대한 판매금지 등)</p>
                    <p className="text-xs text-gray-600">위반 시 3년 이하의 징역 또는 3천만원 이하의 벌금에 처해질 수 있습니다.</p>
                </div>
            </div>

            {/* 회원가입 모달 */}
            {showSignupModal && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 overflow-auto">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-[#1a1a1a] rounded-2xl">
                        {/* 모달 헤더 */}
                        <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">회원가입</h2>
                            <button
                                onClick={() => setShowSignupModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        {/* 회원가입 폼 */}
                        <div className="p-6">
                            <Signup
                                isModal={true}
                                onSignupSuccess={() => {
                                    setShowSignupModal(false);
                                    setAdultVerified();
                                    onVerified();
                                }}
                                onClose={() => setShowSignupModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdultVerification;
