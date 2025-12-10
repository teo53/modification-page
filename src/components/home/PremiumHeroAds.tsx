import React from 'react';
import { MapPin, DollarSign, Clock, Crown, Gem, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Tier configuration - each with distinct design
const tierConfig = {
    diamond: {
        name: 'DIAMOND',
        korean: '다이아몬드',
        price: '월 500만원',
        duration: '30일',
        borderGradient: 'linear-gradient(135deg, #fff 0%, #a5f3fc 30%, #fff 50%, #67e8f9 70%, #fff 100%)',
        glowColor: 'rgba(255, 255, 255, 0.6)',
        badgeBg: 'bg-gradient-to-r from-white via-cyan-100 to-white',
        badgeText: 'text-gray-900',
        cardBg: 'from-[#1a1a2e] via-[#16162a] to-[#0f0f1a]',
        iconColor: 'text-cyan-200',
        count: 2,
    },
    sapphire: {
        name: 'SAPPHIRE',
        korean: '사파이어',
        price: '월 300만원',
        duration: '30일',
        borderGradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 30%, #93c5fd 50%, #60a5fa 70%, #3b82f6 100%)',
        glowColor: 'rgba(59, 130, 246, 0.5)',
        badgeBg: 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500',
        badgeText: 'text-white',
        cardBg: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]',
        iconColor: 'text-blue-400',
        count: 3,
    },
    ruby: {
        name: 'RUBY',
        korean: '루비',
        price: '월 200만원',
        duration: '30일',
        borderGradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 30%, #fca5a5 50%, #f87171 70%, #ef4444 100%)',
        glowColor: 'rgba(239, 68, 68, 0.5)',
        badgeBg: 'bg-gradient-to-r from-red-500 via-rose-400 to-red-500',
        badgeText: 'text-white',
        cardBg: 'from-[#1a0a0a] via-[#2a1515] to-[#1a0a0a]',
        iconColor: 'text-rose-400',
        count: 4,
    },
    gold: {
        name: 'GOLD',
        korean: '골드',
        price: '월 100만원',
        duration: '30일',
        borderGradient: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 30%, #fef08a 50%, #fcd34d 70%, #fbbf24 100%)',
        glowColor: 'rgba(251, 191, 36, 0.5)',
        badgeBg: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500',
        badgeText: 'text-gray-900',
        cardBg: 'from-[#1a1508] via-[#2a2010] to-[#1a1508]',
        iconColor: 'text-amber-400',
        count: 5,
    },
};

type TierType = keyof typeof tierConfig;

interface PremiumAd {
    id: string;
    tier: TierType;
    businessName: string;
    title: string;
    location: string;
    salary: string;
    workHours: string;
}

// Generate sample ads for each tier
const generateAds = (): PremiumAd[] => {
    const ads: PremiumAd[] = [];
    const sampleData = {
        diamond: [
            { businessName: '청담 다이아몬드', title: '최상위 VIP 룸살롱 정규직', location: '청담동', salary: '일 200만~', workHours: '협의' },
            { businessName: '압구정 크리스탈', title: '하이엔드 프라이빗 클럽', location: '압구정', salary: '일 150만~', workHours: '협의' },
        ],
        sapphire: [
            { businessName: '강남 사파이어', title: 'VIP 라운지 신규 오픈', location: '강남역', salary: '일 100만~200만', workHours: '저녁' },
            { businessName: '역삼 블루', title: '프리미엄 룸살롱 급구', location: '역삼역', salary: '일 80만~150만', workHours: '협의' },
            { businessName: '선릉 아쿠아', title: '하이엔드 클럽 모집', location: '선릉역', salary: '일 90만~', workHours: '저녁' },
        ],
        ruby: [
            { businessName: '홍대 루비', title: '프리미엄 가라오케 모집', location: '홍대입구', salary: '일 70만~120만', workHours: '저녁' },
            { businessName: '신촌 로제', title: '신규 오픈 라운지', location: '신촌역', salary: '일 60만~100만', workHours: '협의' },
            { businessName: '이태원 레드', title: 'VIP 클럽 정규직', location: '이태원', salary: '일 80만~', workHours: '밤' },
            { businessName: '건대 크림슨', title: '프리미엄 노래방', location: '건대입구', salary: '일 50만~90만', workHours: '저녁' },
        ],
        gold: [
            { businessName: '강남 골드', title: '업소 직원 모집', location: '강남역', salary: '일 50만~100만', workHours: '협의' },
            { businessName: '신사 엠버', title: '프리미엄 업소 급구', location: '신사역', salary: '일 40만~80만', workHours: '저녁' },
            { businessName: '논현 선샤인', title: '라운지 신규 오픈', location: '논현역', salary: '일 50만~', workHours: '협의' },
            { businessName: '삼성 골든', title: '클럽 스태프 모집', location: '삼성역', salary: '일 45만~85만', workHours: '밤' },
            { businessName: '잠실 오로라', title: '룸살롱 정규직', location: '잠실역', salary: '일 55만~', workHours: '저녁' },
        ],
    };

    Object.entries(sampleData).forEach(([tier, data]) => {
        data.forEach((ad, idx) => {
            ads.push({ id: `${tier}-${idx + 1}`, tier: tier as TierType, ...ad });
        });
    });

    return ads;
};

