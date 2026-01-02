import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Target, Calendar, Bell, Briefcase, Building2,
  ChevronRight, ChevronDown, Search, Menu, Flame, Star, FileText, Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { allAds, vipAds, specialAds } from '../data/mockAds';
import PullToRefresh from '../components/app/PullToRefresh';

// Quick menu items with lucide icons
const quickMenuItems = [
  { id: 'custom', Icon: Target, label: '맞춤', path: '/search?filter=custom' },
  { id: 'region', Icon: MapPin, label: '지역별', path: '/search' },
  { id: 'shortterm', Icon: Calendar, label: '단기', path: '/theme/short' },
  { id: 'urgent', Icon: Bell, label: '급구', path: '/urgent' },
];

// Brand section
const brands = [
  { id: 1, name: '쿠팡', initial: 'C' },
  { id: 2, name: 'CU', initial: 'CU' },
  { id: 3, name: '스타벅스', initial: 'S' },
  { id: 4, name: '맥도날드', initial: 'M' },
  { id: 5, name: '올리브영', initial: 'O' },
  { id: 6, name: 'GS25', initial: 'G' },
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
      <div ref={containerRef} className="min-h-screen bg-background pb-4">
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
          <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-text-main font-bold">매일 미션 참여하고</p>
              <p className="text-text-muted text-sm">현금처럼 쓸 수 있는 포인트 받자!</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Gift size={24} className="text-primary" />
            </div>
          </div>
        </section>

        {/* Hot Jobs Section */}
        <section className="py-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Flame size={20} className="text-primary" />
              적극 채용 중인 공고
              <span className="text-xs font-normal text-white bg-text-light px-2 py-0.5 rounded">AD</span>
            </h2>
            <span className="text-sm text-text-muted">1 / {Math.ceil(vipAds.length / 2)}</span>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {vipAds.slice(0, 4).map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`} className="flex-shrink-0 w-[200px]">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* Company Logo Area */}
                  <div className="h-16 bg-accent flex items-center justify-center relative">
                    <Building2 size={28} className="text-text-muted" />
                    {ad.isHot && (
                      <span className="absolute top-2 right-2 bg-badge-hot text-white text-xs px-2 py-0.5 rounded font-bold">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-text-muted mb-1 truncate">
                      #{ad.badges.slice(0, 2).join(' #')}
                    </p>
                    <h3 className="font-bold text-text-main text-sm mb-2 line-clamp-2 min-h-[40px]">
                      {ad.title}
                    </h3>
                    <p className="text-xs text-text-muted">{ad.location}</p>
                    <p className="text-primary font-bold text-sm mt-1">{ad.pay}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Brand Section */}
        <section className="py-4 bg-surface">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              경력에 도움되는 브랜드 공고
            </h2>
            <ChevronRight size={20} className="text-text-muted" />
          </div>
          <div className="grid grid-cols-3 gap-3 px-4">
            {brands.map((brand) => (
              <Link key={brand.id} to={`/search?brand=${brand.name}`}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-card rounded-xl p-4 text-center border border-border"
                >
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-text-main">{brand.initial}</span>
                  </div>
                  <p className="text-sm font-medium text-text-main">{brand.name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Real-time Job Listings */}
        <section className="py-4">
          <div className="flex items-center gap-2 px-4 mb-3">
            <FileText size={18} className="text-primary" />
            <button className="flex items-center gap-1 font-bold text-text-main">
              {selectedLocation}
              <ChevronDown size={16} />
            </button>
            <span className="text-text-main font-bold">실시간 공고</span>
          </div>
          <div className="divide-y divide-border">
            {recentAds.map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`}>
                <motion.div
                  whileTap={{ backgroundColor: '#f5f5f5' }}
                  className="px-4 py-4 bg-card"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-text-muted truncate flex-1">
                      {ad.badges.slice(0, 2).join(' · ')}
                    </p>
                    <span className="text-xs text-text-light ml-2">{formatTimeAgo()}</span>
                  </div>
                  <h3 className="font-bold text-text-main mb-2 line-clamp-1">
                    {ad.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">{ad.location}</p>
                    <p className="font-bold">
                      <span className="text-primary">월</span>
                      <span className="text-text-main ml-1">{ad.pay.replace('시급 ', '').replace('일급 ', '')}</span>
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Special Ads Section */}
        <section className="py-4 bg-surface">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Star size={20} className="text-primary" />
              특별한 공고 모아보기
              <span className="text-xs font-normal text-white bg-text-light px-2 py-0.5 rounded">AD</span>
            </h2>
            <span className="text-sm text-text-muted">1 / {Math.ceil(specialAds.length / 4)}</span>
          </div>
          <div className="space-y-3 px-4">
            {specialAds.slice(0, 4).map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`}>
                <motion.div
                  whileTap={{ scale: 0.99 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <p className="text-xs text-text-muted mb-1">
                    #{ad.badges.join(' #')}
                  </p>
                  <h3 className="font-bold text-text-main mb-2">{ad.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">{ad.location}</p>
                    <p className="font-bold">
                      <span className="text-primary">월</span>
                      <span className="text-text-main ml-1">{ad.pay.replace('시급 ', '').replace('일급 ', '')}</span>
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Views - Only if has history */}
        {state.recentViews.length > 0 && (
          <section className="py-4">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                최근 본 공고
              </h2>
              <Link to="/mypage/views" className="text-sm text-primary flex items-center">
                전체보기 <ChevronRight size={16} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
              {state.recentViews.slice(0, 5).map((view) => {
                const ad = allAds.find(a => String(a.id) === view.id);
                if (!ad) return null;
                return (
                  <Link key={view.id} to={`/ad/${ad.id}`} className="flex-shrink-0 w-[150px]">
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="h-20 bg-accent flex items-center justify-center">
                        <Building2 size={24} className="text-text-muted" />
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
        )}

        {/* View More Button */}
        <div className="px-4 py-4">
          <Link to="/search">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-accent border border-border text-text-main font-medium"
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
