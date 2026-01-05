import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Shield, FileCheck, ChevronRight, ChevronDown, Building2 } from 'lucide-react';
import { signup } from '../utils/auth';
import PhoneVerification from '../components/auth/PhoneVerification';
import BusinessVerification from '../components/auth/BusinessVerification';
import { useApp } from '../context/AppContext';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isBusinessVerified, setIsBusinessVerified] = useState(false);
    const [businessCertificate, setBusinessCertificate] = useState<File | null>(null);

    // Adult verification state
    const [isAdultVerified, setIsAdultVerified] = useState(false);

    // Agreement states
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
        marketing: false,
        adult: false
    });
    const [expandedTerms, setExpandedTerms] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        type: 'worker' as 'worker' | 'advertiser',
        businessNumber: '',
        businessName: '',
        nickname: ''
    });

    // Password strength calculation
    const getPasswordStrength = (password: string): { level: number; text: string; color: string } => {
        if (!password) return { level: 0, text: '', color: '' };
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { level: 1, text: '약함', color: 'bg-red-500' };
        if (strength <= 3) return { level: 2, text: '보통', color: 'bg-yellow-500' };
        if (strength <= 4) return { level: 3, text: '강함', color: 'bg-green-500' };
        return { level: 4, text: '매우 강함', color: 'bg-primary' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAllAgreedChange = (checked: boolean) => {
        setAllAgreed(checked);
        setAgreements({
            terms: checked,
            privacy: checked,
            marketing: checked,
            adult: checked
        });
        if (checked) setIsAdultVerified(true);
    };

    const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
        const newAgreements = { ...agreements, [key]: checked };
        setAgreements(newAgreements);
        setAllAgreed(newAgreements.terms && newAgreements.privacy && newAgreements.marketing && newAgreements.adult);
        if (key === 'adult') setIsAdultVerified(checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        if (!formData.email || !formData.password || !formData.name || !formData.nickname) {
            setError('필수 항목을 모두 입력해주세요.');
            setLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setError('올바른 이메일 형식을 입력해주세요.');
            setLoading(false);
            return;
        }

        if (formData.type === 'advertiser') {
            if (!formData.businessNumber || !formData.businessName) {
                setError('사업자 정보를 모두 입력해주세요.');
                setLoading(false);
                return;
            }
            if (!isBusinessVerified) {
                setError('사업자등록번호 확인을 완료해주세요.');
                setLoading(false);
                return;
            }
            if (!businessCertificate) {
                setError('사업자등록증 사본을 업로드해주세요.');
                setLoading(false);
                return;
            }
        }

        if (formData.password.length < 6) {
            setError('비밀번호는 6자 이상이어야 합니다.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            setLoading(false);
            return;
        }

        if (!agreements.terms || !agreements.privacy || !agreements.adult) {
            setError('필수 약관에 동의해주세요.');
            setLoading(false);
            return;
        }

        if (!isAdultVerified) {
            setError('만 19세 이상 성인인증이 필요합니다.');
            setLoading(false);
            return;
        }

        if (!isPhoneVerified) {
            setError('휴대폰 본인인증을 완료해주세요.');
            setLoading(false);
            return;
        }

        // Attempt signup
        const result = signup({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            type: formData.type,
            businessNumber: formData.businessNumber,
            businessName: formData.businessName,
            nickname: formData.nickname
        });

        if (result.success && result.user) {
            // Sync with AppContext
            dispatch({
                type: 'SET_USER',
                payload: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    type: result.user.type === 'worker' ? 'user' : 'advertiser',
                    phone: result.user.phone
                }
            });
            setSuccess(result.message + ' 잠시 후 이동합니다...');
            setTimeout(() => {
                if (result.user?.type === 'advertiser') {
                    navigate('/advertiser/dashboard');
                } else {
                    navigate('/');
                }
            }, 1500);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full space-y-8">
                {/* 19+ Age Restriction Notice */}
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-black text-lg">19</span>
                        </div>
                        <div>
                            <p className="text-red-400 font-bold text-sm">청소년 이용 불가 서비스</p>
                            <p className="text-text-muted text-xs mt-0.5">본 서비스는 만 19세 이상의 성인만 이용 가능합니다.</p>
                            <p className="text-text-muted text-xs">회원가입 시 성인인증이 필수입니다.</p>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text-main mb-2">회원가입</h1>
                    <p className="text-text-muted text-sm">LunaAlba의 회원이 되어주세요</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-card rounded-xl p-8 border border-border shadow-sm">
                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 animate-shake">
                            <AlertCircle size={18} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                            <CheckCircle size={18} />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    {/* User Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-3">회원 유형 선택</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${formData.type === 'worker'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/30'
                                    }`}
                                onClick={() => setFormData({ ...formData, type: 'worker' })}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.type === 'worker' ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${formData.type === 'worker' ? 'text-text-main' : 'text-text-muted'}`}>일반회원</div>
                                        <div className="text-xs text-text-muted">구직 및 커뮤니티 이용</div>
                                    </div>
                                </div>
                                {formData.type === 'worker' && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <CheckCircle size={14} className="text-white" />
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${formData.type === 'advertiser'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/30'
                                    }`}
                                onClick={() => setFormData({ ...formData, type: 'advertiser' })}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.type === 'advertiser' ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${formData.type === 'advertiser' ? 'text-text-main' : 'text-text-muted'}`}>광고주</div>
                                        <div className="text-xs text-text-muted">광고 등록 및 관리</div>
                                    </div>
                                </div>
                                {formData.type === 'advertiser' && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <CheckCircle size={14} className="text-white" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                            <User size={16} className="text-primary" /> 기본 정보
                        </h3>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">이메일 <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-text-main focus:border-primary outline-none transition-colors"
                                    placeholder="example@lunaalba.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">비밀번호 <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-surface border border-border rounded-lg py-3 pl-10 pr-12 text-text-main focus:border-primary outline-none transition-colors"
                                    placeholder="6자 이상 입력"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.level ? passwordStrength.color : 'bg-border'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs text-text-muted">비밀번호 강도: <span className={passwordStrength.level >= 3 ? 'text-green-500' : passwordStrength.level >= 2 ? 'text-yellow-500' : 'text-red-500'}>{passwordStrength.text}</span></div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">비밀번호 확인 <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-surface border rounded-lg py-3 pl-10 pr-12 text-text-main outline-none transition-colors ${formData.confirmPassword
                                        ? formData.password === formData.confirmPassword
                                            ? 'border-green-500/50 focus:border-green-500'
                                            : 'border-red-500/50 focus:border-red-500'
                                        : 'border-border focus:border-primary'
                                        }`}
                                    placeholder="비밀번호 다시 입력"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formData.confirmPassword && (
                                <div className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                    {formData.password === formData.confirmPassword ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                                </div>
                            )}
                        </div>

                        {/* Name & Nickname */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">이름 <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-text-main focus:border-primary outline-none transition-colors"
                                        placeholder="이름"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">닉네임 <span className="text-red-400">*</span></label>
                                <input
                                    name="nickname"
                                    type="text"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    className="w-full bg-surface border border-border rounded-lg py-3 px-4 text-text-main focus:border-primary outline-none transition-colors"
                                    placeholder="닉네임"
                                />
                            </div>
                        </div>

                        {/* Phone Verification */}
                        <PhoneVerification
                            phone={formData.phone}
                            onPhoneChange={(phone) => setFormData({ ...formData, phone })}
                            onVerified={setIsPhoneVerified}
                            isVerified={isPhoneVerified}
                        />
                    </div>

                    {/* Business Fields - Conditional Render */}
                    {formData.type === 'advertiser' && (
                        <>
                            <div className="h-px bg-border" />
                            <BusinessVerification
                                businessNumber={formData.businessNumber}
                                businessName={formData.businessName}
                                onBusinessNumberChange={(value) => setFormData({ ...formData, businessNumber: value })}
                                onBusinessNameChange={(value) => setFormData({ ...formData, businessName: value })}
                                onVerified={setIsBusinessVerified}
                                onCertificateChange={setBusinessCertificate}
                                isVerified={isBusinessVerified}
                            />
                        </>
                    )}

                    <div className="h-px bg-border" />

                    {/* Terms & Agreements Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                            <Shield size={16} className="text-primary" /> 약관 동의
                        </h3>

                        {/* All Agree */}
                        <label className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors border border-primary/20">
                            <input
                                type="checkbox"
                                checked={allAgreed}
                                onChange={(e) => handleAllAgreedChange(e.target.checked)}
                                className="w-5 h-5 rounded border-border bg-card accent-primary"
                            />
                            <span className="text-text-main font-bold">전체 동의</span>
                        </label>

                        {/* Individual Agreements */}
                        <div className="space-y-2 pl-2">
                            {/* Terms of Service */}
                            <div className="rounded-lg border border-border overflow-hidden">
                                <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={agreements.terms}
                                        onChange={(e) => handleAgreementChange('terms', e.target.checked)}
                                        className="w-4 h-4 rounded border-border bg-card accent-primary"
                                    />
                                    <span className="text-text-muted flex-1">이용약관 동의 <span className="text-red-400">*</span></span>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedTerms(expandedTerms === 'terms' ? null : 'terms')}
                                        className="text-text-muted hover:text-text-main transition-colors"
                                    >
                                        {expandedTerms === 'terms' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>
                                </label>
                                {expandedTerms === 'terms' && (
                                    <div className="px-3 pb-3">
                                        <div className="bg-background rounded p-3 text-xs text-text-muted max-h-32 overflow-y-auto">
                                            제1조 (목적) 이 약관은 LunaAlba가 제공하는 서비스의 이용조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br /><br />
                                            제2조 (약관의 효력과 변경) 1) 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 이용자에게 공시하고, 이에 동의한 이용자가 서비스에 가입함으로써 효력이 발생합니다.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Privacy Policy */}
                            <div className="rounded-lg border border-border overflow-hidden">
                                <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={agreements.privacy}
                                        onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
                                        className="w-4 h-4 rounded border-border bg-card accent-primary"
                                    />
                                    <span className="text-text-muted flex-1">개인정보처리방침 동의 <span className="text-red-400">*</span></span>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedTerms(expandedTerms === 'privacy' ? null : 'privacy')}
                                        className="text-text-muted hover:text-text-main transition-colors"
                                    >
                                        {expandedTerms === 'privacy' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>
                                </label>
                                {expandedTerms === 'privacy' && (
                                    <div className="px-3 pb-3">
                                        <div className="bg-background rounded p-3 text-xs text-text-muted max-h-32 overflow-y-auto">
                                            1. 수집하는 개인정보 항목: 이메일, 이름, 닉네임, 휴대폰번호<br /><br />
                                            2. 개인정보의 수집 및 이용목적: 회원관리, 서비스 제공<br /><br />
                                            3. 개인정보의 보유 및 이용기간: 회원탈퇴 시까지
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Marketing */}
                            <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface transition-colors rounded-lg border border-border">
                                <input
                                    type="checkbox"
                                    checked={agreements.marketing}
                                    onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
                                    className="w-4 h-4 rounded border-border bg-card accent-primary"
                                />
                                <span className="text-text-muted flex-1">마케팅 정보 수신 동의 <span className="text-text-light">(선택)</span></span>
                            </label>

                            {/* Adult Verification - Required */}
                            <div className="rounded-lg border-2 border-red-500/30 bg-red-500/5 overflow-hidden">
                                <label className="flex items-center gap-3 p-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreements.adult}
                                        onChange={(e) => handleAgreementChange('adult', e.target.checked)}
                                        className="w-5 h-5 rounded border-red-500 bg-card accent-red-500"
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-black text-xs">19</span>
                                        </div>
                                        <span className="text-text-main font-medium">만 19세 이상 성인입니다 <span className="text-red-400">*</span></span>
                                    </div>
                                </label>
                                <div className="px-3 pb-3 text-xs text-text-muted bg-red-500/5">
                                    본 서비스는 청소년보호법에 의거, 만 19세 이상의 성인만 이용할 수 있습니다.
                                    허위 사실 입력 시 법적 책임이 따를 수 있습니다.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                처리 중...
                            </>
                        ) : (
                            <>
                                <FileCheck size={20} />
                                회원가입
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center text-sm text-text-muted">
                        이미 계정이 있으신가요?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">로그인</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
