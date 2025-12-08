import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ui/AdCard';
import { regularAds } from '../../data/mockAds';

// Expand 2 real crawled regular ads to 48 by repeating
const regularGridAds = Array(48).fill(null).map((_, i) => {
    const sourceAd = regularAds[i % regularAds.length];
    return {
        ...sourceAd,
        key={ ad.id }
                        variant="regular"
                        title={ ad.title }
                        location={ ad.location }
                        pay={ ad.pay }
                        image={ ad.thumbnail }
                        badges={ ad.badges }
                        isNew={ ad.isNew }
                        price={ ad.price }
                        duration={ ad.duration }
                        productType={ ad.productType }
        />
                ))}
            </div >
        </section >
    );
};

export default RegularAdList;
