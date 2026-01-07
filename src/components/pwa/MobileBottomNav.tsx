import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PenSquare, MessageSquare, User } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const user = getCurrentUser();

  const navItems: NavItem[] = [
    {
      icon: <Home size={22} />,
      label: '홈',
      path: '/',
    },
    {
      icon: <Search size={22} />,
      label: '검색',
      path: '/search',
    },
    {
      icon: <PenSquare size={22} />,
      label: '등록',
      path: '/post-ad',
    },
    {
      icon: <MessageSquare size={22} />,
      label: '커뮤니티',
      path: '/community',
    },
    {
      icon: <User size={22} />,
      label: user ? '마이' : '로그인',
      path: user ? '/advertiser/dashboard' : '/login',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-white/10 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(item.path)
                ? 'text-primary'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <span className={`${isActive(item.path) ? 'scale-110' : ''} transition-transform`}>
              {item.icon}
            </span>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
