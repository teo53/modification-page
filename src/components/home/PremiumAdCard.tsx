import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Crown, Sparkles, Diamond, Calendar } from 'lucide-react';
import type { Advertisement } from '../../data/mockAds';

interface PremiumAdCardProps {
    ad: Advertisement;
    variant?: 'large' | 'medium' | 'compact' | 'grid';
    showRank?: number;
}

const PremiumAdCard: React.FC<PremiumAdCardProps> = ({ ad, variant = 'medium', showRank }) => {
    const tierConfig = {
        diamond: {
            border: 'border-2 border-cyan-400',
            badge: 'DIAMOND',
            badgeClass: 'bg-cyan-400 text-black',
            icon: Diamond,
        },
        sapphire: {
            border: 'border-2 border-blue-500',
            badge: 'SAPPHIRE',
            badgeClass: 'bg-blue-500 text-white',
            icon: Diamond,
        },
        ruby: {
            border: 'border-2 border-red-500',
            badge: 'RUBY',
            badgeClass: 'bg-red-500 text-white',
            icon: Diamond,
        },
        gold: {
            border: 'border-2 border-yellow-500',
            badge: 'GOLD',
            badgeClass: 'bg-yellow-500 text-black',
            icon: Crown,
        },
        vip: {
            border: 'border-2 border-primary',
            badge: 'VIP',
            badgeClass: 'bg-primary text-white',
            icon: Crown,
        },
        special: {
            border: 'border-2 border-purple-500',
            badge: 'SPECIAL',
            badgeClass: 'bg-purple-500 text-white',
            icon: Sparkles,
        },
        premium: {
            border: 'border-2 border-blue-500',
            badge: 'PREMIUM',
            badgeClass: 'bg-blue-500 text-white',
            icon: Diamond,
        },
        general: {
            border: 'border border-border',
            badge: '',
            badgeClass: '',
            icon: null,
        },
    };

    const config = tierConfig[ad.productType] || tierConfig.general;
    const TierIcon = config.icon;

    // Mock ad duration (days running)
    const daysRunning = Math.floor(Math.random() * 30) + 1;

    // Grid variant - clean, no sparkle, 2-column optimized
    if (variant === 'grid') {
        return (
            <Link to={`/ad/${ad.id}`} className="block">
                <div className={`rounded-xl overflow-hidden ${config.border} bg-card`}>
                    {/* Image */}
                    <div className="relative h-24">
                        <img
                            src={ad.thumbnail}
                            alt={ad.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-ad.jpg';
                                target.onerror = null;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                        {/* Tier Badge */}
                        {config.badge && (
                            <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded ${config.badgeClass} text-[10px] font-bold`}>
                                {TierIcon && <TierIcon size={10} />}
                                {config.badge}
                            </div>
                        )}

                        {/* Rank */}
                        {showRank && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white font-bold text-xs">
                                {showRank}
                            </div>
                        )}

                        {/* Pay overlay */}
                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded">
                            <span className="text-white text-xs font-bold">{ad.pay}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-2">
                        <h3 className="font-bold text-text-main text-xs line-clamp-2 min-h-[32px] mb-1">
                            {ad.title}
                        </h3>
                        <div className="flex items-center gap-1 text-text-muted text-[10px] mb-1">
                            <MapPin size={10} />
                            <span className="truncate">{ad.location}</span>
                        </div>
                        {/* Ad Duration & AD indicator */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-text-light text-[9px]">
                                <Calendar size={9} />
                                <span>{daysRunning}일째 광고중</span>
                            </div>
                            <span className="text-[8px] text-text-light bg-surface px-1 py-0.5 rounded">AD</span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'large') {
        return (
            <Link to={`/ad/${ad.id}`} className="block">
                <div className={`relative rounded-2xl overflow-hidden ${config.border} bg-card`}>
                    {/* Image */}
                    <div className="relative h-48">
                        <img
                            src={ad.thumbnail}
                            alt={ad.title}
                            loading="lazy"
                            decoding="async"
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
                </div>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link to={`/ad/${ad.id}`} className="block">
                <div className={`flex gap-3 p-3 rounded-xl ${config.border} bg-card`}>
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                            src={ad.thumbnail}
                            alt={ad.title}
                            loading="lazy"
                            decoding="async"
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
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-primary">{ad.pay}</p>
                            <span className="text-[8px] text-text-light bg-surface px-1 py-0.5 rounded">AD</span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Medium (default)
    return (
        <Link to={`/ad/${ad.id}`} className="block flex-shrink-0 w-[160px]">
            <div className={`rounded-xl overflow-hidden ${config.border} bg-card h-full`}>
                {/* Image */}
                <div className="relative h-24">
                    <img
                        src={ad.thumbnail}
                        alt={ad.title}
                        loading="lazy"
                        decoding="async"
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

                    {/* Pay overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                        {ad.pay}
                    </div>
                </div>

                {/* Content */}
                <div className="p-2">
                    <h3 className="font-bold text-text-main text-xs line-clamp-2 min-h-[32px] mb-1">
                        {ad.title}
                    </h3>
                    <p className="text-[10px] text-text-muted flex items-center gap-1 truncate">
                        <MapPin size={10} />
                        {ad.location}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default PremiumAdCard;
