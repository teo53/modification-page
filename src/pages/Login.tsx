import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, X, Mail } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryStep, setRecoveryStep] = useState<'email' | 'sent'>('email');

    const handlePasswordRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock password recovery
        setRecoveryStep('sent');
        setTimeout(() => {
            alert(`비밀번호 재설정 링크가 ${recoveryEmail}(으)로 전송되었습니다.`);
            setShowPasswordRecovery(false);
            setRecoveryStep('email');
            setRecoveryEmail('');
        }, 1500);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md bg-accent rounded-xl border border-white/10 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">로그인</h1>
                        <p className="text-text-muted text-sm">QueenAlba에 오신 것을 환영합니다</p>
                    </div>

                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">아이디</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="아이디를 입력하세요"
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">비밀번호</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="비밀번호를 입력하세요"
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-text-muted cursor-pointer">
                                <input type="checkbox" className="rounded border-white/20 bg-black/20 w-4 h-4 accent-primary" />
                                자동 로그인
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPasswordRecovery(true)}
                                className="text-primary hover:underline"
                            >
                                비밀번호 찾기
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors mt-6"
                        >
                            로그인
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-text-muted text-sm mb-4">SNS 계정으로 간편 로그인</p>
                        <div className="flex justify-center gap-4">
                            <button className="w-10 h-10 rounded-full bg-[#FAE100] text-[#371D1E] font-bold flex items-center justify-center hover:opacity-90 transition-opacity" title="카카오">K</button>
                            <button className="w-10 h-10 rounded-full bg-[#03C75A] text-white font-bold flex items-center justify-center hover:opacity-90 transition-opacity" title="네이버">N</button>
                            <button className="w-10 h-10 rounded-full bg-white text-black font-bold flex items-center justify-center hover:opacity-90 transition-opacity" title="구글">G</button>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-text-muted">
                        계정이 없으신가요? <Link to="/signup" className="text-white font-bold hover:underline ml-1">회원가입</Link>
                    </div>
                </div>
            </div>

            {/* Password Recovery Modal */}
            {showPasswordRecovery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowPasswordRecovery(false)}>
                    <div className="bg-background border border-white/10 rounded-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-white">비밀번호 찾기</h3>
                            <button onClick={() => setShowPasswordRecovery(false)} className="text-text-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordRecovery} className="p-6">
                            {recoveryStep === 'email' ? (
                                <>
                                    <p className="text-text-muted text-sm mb-6">
                                        가입하신 이메일 주소를 입력하시면<br />
                                        비밀번호 재설정 링크를 보내드립니다.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={recoveryEmail}
                                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                                className="w-full bg-accent border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                                                placeholder="example@email.com"
                                                required
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors"
                                        >
                                            재설정 링크 보내기
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="text-green-500" size={32} />
                                    </div>
                                    <h4 className="text-white font-bold mb-2">이메일을 확인하세요</h4>
                                    <p className="text-text-muted text-sm">
                                        비밀번호 재설정 링크가 전송되었습니다.
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
