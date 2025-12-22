import React from 'react';
import PremiumHeroAds from '../components/home/PremiumHeroAds';
import QuickMenuBar from '../components/home/QuickMenuBar';
import PremiumAdGrid from '../components/home/PremiumAdGrid';
import SpecialAdGrid from '../components/home/SpecialAdGrid';
import RegularAdList from '../components/home/RegularAdList';
import TextAdsList from '../components/home/TextAdsList';
import CommunityPreview from '../components/home/CommunityPreview';

const Home: React.FC = () => {
    return (
        <div className="pb-20">
            {/* 프리미엄 광고 (메인 히어로) */}
            <PremiumHeroAds />
            {/* 빠른 메뉴 (지역검색/업종별 등) - 프리미엄 광고 바로 아래 */}
            <QuickMenuBar />
            <PremiumAdGrid />
            <SpecialAdGrid />
            {/* 커뮤니티 미리보기 */}
            <CommunityPreview />
            {/* 일반 광고 */}
            <RegularAdList />
            <TextAdsList />
        </div>
    );
};

export default Home;
