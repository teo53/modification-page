import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Gem, Calendar } from 'lucide-react';
import { jewelAds } from '../../data/mockAds';
import type { Advertisement } from '../../data/mockAds';

// Jewel tier configuration with glow effects
const jewelConfig = {
    diamond: {
        name: 'DIAMOND',
        border: 'border-cyan-400',
        bg: 'bg-cyan-400',
        textColor: 'text-cyan-400',
        glow: 'shadow-[0_0_20px_rgba(34,211,238,0.4)]',
    },
    sapphire: {
        name: 'SAPPHIRE',
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        textColor: 'text-blue-400',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    },
    ruby: {
        name: 'RUBY',
        border: 'border-red-500',
        bg: 'bg-red-500',
        textColor: 'text-red-400',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    },
    gold: {
        name: 'GOLD',
        border: 'border-yellow-500',
        bg: 'bg-yellow-500',
        textColor: 'text-yellow-400',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]',
    },
};

interface JewelAdCardProps {
    ad: Advertisement;
    index: number;
}

const JewelAdCard: React.FC<JewelAdCardProps> = ({ ad, index }) => {
    const tier = ad.productType as keyof typeof jewelConfig;
    const config = jewelConfig[tier] || jewelConfig.gold;

    // Mock ad duration (days running)
    const daysRunning = Math.floor(Math.random() * 30) + 1;

    return (
        <Link to={`/ad/${ad.id}`} className="block">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-xl overflow-hidden border-2 ${config.border} ${config.glow} bg-card`}
            >
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
                            target.style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Tier Badge */}
                    <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded ${config.bg} text-black text-[10px] font-black`}>
                        <Gem size={10} />
                        {config.name}
                    </div>

                    {/* Rank */}
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center ${config.textColor} font-bold text-xs`}>
                        {index + 1}
                    </div>

                    {/* Pay Overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded">
                        <span className="text-white text-xs font-bold">{ad.pay}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-2 bg-card">
                    <h3 className="font-bold text-text-main text-xs line-clamp-2 min-h-[32px] mb-1">
                        {ad.title}
                    </h3>
                    <div className="flex items-center gap-1 text-text-muted text-[10px] mb-1">
                        <MapPin size={10} />
                        <span className="truncate">{ad.location}</span>
                    </div>
                    {/* Ad Duration */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-text-light text-[9px]">
                            <Calendar size={9} />
                            <span>{daysRunning}일째 광고중</span>
                        </div>
                        <span className="text-[8px] text-text-light bg-surface px-1 py-0.5 rounded">AD</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

const JewelAdSection: React.FC = () => {
    return (
        <section className="py-4 bg-surface">
            {/* Section Header */}
            <div className="px-4 mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                        <Gem size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
                            PREMIUM JEWEL
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500 text-white">
                                TOP
                            </span>
                        </h2>
                        <p className="text-[10px] text-text-muted">최상위 프리미엄 광고 {jewelAds.length}개</p>
                    </div>
                </div>
            </div>

            {/* Jewel Cards - 2 Column Grid - Show ALL jewel ads */}
            <div className="px-4 grid grid-cols-2 gap-3">
                {jewelAds.map((ad, idx) => (
                    <JewelAdCard key={ad.id} ad={ad} index={idx} />
                ))}
            </div>
        </section>
    );
};

export default JewelAdSection;
