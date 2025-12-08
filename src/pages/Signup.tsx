import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, ArrowLeft } from 'lucide-react';
import ProgressStepper from '../components/signup/ProgressStepper';
import TermsModal from '../components/signup/TermsModal';
import PasswordStrengthIndicator from '../components/signup/PasswordStrengthIndicator';
import VerificationButton from '../components/signup/VerificationButton';
import PRIVACY_POLICY from '../data/privacy-policy';
import TERMS_OF_SERVICE from '../data/terms-of-service';

interface SignupFormData {
    // Step 1
    agreePrivacy: boolean;
    agreeTerms: boolean;
    agreeAge: boolean;
    agreeMarketing: boolean;

    // Step 2
    isVerified: boolean;
    verifiedName: string;
    verifiedPhone: string;
    verifiedBirthDate: string;

    // Step 3
    role: 'seeker' | 'employer';
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
    emailCode: string;

    // Step 4 - Seeker
    name: string;
    birthDate: string;
    gender: string;

    // Step 4 - Employer
    companyName: string;
    businessNumber: string;
    representative: string;
    businessType: string;
}

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'loading' | 'verified' | 'failed'>('pending');
    const [emailVerified, setEmailVerified] = useState(false);

    const [formData, setFormData] = useState<SignupFormData>({
        agreePrivacy: false,
        agreeTerms: false,
        agreeAge: false,
        agreeMarketing: false,
        isVerified: false,
        verifiedName: '',
        verifiedPhone: '',
        verifiedBirthDate: '',
        role: 'seeker',
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
        emailCode: '',
        name: '',
        birthDate: '',
        gender: '',
        companyName: '',
        businessNumber: '',
        representative: '',
        businessType: '',
    });

    const steps = ['약관동의', '본인인증', '계정정보', '추가정보', '가입완료'];

    const handleInputChange = (field: keyof SignupFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAllAgree = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            agreePrivacy: checked,
            agreeTerms: checked,
            agreeAge: checked,
            agreeMarketing: checked,
        }));
    };

    const handleVerification = () => {
        setVerificationStatus('loading');
        // Mock PASS verification
        setTimeout(() => {
            setVerificationStatus('verified');
            setFormData(prev => ({
                ...prev,
                isVerified: true,
                verifiedName: '홍길동',
                verifiedPhone: '010-1234-5678',
                verifiedBirthDate: '1990-01-01',
            }));
        }, 2000);
    };

    const handleEmailVerification = () => {
        // Mock email verification
        setTimeout(() => {
            setEmailVerified(true);
            alert('인증번호가 발송되었습니다.');
        }, 1000);
    };

    const canProceedStep1 = formData.agreePrivacy && formData.agreeTerms && formData.agreeAge;
    const canProceedStep2 = formData.isVerified;
    const canProceedStep3 = formData.username && formData.password && formData.passwordConfirm &&
        formData.password === formData.passwordConfirm && formData.email && emailVerified;
    const canProceedStep4 = formData.role === 'seeker'
        ? formData.name && formData.birthDate
        : formData.companyName && formData.businessNumber && formData.representative;

    const handleNext = () => {
        if (step === 1 && canProceedStep1) setStep(2);
        else if (step === 2 && canProceedStep2) setStep(3);
        else if (step === 3 && canProceedStep3) setStep(4);
        else if (step === 4 && canProceedStep4) setStep(5);
    };

    const handleSubmit = () => {
        console.log('회원가입 데이터:', formData);
        alert('회원가입이 완료되었습니다!');
        navigate('/');
    };

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-2xl bg-accent rounded-xl border border-white/10 p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
                    <p className="text-text-muted text-sm">QueenAlba에 오신 것을 환영합니다</p>
                </div>

                {/* Progress */}
                {step < 5 && <ProgressStepper currentStep={step} totalSteps={5} steps={steps} />}

                {/* Step 1: Terms Agreement */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-white">약관 동의</h2>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 p-4 bg-background rounded-lg border border-white/10 cursor-pointer hover:border-primary/50">
                                <input
                                    type="checkbox"
                                    checked={formData.agreePrivacy && formData.agreeTerms && formData.agreeAge}
                                    onChange={(e) => handleAllAgree(e.target.checked)}
                                    className="w-5 h-5 accent-primary"
                                />
                                <span className="flex-1 font-bold text-white">전체 동의</span>
                            </label>

                            <div className="pl-4 space-y-3">
                                <label className="flex items-center justify-between gap-3 p-3 bg-background/50 rounded-lg cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreePrivacy}
                                            onChange={(e) => handleInputChange('agreePrivacy', e.target.checked)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className="text-white">(필수) 개인정보 처리방침</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPrivacyModal(true)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        보기
                                    </button>
                                </label>

                                <label className="flex items-center justify-between gap-3 p-3 bg-background/50 rounded-lg cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreeTerms}
                                            onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className="text-white">(필수) 이용약관</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowTermsModal(true)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        보기
                                    </button>
                                </label>

                                <label className="flex items-center gap-3 p-3 bg-background/50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreeAge}
                                        onChange={(e) => handleInputChange('agreeAge', e.target.checked)}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-white">(필수) 만 19세 이상입니다</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 bg-background/50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreeMarketing}
                                        onChange={(e) => handleInputChange('agreeMarketing', e.target.checked)}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-text-muted">(선택) 마케팅 정보 수신 동의</span>
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!canProceedStep1}
                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                )}

                {/* Step 2: Identity Verification */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 text-text-muted hover:text-white mb-4"
                            >
                                <ArrowLeft size={16} />
                                이전
                            </button>
                            <h2 className="text-xl font-bold text-white">본인인증</h2>
                            <p className="text-sm text-text-muted mt-2">안전한 서비스 이용을 위해 본인인증이 필요합니다</p>
                        </div>

                        <div className="bg-background rounded-lg p-6 border border-white/10">
                            <VerificationButton
                                onVerify={handleVerification}
                                status={verificationStatus}
                                verifiedName={formData.verifiedName}
                            />

                            {verificationStatus === 'verified' && (
                                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-sm text-green-500">
                                        ✓ 인증 완료: {formData.verifiedName} ({formData.verifiedPhone})
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!canProceedStep2}
                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                )}

                {/* Step 3: Account Information */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <button
                                onClick={() => setStep(2)}
                                className="flex items-center gap-2 text-text-muted hover:text-white mb-4"
                            >
                                <ArrowLeft size={16} />
                                이전
                            </button>
                            <h2 className="text-xl font-bold text-white">계정 정보</h2>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="text-sm text-text-muted block mb-2">회원 유형</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('role', 'seeker')}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'seeker'
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-background border-white/10 text-text-muted hover:border-white/30'
                                        }`}
                                >
                                    <User size={32} />
                                    <span className="font-bold">일반회원</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('role', 'employer')}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'employer'
                                            ? 'bg-secondary/10 border-secondary text-secondary'
                                            : 'bg-background border-white/10 text-text-muted hover:border-white/30'
                                        }`}
                                >
                                    <Building2 size={32} />
                                    <span className="font-bold">기업회원</span>
                                </button>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">아이디</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                        placeholder="아이디 입력"
                                    />
                                    <button type="button" className="bg-white/10 text-white px-4 rounded-lg text-sm hover:bg-white/20 whitespace-nowrap">
                                        중복확인
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">비밀번호</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                    placeholder="비밀번호 입력"
                                />
                                <PasswordStrengthIndicator password={formData.password} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={formData.passwordConfirm}
                                    onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                    placeholder="비밀번호 재입력"
                                />
                                {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                                    <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다</p>
                                )}
                                {formData.passwordConfirm && formData.password === formData.passwordConfirm && (
                                    <p className="text-xs text-green-500">✓ 비밀번호가 일치합니다</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-text-muted">이메일</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="flex-1 bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                        placeholder="example@email.com"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleEmailVerification}
                                        disabled={!formData.email || emailVerified}
                                        className="bg-white/10 text-white px-4 rounded-lg text-sm hover:bg-white/20 whitespace-nowrap disabled:opacity-50"
                                    >
                                        {emailVerified ? '인증완료' : '인증'}
                                    </button>
                                </div>
                                {emailVerified && (
                                    <input
                                        type="text"
                                        value={formData.emailCode}
                                        onChange={(e) => handleInputChange('emailCode', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                        placeholder="인증번호 입력"
                                    />
                                )}
                            </div>
                        </form>

                        <button
                            onClick={handleNext}
                            disabled={!canProceedStep3}
                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                )}

                {/* Step 4: Additional Information */}
                {step === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <button
                                onClick={() => setStep(3)}
                                className="flex items-center gap-2 text-text-muted hover:text-white mb-4"
                            >
                                <ArrowLeft size={16} />
                                이전
                            </button>
                            <h2 className="text-xl font-bold text-white">추가 정보</h2>
                        </div>

                        {formData.role === 'seeker' ? (
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">이름</label>
                                    <input
                                        type="text"
                                        value={formData.verifiedName}
                                        disabled
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white/50"
                                    />
                                    <p className="text-xs text-text-muted">본인인증 정보</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">생년월일</label>
                                    <input
                                        type="text"
                                        value={formData.verifiedBirthDate}
                                        disabled
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white/50"
                                    />
                                    <p className="text-xs text-text-muted">본인인증 정보</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">성별 (선택)</label>
                                    <div className="flex gap-2">
                                        {['남성', '여성', '선택안함'].map((gender) => (
                                            <button
                                                key={gender}
                                                type="button"
                                                onClick={() => handleInputChange('gender', gender)}
                                                className={`flex-1 py-2 rounded-lg border transition-all ${formData.gender === gender
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-white/10 text-text-muted hover:border-white/30'
                                                    }`}
                                            >
                                                {gender}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">업체명 *</label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                        placeholder="업체명 입력"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">사업자번호 *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.businessNumber}
                                            onChange={(e) => handleInputChange('businessNumber', e.target.value)}
                                            className="flex-1 bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                            placeholder="000-00-00000"
                                        />
                                        <button type="button" className="bg-white/10 text-white px-4 rounded-lg text-sm hover:bg-white/20 whitespace-nowrap">
                                            조회
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">대표자명 *</label>
                                    <input
                                        type="text"
                                        value={formData.representative}
                                        onChange={(e) => handleInputChange('representative', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                        placeholder="대표자 이름"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted">업종 (선택)</label>
                                    <select
                                        value={formData.businessType}
                                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="유흥주점">유흥주점</option>
                                        <option value="일반음식점">일반음식점</option>
                                        <option value="노래연습장">노래연습장</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>
                            </form>
                        )}

                        <button
                            onClick={handleNext}
                            disabled={!canProceedStep4}
                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                )}

                {/* Step 5: Confirmation */}
                {step === 5 && (
                    <div className="space-y-6 animate-fade-in text-center">
                        <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="text-primary text-4xl">✓</div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">가입 정보 확인</h2>
                            <p className="text-text-muted">입력하신 정보를 확인해주세요</p>
                        </div>

                        <div className="bg-background rounded-lg p-6 border border-white/10 text-left space-y-4">
                            <div className="pb-4 border-b border-white/10">
                                <p className="text-sm text-text-muted mb-1">회원 유형</p>
                                <p className="text-white font-bold">{formData.role === 'seeker' ? '일반회원' : '기업회원'}</p>
                            </div>

                            <div className="pb-4 border-b border-white/10">
                                <p className="text-sm text-text-muted mb-1">아이디</p>
                                <p className="text-white">{formData.username}</p>
                            </div>

                            <div className="pb-4 border-b border-white/10">
                                <p className="text-sm text-text-muted mb-1">이메일</p>
                                <p className="text-white">{formData.email}</p>
                            </div>

                            {formData.role === 'seeker' ? (
                                <div className="pb-4 border-b border-white/10">
                                    <p className="text-sm text-text-muted mb-1">이름</p>
                                    <p className="text-white">{formData.verifiedName}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="pb-4 border-b border-white/10">
                                        <p className="text-sm text-text-muted mb-1">업체명</p>
                                        <p className="text-white">{formData.companyName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted mb-1">사업자번호</p>
                                        <p className="text-white">{formData.businessNumber}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(4)}
                                className="flex-1 bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors"
                            >
                                가입완료
                            </button>
                        </div>
                    </div>
                )}

                {/* Modals */}
                <TermsModal
                    isOpen={showPrivacyModal}
                    onClose={() => setShowPrivacyModal(false)}
                    title="개인정보 처리방침"
                    content={PRIVACY_POLICY}
                />

                <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                    title="이용약관"
                    content={TERMS_OF_SERVICE}
                />

                {/* Footer */}
                {step < 5 && (
                    <div className="mt-8 text-center text-sm text-text-muted">
                        이미 계정이 있으신가요? <Link to="/login" className="text-white font-bold hover:underline ml-1">로그인</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
