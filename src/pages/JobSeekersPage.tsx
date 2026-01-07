import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, MapPin, Briefcase, Clock, ChevronRight,
  Search, User, Award, Calendar, CheckCircle2
} from 'lucide-react';

// Mock job seeker data - 유흥업소 구직자
const jobSeekers = [
  {
    id: 1,
    title: '강남 라운지 경력 3년 여성입니다',
    name: '김**',
    age: '20대 중반',
    gender: '여',
    location: '서울 강남구',
    desiredJob: '라운지, 룸살롱',
    experience: '3년',
    availableTime: '야간 전문',
    introduction: '고급 라운지 3년 경력입니다. 서비스 마인드 확실하고 단골 관리 잘합니다.',
    verified: true,
    hireCount: 12,
    postedAt: '10분 전',
  },
  {
    id: 2,
    title: '호텔바 경력 5년차 바텐더입니다',
    name: '이**',
    age: '30대 초반',
    gender: '남',
    location: '서울 홍대',
    desiredJob: '바텐더, 호프',
    experience: '5년',
    availableTime: '야간 가능',
    introduction: '호텔바, 칵테일바 경력 5년입니다. 칵테일 자격증 보유. 고객 응대 능숙.',
    verified: true,
    hireCount: 8,
    postedAt: '30분 전',
  },
  {
    id: 3,
    title: '노래방 도우미 경험있습니다',
    name: '박**',
    age: '20대 초반',
    gender: '여',
    location: '서울 신촌',
    desiredJob: '노래방, 주점',
    experience: '6개월',
    availableTime: '주말 야간',
    introduction: '밝은 성격이고 노래도 잘합니다. 시간 약속 잘 지킵니다!',
    verified: false,
    hireCount: 2,
    postedAt: '1시간 전',
  },
  {
    id: 4,
    title: '텐프로/하이퍼블릭 경력자입니다',
    name: '최**',
    age: '20대 후반',
    gender: '여',
    location: '서울 강남구',
    desiredJob: '텐프로, 하이퍼블릭',
    experience: '4년',
    availableTime: '야간 전문',
    introduction: '강남 유명 업소 4년 경력입니다. TC 관리 능숙하고 매출 상위권 유지.',
    verified: true,
    hireCount: 15,
    postedAt: '2시간 전',
  },
  {
    id: 5,
    title: '클럽/라운지바 서빙 경력자',
    name: '정**',
    age: '20대 초반',
    gender: '남',
    location: '서울 이태원',
    desiredJob: '클럽, 라운지바',
    experience: '2년',
    availableTime: '금/토 야간',
    introduction: '이태원 클럽 2년 경력. 체력 좋고 빠릿빠릿하게 일합니다.',
    verified: true,
    hireCount: 5,
    postedAt: '3시간 전',
  },
  {
    id: 6,
    title: '룸살롱 경력 여성 구직합니다',
    name: '한**',
    age: '20대 후반',
    gender: '여',
    location: '서울 역삼동',
    desiredJob: '룸살롱, 라운지',
    experience: '5년',
    availableTime: '평일/주말 가능',
    introduction: '역삼동 일대 룸살롱 경력 5년. 단골 고객 다수 보유.',
    verified: true,
    hireCount: 20,
    postedAt: '4시간 전',
  },
];

const categories = ['전체', '라운지/룸', '텐프로', '노래방', '클럽/바', '호프/주점'];

const JobSeekersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSeekers = jobSeekers.filter(seeker => {
    if (selectedCategory !== '전체') {
      const categoryMap: Record<string, string[]> = {
        '라운지/룸': ['라운지', '룸살롱', '룸'],
        '텐프로': ['텐프로', '하이퍼블릭'],
        '노래방': ['노래방'],
        '클럽/바': ['클럽', '라운지바', '바'],
        '호프/주점': ['호프', '주점', '바텐더'],
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
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
            <p className="text-text-muted text-sm">유흥업소 전문 인력</p>
          </div>
          <div className="flex items-center gap-1 text-primary font-bold text-2xl">
            <User size={24} />
            {jobSeekers.length * 15}+
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
                seeker.hireCount >= 10 ? 'border-primary/50' : 'border-border'
              }`}
            >
              {/* Hire Count Badge */}
              {seeker.hireCount >= 5 && (
                <div className="bg-primary/10 px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary" />
                    <span className="text-xs font-bold text-primary">
                      구직 성공 {seeker.hireCount}회
                    </span>
                  </div>
                  {seeker.hireCount >= 10 && (
                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                      베테랑
                    </span>
                  )}
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
                    <div className="flex items-center gap-2 flex-wrap">
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
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-gradient-to-t from-background via-background to-transparent">
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
