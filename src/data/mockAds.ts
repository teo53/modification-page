// Mock ad data using real crawled images from queenalba.net
// Updated to use real scraped data from scraped_ads.json

import scrapedAdsData from './scraped_ads.json';

export interface Advertisement {
    id: number;
    title: string;
    location: string;
    pay: string;
    thumbnail: string;
    images: string[];
    badges: string[];
    isNew: boolean;
    isHot: boolean;
    productType: 'vip' | 'special' | 'premium' | 'general';
    price: string;
    duration: string;
}


// Convert scraped ads to Advertisement format - Using REAL scraped data
const convertToAd = (scrapedAd: any, productType: 'vip' | 'special' | 'premium' | 'general'): Advertisement => {
    // Use actual scraped data
    const title = scrapedAd.title || scrapedAd.advertiser?.nickname || `광고 #${scrapedAd.id}`;
    const location = scrapedAd.location || scrapedAd.advertiser?.work_location || '서울';
    const pay = scrapedAd.pay || scrapedAd.recruitment?.salary || '협의';

    // Generate badges from job_type and salary
    const badges: string[] = [];
    const jobType = scrapedAd.recruitment?.job_type || '';
    const salary = scrapedAd.recruitment?.salary || '';

    // Add industry-based badges
    if (jobType.includes('룸살롱') || jobType.includes('룸싸롱')) badges.push('룸');
    if (jobType.includes('하이퍼블릭')) badges.push('하이퍼블릭');
    if (jobType.includes('텐프로')) badges.push('텐프로');
    if (jobType.includes('쩜오')) badges.push('쩜오');
    if (jobType.includes('클럽')) badges.push('클럽');
    if (jobType.includes('노래방')) badges.push('노래방');
    if (jobType.includes('바')) badges.push('바');

    // Add salary-based badges
    if (salary && parseInt(salary.replace(/[^0-9]/g, '')) >= 1000000) badges.push('고수입');

    // Add default badges if none
    if (badges.length === 0) badges.push('채용중');

    // Determine isNew/isHot based on views
    const views = scrapedAd.advertiser?.views || 0;
    const isHot = views > 10000;
    const isNew = scrapedAd.id % 3 === 0;

    return {
        id: scrapedAd.id,
        title,
        location,
        pay,
        thumbnail: scrapedAd.thumbnail || scrapedAd.detail_images?.[0] || '',
        images: scrapedAd.detail_images || scrapedAd.detail?.images || [],
        badges,
        isNew,
        isHot,
        productType,
        price: productType === 'vip' ? '300,000원' : productType === 'special' ? '150,000원' : '50,000원',
        duration: productType === 'vip' ? '30일' : productType === 'special' ? '15일' : '7일',
    };
};

// VIP Premium Ads (first 12 scraped ads)
export const vipAds: Advertisement[] = scrapedAdsData.slice(0, 12).map(ad => convertToAd(ad, 'vip'));

// Special Ads (next 24 scraped ads)
export const specialAds: Advertisement[] = scrapedAdsData.slice(12, 36).map(ad => convertToAd(ad, 'special'));

// Regular Ads (remaining scraped ads)
export const regularAds: Advertisement[] = scrapedAdsData.slice(36).map(ad => convertToAd(ad, 'general'));

// All ads combined
export const allAds = [...vipAds, ...specialAds, ...regularAds];

// Helper function to get ad by ID
export const getAdById = (id: number): Advertisement | undefined => {
    return allAds.find(ad => ad.id === id);
};
