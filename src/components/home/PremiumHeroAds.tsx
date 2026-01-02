import React from 'react';
import PremiumModernBanner from './PremiumModernBanner';

// Tier configuration
const tierConfig = {
    diamond: { name: 'DIAMOND', count: 2 },
    sapphire: { name: 'SAPPHIRE', count: 3 },
    ruby: { name: 'RUBY', count: 4 },
    gold: { name: 'GOLD', count: 5 },
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

// Generate sample ads
const generateAds = (): PremiumAd[] => {
    const ads: PremiumAd[] = [];
    const sampleData = {
        diamond: [
            { businessName: '청담 다이아몬드', title: '최상위 VIP 룸살롱 정규직', location: '청담동', salary: '일 200만~', workHours: '협의' },
            { businessName: '압구정 크리스탈', title: '하이엔드 프라이빗 클럽', location: '압구정', salary: '일 150만~', workHours: '협의' },
        ],
        sapphire: [
            { businessName: '강남 사파이어', title: 'VIP 라운지 신규 오픈', location: '강남역', salary: '일 100만~', workHours: '저녁' },
            { businessName: '역삼 블루', title: '프리미엄 룸살롱 급구', location: '역삼역', salary: '일 80만~', workHours: '협의' },
            { businessName: '선릉 아쿠아', title: '하이엔드 클럽 모집', location: '선릉역', salary: '일 90만~', workHours: '저녁' },
        ],
        ruby: [
            { businessName: '홍대 루비', title: '프리미엄 가라오케 모집', location: '홍대입구', salary: '일 70만~', workHours: '저녁' },
            { businessName: '신촌 로제', title: '신규 오픈 라운지', location: '신촌역', salary: '일 60만~', workHours: '협의' },
            { businessName: '이태원 레드', title: 'VIP 클럽 정규직', location: '이태원', salary: '일 80만~', workHours: '밤' },
            { businessName: '건대 크림슨', title: '프리미엄 노래방', location: '건대입구', salary: '일 50만~', workHours: '저녁' },
        ],
        gold: [
            { businessName: '강남 골드', title: '업소 직원 모집', location: '강남역', salary: '일 50만~', workHours: '협의' },
            { businessName: '신사 엠버', title: '프리미엄 업소 급구', location: '신사역', salary: '일 40만~', workHours: '저녁' },
            { businessName: '논현 선샤인', title: '라운지 신규 오픈', location: '논현역', salary: '일 50만~', workHours: '협의' },
            { businessName: '삼성 골든', title: '클럽 스태프 모집', location: '삼성역', salary: '일 45만~', workHours: '밤' },
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

const TierSection: React.FC<{ tierKey: TierType }> = ({ tierKey }) => {
    const tier = tierConfig[tierKey];
    const tierAds = allAds.filter(ad => ad.tier === tierKey);

    // Adjusted Grid Layout for Larger Banners
    // Desktop: 2 columns (Diamond/Sapphire/Ruby)
    // Gold can be 2 columns too.
    // Layout notes: Desktop 2 columns for large banners

    // For Sapphire (3 items), displaying 3 in 2 columns leaves a gap. 
    // Maybe grid-cols-1 lg:grid-cols-2 xl:grid-cols-2? 
    // Or just flex wrap? Let's use grid-cols-1 xl:grid-cols-2 for consistent large banners.

    return (
        <div className="mb-12">
            <h3 className="text-white/30 text-sm font-bold tracking-[0.2em] mb-4 uppercase flex items-center gap-4">
                <span className="h-px bg-card/10 flex-1"></span>
                {tier.name} TIER
                <span className="h-px bg-card/10 flex-1"></span>
            </h3>
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6`}>
                {tierAds.map(ad => (
                    <PremiumModernBanner
                        key={ad.id}
                        id={ad.id}
                        tier={tierKey}
                        title={ad.title}
                        location={ad.location}
                        salary={ad.salary}
                        workHours={ad.workHours}
                        businessName={ad.businessName}
                    />
                ))}
            </div>
        </div>
    );
};

const PremiumHeroAds: React.FC = () => {
    return (
        <section className="bg-gradient-to-b from-[#050505] via-[#110518] to-[#1a0b2e] min-h-screen pt-12 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
                        Premium Recruitment
                    </h1>
                    <p className="text-white/40 tracking-widest text-sm">최상위 1%를 위한 프리미엄 채용관</p>
                </div>

                <TierSection tierKey="diamond" />
                <TierSection tierKey="sapphire" />
                <TierSection tierKey="ruby" />
                <TierSection tierKey="gold" />
            </div>
        </section>
    );
};

export default PremiumHeroAds;
