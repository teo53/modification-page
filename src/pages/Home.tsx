import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Target, Calendar, Bell, Briefcase,
  ChevronRight, ChevronDown, Search, Menu, Flame, FileText, Gift, Crown, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { allAds, vipAds, specialAds } from '../data/mockAds';
import PullToRefresh from '../components/app/PullToRefresh';
import TextAdsList from '../components/home/TextAdsList';
import CommunityPreview from '../components/home/CommunityPreview';
import SectionHeader from '../components/ui/SectionHeader';
import PremiumAdCard from '../components/home/PremiumAdCard';
import JewelAdSection from '../components/home/JewelAdSection';

// Quick menu items with lucide icons
const quickMenuItems = [
  { id: 'custom', Icon: Target, label: '맞춤', path: '/search?filter=custom' },
  { id: 'region', Icon: MapPin, label: '지역별', path: '/search' },
  { id: 'shortterm', Icon: Calendar, label: '단기', path: '/theme/short' },
  { id: 'urgent', Icon: Bell, label: '급구', path: '/urgent' },
];

// Brand section
const brands = [
  { id: 1, name: '쿠팡', initial: 'C', color: 'bg-blue-500' },
  { id: 2, name: 'CU', initial: 'CU', color: 'bg-green-500' },
  { id: 3, name: '스타벅스', initial: 'S', color: 'bg-green-600' },
  { id: 4, name: '맥도날드', initial: 'M', color: 'bg-red-500' },
  { id: 5, name: '올리브영', initial: 'O', color: 'bg-yellow-500' },
  { id: 6, name: 'GS25', initial: 'G', color: 'bg-blue-600' },
];

// Location options
const locations = ['서울 전체', '강남구', '마포구', '송파구', '강서구', '서초구'];

