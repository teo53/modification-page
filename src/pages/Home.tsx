import React from 'react';
import HeroSection from '../components/home/HeroSection';
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
            {/* 히어로 배너 슬라이드 */}
            <HeroSection />
            {/* 빠른 메뉴 */}
            <QuickMenuBar />
            {/* 프리미엄 광고 */}
            <PremiumHeroAds />
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
