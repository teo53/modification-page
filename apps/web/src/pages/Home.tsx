import React from 'react';
import PremiumHeroAds from '../components/home/PremiumHeroAds';
import QuickMenuBar from '../components/home/QuickMenuBar';
import PremiumAdGrid from '../components/home/PremiumAdGrid';
import SpecialAdGrid from '../components/home/SpecialAdGrid';
import PremiumJobGrid from '../components/home/PremiumJobGrid';
import CompactAdGrid from '../components/home/CompactAdGrid';
import TextAdsList from '../components/home/TextAdsList';
import CommunityPreview from '../components/home/CommunityPreview';
import CommunityTicker from '../components/home/CommunityTicker';
import DenseAdList from '../components/home/DenseAdList';

const Home: React.FC = () => {
    return (
        <div className="pb-20">
            {/* 실시간 커뮤니티 티커 (에브리타임 스타일) */}
            <CommunityTicker />

            {/* 프리미엄 광고 (메인 히어로) - 보석 등급 유지 */}
            <PremiumHeroAds />
            {/* 빠른 메뉴 (지역검색/업종별 등) */}
            <QuickMenuBar />

            {/* ========================================== */}
            {/* VIP 프리미엄 - 24개 (4줄) */}
            {/* ========================================== */}
            <PremiumAdGrid />

            {/* ========================================== */}
            {/* SPECIAL 스페셜 - 24개 (4줄) */}
            {/* ========================================== */}
            <SpecialAdGrid />

            {/* ========================================== */}
            {/* 커뮤니티 미리보기 - 프리미엄채용 위 배치 */}
            {/* ========================================== */}
            <CommunityPreview />

            {/* ========================================== */}
            {/* 프리미엄채용정보 - 191×154 세로형 카드 7열 */}
            {/* ========================================== */}
            <PremiumJobGrid />

            {/* ========================================== */}
            {/* 우대채용정보 - 230×114 가로형 카드 6열 */}
            {/* ========================================== */}
            <CompactAdGrid />

            {/* 텍스트 광고 */}
            <TextAdsList />

            {/* ========================================== */}
            {/* 최신 채용정보 - 밀집형 리스트 (레퍼런스 사이트 스타일) */}
            {/* ========================================== */}
            <DenseAdList />
        </div>
    );
};

export default Home;