const Home: React.FC = () => {
  const { state } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('서울 전체');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Banner data
  const banners = [
    { id: 1, title: '겨울 단기 알바 모음', subtitle: '나와 가까운 알바 더 쉽게 찾자!', bg: 'from-orange-400 to-orange-500' },
    { id: 2, title: '신입 환영 채용중', subtitle: '경력 무관, 지금 바로 지원하세요!', bg: 'from-blue-400 to-blue-500' },
    { id: 3, title: '주말 알바 특집', subtitle: '토/일 가능한 알바 모아보기', bg: 'from-purple-400 to-purple-500' },
  ];

  // Get featured and recent ads
  const recentAds = allAds.slice(0, 8);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const formatTimeAgo = () => {
    const mins = Math.floor(Math.random() * 30) + 1;
    return `${mins}분전`;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      <div ref={containerRef} className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-bold">
              <span className="text-primary">Luna</span>
              <span className="text-text-main">Alba</span>
            </h1>
            <div className="flex items-center gap-4">
              <Link to="/search">
                <Search size={22} className="text-text-main" />
              </Link>
              <button>
                <Menu size={22} className="text-text-main" />
              </button>
            </div>
          </div>

          {/* Location Selector */}
          <div className="px-4 pb-3">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center gap-1 text-sm"
            >
              <MapPin size={16} className="text-primary" />
              <span className="text-text-main font-medium">{selectedLocation}</span>
              <ChevronDown size={16} className="text-text-muted" />
            </button>

            {showLocationDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-4 right-4 mt-2 bg-card rounded-xl shadow-lg border border-border z-50"
              >
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm border-b border-border last:border-0 ${
                      selectedLocation === loc ? 'text-primary font-medium' : 'text-text-main'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </header>

        {/* Hero Banner Carousel */}
        <section className="px-4 py-4">
          <div className="relative rounded-2xl overflow-hidden">
            <motion.div
              className={`bg-gradient-to-r ${banners[bannerIndex].bg} p-6 min-h-[160px]`}
              key={bannerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-white/80 text-sm mb-1">올 겨울 든든하게 보낼</p>
              <h2 className="text-white text-2xl font-bold mb-4">
                {banners[bannerIndex].title}
              </h2>
              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {banners[bannerIndex].subtitle}
              </button>
            </motion.div>
            <div className="absolute bottom-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full">
              {bannerIndex + 1} / {banners.length}
            </div>
          </div>
          {/* Banner dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setBannerIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === bannerIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Menu Icons */}
        <section className="px-4 py-2">
          <div className="flex justify-around">
            {quickMenuItems.map((item) => (
              <Link key={item.id} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center">
                    <item.Icon size={24} className="text-primary" />
                  </div>
                  <span className="text-xs font-medium text-text-main">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mission Banner */}
        <section className="px-4 py-3">
          <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-text-main font-bold">매일 미션 참여하고</p>
              <p className="text-text-muted text-sm">현금처럼 쓸 수 있는 포인트 받자!</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Gift size={24} className="text-primary" />
            </div>
          </div>
        </section>

        {/* ============ JEWEL PREMIUM ADS - TOP TIER ============ */}
        <JewelAdSection />

        {/* VIP Premium Ads */}
        <section className="py-4">
          <SectionHeader
            icon={Crown}
            title="VIP 프리미엄 공고"
            subtitle="검증된 고수익 채용정보"
            badge="AD"
            badgeColor="vip"
            variant="premium"
            pagination={{ current: 1, total: Math.ceil(vipAds.length / 4) }}
          />
          <div className="flex gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {vipAds.slice(0, 6).map((ad, idx) => (
              <PremiumAdCard key={ad.id} ad={ad} variant="medium" showRank={idx + 1} />
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-2 bg-surface" />

        {/* Special Ads Section - with images */}
        <section className="py-4">
          <SectionHeader
            icon={Sparkles}
            title="SPECIAL 추천 공고"
            subtitle="오늘의 특별 채용"
            badge="SPECIAL"
            badgeColor="special"
            variant="highlighted"
            showMore
            moreLink="/search?type=special"
          />
          <div className="px-4 space-y-3">
            {specialAds.slice(0, 4).map((ad) => (
              <PremiumAdCard key={ad.id} ad={ad} variant="compact" />
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-2 bg-surface" />

        {/* Brand Section */}
        <section className="py-4">
          <SectionHeader
            icon={Briefcase}
            title="브랜드 공고"
            subtitle="경력에 도움되는 대기업/프랜차이즈"
            showMore
            moreLink="/search?type=brand"
          />
          <div className="grid grid-cols-3 gap-3 px-4">
            {brands.map((brand) => (
              <Link key={brand.id} to={`/search?brand=${brand.name}`}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-card rounded-xl p-4 text-center border border-border hover:border-primary/30 transition-colors"
                >
                  <div className={`w-12 h-12 ${brand.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-lg font-bold text-white">{brand.initial}</span>
                  </div>
                  <p className="text-sm font-medium text-text-main">{brand.name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-2 bg-surface" />

        {/* Real-time Job Listings */}
        <section className="py-4">
          <SectionHeader
            icon={FileText}
            title={`${selectedLocation} 실시간 공고`}
            subtitle="방금 올라온 최신 채용정보"
            showMore
            moreLink="/search"
          />
          <div className="divide-y divide-border mx-4 rounded-xl border border-border overflow-hidden">
            {recentAds.map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`}>
                <motion.div
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex gap-3 p-3 bg-card"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
                    <img
                      src={ad.thumbnail}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex gap-1">
                        {ad.productType === 'vip' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-white font-bold">VIP</span>
                        )}
                        {ad.isHot && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">HOT</span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-light">{formatTimeAgo()}</span>
                    </div>
                    <h3 className="font-bold text-text-main text-sm line-clamp-1 mb-1">
                      {ad.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-text-muted">{ad.location}</p>
                      <p className="text-sm font-bold text-primary">{ad.pay}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-2 bg-surface" />

        {/* Hot Jobs Section - Urgent */}
        <section className="py-4 bg-red-500/5">
          <SectionHeader
            icon={Flame}
            title="급구! 지금 바로 출근"
            subtitle="사장님이 급하게 찾는 알바"
            badge="HOT"
            badgeColor="hot"
            showMore
            moreLink="/urgent"
          />
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {allAds.filter(ad => ad.isHot).slice(0, 6).map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`} className="flex-shrink-0 w-[160px]">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-card rounded-xl border-2 border-red-500/30 overflow-hidden"
                >
                  <div className="relative h-24">
                    <img
                      src={ad.thumbnail}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold animate-pulse">
                      <Flame size={10} />
                      급구
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-bold text-text-main line-clamp-2 min-h-[32px]">{ad.title}</h4>
                    <p className="text-[10px] text-text-muted mt-1">{ad.location}</p>
                    <p className="text-xs font-bold text-red-500 mt-1">{ad.pay}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-2 bg-surface" />

        {/* Text Ads Section */}
        <TextAdsList />

        {/* Section Divider */}
        <div className="h-2 bg-surface" />

        {/* Community Preview Section */}
        <CommunityPreview />

        {/* Recent Views - Only if has history */}
        {state.recentViews.length > 0 && (
          <>
            <div className="h-2 bg-surface" />
            <section className="py-4">
              <SectionHeader
                icon={Clock}
                title="최근 본 공고"
                showMore
                moreLink="/mypage/views"
              />
              <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {state.recentViews.slice(0, 5).map((view) => {
                  const ad = allAds.find(a => String(a.id) === view.id);
                  if (!ad) return null;
                  return (
                    <Link key={view.id} to={`/ad/${ad.id}`} className="flex-shrink-0 w-[150px]">
                      <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <div className="h-20 bg-accent overflow-hidden">
                          <img
                            src={ad.thumbnail}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="p-2">
                          <h4 className="text-xs font-medium text-text-main truncate">{ad.title}</h4>
                          <p className="text-xs text-primary mt-1">{ad.pay}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* View More Button */}
        <div className="px-4 py-6">
          <Link to="/search">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg"
            >
              더 많은 공고 보기
            </motion.button>
          </Link>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 w-12 h-12 bg-card rounded-full shadow-lg border border-border flex items-center justify-center z-40"
        >
          <ChevronRight size={20} className="text-primary rotate-[-90deg]" />
        </motion.button>
      </div>
    </PullToRefresh>
  );
};

export default Home;
