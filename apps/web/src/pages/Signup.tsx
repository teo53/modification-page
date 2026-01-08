import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Shield, FileCheck, ChevronRight, ChevronDown, Building2, MapPin } from 'lucide-react';
import { signup } from '../utils/auth';
import PhoneVerification from '../components/auth/PhoneVerification';
import BusinessVerification from '../components/auth/BusinessVerification';

interface SignupProps {
    isModal?: boolean;
    onSignupSuccess?: () => void;
    onClose?: () => void;
}

const Signup: React.FC<SignupProps> = ({ isModal = false, onSignupSuccess, onClose }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isBusinessVerified, setIsBusinessVerified] = useState(false);
    const [businessCertificate, setBusinessCertificate] = useState<File | null>(null);

    // Field refs for focus management
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const nicknameRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);

    // Field-level error states
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Agreement states
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
        marketing: false
    });
    const [expandedTerms, setExpandedTerms] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        gender: '' as '' | 'male' | 'female',
        type: 'worker' as 'worker' | 'advertiser',
        businessNumber: '',
        businessName: '',
        nickname: '',
        address: '',
        addressDetail: ''
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
    const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAllAgreedChange = (checked: boolean) => {
        setAllAgreed(checked);
        setAgreements({
            terms: checked,
            privacy: checked,
            marketing: checked
        });
    };

    const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
        const newAgreements = { ...agreements, [key]: checked };
        setAgreements(newAgreements);
        setAllAgreed(newAgreements.terms && newAgreements.privacy && newAgreements.marketing);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFieldErrors({});
        setLoading(true);

        const errors: Record<string, string> = {};

        // Email validation
        if (!formData.email) {
            errors.email = '이메일을 입력해주세요.';
        } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
            errors.email = '올바른 이메일 형식을 입력해주세요. (예: example@email.com)';
        }

        // Password validation - 강화된 규칙
        if (!formData.password) {
            errors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 8) {
            errors.password = '비밀번호는 8자 이상이어야 합니다.';
        } else if (!/[A-Z]/.test(formData.password)) {
            errors.password = '비밀번호에 대문자를 1개 이상 포함해주세요.';
        } else if (!/[a-z]/.test(formData.password)) {
            errors.password = '비밀번호에 소문자를 1개 이상 포함해주세요.';
        } else if (!/[0-9]/.test(formData.password)) {
            errors.password = '비밀번호에 숫자를 1개 이상 포함해주세요.';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        // Name validation
        if (!formData.name) {
            errors.name = '이름을 입력해주세요.';
        } else if (formData.name.length < 2) {
            errors.name = '이름은 2자 이상이어야 합니다.';
        }

        // Nickname validation
        if (!formData.nickname) {
            errors.nickname = '닉네임을 입력해주세요.';
        } else if (formData.nickname.length < 2) {
            errors.nickname = '닉네임은 2자 이상이어야 합니다.';
        }

        // Address validation (optional but recommended)
        // No strict validation - just check format if provided

        // Phone verification
        if (!isPhoneVerified) {
            errors.phone = '휴대폰 본인인증을 완료해주세요.';
        }

        // Gender validation
        if (!formData.gender) {
            errors.gender = '성별을 선택해주세요.';
        }

        // Business validation for advertisers
        if (formData.type === 'advertiser') {
            if (!formData.businessNumber) {
                errors.businessNumber = '사업자등록번호를 입력해주세요.';
            }
            if (!formData.businessName) {
                errors.businessName = '상호명을 입력해주세요.';
            }
            if (!isBusinessVerified) {
                errors.businessVerified = '사업자등록번호 확인을 완료해주세요.';
            }
            if (!businessCertificate) {
                errors.businessCertificate = '사업자등록증 사본을 업로드해주세요.';
            }
        }

        // Terms validation
        if (!agreements.terms || !agreements.privacy) {
            errors.terms = '필수 약관에 동의해주세요.';
        }

        // If there are errors, set them and focus on first error field
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setLoading(false);

            // Focus on first error field
            if (errors.email) {
                emailRef.current?.focus();
                emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (errors.password) {
                passwordRef.current?.focus();
                passwordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (errors.confirmPassword) {
                confirmPasswordRef.current?.focus();
                confirmPasswordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (errors.name) {
                nameRef.current?.focus();
                nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (errors.nickname) {
                nicknameRef.current?.focus();
                nicknameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Attempt signup
        const result = signup({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            phoneVerified: isPhoneVerified,
            gender: formData.gender as 'male' | 'female',
            type: formData.type,
            businessNumber: formData.businessNumber,
            businessName: formData.businessName,
            nickname: formData.nickname
        });

        if (result.success) {
            setSuccess(result.message + ' 잠시 후 이동합니다...');
            setTimeout(() => {
                // 모달 모드일 때는 콜백 호출
                if (isModal && onSignupSuccess) {
                    onSignupSuccess();
                } else {
                    // 일반 페이지 모드
                    if (result.user?.type === 'advertiser') {
                        navigate('/advertiser/dashboard');
                    } else {
                        navigate('/');
                    }
                }
            }, 1500);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className={isModal ? "" : "min-h-screen flex items-center justify-center py-12 px-4"}>
            <div className={isModal ? "space-y-6" : "max-w-lg w-full space-y-8"}>
                {/* Header - 모달 모드에서는 숨김 (모달 자체 헤더 사용) */}
                {!isModal && (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
                        <p className="text-text-muted">달빛알바의 회원이 되어주세요</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-accent rounded-xl p-8 border border-white/5">
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
                        <label className="block text-sm font-medium text-white mb-3">회원 유형 선택</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${formData.type === 'worker'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}
                                onClick={() => setFormData({ ...formData, type: 'worker' })}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.type === 'worker' ? 'bg-primary text-black' : 'bg-white/10 text-text-muted'}`}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${formData.type === 'worker' ? 'text-white' : 'text-text-muted'}`}>일반회원</div>
                                        <div className="text-xs text-text-muted">구직 및 커뮤니티 이용</div>
                                    </div>
                                </div>
                                {formData.type === 'worker' && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <CheckCircle size={14} className="text-black" />
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${formData.type === 'advertiser'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}
                                onClick={() => setFormData({ ...formData, type: 'advertiser' })}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.type === 'advertiser' ? 'bg-primary text-black' : 'bg-white/10 text-text-muted'}`}>
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${formData.type === 'advertiser' ? 'text-white' : 'text-text-muted'}`}>광고주</div>
                                        <div className="text-xs text-text-muted">광고 등록 및 관리</div>
                                    </div>
                                </div>
                                {formData.type === 'advertiser' && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <CheckCircle size={14} className="text-black" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <User size={16} className="text-primary" /> 기본 정보
                        </h3>

                        {/* Email */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-text-muted mb-1.5">이메일 <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    ref={emailRef}
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-background border rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-colors ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                                    placeholder="example@dalbitalba.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <div className="absolute left-0 -bottom-6 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg z-10 animate-pulse">
                                    ⚠ {fieldErrors.email}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative mt-6">
                            <label className="block text-sm font-medium text-text-muted mb-1.5">비밀번호 <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    ref={passwordRef}
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-background border rounded-lg py-3 pl-10 pr-12 text-white outline-none transition-colors ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                                    placeholder="6자 이상 입력"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-1 animate-pulse">
                                    ⚠ {fieldErrors.password}
                                </div>
                            )}
                            {/* Password Strength Indicator */}
                            {formData.password && !fieldErrors.password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.level ? passwordStrength.color : 'bg-white/10'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs text-text-muted">비밀번호 강도: <span className={passwordStrength.level >= 3 ? 'text-green-400' : passwordStrength.level >= 2 ? 'text-yellow-400' : 'text-red-400'}>{passwordStrength.text}</span></div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-text-muted mb-1.5">비밀번호 확인 <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    ref={confirmPasswordRef}
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-background border rounded-lg py-3 pl-10 pr-12 text-white outline-none transition-colors ${fieldErrors.confirmPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : !formData.confirmPassword
                                            ? 'border-white/10 focus:border-primary'
                                            : isPasswordMatch
                                                ? 'border-green-500/50 focus:border-green-500'
                                                : 'border-red-500/50 focus:border-red-500'
                                        }`}
                                    placeholder="비밀번호 다시 입력"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword ? (
                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-1 animate-pulse">
                                    ⚠ {fieldErrors.confirmPassword}
                                </div>
                            ) : formData.confirmPassword && (
                                <div className={`text-xs mt-1 ${isPasswordMatch ? 'text-green-400' : 'text-red-400'}`}>
                                    {isPasswordMatch ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
                                </div>
                            )}
                        </div>

                        {/* Name & Nickname */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <label className="block text-sm font-medium text-text-muted mb-1.5">이름 <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        ref={nameRef}
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full bg-background border rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-colors ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                                        placeholder="이름"
                                    />
                                </div>
                                {fieldErrors.name && (
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-1 animate-pulse">
                                        ⚠ {fieldErrors.name}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-text-muted mb-1.5">닉네임 <span className="text-red-400">*</span></label>
                                <input
                                    ref={nicknameRef}
                                    name="nickname"
                                    type="text"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    className={`w-full bg-background border rounded-lg py-3 px-4 text-white outline-none transition-colors ${fieldErrors.nickname ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                                    placeholder="닉네임"
                                />
                                {fieldErrors.nickname && (
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-1 animate-pulse">
                                        ⚠ {fieldErrors.nickname}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gender Selection (Required) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-muted mb-1.5">
                                성별 선택 <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold ${formData.gender === 'female'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-white/10 text-text-muted hover:border-white/20 hover:bg-white/5'
                                        }`}
                                >
                                    여성
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold ${formData.gender === 'male'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-white/10 text-text-muted hover:border-white/20 hover:bg-white/5'
                                        }`}
                                >
                                    남성
                                </button>
                            </div>
                            {fieldErrors.gender && (
                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                                    ⚠ {fieldErrors.gender}
                                </div>
                            )}
                        </div>

                        {/* Address (Optional but Recommended) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-muted mb-1.5">
                                <MapPin size={14} className="inline mr-1" />
                                주소 <span className="text-text-muted/50">(선택)</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    ref={addressRef}
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="주소 (시/도, 구/군)"
                                />
                            </div>
                            <input
                                name="addressDetail"
                                type="text"
                                value={formData.addressDetail}
                                onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-colors"
                                placeholder="상세주소 (선택)"
                            />
                            <p className="text-xs text-text-muted">※ 주소 정보는 맞춤 구인정보 제공에 활용됩니다.</p>
                        </div>

                        {/* Phone Verification */}
                        <PhoneVerification
                            phone={formData.phone}
                            onPhoneChange={(phone) => setFormData({ ...formData, phone })}
                            onVerified={setIsPhoneVerified}
                            isVerified={isPhoneVerified}
                        />
                        {fieldErrors.phone && (
                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse -mt-2">
                                ⚠ {fieldErrors.phone}
                            </div>
                        )}
                    </div>

                    {/* Business Fields - Conditional Render */}
                    {formData.type === 'advertiser' && (
                        <>
                            <div className="h-px bg-white/10" />
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

                    <div className="h-px bg-white/10" />

                    {/* Terms & Agreements Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Shield size={16} className="text-primary" /> 약관 동의
                        </h3>

                        {/* All Agree */}
                        <label className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors border border-primary/20">
                            <input
                                type="checkbox"
                                checked={allAgreed}
                                onChange={(e) => handleAllAgreedChange(e.target.checked)}
                                className="w-5 h-5 rounded border-white/20 bg-black/40 accent-primary"
                            />
                            <span className="text-white font-bold">전체 동의</span>
                        </label>

                        {/* Individual Agreements */}
                        <div className="space-y-2 pl-2">
                            {/* Terms of Service */}
                            <div className="rounded-lg border border-white/5 overflow-hidden">
                                <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={agreements.terms}
                                        onChange={(e) => handleAgreementChange('terms', e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary"
                                    />
                                    <span className="text-text-muted flex-1">이용약관 동의 <span className="text-red-400">*</span></span>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedTerms(expandedTerms === 'terms' ? null : 'terms')}
                                        className="text-text-muted hover:text-white transition-colors"
                                    >
                                        {expandedTerms === 'terms' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>
                                </label>
                                {expandedTerms === 'terms' && (
                                    <div className="px-3 pb-3">
                                        <div className="bg-background rounded p-3 text-xs text-text-muted max-h-32 overflow-y-auto">
                                            제1조 (목적) 이 약관은 달빛알바가 제공하는 서비스의 이용조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br /><br />
                                            제2조 (약관의 효력과 변경) 1) 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 이용자에게 공시하고, 이에 동의한 이용자가 서비스에 가입함으로써 효력이 발생합니다.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Privacy Policy */}
                            <div className="rounded-lg border border-white/5 overflow-hidden">
                                <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={agreements.privacy}
                                        onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary"
                                    />
                                    <span className="text-text-muted flex-1">개인정보처리방침 동의 <span className="text-red-400">*</span></span>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedTerms(expandedTerms === 'privacy' ? null : 'privacy')}
                                        className="text-text-muted hover:text-white transition-colors"
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
                            <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors rounded-lg border border-white/5">
                                <input
                                    type="checkbox"
                                    checked={agreements.marketing}
                                    onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary"
                                />
                                <span className="text-text-muted flex-1">마케팅 정보 수신 동의 <span className="text-text-muted/50">(선택)</span></span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
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
                        {isModal ? (
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-primary hover:underline font-medium"
                            >
                                로그인으로 돌아가기
                            </button>
                        ) : (
                            <Link to="/login" className="text-primary hover:underline font-medium">로그인</Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
