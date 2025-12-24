import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ad/AdCard';
import { specialAds } from '../../data/mockAds';
import { sampleSpecialAds } from '../../data/sampleAds';
import { useDataMode } from '../../contexts/DataModeContext';
import { USE_API_ADS, fetchAdsFromApi } from '../../utils/adStorage';

const SpecialAdGrid: React.FC = () => {
    const { useSampleData } = useDataMode();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [apiAds, setApiAds] = useState<any[]>([]);

    useEffect(() => {
        const loadAds = async () => {
            if (USE_API_ADS && !useSampleData) {
                try {
                    const { ads } = await fetchAdsFromApi({
                        status: 'active',
                        productType: 'special',
                        limit: 12
                    });
                    setApiAds(ads);
                } catch (error) {
                    console.error('Failed to load ads from API:', error);
                }
            }
        };
        loadAds();
    }, [useSampleData]);

    // Determine data source: API > Sample > Mock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sourceAds: any[] = USE_API_ADS && !useSampleData && apiAds.length > 0
        ? apiAds
        : (useSampleData ? sampleSpecialAds : specialAds);

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
                            id={String(ad.id)}
                            variant="special"
                            title={ad.title}
                            location={ad.location}
                            pay={ad.pay || ad.salary}
                            image={ad.thumbnail}
                            badges={ad.badges}
                            isNew={ad.isNew}
                            productType={ad.productType}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialAdGrid;

