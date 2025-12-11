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
            <PremiumHeroAds />
            <PremiumAdGrid />
            <SpecialAdGrid />
            <CommunityPreview />
            <QuickMenuBar />
            <RegularAdList />
            <TextAdsList />
        </div>
    );
};

export default Home;
