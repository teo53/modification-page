import React from 'react';
import { MapPin, DollarSign, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

interface AdCardProps {
    id?: number | string;
    variant?: 'vip' | 'special' | 'premium' | 'regular';
    title: string;
    location: string;
    pay: string;
    image: string;
    badges?: string[];
    isNew?: boolean;
    isHot?: boolean;
    price?: string;
    duration?: string;
    productType?: 'vip' | 'special' | 'premium' | 'general';
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
    const isVip = variant === 'vip';
    const isSpecial = variant === 'special';
    const isPremium = variant === 'premium';

    return (
        <Link
            to={`/ad/${id}`}
            className={cn(
                "block group relative overflow-hidden rounded-xl bg-accent transition-all duration-300 hover:-translate-y-1",
                isVip && "border-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]",
                isSpecial && "border-2 border-secondary shadow-[0_0_15px_rgba(255,0,127,0.3)]",
                isPremium && "border border-white/20",
                variant === 'regular' && "border border-white/5 hover:border-white/20"
            )}
        >
            {/* Image Section */}
            <div className={cn("relative overflow-hidden", isVip ? "h-48" : "h-40")}>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

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
                <h3 className={cn(
                    "font-bold truncate mb-1",
                    isVip ? "text-lg text-primary" : isSpecial ? "text-base text-secondary" : "text-sm text-white"
                )}>
                    {title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
                    <MapPin size={12} />
                    <span className="truncate">{location}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-white font-bold">
                        <DollarSign size={14} className="text-primary" />
                        <span>{pay}</span>
                    </div>
                    {isVip && (
                        <span className="text-[10px] text-black bg-primary px-2 py-0.5 rounded-full font-bold">
                            VIP
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
                                    productType === 'vip' && "bg-yellow-400 text-black",
                                    productType === 'special' && "bg-blue-400 text-white",
                                    productType === 'premium' && "bg-purple-400 text-white",
                                    productType === 'general' && "bg-gray-400 text-white"
                                )}>
                                    {productType === 'vip' && 'VIP'}
                                    {productType === 'special' && 'SPECIAL'}
                                    {productType === 'premium' && 'PREMIUM'}
                                    {productType === 'general' && 'GENERAL'}
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
