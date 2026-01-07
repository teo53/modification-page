import React, { useState, useEffect } from 'react';
import { Search, Menu, User, LogIn, PenSquare, LogOut, LayoutDashboard, X, Phone, MessageCircle, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, isAdvertiser } from '../../utils/auth';
import { detectSqlInjection } from '../../utils/validation';
import { useTheme } from '../../contexts/ThemeContext';

// 사이트 통계 (실제로는 API에서 가져옴)
const siteStats = {
    totalAds: 2847,
    todayAds: 127,
    totalMembers: 15420,
};


const Header: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(getCurrentUser());
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Refresh user state when component mounts or navigates
    useEffect(() => {
        const checkUser = () => setUser(getCurrentUser());
        checkUser();

        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', checkUser);
        // Listen for custom auth state change event (for same-tab sync)
        window.addEventListener('authStateChange', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('authStateChange', checkUser);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-white/10">
            {/* Top Info Bar - CS & Stats */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-white/5">
                <div className="container mx-auto px-4 h-8 flex items-center justify-between text-xs">
                    {/* Customer Service */}
                    <div className="flex items-center gap-4">
                        <a href="tel:1577-0000" className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                            <Phone size={12} />
                            <span>고객센터: 1577-0000</span>
                        </a>
                        <a href="https://open.kakao.com/o/dalbitAlba" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 text-text-muted hover:text-yellow-400 transition-colors">
                            <MessageCircle size={12} />
                            <span>카카오 상담</span>
                        </a>
                    </div>
                    {/* Site Stats */}
                    <div className="flex items-center gap-4 text-text-muted">
                        <span className="hidden sm:inline">
                            총 광고 <span className="text-primary font-bold">{siteStats.totalAds.toLocaleString()}</span>개
                        </span>
                        <span className="hidden md:inline">
                            오늘 등록 <span className="text-green-400 font-bold">{siteStats.todayAds}</span>개
                        </span>
                        <span>
                            회원 <span className="text-secondary font-bold">{siteStats.totalMembers.toLocaleString()}</span>명
                        </span>
                    </div>
                </div>
            </div>
            {/* Main Header */}
            <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center shrink-0">
                    <img src="/logo-horizontal-white.png" alt="달빛알바" className="h-8 sm:h-10 md:h-12 object-contain" />
                </Link>

                {/* Search Bar (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                    <input
                        type="text"
                        placeholder="지역 또는 업종을 검색해보세요"
                        className="w-full h-10 pl-4 pr-10 rounded-full bg-accent border border-white/10 focus:border-primary focus:outline-none text-white placeholder-text-muted transition-colors"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const input = e.currentTarget;
                                const searchTerm = input.value.trim();

                                // Normal search with security check
                                if (searchTerm) {
                                    // Block malicious input
                                    if (detectSqlInjection(searchTerm)) {
                                        console.error('[Security] Suspicious search term blocked');
                                        input.value = '';
                                        return;
                                    }
                                    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                                }
                            }
                        }}
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
                                <div className="absolute right-0 top-full mt-2 w-48 bg-accent border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
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
                        className="flex items-center gap-1 sm:gap-2 bg-primary hover:bg-primary-hover text-black font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors text-xs sm:text-sm whitespace-nowrap"
                    >
                        <PenSquare size={14} className="sm:w-[18px] sm:h-[18px]" />
                        <span>광고등록</span>
                    </Link>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        aria-label={`${theme === 'dark' ? '라이트' : '다크'} 모드로 전환`}
                        title={`${theme === 'dark' ? '라이트' : '다크'} 모드로 전환`}
                    >
                        {theme === 'dark' ? (
                            <Sun size={18} className="text-primary" />
                        ) : (
                            <Moon size={18} className="text-primary" />
                        )}
                    </button>

                    <button
                        className="md:hidden text-theme-text-primary"
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
                                { name: '지역별', path: '/region' },
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
                            { name: '지역별', path: '/region' },
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
