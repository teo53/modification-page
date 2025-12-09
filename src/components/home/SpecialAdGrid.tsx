import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ui/AdCard';
import { specialAds } from '../../data/mockAds';

// Use 12 special ads from the scraped data (slice to limit display)
const displayAds = specialAds.slice(0, 12);

const SpecialAdGrid: React.FC = () => {
    return (
        <section className="py-6 bg-accent/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-secondary">SPECIAL</span> 스페셜 광고
                    </h2>
                    <Link to="/theme" className="text-sm text-text-muted hover:text-secondary">더보기 +</Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {displayAds.map((ad) => (
                        <AdCard
                            key={ad.id}
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
