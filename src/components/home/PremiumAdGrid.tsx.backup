import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ui/AdCard';
import { vipAds } from '../../data/mockAds';

// Expand 2 real crawled VIP ads to 24 by repeating
const premiumAds = Array(24).fill(null).map((_, i) => {
    const sourceAd = vipAds[i % vipAds.length];
    return {
        ...sourceAd,
        variant="vip"
                        title={ ad.title }
                        location={ ad.location }
                        pay={ ad.pay }
                        image={ ad.thumbnail }
                        badges={ ad.badges }
                        isNew={ ad.isNew }
                        isHot={ ad.isHot }
                        price={ ad.price }
                        duration={ ad.duration }
                        productType={ ad.productType }
        />
                ))}
            </div >
        </section >
    );
};

export default PremiumAdGrid;
