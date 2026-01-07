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

interface PremiumAdGridProps {
    itemsPerRow?: number;
    maxItems?: number;
    isEditMode?: boolean;
}

const PremiumAdGrid: React.FC<PremiumAdGridProps> = ({
    itemsPerRow,
    maxItems = 24,
    isEditMode = false
}) => {
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
                        limit: maxItems
                    });
                    setApiAds(ads as unknown as AdData[]);
                } catch (error) {
                    console.error('Failed to load ads from API:', error);
                }
            }
        };
        loadAds();
    }, [useSampleData, maxItems]);

    // ... (data source logic) ...

    // Determine data source based on mode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sourceAds: any[];
    if (useSampleData) {
        sourceAds = sampleVipAds;
    } else if (USE_API_ADS && apiAds.length > 0) {
        sourceAds = apiAds;
    } else if (USE_API_ADS) {
        sourceAds = apiAds;
    } else {
        sourceAds = vipAds;
    }

    // Filter ads that have valid thumbnails (not empty)
    const adsWithThumbnails = sourceAds.filter(ad =>
        ad.thumbnail &&
        ad.thumbnail.trim() !== ''
    );

    const gridStyle = itemsPerRow
        ? { gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))` }
        : undefined;

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
                <Link to="/search?productType=vip" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div
                className={`grid gap-2 sm:gap-3 ${!itemsPerRow ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : ''}`}
                style={gridStyle}
            >
                {adsWithThumbnails.slice(0, maxItems).map((ad) => (
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
                        isEditMode={isEditMode}
                    />
                ))}
            </div>
        </section>
    );
};

export default PremiumAdGrid;

