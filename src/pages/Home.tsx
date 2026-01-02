import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Briefcase, Clock, Zap, Star,
  ChevronRight, TrendingUp, Users, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { allAds } from '../data/mockAds';
import JobCard from '../components/app/JobCard';
import PullToRefresh from '../components/app/PullToRefresh';

// Quick category items
const categories = [
  { id: 'region', icon: MapPin, label: '지역별', path: '/search', color: 'from-blue-500 to-blue-600' },
  { id: 'industry', icon: Briefcase, label: '업종별', path: '/industry', color: 'from-purple-500 to-purple-600' },
  { id: 'theme', icon: Sparkles, label: '테마별', path: '/theme', color: 'from-pink-500 to-pink-600' },
  { id: 'urgent', icon: Clock, label: '급구', path: '/urgent', color: 'from-red-500 to-red-600' },
];

// Popular regions
const popularRegions = [
  { name: '강남', count: 234 },
  { name: '홍대', count: 189 },
  { name: '이태원', count: 156 },
  { name: '신촌', count: 142 },
  { name: '압구정', count: 128 },
  { name: '청담', count: 115 },
];

const Home: React.FC = () => {
  const { state } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get featured ads (VIP/Special)
  const featuredAds = allAds.filter(ad =>
    ad.productType === 'vip' || ad.productType === 'special'
  ).slice(0, 6);

  // Get recent ads
  const recentAds = allAds.slice(0, 10);

  // Get urgent ads
  const urgentAds = allAds.filter(ad => ad.isHot).slice(0, 5);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      <div ref={containerRef} className="min-h-screen pb-4">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />
          <div className="relative px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-white mb-2">
                오늘의 <span className="text-primary">HOT</span> 공고
              </h1>
              <p className="text-text-muted text-sm">
                {allAds.length.toLocaleString()}개의 새로운 채용공고
              </p>
            </motion.div>

            {/* Featured Stats */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{allAds.length}+</p>
                <p className="text-xs text-text-muted">채용공고</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">500+</p>
                <p className="text-xs text-text-muted">업체</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">24시간</p>
                <p className="text-xs text-text-muted">실시간 업데이트</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Categories */}
        <section className="px-4 py-6">
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={cat.path}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                      <cat.icon size={24} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">{cat.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Regions */}
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              인기 지역
            </h2>
            <Link to="/search" className="text-sm text-primary flex items-center">
              전체보기 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {popularRegions.map((region) => (
              <Link
                key={region.name}
                to={`/search?q=${region.name}`}
                className="flex-shrink-0"
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-accent border border-white/10 flex items-center gap-2"
                >
                  <span className="text-white font-medium">{region.name}</span>
                  <span className="text-xs text-primary">{region.count}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Urgent Jobs */}
        {urgentAds.length > 0 && (
          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={20} className="text-red-500" />
                급구 공고
              </h2>
              <Link to="/urgent" className="text-sm text-primary flex items-center">
                전체보기 <ChevronRight size={16} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
              {urgentAds.map((ad) => (
                <div key={ad.id} className="flex-shrink-0 w-[280px]">
                  <JobCard
                    id={ad.id}
                    title={ad.title}
                    location={ad.location}
                    pay={ad.pay}
                    image={ad.thumbnail}
                    badges={ad.badges}
                    isHot={ad.isHot}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Jobs */}
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Star size={20} className="text-primary" />
              프리미엄 공고
            </h2>
            <Link to="/search?filter=premium" className="text-sm text-primary flex items-center">
              전체보기 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredAds.slice(0, 4).map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <JobCard
                  id={ad.id}
                  title={ad.title}
                  location={ad.location}
                  pay={ad.pay}
                  image={ad.thumbnail}
                  badges={ad.badges}
                  isNew={ad.isNew}
                  variant="grid"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Views - Only if has history */}
        {state.recentViews.length > 0 && (
          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock size={20} className="text-text-muted" />
                최근 본 공고
              </h2>
              <Link to="/mypage/views" className="text-sm text-primary flex items-center">
                전체보기 <ChevronRight size={16} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
              {state.recentViews.slice(0, 5).map((view) => {
                const ad = allAds.find(a => String(a.id) === view.id);
                if (!ad) return null;
                return (
                  <div key={view.id} className="flex-shrink-0 w-[160px]">
                    <JobCard
                      id={ad.id}
                      title={ad.title}
                      location={ad.location}
                      pay={ad.pay}
                      image={ad.thumbnail}
                      variant="minimal"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent Jobs */}
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users size={20} className="text-green-400" />
              최신 공고
            </h2>
            <Link to="/search" className="text-sm text-primary flex items-center">
              전체보기 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAds.slice(0, 5).map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <JobCard
                  id={ad.id}
                  title={ad.title}
                  location={ad.location}
                  pay={ad.pay}
                  image={ad.thumbnail}
                  badges={ad.badges}
                  isNew={ad.isNew}
                  variant="list"
                />
              </motion.div>
            ))}
          </div>

          <Link to="/search">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-4 rounded-xl bg-accent border border-white/10 text-white font-medium"
            >
              더 많은 공고 보기
            </motion.button>
          </Link>
        </section>
      </div>
    </PullToRefresh>
  );
};

export default Home;
