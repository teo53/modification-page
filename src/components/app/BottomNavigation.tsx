import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PenSquare, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

interface NavItem {
  icon: React.ElementType;
  activeIcon?: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { state } = useApp();

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: '홈',
      path: '/',
    },
    {
      icon: Search,
      label: '검색',
      path: '/search',
    },
    {
      icon: PenSquare,
      label: '등록',
      path: '/post-ad',
    },
    {
      icon: Heart,
      label: '찜',
      path: '/favorites',
      badge: state.favorites.length > 0 ? state.favorites.length : undefined,
    },
    {
      icon: User,
      label: state.isAuthenticated ? '마이' : '로그인',
      path: state.isAuthenticated ? '/mypage' : '/login',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Haptic feedback (if supported)
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-xl border-t border-white/10 safe-area-pb">
      <div className="flex items-stretch h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          // Special styling for center button
          const isCenter = index === 2;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={triggerHaptic}
              className={`
                relative flex-1 flex flex-col items-center justify-center
                min-h-[64px] min-w-[64px]
                transition-colors duration-200
                ${isCenter ? '' : 'active:bg-white/5'}
              `}
            >
              {isCenter ? (
                // Center FAB-style button
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative -mt-4"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon size={26} className="text-black" />
                  </div>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-primary whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.div>
              ) : (
                // Regular nav items
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <div className="relative">
                    <Icon
                      size={24}
                      className={`transition-colors duration-200 ${
                        active ? 'text-primary' : 'text-text-muted'
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    {/* Badge */}
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-secondary rounded-full"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      active ? 'text-primary' : 'text-text-muted'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
