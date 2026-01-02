import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppBarProps {
  showBackButton?: boolean;
  transparent?: boolean;
  title?: string;
  showSearch?: boolean;
  showMenu?: boolean;
  rightAction?: React.ReactNode;
}

// Route titles
const ROUTE_TITLES: Record<string, string> = {
  '/': '',
  '/search': '검색',
  '/community': '커뮤니티',
  '/post-ad': '광고 등록',
  '/login': '로그인',
  '/signup': '회원가입',
  '/support': '고객센터',
  '/advertiser/dashboard': '광고주 센터',
  '/admin/crm': '관리자',
  '/theme': '테마별',
  '/industry': '업종별',
  '/urgent': '급구',
};

const AppBar: React.FC<AppBarProps> = ({
  showBackButton = false,
  transparent = false,
  title,
  showSearch = true,
  rightAction,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get page title
  const pageTitle = title || ROUTE_TITLES[location.pathname] || '';

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Is home page
  const isHome = location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      className={`
        sticky top-0 z-40 h-14
        ${transparent
          ? 'bg-transparent'
          : 'bg-background/95 backdrop-blur-lg border-b border-white/5'
        }
        safe-area-pt
      `}
    >
      <div className="h-full px-4 flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-2 min-w-[60px]">
          {showBackButton ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors -ml-2"
              aria-label="뒤로가기"
            >
              <ArrowLeft size={24} className="text-white" />
            </motion.button>
          ) : isHome ? (
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">
                <span className="text-white">Luna</span>
                <span className="text-secondary">Alba</span>
              </span>
            </Link>
          ) : null}
        </div>

        {/* Center Section - Title or Search */}
        <div className="flex-1 flex items-center justify-center">
          {pageTitle && !isHome ? (
            <h1 className="text-lg font-bold text-white truncate">
              {pageTitle}
            </h1>
          ) : isHome && showSearch ? (
            <Link
              to="/search"
              className="flex-1 max-w-md mx-2"
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 h-10 px-4 rounded-full bg-accent/80 border border-white/10"
              >
                <Search size={18} className="text-text-muted flex-shrink-0" />
                <span className="text-text-muted text-sm truncate">
                  지역, 업종으로 검색
                </span>
              </motion.div>
            </Link>
          ) : null}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 min-w-[60px] justify-end">
          {rightAction || (
            <>
              {isHome && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label="알림"
                >
                  <Bell size={22} className="text-white" />
                  {/* Notification Badge */}
                  <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default AppBar;
