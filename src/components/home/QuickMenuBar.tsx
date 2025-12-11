import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Zap, MessageSquare, Upload, Users, Clock } from 'lucide-react';

const menuItems = [
    { id: 'region-search', label: '지역검색', icon: Search, to: '/search', color: 'from-blue-600/20 to-blue-400/5 border-blue-500/30' },
    { id: 'region', label: '지역별', icon: MapPin, to: '/region', color: 'from-green-600/20 to-green-400/5 border-green-500/30' },
    { id: 'industry', label: '업종별', icon: Briefcase, to: '/industry', color: 'from-purple-600/20 to-purple-400/5 border-purple-500/30' },
    { id: 'theme', label: '검색', icon: Zap, to: '/theme', color: 'from-yellow-600/20 to-yellow-400/5 border-yellow-500/30' },
    { id: 'urgent', label: '급구', icon: Clock, to: '/urgent', color: 'from-red-600/20 to-red-400/5 border-red-500/30' },
    { id: 'community', label: '커뮤니티', icon: MessageSquare, to: '/community', color: 'from-cyan-600/20 to-cyan-400/5 border-cyan-500/30' },
    { id: 'post-ad', label: '광고게시', icon: Upload, to: '/post-ad', color: 'from-pink-600/20 to-pink-400/5 border-pink-500/30' },
    { id: 'group', label: '공동모집', icon: Users, to: '/support', color: 'from-indigo-600/20 to-indigo-400/5 border-indigo-500/30' },
];

const QuickMenuBar: React.FC = () => {
    return (
        <section className="py-8 container mx-auto px-4">
            <h2 className="text-xl font-bold text-white mb-6 text-center">빠른 메뉴</h2>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
                {menuItems.map((item) => {
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
