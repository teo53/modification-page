import React, { useState, useEffect, useRef } from 'react';
import { Phone, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PhoneVerificationProps {
    phone: string;
    onPhoneChange: (phone: string) => void;
    onVerified: (verified: boolean) => void;
    isVerified: boolean;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
    phone,
    onPhoneChange,
    onVerified,
    isVerified
}) => {
    const [step, setStep] = useState<'input' | 'code' | 'verified'>('input');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [sentCode, setSentCode] = useState('');
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    // Send verification code
    const sendCode = async () => {
        if (phone.replace(/\D/g, '').length < 10) {
            setError('올바른 휴대폰 번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const code = generateCode();
        setSentCode(code);
        setTimer(180); // 3 minutes
        setStep('code');
        setLoading(false);

        // In demo mode, show the code in console
        console.log(`[DEMO] 인증번호: ${code}`);

        // For demo purposes, show an alert with the code
        alert(`[데모 모드] 인증번호: ${code}\n\n실제 서비스에서는 SMS로 전송됩니다.`);
    };

    // Handle code input
    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value.slice(-1);
        setVerificationCode(newCode);

        // Auto-focus next input
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

    // Verify code
    const verifyCode = async () => {
        const enteredCode = verificationCode.join('');

        if (enteredCode.length !== 6) {
            setError('6자리 인증번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        if (enteredCode === sentCode) {
            setStep('verified');
            onVerified(true);
        } else {
            setError('인증번호가 일치하지 않습니다.');
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
        setTimer(0);
        setError('');
        onVerified(false);
    };

    if (isVerified || step === 'verified') {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted">휴대폰 본인인증</label>
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="text-green-400 font-medium">본인인증 완료</div>
                        <div className="text-sm text-text-muted">{phone}</div>
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
                휴대폰 본인인증 <span className="text-red-400">*</span>
            </label>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {step === 'input' && (
                <div className="space-y-3">
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
                            onClick={sendCode}
                            disabled={loading || phone.replace(/\D/g, '').length < 10}
                            className="px-4 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                '인증요청'
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-text-muted">
                        입력하신 휴대폰 번호로 인증번호가 발송됩니다.
                    </p>
                </div>
            )}

            {step === 'code' && (
                <div className="space-y-4">
                    <div className="bg-accent/50 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-text-muted">인증번호 입력</span>
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
                                onClick={sendCode}
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
                            인증번호가 오지 않으면 입력하신 번호가 맞는지 확인해주세요.
                            스팸함도 확인해보시기 바랍니다.
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={resetVerification}
                        className="w-full text-center text-sm text-text-muted hover:text-white transition-colors py-2"
                    >
                        ← 휴대폰 번호 변경
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhoneVerification;
