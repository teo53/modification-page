import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { signup } from '../utils/auth';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        type: 'worker' as 'worker' | 'advertiser'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        if (!formData.email || !formData.password || !formData.name) {
            setError('필수 항목을 모두 입력해주세요.');
            setLoading(false);
            return;
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

        if (!agreed) {
            setError('이용약관에 동의해주세요.');
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
        });

        if (result.success) {
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
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
                    <p className="text-text-muted">QueenAlba의 회원이 되어주세요</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-accent rounded-xl p-8 border border-white/5">
                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                            <AlertCircle size={18} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                            <CheckCircle size={18} />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    {/* User Type Selection */}
                    <div className="flex gap-2 p-1 bg-background rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${formData.type === 'worker'
                                ? 'bg-primary text-black shadow-lg'
                                : 'text-text-muted hover:text-white'
                                }`}
                            onClick={() => setFormData({ ...formData, type: 'worker' })}
                        >
                            일반회원
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${formData.type === 'advertiser'
                                ? 'bg-primary text-black shadow-lg'
                                : 'text-text-muted hover:text-white'
                                }`}
                            onClick={() => setFormData({ ...formData, type: 'advertiser' })}
                        >
                            광고주
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">이메일 *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                                    placeholder="example@queenalba.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">비밀번호 *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white focus:border-primary outline-none"
                                    placeholder="6자 이상 입력"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">비밀번호 확인 *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                                    placeholder="비밀번호 다시 입력"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">이름 *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                                    placeholder="이름을 입력해주세요"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">휴대폰 번호</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                                    placeholder="010-0000-0000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-text-muted">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1 rounded border-white/20"
                        />
                        <span>
                            <a href="#" className="text-white hover:underline">이용약관</a> 및
                            <a href="#" className="text-white hover:underline"> 개인정보처리방침</a>에 동의합니다. *
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? '처리 중...' : '회원가입'}
                    </button>

                    <div className="text-center text-sm text-text-muted">
                        이미 계정이 있으신가요?{' '}
                        <Link to="/login" className="text-primary hover:underline">로그인</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
