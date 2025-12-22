import React, { useEffect } from 'react';
import { MapPin, DollarSign, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { trackAdInteraction } from '../../utils/analytics';

interface AdCardProps {
    id?: number | string;
    variant?: 'diamond' | 'sapphire' | 'ruby' | 'gold' | 'vip' | 'special' | 'premium' | 'regular';
    title: string;
    location: string;
    pay: string;
    image: string;
    badges?: string[];
    isNew?: boolean;
    isHot?: boolean;
    highlightConfig?: {
        color: 'yellow' | 'pink' | 'green' | 'cyan';
        text: string;
    };
    productType?: 'diamond' | 'sapphire' | 'ruby' | 'gold' | 'vip' | 'special' | 'premium' | 'general' | 'regular' | 'highlight' | 'jumpup';
}

const AdCard: React.FC<AdCardProps> = ({
    id = 1,
    variant = 'regular',
    title,
    location,
    pay,
    image,
    badges = [],
    isNew,
    isHot,
    highlightConfig,
    productType,
}) => {
    const isDiamond = variant === 'diamond' || productType === 'diamond';
    const isSapphire = variant === 'sapphire' || productType === 'sapphire';
    const isRuby = variant === 'ruby' || productType === 'ruby';
    const isGold = variant === 'gold' || productType === 'gold';
    const isVip = variant === 'vip' || productType === 'vip';
    const isSpecial = variant === 'special' || productType === 'special';
    const isPremium = variant === 'premium' || productType === 'premium';
    // Track ad view on mount
    const adTypeForTracking = (productType || variant) as 'vip' | 'special' | 'premium' | 'general';
    useEffect(() => {
        const normalizedType = ['diamond', 'sapphire', 'ruby', 'gold', 'vip'].includes(adTypeForTracking) ? 'vip'
            : adTypeForTracking === 'special' ? 'special'
                : adTypeForTracking === 'premium' ? 'premium' : 'general';
        trackAdInteraction(Number(id), title, normalizedType, 'view');
    }, [id, title, adTypeForTracking]);

    const handleClick = () => {
        const normalizedType = ['diamond', 'sapphire', 'ruby', 'gold', 'vip'].includes(adTypeForTracking) ? 'vip'
            : adTypeForTracking === 'special' ? 'special'
                : adTypeForTracking === 'premium' ? 'premium' : 'general';
        trackAdInteraction(Number(id), title, normalizedType, 'click');
    };

    // 형광펜 효과 색상 매핑
    const highlightColors = {
        yellow: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
        pink: 'bg-pink-500/20 border-pink-500 text-pink-300',
        green: 'bg-green-500/20 border-green-500 text-green-300',
        cyan: 'bg-cyan-500/20 border-cyan-500 text-cyan-300',
    };

    const highlightStyle = highlightConfig ? highlightColors[highlightConfig.color] : '';

    // 형광펜 텍스트 교체 (제목 대신)
    const displayTitle = highlightConfig?.text || title;

    return (
        <Link
            to={`/ad/${id}`}
            onClick={handleClick}
            className={cn(
                "block group relative overflow-hidden rounded-xl bg-accent transition-all duration-300 hover:-translate-y-1",
                highlightConfig ? `border-2 ${highlightStyle.split(' ')[1]} shadow-[0_0_15px_rgba(255,255,255,0.2)]` : '', // 형광펜 보더
                !highlightConfig && isDiamond && "border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] ad-card-diamond",
                !highlightConfig && isSapphire && "border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                !highlightConfig && isRuby && "border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
                !highlightConfig && isGold && "border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]",
                !highlightConfig && isVip && "border-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)] ad-card-vip",
                !highlightConfig && isSpecial && "border-2 border-secondary shadow-[0_0_15px_rgba(255,0,127,0.3)] ad-card-special",
                !highlightConfig && isPremium && "border border-white/20",
                !highlightConfig && variant === 'regular' && "border border-white/5 hover:border-white/20"
            )}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden h-40">
                {image ? (
                    <>
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                        <div className="text-white/10 text-4xl font-bold opacity-30">
                            QUEEN
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                    {isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>}
                    {isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>}
                    {badges.map((badge, i) => (
                        <span key={i} className="bg-white/20 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded">
                            {badge}
                        </span>
                    ))}
                </div>

                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 text-white/70 hover:bg-secondary hover:text-white transition-colors">
                    <Heart size={16} />
                </button>
            </div>

            {/* Content Section */}
            <div className={`p-3 ${highlightConfig ? highlightStyle.split(' ')[0] : ''}`}> {/* 형광펜 배경 */}
                <div className="overflow-hidden">
                    <h3 className={cn(
                        "font-bold mb-1 whitespace-nowrap",
                        "hover:animate-marquee",
                        // ... width calc omitted ...
                        (() => {
                            let width = 0;
                            for (const char of title) {
                                if (/[\u3131-\uD79D]/.test(char)) width += 2; // Korean
                                else if (/[a-zA-Z0-9]/.test(char)) width += 1; // English/number
                                else if (char === ' ') width += 0.5; // Space
                                else width += 1.2; // Special chars
                            }
                            return width > 18;
                        })() && "animate-marquee-hover", // width logic placeholder
                        // 텍스트 색상 적용
                        highlightConfig ? highlightStyle.split(' ')[2] : (
                            isDiamond ? "text-lg text-cyan-400" :
                                isSapphire ? "text-lg text-blue-400" :
                                    isRuby ? "text-lg text-red-400" :
                                        isGold ? "text-lg text-yellow-400" :
                                            isVip ? "text-lg text-primary" :
                                                isSpecial ? "text-base text-secondary" :
                                                    "text-sm text-white"
                        )
                    )}>
                        {displayTitle}
                    </h3>
                </div>

                <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
                    <MapPin size={12} />
                    <span className="truncate">{location}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-white font-bold">
                        <DollarSign size={14} className="text-primary" />
                        <span>{pay}</span>
                    </div>
                    {!highlightConfig && (isDiamond || isSapphire || isRuby || isGold || isVip) && (
                        <span className={cn(
                            "text-[10px] text-black px-2 py-0.5 rounded-full font-bold",
                            isDiamond && "bg-cyan-400",
                            isSapphire && "bg-blue-500 text-white",
                            isRuby && "bg-red-500 text-white",
                            isGold && "bg-yellow-400",
                            isVip && "bg-primary"
                        )}>
                            {isDiamond ? 'DIAMOND' : isSapphire ? 'SAPPHIRE' : isRuby ? 'RUBY' : isGold ? 'GOLD' : 'VIP'}
                        </span>
                    )}
                    {highlightConfig && (
                        <span className={cn(
                            "text-[10px] text-black px-2 py-0.5 rounded-full font-bold bg-white/20 text-white"
                        )}>
                            HIGHLIGHT
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
