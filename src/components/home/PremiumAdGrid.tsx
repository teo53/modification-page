import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ad/AdCard';
import { vipAds } from '../../data/mockAds';
import { sampleVipAds } from '../../data/sampleAds';
import { useDataMode } from '../../contexts/DataModeContext';

const PremiumAdGrid: React.FC = () => {
    const { useSampleData } = useDataMode();

    // Use sample data or real data based on admin toggle
    const sourceAds = useSampleData ? sampleVipAds : vipAds;

    // Filter ads that have valid thumbnails (not empty)
    const adsWithThumbnails = sourceAds.filter(ad =>
        ad.thumbnail &&
        ad.thumbnail.trim() !== ''
    );

    return (
        <section className="py-6 container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-primary">VIP</span> 프리미엄 광고
                    {useSampleData && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full ml-2">
                            샘플
                        </span>
                    )}
                </h2>
                <Link to="/theme" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {adsWithThumbnails.slice(0, 12).map((ad) => (
                    <AdCard
                        key={ad.id}
                        id={ad.id}
                        variant="vip"
                        title={ad.title}
                        location={ad.location}
                        pay={ad.pay}
                        image={ad.thumbnail}
                        badges={ad.badges}
                        isNew={ad.isNew}
                        isHot={ad.isHot}
                        price={ad.price}
                        duration={ad.duration}
                        productType={ad.productType}
                    />
                ))}
            </div>
        </section>
    );
};

export default PremiumAdGrid;
