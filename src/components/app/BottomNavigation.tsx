import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, MapPin, MessageCircle, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

interface NavItem {
  icon: React.ElementType;
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
      icon: BarChart3,
      label: 'AI 추천',
      path: '/search?filter=ai',
    },
    {
      icon: MapPin,
      label: '알바지도',
      path: '/search?view=map',
    },
    {
      icon: MessageCircle,
      label: '채팅',
      path: '/community',
    },
    {
      icon: Users,
      label: '커뮤니티',
      path: '/community',
    },
    {
      icon: User,
      label: '마이페이지',
      path: state.isAuthenticated ? '/mypage' : '/login',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    // Handle query params in path
    const basePath = path.split('?')[0];
    return location.pathname === basePath || location.pathname.startsWith(basePath + '/');
  };

  // Haptic feedback (if supported)
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-area-pb">
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              onClick={triggerHaptic}
              className="relative flex-1 flex flex-col items-center justify-center min-h-[64px] active:bg-accent transition-colors"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center gap-1"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${
                      active ? 'text-text-main' : 'text-text-muted'
                    }`}
                    strokeWidth={active ? 2.5 : 1.5}
                    fill={active ? 'currentColor' : 'none'}
                  />
                  {/* Badge */}
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-primary rounded-full"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    active ? 'text-text-main' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
