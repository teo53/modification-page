import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ad/AdCard';
import { vipAds } from '../../data/mockAds';
import { sampleVipAds } from '../../data/sampleAds';
import { useDataMode } from '../../contexts/DataModeContext';
import { USE_API_ADS, fetchAdsFromApi } from '../../utils/adStorage';

interface AdData {
    id: string;
    title: string;
    location: string;
    pay?: string;
    salary?: string;
    thumbnail?: string;
    badges?: string[];
    isNew?: boolean;
    isHot?: boolean;
    productType?: string;
}

const PremiumAdGrid: React.FC = () => {
    const { useSampleData } = useDataMode();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [apiAds, setApiAds] = useState<AdData[]>([]);

    useEffect(() => {
        const loadAds = async () => {
            if (USE_API_ADS && !useSampleData) {
                try {
                    const { ads } = await fetchAdsFromApi({
                        status: 'active',
                        productType: 'vip',
                        limit: 12
                    });
                    setApiAds(ads as unknown as AdData[]);
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
        : (useSampleData ? sampleVipAds : vipAds);

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
                        pay={ad.pay || ad.salary}
                        image={ad.thumbnail}
                        badges={ad.badges}
                        isNew={ad.isNew}
                        isHot={ad.isHot}
                        productType={ad.productType}
                    />
                ))}
            </div>
        </section>
    );
};

export default PremiumAdGrid;

