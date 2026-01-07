import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, MapPin, Briefcase, Clock, ChevronRight,
  Search, User, Star, Award, Calendar
} from 'lucide-react';

// Mock job seeker data
const jobSeekers = [
  {
    id: 1,
    title: '성실하고 책임감 있는 20대 여성입니다',
    name: '김**',
    age: '20대 초반',
    gender: '여',
    location: '서울 강남구',
    desiredJob: '서빙, 카페',
    experience: '2년',
    availableTime: '주말 가능',
    introduction: '음식점 서빙 경력 2년입니다. 친절하고 빠릿빠릿하게 일합니다.',
    verified: true,
    premium: true,
    postedAt: '10분 전',
  },
  {
    id: 2,
    title: '경력 5년차 바텐더입니다',
    name: '이**',
    age: '30대 초반',
    gender: '남',
    location: '서울 홍대',
    desiredJob: '바텐더, 홀서빙',
    experience: '5년',
    availableTime: '야간 가능',
    introduction: '호텔바, 칵테일바 경력 5년입니다. 칵테일 자격증 보유.',
    verified: true,
    premium: true,
    postedAt: '30분 전',
  },
  {
    id: 3,
    title: '대학생 아르바이트 구합니다',
    name: '박**',
    age: '20대 초반',
    gender: '여',
    location: '서울 신촌',
    desiredJob: '카페, 편의점',
    experience: '6개월',
    availableTime: '평일 오후',
    introduction: '시간 약속 잘 지키고 성실하게 일합니다!',
    verified: false,
    premium: false,
    postedAt: '1시간 전',
  },
  {
    id: 4,
    title: '주점/라운지 경력자입니다',
    name: '최**',
    age: '20대 후반',
    gender: '여',
    location: '서울 강남구',
    desiredJob: '주점, 라운지, 룸',
    experience: '3년',
    availableTime: '야간 전문',
    introduction: '고급 라운지 3년 경력입니다. 서비스 마인드 확실합니다.',
    verified: true,
    premium: true,
    postedAt: '2시간 전',
  },
  {
    id: 5,
    title: '성실한 30대 남성 구직중',
    name: '정**',
    age: '30대 중반',
    gender: '남',
    location: '서울 송파구',
    desiredJob: '배달, 물류',
    experience: '1년',
    availableTime: '시간 협의',
    introduction: '배달 경험 있습니다. 오토바이 면허 보유.',
    verified: true,
    premium: false,
    postedAt: '3시간 전',
  },
];

const categories = ['전체', '서빙/홀', '주점/라운지', '카페', '배달', '사무'];

const JobSeekersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSeekers = jobSeekers.filter(seeker => {
    if (selectedCategory !== '전체') {
      const categoryMap: Record<string, string[]> = {
        '서빙/홀': ['서빙', '홀서빙'],
        '주점/라운지': ['주점', '라운지', '룸', '바텐더'],
        '카페': ['카페'],
        '배달': ['배달', '물류'],
        '사무': ['사무'],
      };
      const keywords = categoryMap[selectedCategory] || [];
      if (!keywords.some(k => seeker.desiredJob.includes(k))) {
        return false;
      }
    }
    if (searchQuery && !seeker.title.includes(searchQuery) && !seeker.location.includes(searchQuery)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="sticky top-14 z-30 bg-card border-b border-border">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="지역, 희망업종으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-muted hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Banner */}
      <div className="px-4 py-3">
        <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-text-main font-bold">오늘의 구직자</p>
            <p className="text-text-muted text-sm">실시간 업데이트 중</p>
          </div>
          <div className="flex items-center gap-1 text-primary font-bold text-2xl">
            <User size={24} />
            {jobSeekers.length * 12}+
          </div>
        </div>
      </div>

      {/* Job Seekers List */}
      <div className="px-4 space-y-3">
        {filteredSeekers.map((seeker) => (
          <Link key={seeker.id} to={`/job-seeker/${seeker.id}`}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`bg-card rounded-xl border overflow-hidden ${
                seeker.premium ? 'border-primary/50' : 'border-border'
              }`}
            >
              {/* Premium Badge */}
              {seeker.premium && (
                <div className="bg-primary/10 px-3 py-1.5 flex items-center gap-2">
                  <Star size={12} className="text-primary fill-primary" />
                  <span className="text-xs font-bold text-primary">프리미엄 구직자</span>
                </div>
              )}

              <div className="p-4">
                {/* Title & Info */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text-main line-clamp-1 flex-1 pr-2">
                    {seeker.title}
                  </h3>
                  <span className="text-xs text-text-light flex-shrink-0">{seeker.postedAt}</span>
                </div>

                {/* Profile Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <User size={24} className="text-text-muted" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-main">{seeker.name}</span>
                      <span className="text-xs text-text-muted">{seeker.age} · {seeker.gender}</span>
                      {seeker.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                          <Award size={10} />
                          인증
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                      <MapPin size={12} />
                      {seeker.location}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                    <Briefcase size={12} className="text-primary" />
                    {seeker.desiredJob}
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                    <Clock size={12} className="text-primary" />
                    {seeker.availableTime}
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                    <Calendar size={12} className="text-primary" />
                    경력 {seeker.experience}
                  </span>
                </div>

                {/* Introduction */}
                <p className="text-sm text-text-muted line-clamp-2">
                  {seeker.introduction}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-text-muted">프로필 보기</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredSeekers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText size={48} className="text-text-muted mb-4" />
          <p className="text-text-muted">해당하는 구직자가 없습니다</p>
        </div>
      )}

      {/* Post Resume CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-gradient-to-t from-background to-transparent">
        <Link to="/post-resume">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg"
          >
            내 이력서 등록하기
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default JobSeekersPage;
