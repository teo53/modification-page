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
    price?: string;
    duration?: string;
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
    price,
    duration,
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

    return (
        <Link
            to={`/ad/${id}`}
            onClick={handleClick}
            className={cn(
                "block group relative overflow-hidden rounded-xl bg-accent transition-all duration-300 hover:-translate-y-1",
                isDiamond && "border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] ad-card-diamond",
                isSapphire && "border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                isRuby && "border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
                isGold && "border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]",
                isVip && "border-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)] ad-card-vip",
                isSpecial && "border-2 border-secondary shadow-[0_0_15px_rgba(255,0,127,0.3)] ad-card-special",
                isPremium && "border border-white/20",
                variant === 'regular' && "border border-white/5 hover:border-white/20"
            )}
        >
            {/* Image Section */}
            <div className={cn("relative overflow-hidden", (isDiamond || isSapphire || isRuby || isGold || isVip) ? "h-48" : "h-40")}>
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
            <div className="p-3">
                <div className="overflow-hidden">
                    <h3 className={cn(
                        "font-bold mb-1 whitespace-nowrap",
                        "hover:animate-marquee",
                        // Calculate visual width: Korean=2, English/number=1, space=0.5
                        (() => {
                            let width = 0;
                            for (const char of title) {
                                if (/[\u3131-\uD79D]/.test(char)) width += 2; // Korean
                                else if (/[a-zA-Z0-9]/.test(char)) width += 1; // English/number
                                else if (char === ' ') width += 0.5; // Space
                                else width += 1.2; // Special chars
                            }
                            return width > 18;
                        })() && "animate-marquee-hover",
                        isDiamond ? "text-lg text-cyan-400" :
                            isSapphire ? "text-lg text-blue-400" :
                                isRuby ? "text-lg text-red-400" :
                                    isGold ? "text-lg text-yellow-400" :
                                        isVip ? "text-lg text-primary" :
                                            isSpecial ? "text-base text-secondary" :
                                                "text-sm text-white"
                    )}>
                        {title}
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
                    {(isDiamond || isSapphire || isRuby || isGold || isVip) && (
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
                </div>

                {/* Pricing Info Section */}
                {(price || duration) && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                {duration && <span className="text-[10px] text-text-muted">노출기간: {duration}</span>}
                                {price && <span className="text-xs text-white font-bold">{price}/월</span>}
                            </div>
                            {productType && (
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded font-bold",
                                    productType === 'diamond' && "bg-cyan-400 text-black",
                                    productType === 'sapphire' && "bg-blue-500 text-white",
                                    productType === 'ruby' && "bg-red-500 text-white",
                                    productType === 'gold' && "bg-yellow-400 text-black",
                                    productType === 'vip' && "bg-yellow-400 text-black",
                                    productType === 'special' && "bg-blue-400 text-white",
                                    productType === 'premium' && "bg-purple-400 text-white",
                                    productType === 'highlight' && "bg-yellow-500 text-black",
                                    productType === 'jumpup' && "bg-green-500 text-white",
                                    (productType === 'general' || productType === 'regular') && "bg-gray-400 text-white"
                                )}>
                                    {productType === 'highlight' ? 'HIGHLIGHT' : productType === 'jumpup' ? 'JUMP UP' : productType.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default AdCard;
