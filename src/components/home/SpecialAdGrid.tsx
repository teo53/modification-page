import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ad/AdCard';
import { specialAds } from '../../data/mockAds';
import { sampleSpecialAds } from '../../data/sampleAds';
import { useDataMode } from '../../contexts/DataModeContext';

const SpecialAdGrid: React.FC = () => {
    const { useSampleData } = useDataMode();

    // Use sample data or real data based on admin toggle
    const sourceAds = useSampleData ? sampleSpecialAds : specialAds;

    // Filter ads that have valid thumbnails (not empty)
    const adsWithThumbnails = sourceAds.filter(ad =>
        ad.thumbnail &&
        ad.thumbnail.trim() !== ''
    );

    return (
        <section className="py-6 bg-accent/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-secondary">SPECIAL</span> 스페셜 광고
                        {useSampleData && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full ml-2">
                                샘플
                            </span>
                        )}
                    </h2>
                    <Link to="/theme" className="text-sm text-text-muted hover:text-secondary">더보기 +</Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {adsWithThumbnails.slice(0, 12).map((ad) => (
                        <AdCard
                            key={ad.id}
                            id={ad.id}
                            variant="special"
                            title={ad.title}
                            location={ad.location}
                            pay={ad.pay}
                            image={ad.thumbnail}
                            badges={ad.badges}
                            isNew={ad.isNew}
                            price={ad.price}
                            duration={ad.duration}
                            productType={ad.productType}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialAdGrid;
