import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Gem, ChevronRight } from 'lucide-react';
import { jewelAds } from '../../data/mockAds';
import type { Advertisement } from '../../data/mockAds';

// Jewel tier configuration
const jewelConfig = {
    diamond: {
        name: 'DIAMOND',
        gradient: 'from-cyan-400 via-cyan-300 to-cyan-500',
        border: 'border-cyan-400',
        glow: 'shadow-[0_0_30px_rgba(34,211,238,0.4)]',
        bg: 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10',
        textColor: 'text-cyan-400',
        iconColor: 'text-cyan-300',
    },
    sapphire: {
        name: 'SAPPHIRE',
        gradient: 'from-blue-500 via-blue-400 to-blue-600',
        border: 'border-blue-500',
        glow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]',
        bg: 'bg-gradient-to-r from-blue-500/20 to-blue-400/10',
        textColor: 'text-blue-400',
        iconColor: 'text-blue-300',
    },
    ruby: {
        name: 'RUBY',
        gradient: 'from-red-500 via-red-400 to-red-600',
        border: 'border-red-500',
        glow: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]',
        bg: 'bg-gradient-to-r from-red-500/20 to-red-400/10',
        textColor: 'text-red-400',
        iconColor: 'text-red-300',
    },
    gold: {
        name: 'GOLD',
        gradient: 'from-yellow-500 via-amber-400 to-yellow-600',
        border: 'border-yellow-500',
        glow: 'shadow-[0_0_25px_rgba(234,179,8,0.4)]',
        bg: 'bg-gradient-to-r from-yellow-500/20 to-amber-400/10',
        textColor: 'text-yellow-400',
        iconColor: 'text-yellow-300',
    },
};

interface JewelAdCardProps {
    ad: Advertisement;
    index: number;
}

const JewelAdCard: React.FC<JewelAdCardProps> = ({ ad, index }) => {
    const tier = ad.productType as keyof typeof jewelConfig;
    const config = jewelConfig[tier] || jewelConfig.gold;

    return (
        <Link to={`/ad/${ad.id}`} className="block flex-shrink-0 w-[200px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl overflow-hidden ${config.glow} border-2 ${config.border}`}
            >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-xl">
                    <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20`} />
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{
                            animation: 'shimmer 3s ease-in-out infinite',
                            backgroundSize: '200% 100%',
                        }}
                    />
                </div>

                {/* Image */}
                <div className="relative h-28">
                    <img
                        src={ad.thumbnail}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Tier Badge */}
                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-black text-xs font-black`}>
                        <Gem size={12} />
                        {config.name}
                    </div>

                    {/* Rank */}
                    <div className={`absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center ${config.textColor} font-bold text-sm border ${config.border}`}>
                        {index + 1}
                    </div>

                    {/* Pay Overlay */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
                        <DollarSign size={12} className={config.iconColor} />
                        <span className="text-white text-xs font-bold">{ad.pay}</span>
                    </div>
                </div>

                {/* Content */}
                <div className={`p-3 bg-gradient-to-b from-black to-gray-900`}>
                    <h3 className="font-bold text-white text-xs line-clamp-2 min-h-[32px] mb-1">
                        {ad.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                        <MapPin size={10} className={config.iconColor} />
                        <span className="truncate">{ad.location}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

const JewelAdSection: React.FC = () => {
    return (
        <section className="py-4 bg-gradient-to-b from-black via-gray-900 to-background">
            {/* Section Header */}
            <div className="px-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30">
                            <Gem size={20} className="text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                PREMIUM JEWEL
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                                    TOP
                                </span>
                            </h2>
                            <p className="text-xs text-gray-400">최상위 프리미엄 광고</p>
                        </div>
                    </div>
                    <Link to="/search?tier=jewel" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                        전체보기
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Jewel Cards Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                {jewelAds.map((ad, idx) => (
                    <JewelAdCard key={ad.id} ad={ad} index={idx} />
                ))}
            </div>

            {/* Shimmer Animation CSS */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </section>
    );
};

export default JewelAdSection;
