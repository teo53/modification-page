import React, { useState, useEffect, useRef } from 'react';
import { Phone, Shield, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import { useToastOptional } from '../common/Toast';
import { api } from '../../utils/apiClient';

interface PhoneVerificationProps {
    phone: string;
    onPhoneChange: (phone: string) => void;
    onVerified: (verified: boolean) => void;
    isVerified: boolean;
}

type VerificationMethod = 'phone' | 'email';
type Step = 'input' | 'code' | 'verified';

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
    phone,
    onPhoneChange,
    onVerified,
    isVerified
}) => {
    const [step, setStep] = useState<Step>('input');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [sentCode, setSentCode] = useState('');
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 이메일 폴백 관련 상태
    const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('phone');
    const [email, setEmail] = useState('');
    const [showEmailFallback, setShowEmailFallback] = useState(false);
    const [smsFailCount, setSmsFailCount] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Toast hook - safely returns null if not in provider context
    const toast = useToastOptional();

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Generate random 6-digit code
    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Format phone number
    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    };

    // Handle phone input
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        onPhoneChange(formatted);
    };

    // SMS API 응답 타입
    interface SmsApiResponse {
        success: boolean;
        message: string;
        demoCode?: string;
        isDemoMode?: boolean;
    }

    // Send SMS verification code
    const sendSmsCode = async () => {
        if (phone.replace(/\D/g, '').length < 10) {
            setError('올바른 휴대폰 번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSentCode('');
        setIsDemoMode(false);

        const response = await api.post<SmsApiResponse>('/auth/phone/send-code', {
            phone: phone.replace(/\D/g, '')
        });

        if (response.data?.success) {
            setTimer(180);
            setStep('code');
            setVerificationMethod('phone');
            setSmsFailCount(0);
            setShowEmailFallback(false);

            if (response.data.isDemoMode && response.data.demoCode) {
                setSentCode(response.data.demoCode);
                setIsDemoMode(true);
                console.log(`[테스트 모드] 인증번호: ${response.data.demoCode}`);
                if (toast) {
                    toast.showDemoCode(response.data.demoCode);
                } else {
                    navigator.clipboard?.writeText(response.data.demoCode);
                    alert(`[테스트 모드] 인증번호: ${response.data.demoCode}\n\n클립보드에 복사되었습니다.`);
                }
            }
        } else {
            // SMS 발송 실패 - 이메일 폴백 옵션 표시
            const newFailCount = smsFailCount + 1;
            setSmsFailCount(newFailCount);
            setError(response.error || response.data?.message || 'SMS 발송에 실패했습니다.');

            // 개발 모드에서 서버 연결 실패 시 데모 모드
            if (import.meta.env.DEV && response.status === 0) {
                await new Promise(resolve => setTimeout(resolve, 800));
                const code = generateCode();
                setSentCode(code);
                setIsDemoMode(true);
                setTimer(180);
                setStep('code');
                setVerificationMethod('phone');

                console.log(`[개발 모드] 인증번호: ${code}`);
                if (toast) {
                    toast.showDemoCode(code);
                } else {
                    navigator.clipboard?.writeText(code);
                    alert(`[개발 모드 - 서버 연결 실패]\n인증번호: ${code}\n\n클립보드에 복사되었습니다.`);
                }
            } else {
                // SMS 실패 시 이메일 폴백 옵션 바로 표시
                setShowEmailFallback(true);
            }
        }

        setLoading(false);
    };

    // Email API 응답 타입
    interface EmailApiResponse {
        success: boolean;
        message: string;
        demoCode?: string;
        isDemoMode?: boolean;
    }

    // Send email verification code
    const sendEmailCode = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSentCode('');
        setIsDemoMode(false);

        const response = await api.post<EmailApiResponse>('/auth/email/send-code', {
            email: email.toLowerCase().trim()
        });

        if (response.data?.success) {
            setTimer(180);
            setStep('code');
            setVerificationMethod('email');
            setShowEmailFallback(false);

            if (response.data.isDemoMode && response.data.demoCode) {
                setSentCode(response.data.demoCode);
                setIsDemoMode(true);
                console.log(`[테스트 모드] 이메일 인증번호: ${response.data.demoCode}`);
                if (toast) {
                    toast.showDemoCode(response.data.demoCode);
                } else {
                    navigator.clipboard?.writeText(response.data.demoCode);
                    alert(`[테스트 모드] 이메일 인증번호: ${response.data.demoCode}\n\n클립보드에 복사되었습니다.`);
                }
            }
        } else {
            // 개발 모드에서 서버 연결 실패 시 데모 모드
            if (import.meta.env.DEV && response.status === 0) {
                await new Promise(resolve => setTimeout(resolve, 800));
                const code = generateCode();
                setSentCode(code);
                setIsDemoMode(true);
                setTimer(180);
                setStep('code');
                setVerificationMethod('email');

                console.log(`[개발 모드] 이메일 인증번호: ${code}`);
                if (toast) {
                    toast.showDemoCode(code);
                } else {
                    navigator.clipboard?.writeText(code);
                    alert(`[개발 모드]\n이메일 인증번호: ${code}\n\n클립보드에 복사되었습니다.`);
                }
            } else {
                setError(response.error || response.data?.message || '이메일 발송에 실패했습니다.');
            }
        }

        setLoading(false);
    };

    // Handle code input
    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value.slice(-1);
        setVerificationCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Verify API 응답 타입
    interface VerifyApiResponse {
        success: boolean;
        message: string;
    }

    // Verify code
    const verifyCode = async () => {
        const enteredCode = verificationCode.join('');

        if (enteredCode.length !== 6) {
            setError('6자리 인증번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        // 데모 모드 로컬 검증
        if (isDemoMode && sentCode) {
            await new Promise(resolve => setTimeout(resolve, 500));

            if (enteredCode === sentCode) {
                setStep('verified');
                onVerified(true);
                console.log('[데모 모드] 인증 성공');
            } else {
                setError('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
            }
            setLoading(false);
            return;
        }

        // API 검증
        const endpoint = verificationMethod === 'phone'
            ? '/auth/phone/verify-code'
            : '/auth/email/verify-code';

        const body = verificationMethod === 'phone'
            ? { phone: phone.replace(/\D/g, ''), code: enteredCode }
            : { email: email.toLowerCase().trim(), code: enteredCode };

        const response = await api.post<VerifyApiResponse>(endpoint, body);

        if (response.data?.success) {
            setStep('verified');
            onVerified(true);
            console.log(`[서버] ${verificationMethod === 'phone' ? '휴대폰' : '이메일'} 인증 성공`);
        } else {
            // 개발 모드에서 서버 연결 실패 시 로컬 검증
            if (import.meta.env.DEV && response.status === 0 && sentCode && enteredCode === sentCode) {
                setStep('verified');
                onVerified(true);
                console.log('[개발 모드 폴백] 로컬 인증 성공');
            } else {
                setError(response.error || response.data?.message || '인증번호가 일치하지 않습니다.');
            }
        }

        setLoading(false);
    };

    // Format timer display
    const formatTimer = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    // Reset verification
    const resetVerification = () => {
        setStep('input');
        setVerificationCode(['', '', '', '', '', '']);
        setSentCode('');
        setIsDemoMode(false);
        setTimer(0);
        setError('');
        setShowEmailFallback(false);
        setVerificationMethod('phone');
        onVerified(false);
    };

    // Switch to email verification
    const switchToEmail = () => {
        setVerificationMethod('email');
        setShowEmailFallback(false);
        setError('');
    };

    // Switch back to SMS
    const switchToSms = () => {
        setVerificationMethod('phone');
        setError('');
    };

    if (isVerified || step === 'verified') {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted">본인인증</label>
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="text-green-400 font-medium">본인인증 완료</div>
                        <div className="text-sm text-text-muted">
                            {verificationMethod === 'phone' ? phone : email}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={resetVerification}
                        className="text-xs text-text-muted hover:text-white transition-colors"
                    >
                        재인증
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-text-muted flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                본인인증 <span className="text-red-400">*</span>
            </label>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {step === 'input' && (
                <div className="space-y-3">
                    {/* SMS 인증 폼 */}
                    {verificationMethod === 'phone' && (
                        <>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors"
                                        placeholder="010-0000-0000"
                                        maxLength={13}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={sendSmsCode}
                                    disabled={loading || phone.replace(/\D/g, '').length < 10}
                                    className="px-4 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        'SMS 인증'
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-text-muted">
                                입력하신 휴대폰 번호로 인증번호가 발송됩니다.
                            </p>

                            {/* 이메일 폴백 옵션 */}
                            {showEmailFallback && (
                                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                        <Mail size={16} />
                                        <span className="font-medium">SMS 발송에 문제가 있나요?</span>
                                    </div>
                                    <p className="text-sm text-text-muted mb-3">
                                        이메일로 인증번호를 받으실 수 있습니다.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={switchToEmail}
                                        className="w-full py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                                    >
                                        이메일 인증으로 변경
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* 이메일 인증 폼 */}
                    {verificationMethod === 'email' && (
                        <>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors"
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={sendEmailCode}
                                    disabled={loading || !email.includes('@')}
                                    className="px-4 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        '이메일 인증'
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-text-muted">
                                입력하신 이메일 주소로 인증번호가 발송됩니다.
                            </p>

                            {/* SMS 인증으로 돌아가기 */}
                            <button
                                type="button"
                                onClick={switchToSms}
                                className="flex items-center gap-1 text-sm text-text-muted hover:text-white transition-colors"
                            >
                                <Phone size={14} />
                                SMS 인증으로 변경
                            </button>
                        </>
                    )}
                </div>
            )}

            {step === 'code' && (
                <div className="space-y-4">
                    <div className="bg-accent/50 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-text-muted flex items-center gap-2">
                                {verificationMethod === 'phone' ? (
                                    <><Phone size={14} /> SMS 인증번호</>
                                ) : (
                                    <><Mail size={14} /> 이메일 인증번호</>
                                )}
                            </span>
                            <span className={`text-sm font-mono ${timer < 60 ? 'text-red-400' : 'text-primary'}`}>
                                {formatTimer(timer)}
                            </span>
                        </div>

                        {/* 6-digit code input */}
                        <div className="flex gap-2 justify-center mb-4">
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-background border border-white/20 rounded-lg text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    maxLength={1}
                                />
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={verifyCode}
                                disabled={loading || verificationCode.join('').length !== 6}
                                className="flex-1 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        인증확인
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={verificationMethod === 'phone' ? sendSmsCode : sendEmailCode}
                                disabled={loading || timer > 150}
                                className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                재전송
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-text-muted">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>
                            {verificationMethod === 'phone'
                                ? '인증번호가 오지 않으면 입력하신 번호가 맞는지 확인해주세요.'
                                : '인증번호가 오지 않으면 스팸함을 확인해보세요.'
                            }
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={resetVerification}
                        className="w-full text-center text-sm text-text-muted hover:text-white transition-colors py-2"
                    >
                        ← {verificationMethod === 'phone' ? '휴대폰 번호' : '이메일'} 변경
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhoneVerification;
