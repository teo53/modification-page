import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ad/AdCard';
import { regularAds } from '../../data/mockAds';

// Filter ads that have valid thumbnails (not empty, not default placeholder)
const adsWithThumbnails = regularAds.filter(ad =>
    ad.thumbnail &&
    ad.thumbnail.trim() !== '' &&
    !ad.thumbnail.includes('mobile_img/banner')
);

const RegularAdList: React.FC = () => {
    return (
        <section className="py-6 container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">최신 등록 광고</h2>
                <Link to="/search" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {adsWithThumbnails.slice(0, 24).map((ad) => (
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
                        price={ad.price}
                        duration={ad.duration}
                        productType={ad.productType}
                    />
                ))}
            </div>
        </section>
    );
};

export default RegularAdList;

