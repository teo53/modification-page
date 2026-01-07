import React from 'react';
import { MapPin, Heart, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

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
    isNew,
    isHot,
    productType,
}) => {
    const isDiamond = variant === 'diamond' || productType === 'diamond';
    const isSapphire = variant === 'sapphire' || productType === 'sapphire';
    const isRuby = variant === 'ruby' || productType === 'ruby';
    const isGold = variant === 'gold' || productType === 'gold';
    const isVip = variant === 'vip' || productType === 'vip';
    const isSpecial = variant === 'special' || productType === 'special';
    const isPremium = variant === 'premium' || productType === 'premium';
    const isPaid = isDiamond || isSapphire || isRuby || isGold || isVip || isSpecial || isPremium;

    // Stable ad duration based on ID (not random)
    const numericId = typeof id === 'string' ? parseInt(id, 10) || 1 : id;
    const daysRunning = ((numericId * 7) % 28) + 3;

    return (
        <Link
            to={`/ad/${id}`}
            className={cn(
                "block group relative overflow-hidden rounded-xl bg-card",
                isDiamond && "border-2 border-cyan-400",
                isSapphire && "border-2 border-blue-500",
                isRuby && "border-2 border-red-500",
                isGold && "border-2 border-yellow-400",
                isVip && "border-2 border-primary",
                isSpecial && "border-2 border-purple-500",
                isPremium && "border border-primary/30",
                variant === 'regular' && !isPaid && "border border-border"
            )}
        >
            {/* Image Section - compact height for 2-column grid */}
            <div className="relative overflow-hidden h-24">
                {image ? (
                    <>
                        <img
                            src={image}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement?.classList.add('bg-gradient-to-br', 'from-surface', 'to-accent');
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface to-accent flex items-center justify-center">
                        <div className="text-border text-2xl font-bold opacity-30">
                            LUNA
                        </div>
                    </div>
                )}

                {/* Tier Badge */}
                {isPaid && (
                    <div className={cn(
                        "absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold",
                        isDiamond && "bg-cyan-400 text-black",
                        isSapphire && "bg-blue-500 text-white",
                        isRuby && "bg-red-500 text-white",
                        isGold && "bg-yellow-400 text-black",
                        isVip && "bg-primary text-white",
                        isSpecial && "bg-purple-500 text-white",
                        isPremium && "bg-blue-500 text-white"
                    )}>
                        {isDiamond ? 'DIAMOND' : isSapphire ? 'SAPPHIRE' : isRuby ? 'RUBY' : isGold ? 'GOLD' : isVip ? 'VIP' : isSpecial ? 'SPECIAL' : 'PREMIUM'}
                    </div>
                )}

                {/* NEW/HOT badges */}
                {!isPaid && (isNew || isHot) && (
                    <div className="absolute top-2 left-2 flex gap-1">
                        {isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>}
                        {isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>}
                    </div>
                )}

                {/* Heart button */}
                <button
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white/70 flex items-center justify-center"
                    aria-label="관심 공고 추가"
                    onClick={(e) => e.preventDefault()}
                >
                    <Heart size={14} />
                </button>

                {/* Pay overlay */}
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded">
                    <span className="text-white text-xs font-bold">{pay}</span>
                </div>
            </div>

            {/* Content Section - compact */}
            <div className="p-2">
                <h3 className="font-bold text-text-main text-xs line-clamp-2 min-h-[32px] mb-1">
                    {title}
                </h3>

                <div className="flex items-center gap-1 text-[10px] text-text-muted mb-1">
                    <MapPin size={10} />
                    <span className="truncate">{location}</span>
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
        </Link>
    );
};

export default AdCard;
