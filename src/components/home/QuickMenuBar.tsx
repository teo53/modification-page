import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, MessageSquare, Upload, FileText, Clock, Star } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

// 메뉴 아이템 정의
const menuItems = [
    { id: 'region', label: '지역별', icon: MapPin, to: '/region', color: 'from-green-600/20 to-green-400/5 border-green-500/30' },
    { id: 'industry', label: '업종별', icon: Briefcase, to: '/industry', color: 'from-purple-600/20 to-purple-400/5 border-purple-500/30' },
    { id: 'urgent', label: '급구', icon: Clock, to: '/urgent', color: 'from-red-600/20 to-red-400/5 border-red-500/30' },
    { id: 'community', label: '커뮤니티', icon: MessageSquare, to: '/community', color: 'from-cyan-600/20 to-cyan-400/5 border-cyan-500/30' },
    { id: 'review', label: '업소후기', icon: Star, to: '/community?category=review', color: 'from-yellow-600/20 to-yellow-400/5 border-yellow-500/30' },
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
        <section className="py-4 container mx-auto px-4">
            <h2 className="text-lg font-bold text-white mb-4 text-center">빠른 메뉴</h2>
            <div className="flex justify-center">
                <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 ${isAdminOrAdvertiser ? 'lg:grid-cols-7' : 'lg:grid-cols-6'} gap-2 md:gap-3 max-w-4xl`}>
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                to={item.to}
                                className={`
                                    relative group flex flex-col items-center justify-center gap-1.5 p-3 md:p-4 
                                    rounded-xl border bg-gradient-to-br ${item.color}
                                    hover:scale-105 transition-all duration-300
                                    hover:shadow-lg hover:shadow-white/10
                                `}
                            >
                                <div className="p-2 rounded-lg bg-black/30 group-hover:bg-black/40 transition-colors">
                                    <Icon size={20} className="text-white" />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-white text-center">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default QuickMenuBar;

