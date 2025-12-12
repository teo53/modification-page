import React from 'react';
import PremiumModernBanner from './PremiumModernBanner';
import scrapedAdsData from '../../data/scraped_ads.json';

// Tier configuration
const tierConfig = {
    diamond: { name: 'DIAMOND', count: 2 },
    sapphire: { name: 'SAPPHIRE', count: 4 },
    ruby: { name: 'RUBY', count: 6 },
    gold: { name: 'GOLD', count: 8 },
};

type TierType = keyof typeof tierConfig;

interface ScrapedAd {
    id: number;
    title: string;
    thumbnail: string;
    location?: string;
    pay?: string;
    advertiser?: {
        nickname?: string;
        business_name?: string;
        work_location?: string;
        views?: number;
    };
    recruitment?: {
        salary?: string;
    };
}

interface TierAd {
    id: string;
    tier: TierType;
    businessName: string;
    title: string;
    location: string;
    salary: string;
    workHours: string;
}

// Filter and sort ads by views, then distribute to tiers
const validAds = (scrapedAdsData as ScrapedAd[])
    .filter(ad => ad.thumbnail && ad.thumbnail.trim() !== '' && !ad.thumbnail.includes('mobile_img/banner'))
    .sort((a, b) => (b.advertiser?.views || 0) - (a.advertiser?.views || 0));

// Skip first 3 (used by DiamondAdSection) and take next 20 for premium tiers
const premiumPoolAds = validAds.slice(3, 23);

// Distribute ads to tiers based on views ranking
const generateTierAds = (): TierAd[] => {
    const tierAds: TierAd[] = [];
    let index = 0;

    // Diamond: top 2 (indices 0-1)
    for (let i = 0; i < tierConfig.diamond.count && index < premiumPoolAds.length; i++) {
        const ad = premiumPoolAds[index++];
        tierAds.push({
            id: String(ad.id),
            tier: 'diamond',
            businessName: ad.advertiser?.business_name || ad.advertiser?.nickname || '업체명',
            title: ad.title || '광고 제목',
            location: ad.location || ad.advertiser?.work_location || '위치 미정',
            salary: ad.pay || ad.recruitment?.salary || '협의',
            workHours: '협의',
        });
    }

    // Sapphire: next 4
    for (let i = 0; i < tierConfig.sapphire.count && index < premiumPoolAds.length; i++) {
        const ad = premiumPoolAds[index++];
        tierAds.push({
            id: String(ad.id),
            tier: 'sapphire',
            businessName: ad.advertiser?.business_name || ad.advertiser?.nickname || '업체명',
            title: ad.title || '광고 제목',
            location: ad.location || ad.advertiser?.work_location || '위치 미정',
            salary: ad.pay || ad.recruitment?.salary || '협의',
            workHours: '협의',
        });
    }

    // Ruby: next 6
    for (let i = 0; i < tierConfig.ruby.count && index < premiumPoolAds.length; i++) {
        const ad = premiumPoolAds[index++];
        tierAds.push({
            id: String(ad.id),
            tier: 'ruby',
            businessName: ad.advertiser?.business_name || ad.advertiser?.nickname || '업체명',
            title: ad.title || '광고 제목',
            location: ad.location || ad.advertiser?.work_location || '위치 미정',
            salary: ad.pay || ad.recruitment?.salary || '협의',
            workHours: '협의',
        });
    }

    // Gold: next 8
    for (let i = 0; i < tierConfig.gold.count && index < premiumPoolAds.length; i++) {
        const ad = premiumPoolAds[index++];
        tierAds.push({
            id: String(ad.id),
            tier: 'gold',
            businessName: ad.advertiser?.business_name || ad.advertiser?.nickname || '업체명',
            title: ad.title || '광고 제목',
            location: ad.location || ad.advertiser?.work_location || '위치 미정',
            salary: ad.pay || ad.recruitment?.salary || '협의',
            workHours: '협의',
        });
    }

    return tierAds;
};

const allAds = generateTierAds();

const TierSection: React.FC<{ tierKey: TierType }> = ({ tierKey }) => {
    const tier = tierConfig[tierKey];
    const tierAds = allAds.filter(ad => ad.tier === tierKey);

    if (tierAds.length === 0) return null;

    return (
        <div className="mb-12">
            <h3 className="text-white/30 text-sm font-bold tracking-[0.2em] mb-4 uppercase flex items-center gap-4">
                <span className="h-px bg-white/10 flex-1"></span>
                {tier.name} TIER
                <span className="h-px bg-white/10 flex-1"></span>
            </h3>
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6`}>
                {tierAds.map((ad) => (
                    <div key={ad.id}>
                        <PremiumModernBanner
                            id={ad.id}
                            tier={tierKey}
                            title={ad.title}
                            location={ad.location}
                            salary={ad.salary}
                            workHours={ad.workHours}
                            businessName={ad.businessName}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const PremiumHeroAds: React.FC = () => {
    if (allAds.length === 0) return null;

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

