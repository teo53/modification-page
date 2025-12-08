import React from 'react';
import { Search, Menu, User, LogIn, PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
                    <Link to="/login" className="hidden md:flex items-center gap-1 text-text-muted hover:text-white transition-colors">
                        <LogIn size={18} />
                        <span className="text-sm">로그인</span>
                    </Link>
                    <Link to="/signup" className="hidden md:flex items-center gap-1 text-text-muted hover:text-white transition-colors">
                        <User size={18} />
                        <span className="text-sm">회원가입</span>
                    </Link>
                    <Link
                        to="/advertiser/dashboard"
                        className="hidden md:flex items-center gap-1 text-text-muted hover:text-white transition-colors mr-2"
                    >
                        <span className="text-sm">광고주 센터</span>
                    </Link>
                    <Link
                        to="/post-ad"
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold px-4 py-2 rounded-full transition-colors"
                    >
                        <PenSquare size={18} />
                        <span>광고등록</span>
                    </Link>
                    <button className="md:hidden text-white">
                        <Menu size={24} />
                    </button>
                </div>
            </div>

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
