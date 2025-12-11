import React, { useState, useEffect } from 'react';
import { Search, Menu, User, LogIn, PenSquare, LogOut, LayoutDashboard, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, isAdvertiser } from '../../utils/auth';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Refresh user state when component mounts or navigates
    useEffect(() => {
        const checkUser = () => setUser(getCurrentUser());
        checkUser();

        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-white/10">
            {/* Top Bar */}
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">
                        Queen<span className="text-secondary">Alba</span>
                    </span>
                </Link>

                {/* Search Bar (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                    <input
                        type="text"
                        placeholder="지역 또는 업종을 검색해보세요"
                        className="w-full h-10 pl-4 pr-10 rounded-full bg-accent border border-white/10 focus:border-primary focus:outline-none text-white placeholder-text-muted transition-colors"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                        <Search size={20} />
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        /* Logged In State */
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="hidden md:flex items-center gap-2 text-white hover:text-primary transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User size={16} className="text-primary" />
                                </div>
                                <span className="text-sm font-medium">{user.name}</span>
                            </button>

                            {/* User Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-accent border border-white/10 rounded-lg shadow-xl overflow-hidden">
                                    <div className="p-3 border-b border-white/10">
                                        <p className="text-sm font-medium text-white">{user.name}</p>
                                        <p className="text-xs text-text-muted">{user.email}</p>
                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                                            {user.type === 'advertiser' ? '광고주' : '일반회원'}
                                        </span>
                                    </div>
                                    {user.type === 'advertiser' && (
                                        <Link
                                            to="/advertiser/dashboard"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5"
                                        >
                                            <LayoutDashboard size={16} />
                                            광고주 대시보드
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                    >
                                        <LogOut size={16} />
                                        로그아웃
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Logged Out State */
                        <>
                            <Link to="/login" className="hidden md:flex items-center gap-1 text-text-muted hover:text-white transition-colors">
                                <LogIn size={18} />
                                <span className="text-sm">로그인</span>
                            </Link>
                            <Link to="/signup" className="hidden md:flex items-center gap-1 text-text-muted hover:text-white transition-colors">
                                <User size={18} />
                                <span className="text-sm">회원가입</span>
                            </Link>
                        </>
                    )}

                    {isAdvertiser() && (
                        <Link
                            to="/advertiser/dashboard"
                            className="hidden md:flex items-center gap-1 text-text-muted hover:text-white transition-colors mr-2"
                        >
                            <span className="text-sm">광고주 센터</span>
                        </Link>
                    )}

                    <Link
                        to="/post-ad"
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold px-4 py-2 rounded-full transition-colors"
                    >
                        <PenSquare size={18} />
                        <span>광고등록</span>
                    </Link>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-accent border-t border-white/10">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {user ? (
                            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <p className="text-xs text-text-muted">{user.type === 'advertiser' ? '광고주' : '일반회원'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3 pb-4 border-b border-white/10">
                                <Link to="/login" onClick={() => setShowMobileMenu(false)} className="flex-1 py-2 text-center text-sm text-white bg-white/10 rounded-lg">
                                    로그인
                                </Link>
                                <Link to="/signup" onClick={() => setShowMobileMenu(false)} className="flex-1 py-2 text-center text-sm text-black bg-primary rounded-lg font-bold">
                                    회원가입
                                </Link>
                            </div>
                        )}
                        <nav className="space-y-1">
                            {[
                                { name: '홈', path: '/' },
                                { name: '지역별', path: '/search' },
                                { name: '업종별', path: '/industry' },
                                { name: '테마별', path: '/theme' },
                                { name: '급구', path: '/urgent' },
                                { name: '커뮤니티', path: '/community' },
                                { name: '고객센터', path: '/support' },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setShowMobileMenu(false)}
                                    className="block py-2 text-text-muted hover:text-white"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        {user && (
                            <button
                                onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                                className="w-full py-2 text-center text-sm text-red-400 border border-red-400/20 rounded-lg"
                            >
                                로그아웃
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation Bar (Desktop) */}
            <nav className="hidden md:block border-t border-white/5 bg-accent/50">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center justify-center gap-8 h-12 text-sm font-medium text-text-muted">
                        {[
                            { name: '홈', path: '/' },
                            { name: '지역별', path: '/search' },
                            { name: '업종별', path: '/industry' },
                            { name: '테마별', path: '/theme' },
                            { name: '급구', path: '/urgent' },
                            { name: '커뮤니티', path: '/community' },
                            { name: '고객센터', path: '/support' },
                        ].map((item) => (
                            <li key={item.name}>
                                <Link to={item.path} className="hover:text-primary transition-colors py-3 block border-b-2 border-transparent hover:border-primary">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
