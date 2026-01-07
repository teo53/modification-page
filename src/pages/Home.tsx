import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Target, Calendar, Bell,
  ChevronRight, ChevronDown, Flame, FileText, Gift, Crown, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { allAds, vipAds, specialAds } from '../data/mockAds';
import TextAdsList from '../components/home/TextAdsList';
import CommunityPreview from '../components/home/CommunityPreview';
import SectionHeader from '../components/ui/SectionHeader';
import PremiumAdCard from '../components/home/PremiumAdCard';
import JewelAdSection from '../components/home/JewelAdSection';
import FloatingActionButton from '../components/ui/FloatingActionButton';

// Quick menu items
const quickMenuItems = [
  { id: 'custom', Icon: Target, label: '맞춤', path: '/search?filter=custom' },
  { id: 'region', Icon: MapPin, label: '지역별', path: '/search' },
  { id: 'shortterm', Icon: Calendar, label: '단기', path: '/theme/short' },
  { id: 'urgent', Icon: Bell, label: '급구', path: '/urgent' },
];

// Location options
const locations = ['서울 전체', '강남구', '마포구', '송파구', '강서구', '서초구', '역삼동', '이태원'];

// Banner data - 유흥업소 맞춤
const banners = [
  { id: 1, title: '강남 고수익 채용중', subtitle: '검증된 업소만 모았습니다', bg: 'from-primary to-yellow-600' },
  { id: 2, title: '신입 환영 업소 모음', subtitle: '경력 무관, 친절한 교육 제공', bg: 'from-purple-500 to-purple-700' },
  { id: 3, title: '야간 전문 채용', subtitle: '고수익 야간 알바 특집', bg: 'from-blue-500 to-blue-700' },
];
const BANNER_COUNT = banners.length;
const BANNER_INTERVAL = 4000;

// Generate stable time strings based on ad ID
const getTimeAgo = (adId: number): string => {
  const minutes = ((adId * 7) % 55) + 5; // 5-59분 범위
  return `${minutes}분전`;
};

const Home: React.FC = () => {
  const { state } = useApp();
  const [selectedLocation, setSelectedLocation] = useState('서울 전체');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Get featured and recent ads
  const recentAds = useMemo(() => allAds.slice(0, 8), []);
  const hotAds = useMemo(() => allAds.filter(ad => ad.isHot).slice(0, 6), []);

  // Auto-play banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNER_COUNT);
    }, BANNER_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (showLocationDropdown) {
      const handleClick = () => setShowLocationDropdown(false);
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showLocationDropdown]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner with Location Selector */}
      <section className="px-4 pt-2 pb-3">
        {/* Location Selector Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLocationDropdown(!showLocationDropdown);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface border border-border"
              aria-label="지역 선택"
            >
              <MapPin size={16} className="text-primary" />
              <span className="text-text-main font-medium text-sm">{selectedLocation}</span>
              <ChevronDown size={14} className="text-text-muted" />
            </button>

            {/* Location Dropdown */}
            {showLocationDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 top-full mt-1 w-40 bg-card rounded-xl shadow-lg border border-border z-50"
                role="listbox"
                onClick={(e) => e.stopPropagation()}
              >
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationDropdown(false);
                    }}
                    className={`w-full h-10 px-4 text-left text-sm border-b border-border last:border-0 ${
                      selectedLocation === loc ? 'text-primary font-medium bg-primary/5' : 'text-text-main'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <span className="text-xs text-text-muted">유흥업소 전문 구인구직</span>
        </div>

        {/* Banner Carousel */}
        <div className="relative rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              className={`bg-gradient-to-r ${banners[bannerIndex].bg} p-5 min-h-[130px] flex flex-col justify-center`}
              key={bannerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white/80 text-xs mb-1">LunaAlba 추천</p>
              <h2 className="text-white text-xl font-bold mb-2">
                {banners[bannerIndex].title}
              </h2>
              <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs w-fit">
                {banners[bannerIndex].subtitle}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
            {bannerIndex + 1}/{banners.length}
          </div>
        </div>

        {/* Banner dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setBannerIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === bannerIndex ? 'bg-primary w-5' : 'bg-border w-1.5'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Menu Icons */}
      <section className="px-4 py-3">
        <div className="flex justify-around">
          {quickMenuItems.map((item) => (
            <Link key={item.id} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                  <item.Icon size={22} className="text-primary" />
                </div>
                <span className="text-[11px] font-medium text-text-main">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Event Banner */}
      <section className="px-4 pb-3">
        <Link to="/signup">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Gift size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-text-main font-bold text-sm">신규 회원 혜택</p>
                <p className="text-text-muted text-xs">가입시 포인트 3,000P 지급!</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </div>
        </Link>
      </section>

      {/* JEWEL PREMIUM ADS */}
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
        />
        <div className="px-4 grid grid-cols-2 gap-3">
          {vipAds.slice(0, 6).map((ad, idx) => (
            <PremiumAdCard key={ad.id} ad={ad} variant="grid" showRank={idx + 1} />
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-2 bg-surface" />

      {/* Special Ads Section */}
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
        <div className="px-4 grid grid-cols-2 gap-3">
          {specialAds.slice(0, 6).map((ad, idx) => (
            <PremiumAdCard key={ad.id} ad={ad} variant="grid" showRank={idx + 1} />
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
              <div className="flex gap-3 p-3 bg-card active:bg-accent transition-colors">
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
                  <img
                    src={ad.thumbnail}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
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
                    <span className="text-[10px] text-text-light">{getTimeAgo(ad.id)}</span>
                  </div>
                  <h3 className="font-bold text-text-main text-sm line-clamp-1 mb-1">
                    {ad.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-muted">{ad.location}</p>
                    <p className="text-sm font-bold text-primary">{ad.pay}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-2 bg-surface" />

      {/* Hot Jobs Section */}
      <section className="py-4 bg-red-500/5">
        <SectionHeader
          icon={Flame}
          title="급구! 지금 바로 출근"
          subtitle="사장님이 급하게 찾는 인력"
          badge="HOT"
          badgeColor="hot"
          showMore
          moreLink="/urgent"
        />
        <div className="px-4 grid grid-cols-2 gap-3">
          {hotAds.map((ad) => (
            <Link key={ad.id} to={`/ad/${ad.id}`}>
              <div className="bg-card rounded-xl border-2 border-red-500/30 overflow-hidden active:scale-98 transition-transform">
                <div className="relative h-24">
                  <img
                    src={ad.thumbnail}
                    alt={ad.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">
                    <Flame size={10} />
                    급구
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded">
                    <span className="text-white text-xs font-bold">{ad.pay}</span>
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="text-xs font-bold text-text-main line-clamp-2 min-h-[32px]">{ad.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-text-muted truncate">{ad.location}</p>
                    <span className="text-[8px] text-text-light bg-surface px-1 py-0.5 rounded">AD</span>
                  </div>
                </div>
              </div>
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

      {/* Recent Views */}
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
                  <Link key={view.id} to={`/ad/${ad.id}`} className="flex-shrink-0 w-[140px]">
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="h-20 bg-accent overflow-hidden">
                        <img
                          src={ad.thumbnail}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
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

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 left-4 w-11 h-11 bg-card rounded-full shadow-lg border border-border flex items-center justify-center z-40 active:scale-95 transition-transform"
        aria-label="맨 위로"
      >
        <ChevronRight size={18} className="text-primary rotate-[-90deg]" />
      </button>
    </div>
  );
};

export default Home;