const allAds = generateAds();

// Individual Card Component with tier-specific styling
const PremiumCard: React.FC<{ ad: PremiumAd; tierKey: TierType }> = ({ ad, tierKey }) => {
    const tier = tierConfig[tierKey];

    return (
        <Link
            to={`/ad/${ad.id}`}
            className="premium-card group relative block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            style={{
                '--glow': tier.glowColor,
                '--border-gradient': tier.borderGradient,
            } as React.CSSProperties}
        >
            {/* Animated Border */}
            <div className="absolute inset-0 p-[2px] rounded-xl overflow-hidden">
                <div
                    className="absolute inset-0 animate-border-flow"
                    style={{ background: tier.borderGradient, backgroundSize: '200% 200%' }}
                />
                {/* Smoke Effect */}
                <div className="smoke-layer absolute inset-0 opacity-60" />
            </div>

            {/* Card Inner */}
            <div className={`relative bg-gradient-to-br ${tier.cardBg} rounded-xl m-[2px] p-4`}>
                {/* Badge */}
                <div className={`absolute top-3 right-3 ${tier.badgeBg} ${tier.badgeText} px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-lg`}>
                    {tierKey === 'diamond' && <Sparkles size={12} />}
                    {tierKey === 'sapphire' && <Gem size={12} />}
                    {tierKey === 'ruby' && <Gem size={12} />}
                    {tierKey === 'gold' && <Crown size={12} />}
                    {tier.name}
                </div>

                <div className="flex items-center gap-4">
                    {/* Logo Circle */}
                    <div
                        className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-2"
                        style={{ borderColor: tier.glowColor, background: 'rgba(255,255,255,0.05)' }}
                    >
                        <span className="text-white/50 text-sm font-medium">LOGO</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-4">
                        <h3 className="text-base font-bold text-white truncate mb-0.5 group-hover:text-amber-300 transition-colors">
                            {ad.title}
                        </h3>
                        <p className="text-white/60 text-sm mb-2">{ad.businessName}</p>

                        <div className="flex flex-wrap gap-3 text-xs">
                            <span className={`flex items-center gap-1 ${tier.iconColor}`}>
                                <MapPin size={12} /> {ad.location}
                            </span>
                            <span className={`flex items-center gap-1 ${tier.iconColor}`}>
                                <DollarSign size={12} /> {ad.salary}
                            </span>
                            <span className={`flex items-center gap-1 ${tier.iconColor}`}>
                                <Clock size={12} /> {ad.workHours}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// Tier Section Component
