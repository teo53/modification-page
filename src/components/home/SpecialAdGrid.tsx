import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../ui/AdCard';
import { specialAds } from '../../data/mockAds';

// Expand 2 real crawled special ads to 24 by repeating
const specialGridAds = Array(24).fill(null).map((_, i) => {
    const sourceAd = specialAds[i % specialAds.length];
    return {
        ...sourceAd,
        variant="special"
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
            </div >
        </section >
    );
};

export default SpecialAdGrid;
