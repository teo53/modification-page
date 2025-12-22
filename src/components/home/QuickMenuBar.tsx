import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Zap, MessageSquare, Upload, FileText, Clock } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

// 메뉴 아이템 정의
const menuItems = [
    { id: 'region-search', label: '지역검색', icon: Search, to: '/search', color: 'from-blue-600/20 to-blue-400/5 border-blue-500/30' },
    { id: 'region', label: '지역별', icon: MapPin, to: '/region', color: 'from-green-600/20 to-green-400/5 border-green-500/30' },
    { id: 'industry', label: '업종별', icon: Briefcase, to: '/industry', color: 'from-purple-600/20 to-purple-400/5 border-purple-500/30' },
    { id: 'theme', label: '검색', icon: Zap, to: '/theme', color: 'from-yellow-600/20 to-yellow-400/5 border-yellow-500/30' },
    { id: 'urgent', label: '급구', icon: Clock, to: '/urgent', color: 'from-red-600/20 to-red-400/5 border-red-500/30' },
    { id: 'community', label: '커뮤니티', icon: MessageSquare, to: '/community', color: 'from-cyan-600/20 to-cyan-400/5 border-cyan-500/30' },
    { id: 'job-seek', label: '구직등록', icon: FileText, to: '/job-seeker', color: 'from-emerald-600/20 to-emerald-400/5 border-emerald-500/30' },
];

// 광고주/관리자 전용 메뉴
const advertiserMenuItem = {
    id: 'post-ad',
    label: '광고게시',
    icon: Upload,
    to: '/post-ad',
    color: 'from-pink-600/20 to-pink-400/5 border-pink-500/30'
};

const QuickMenuBar: React.FC = () => {
    const currentUser = getCurrentUser();

    // 관리자 또는 광고주인 경우 광고게시 메뉴 추가
    const isAdminOrAdvertiser = currentUser && (
        currentUser.type === 'advertiser' ||
        currentUser.email === 'admin@lunaalba.com'
    );

    const visibleMenuItems = isAdminOrAdvertiser
        ? [...menuItems, advertiserMenuItem]
        : menuItems;

    return (
        <section className="py-8 container mx-auto px-4">
            <h2 className="text-xl font-bold text-white mb-6 text-center">빠른 메뉴</h2>
            <div className={`grid grid-cols-4 ${visibleMenuItems.length > 7 ? 'md:grid-cols-8' : 'md:grid-cols-7'} gap-3 md:gap-4`}>
                {visibleMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            to={item.to}
                            className={`
                                relative group flex flex-col items-center justify-center gap-2 p-4 md:p-6 
                                rounded-2xl border bg-gradient-to-br ${item.color}
                                hover:scale-105 transition-all duration-300
                                hover:shadow-lg hover:shadow-white/10
                            `}
                        >
                            <div className="p-3 rounded-xl bg-black/30 group-hover:bg-black/40 transition-colors">
                                <Icon size={24} className="text-white" />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-white text-center">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default QuickMenuBar;
