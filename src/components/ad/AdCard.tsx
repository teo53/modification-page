import React from 'react';
import { MapPin, DollarSign, Heart } from 'lucide-react';
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

    return (
        <Link
            to={`/ad/${id}`}
            className={cn(
                "block group relative overflow-hidden rounded-xl bg-card transition-all duration-300 hover:-translate-y-1 shadow-sm",
                isDiamond && "border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]",
                isSapphire && "border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
                isRuby && "border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
                isGold && "border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]",
                isVip && "border-2 border-primary shadow-[0_0_15px_rgba(255,107,53,0.2)]",
                isSpecial && "border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
                isPremium && "border border-primary/30",
                variant === 'regular' && "border border-border hover:border-primary/30"
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
                    <div className="w-full h-full bg-gradient-to-br from-surface to-accent flex items-center justify-center">
                        <div className="text-border text-4xl font-bold opacity-30">
                            LUNA
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                    {isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>}
                    {isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>}
                    {badges.map((badge, i) => (
                        <span key={i} className="bg-card/20 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded">
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
                <h3 className={cn(
                    "font-bold truncate mb-1",
                    isDiamond ? "text-lg text-cyan-600" :
                        isSapphire ? "text-lg text-blue-600" :
                            isRuby ? "text-lg text-red-600" :
                                isGold ? "text-lg text-yellow-600" :
                                    isVip ? "text-lg text-primary" :
                                        isSpecial ? "text-base text-purple-600" :
                                            "text-sm text-text-main"
                )}>
                    {title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
                    <MapPin size={12} />
                    <span className="truncate">{location}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-text-main font-bold">
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
                    <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                {duration && <span className="text-[10px] text-text-muted">노출기간: {duration}</span>}
                                {price && <span className="text-xs text-text-main font-bold">{price}/월</span>}
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
