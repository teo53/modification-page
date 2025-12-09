import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ui/AdCard';
import { vipAds } from '../../data/mockAds';

// Use all 12 VIP ads directly from scraped data

const PremiumAdGrid: React.FC = () => {
    return (
        <section className="py-6 container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-primary">VIP</span> 프리미엄 광고
                </h2>
                <Link to="/theme" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {vipAds.map((ad) => (
                    <AdCard
                        key={ad.id}
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
