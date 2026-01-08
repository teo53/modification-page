import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { login, loginWithApi, USE_API_AUTH } from '../utils/auth';
import { validateEmail, detectSqlInjection } from '../utils/validation';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Basic validation
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            setLoading(false);
            return;
        }

        // Email format validation
        if (!validateEmail(email)) {
            setError('올바른 이메일 형식을 입력해주세요.');
            setLoading(false);
            return;
        }

        // Malicious input detection
        if (detectSqlInjection(email) || detectSqlInjection(password)) {
            setError('유효하지 않은 입력입니다.');
            console.error('[Security] Suspicious input detected in login form');
            setLoading(false);
            return;
        }

        try {
            let result;

            // API 인증 시도 (5초 타임아웃)
            if (USE_API_AUTH) {
                const apiPromise = loginWithApi(email, password);
                const timeoutPromise = new Promise<{ success: false; message: string }>((resolve) =>
                    setTimeout(() => resolve({ success: false, message: 'TIMEOUT' }), 5000)
                );

                result = await Promise.race([apiPromise, timeoutPromise]);

                // API 타임아웃 또는 실패 시 localStorage 폴백
                if (!result.success && result.message === 'TIMEOUT') {
                    console.warn('API 로그인 타임아웃, localStorage 폴백 사용');
                    result = login(email, password);
                }
            } else {
                // localStorage 인증
                result = login(email, password);
            }

            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    // Redirect based on user type
                    if (result.user?.type === 'advertiser') {
                        navigate('/advertiser/dashboard');
                    } else {
                        navigate('/');
                    }
                }, 1000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            // 오류 발생 시 localStorage 폴백
            const fallbackResult = login(email, password);
            if (fallbackResult.success) {
                setSuccess(fallbackResult.message);
                setTimeout(() => navigate('/'), 1000);
            } else {
                setError('로그인 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">로그인</h1>
                    <p className="text-text-muted">달빛알바에 오신 것을 환영합니다</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-accent rounded-xl p-8 border border-white/5">
                    {/* Error Message */}
                    {error && (
                        <div id="login-error" role="alert" className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                            <AlertCircle size={18} aria-hidden="true" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div role="status" className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                            <CheckCircle size={18} aria-hidden="true" />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-white mb-2">이메일</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} aria-hidden="true" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="이메일을 입력하세요"
                                    autoComplete="email"
                                    aria-describedby={error ? "login-error" : undefined}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-white mb-2">비밀번호</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} aria-hidden="true" />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="비밀번호를 입력하세요"
                                    autoComplete="current-password"
                                    aria-describedby={error ? "login-error" : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                                >
                                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-text-muted">
                            <input type="checkbox" className="rounded border-white/20" />
                            <span>로그인 상태 유지</span>
                        </label>
                        <a href="#" className="text-primary hover:underline">비밀번호 찾기</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    <div className="text-center text-sm text-text-muted">
                        계정이 없으신가요?{' '}
                        <Link to="/signup" className="text-primary hover:underline">회원가입</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
