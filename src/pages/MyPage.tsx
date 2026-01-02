import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Settings, Bell, Heart, Clock, FileText,
  HelpCircle, LogOut, ChevronRight, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getCurrentUser, logout } from '../utils/auth';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
  badge?: string | number;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  to,
  onClick,
  badge,
  danger = false
}) => {
  const content = (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-4 px-4 py-4 active:bg-white/5 ${
        danger ? 'text-red-400' : 'text-white'
      }`}
    >
      <span className={danger ? 'text-red-400' : 'text-text-muted'}>
        {icon}
      </span>
      <span className="flex-1 font-medium">{label}</span>
      {badge && (
        <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {!danger && <ChevronRight size={20} className="text-text-muted" />}
    </motion.div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return <button onClick={onClick} className="w-full text-left">{content}</button>;
};

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const user = getCurrentUser();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    }
  };

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6">
            <User size={48} className="text-text-muted" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">로그인이 필요합니다</h1>
          <p className="text-text-muted text-center mb-8">
            로그인하고 더 많은 기능을 이용해보세요
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <Link
              to="/login"
              className="flex-1 bg-primary text-black font-bold py-3 rounded-xl text-center"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="flex-1 bg-accent border border-white/10 text-white font-bold py-3 rounded-xl text-center"
            >
              회원가입
            </Link>
          </div>
        </div>

        {/* Quick Links for non-logged users */}
        <div className="border-t border-white/5">
          <MenuItem icon={<HelpCircle size={22} />} label="고객센터" to="/support" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Profile Section */}
      <div className="px-4 py-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <User size={32} className="text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{user.name}</h1>
            <p className="text-sm text-text-muted">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {user.type === 'advertiser' ? '광고주' : '일반회원'}
            </span>
          </div>
          <Link to="/mypage/edit">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
            >
              <Settings size={20} className="text-text-muted" />
            </motion.div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Link to="/favorites" className="bg-accent rounded-xl p-4 text-center">
            <Heart size={24} className="text-secondary mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{state.favorites.length}</p>
            <p className="text-xs text-text-muted">찜한 공고</p>
          </Link>
          <Link to="/mypage/views" className="bg-accent rounded-xl p-4 text-center">
            <Clock size={24} className="text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{state.recentViews.length}</p>
            <p className="text-xs text-text-muted">최근 본</p>
          </Link>
          <Link to="/mypage/applications" className="bg-accent rounded-xl p-4 text-center">
            <FileText size={24} className="text-green-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">0</p>
            <p className="text-xs text-text-muted">지원 현황</p>
          </Link>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="divide-y divide-white/5">
        {/* Activity */}
        <div>
          <p className="px-4 py-3 text-xs text-text-muted font-medium">활동</p>
          <MenuItem
            icon={<Heart size={22} />}
            label="찜한 공고"
            to="/favorites"
            badge={state.favorites.length > 0 ? state.favorites.length : undefined}
          />
          <MenuItem
            icon={<Clock size={22} />}
            label="최근 본 공고"
            to="/mypage/views"
          />
          <MenuItem
            icon={<FileText size={22} />}
            label="지원 현황"
            to="/mypage/applications"
          />
        </div>

        {/* Advertiser Section */}
        {user.type === 'advertiser' && (
          <div>
            <p className="px-4 py-3 text-xs text-text-muted font-medium">광고주</p>
            <MenuItem
              icon={<FileText size={22} />}
              label="광고주 대시보드"
              to="/advertiser/dashboard"
            />
            <MenuItem
              icon={<Shield size={22} />}
              label="광고 등록"
              to="/post-ad"
            />
          </div>
        )}

        {/* Settings */}
        <div>
          <p className="px-4 py-3 text-xs text-text-muted font-medium">설정</p>
          <MenuItem
            icon={<Bell size={22} />}
            label="알림 설정"
            to="/mypage/notifications"
          />
          <MenuItem
            icon={<Shield size={22} />}
            label="개인정보 관리"
            to="/mypage/privacy"
          />
        </div>

        {/* Support */}
        <div>
          <p className="px-4 py-3 text-xs text-text-muted font-medium">지원</p>
          <MenuItem
            icon={<HelpCircle size={22} />}
            label="고객센터"
            to="/support"
          />
        </div>

        {/* Logout */}
        <div className="pb-8">
          <MenuItem
            icon={<LogOut size={22} />}
            label="로그아웃"
            onClick={handleLogout}
            danger
          />
        </div>
      </div>

      {/* App Version */}
      <div className="text-center py-4 text-xs text-text-muted/50">
        LunaAlba v1.0.0
      </div>
    </div>
  );
};

export default MyPage;