const TierSection: React.FC<{ tierKey: TierType }> = ({ tierKey }) => {
    const tier = tierConfig[tierKey];
    const tierAds = allAds.filter(ad => ad.tier === tierKey);

    // Grid columns based on tier count
    const gridClass = {
        diamond: 'grid-cols-1 md:grid-cols-2',
        sapphire: 'grid-cols-1 md:grid-cols-3',
        ruby: 'grid-cols-2 md:grid-cols-4',
        gold: 'grid-cols-2 md:grid-cols-5',
    }[tierKey];

    return (
        <div className="mb-8">
            {/* Tier Header */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className={`${tier.badgeBg} ${tier.badgeText} px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg`}
                    style={{ boxShadow: `0 0 20px ${tier.glowColor}` }}
                >
                    {tierKey === 'diamond' && <Sparkles size={16} />}
                    {tierKey === 'sapphire' && <Gem size={16} />}
                    {tierKey === 'ruby' && <Gem size={16} />}
                    {tierKey === 'gold' && <Crown size={16} />}
                    {tier.korean}
                </div>
                <span className="text-white/40 text-sm">{tier.price} / {tier.duration}</span>
            </div>

            {/* Cards Grid */}
            <div className={`grid ${gridClass} gap-4`}>
                {tierAds.map(ad => (
                    <PremiumCard key={ad.id} ad={ad} tierKey={tierKey} />
                ))}
            </div>
        </div>
    );
};

const PremiumHeroAds: React.FC = () => {
    return (
        <section className="premium-hero relative overflow-hidden min-h-screen">
            {/* Flowing Velvet Background */}
            <div className="velvet-bg absolute inset-0">
                <div className="velvet-layer-1" />
                <div className="velvet-layer-2" />
                <div className="velvet-layer-3" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
                {/* Section Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                            Premium Recruitment
                        </span>
                    </h1>
                    <p className="text-white/50">최상위 프리미엄 채용공고</p>
                </div>

                {/* All Tier Sections */}
                <TierSection tierKey="diamond" />
                <TierSection tierKey="sapphire" />
                <TierSection tierKey="ruby" />
                <TierSection tierKey="gold" />
            </div>

            {/* Animated Styles */}
            <style>{`
                /* Velvet Background Layers */
                .velvet-bg {
                    background: linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #1a0a2e 60%, #0d0518 100%);
                }
                
                .velvet-layer-1, .velvet-layer-2, .velvet-layer-3 {
                    position: absolute;
                    inset: 0;
                    opacity: 0.6;
                }
                
                .velvet-layer-1 {
                    background: 
                        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 40% at 80% 60%, rgba(168, 85, 247, 0.25) 0%, transparent 50%);
                    animation: velvet-flow-1 15s ease-in-out infinite;
                }
                
                .velvet-layer-2 {
                    background: 
                        radial-gradient(ellipse 70% 60% at 60% 30%, rgba(124, 58, 237, 0.2) 0%, transparent 50%),
                        radial-gradient(ellipse 50% 50% at 30% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
                    animation: velvet-flow-2 20s ease-in-out infinite;
                }
                
                .velvet-layer-3 {
                    background: 
                        radial-gradient(ellipse 100% 80% at 50% 50%, rgba(91, 33, 182, 0.1) 0%, transparent 60%);
                    animation: velvet-flow-3 25s ease-in-out infinite;
                }
                
                @keyframes velvet-flow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -20px) scale(1.05); }
                    66% { transform: translate(-20px, 30px) scale(0.98); }
                }
                
                @keyframes velvet-flow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                    50% { transform: translate(-40px, 20px) scale(1.1); opacity: 0.8; }
                }
                
                @keyframes velvet-flow-3 {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.15) rotate(3deg); }
                }

                /* Card Border Animation */
                @keyframes border-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .animate-border-flow {
                    animation: border-flow 3s ease-in-out infinite;
                }

                /* Smoke Effect */
                .smoke-layer {
                    background: 
                        radial-gradient(ellipse at 10% 20%, var(--glow) 0%, transparent 50%),
                        radial-gradient(ellipse at 90% 80%, var(--glow) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 40%);
                    animation: smoke-move 4s ease-in-out infinite alternate;
                }
                
                @keyframes smoke-move {
                    0% { transform: translateX(-5px) scale(1); opacity: 0.4; }
                    100% { transform: translateX(5px) scale(1.05); opacity: 0.7; }
                }

                /* Card Hover Glow */
                .premium-card {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    transition: box-shadow 0.3s ease;
                }
                
                .premium-card:hover {
                    box-shadow: 0 8px 40px var(--glow);
                }
                
                .premium-card:hover .smoke-layer {
                    animation-duration: 2s;
                    opacity: 1;
                }
            `}</style>
        </section>
    );
};

export default PremiumHeroAds;
