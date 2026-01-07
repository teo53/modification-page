import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ad/AdCard';
import { regularAds } from '../../data/mockAds';
import { sampleRegularAds } from '../../data/sampleAds';
import { useDataMode } from '../../contexts/DataModeContext';

// Filter ads that have valid thumbnails (not empty, not default placeholder)
const realAdsWithThumbnails = regularAds.filter(ad =>
    ad.thumbnail &&
    ad.thumbnail.trim() !== '' &&
    !ad.thumbnail.includes('mobile_img/banner')
);

const RegularAdList: React.FC = () => {
    const { useSampleData } = useDataMode();

    // Use sample or real data based on toggle
    const adsToDisplay = useSampleData ? sampleRegularAds : realAdsWithThumbnails;

    return (
        <section className="py-6 container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">최신 등록 광고</h2>
                    {useSampleData && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">샘플</span>
                    )}
                </div>
                <Link to="/search" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {adsToDisplay.slice(0, 24).map((ad) => (
                    <AdCard
                        key={ad.id}
                        id={ad.id}
                        variant="regular"
                        title={ad.title}
                        location={ad.location}
                        pay={ad.pay}
                        image={ad.thumbnail}
                        badges={ad.badges}
                        isNew={ad.isNew}
                        productType={ad.productType}
                    />
                ))}
            </div>
        </section>
    );
};

export default RegularAdList;
