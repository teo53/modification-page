import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Zap, Crown, Sparkles, Diamond } from 'lucide-react';
import type { Advertisement } from '../../data/mockAds';

interface PremiumAdCardProps {
    ad: Advertisement;
    variant?: 'large' | 'medium' | 'compact';
    showRank?: number;
}

const PremiumAdCard: React.FC<PremiumAdCardProps> = ({ ad, variant = 'medium', showRank }) => {
    const tierConfig = {
        diamond: {
            border: 'border-2 border-cyan-400',
            glow: 'shadow-[0_0_25px_rgba(34,211,238,0.4)]',
            badge: 'DIAMOND',
            badgeClass: 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-black',
            icon: Diamond,
        },
        sapphire: {
            border: 'border-2 border-blue-500',
            glow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]',
            badge: 'SAPPHIRE',
            badgeClass: 'bg-gradient-to-r from-blue-500 to-blue-400 text-white',
            icon: Diamond,
        },
        ruby: {
            border: 'border-2 border-red-500',
            glow: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]',
            badge: 'RUBY',
            badgeClass: 'bg-gradient-to-r from-red-500 to-red-400 text-white',
            icon: Diamond,
        },
        gold: {
            border: 'border-2 border-yellow-500',
            glow: 'shadow-[0_0_25px_rgba(234,179,8,0.4)]',
            badge: 'GOLD',
            badgeClass: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-black',
            icon: Crown,
        },
        vip: {
            border: 'border-2 border-primary',
            glow: 'shadow-[0_0_20px_rgba(255,107,53,0.3)]',
            badge: 'VIP',
            badgeClass: 'bg-gradient-to-r from-primary to-orange-400 text-white',
            icon: Crown,
        },
        special: {
            border: 'border-2 border-purple-500',
            glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
            badge: 'SPECIAL',
            badgeClass: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
            icon: Sparkles,
        },
        premium: {
            border: 'border-2 border-blue-500',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
            badge: 'PREMIUM',
            badgeClass: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white',
            icon: Diamond,
        },
        general: {
            border: 'border border-border',
            glow: '',
            badge: '',
            badgeClass: '',
            icon: null,
        },
    };

    const config = tierConfig[ad.productType] || tierConfig.general;
    const TierIcon = config.icon;

    if (variant === 'large') {
        return (
            <Link to={`/ad/${ad.id}`} className="block">
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`relative rounded-2xl overflow-hidden ${config.border} ${config.glow} bg-card`}
                >
                    {/* Image */}
                    <div className="relative h-48">
                        <img
                            src={ad.thumbnail}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-ad.jpg';
                                target.onerror = null;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Tier Badge */}
                        {config.badge && (
                            <div className={`absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full ${config.badgeClass} text-xs font-bold`}>
                                {TierIcon && <TierIcon size={12} />}
                                {config.badge}
                            </div>
                        )}

                        {/* HOT Badge */}
                        {ad.isHot && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                                <Zap size={12} fill="currentColor" />
                                급구
                            </div>
                        )}

                        {/* Rank */}
                        {showRank && (
                            <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                {showRank}
                            </div>
                        )}

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-bold text-white text-lg mb-1 line-clamp-2">
                                {ad.title}
                            </h3>
                            <div className="flex items-center justify-between">
                                <p className="text-white/80 text-sm flex items-center gap-1">
                                    <MapPin size={12} />
                                    {ad.location}
                                </p>
                                <p className="text-white font-bold">{ad.pay}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="p-3 flex flex-wrap gap-1.5">
                        {ad.badges.slice(0, 4).map((badge, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-accent text-text-muted">
                                #{badge}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link to={`/ad/${ad.id}`} className="block">
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`flex gap-3 p-3 rounded-xl ${config.border} ${config.glow} bg-card`}
                >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                            src={ad.thumbnail}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-ad.jpg';
                                target.onerror = null;
                            }}
                        />
                        {config.badge && (
                            <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${config.badgeClass}`}>
                                {config.badge}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            {ad.isHot && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">HOT</span>
                            )}
                            {ad.isNew && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold">NEW</span>
                            )}
                        </div>
                        <h3 className="font-bold text-text-main text-sm line-clamp-2 mb-1">
                            {ad.title}
                        </h3>
                        <p className="text-xs text-text-muted mb-1">{ad.location}</p>
                        <p className="text-sm font-bold text-primary">{ad.pay}</p>
                    </div>
                </motion.div>
            </Link>
        );
    }

    // Medium (default)
    return (
        <Link to={`/ad/${ad.id}`} className="block flex-shrink-0 w-[220px]">
            <motion.div
                whileTap={{ scale: 0.98 }}
                className={`rounded-xl overflow-hidden ${config.border} ${config.glow} bg-card h-full`}
            >
                {/* Image */}
                <div className="relative h-32">
                    <img
                        src={ad.thumbnail}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-ad.jpg';
                            target.onerror = null;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Tier Badge */}
                    {config.badge && (
                        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded ${config.badgeClass} text-[10px] font-bold`}>
                            {TierIcon && <TierIcon size={10} />}
                            {config.badge}
                        </div>
                    )}

                    {/* HOT/NEW */}
                    <div className="absolute top-2 right-2 flex gap-1">
                        {ad.isHot && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">HOT</span>
                        )}
                        {ad.isNew && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold">NEW</span>
                        )}
                    </div>

                    {/* Pay overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                        {ad.pay}
                    </div>
                </div>

                {/* Content */}
                <div className="p-3">
                    <p className="text-[10px] text-text-muted mb-1 truncate">
                        #{ad.badges.slice(0, 2).join(' #')}
                    </p>
                    <h3 className="font-bold text-text-main text-sm line-clamp-2 min-h-[40px] mb-1">
                        {ad.title}
                    </h3>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                        <MapPin size={10} />
                        {ad.location}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export default PremiumAdCard;
