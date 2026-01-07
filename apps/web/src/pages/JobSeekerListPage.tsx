import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, DollarSign, User, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';

// =============================================================================
// 구직자 데이터
// =============================================================================
const allJobSeekers = [
    { id: 1, nickname: '안○○', age: 26, gender: '여', title: '인천 경기 스웨 구함', category: '마사지', pay: '300,000원', payType: '당일', date: '2025-12-25', isNew: true, region: '인천/경기' },
    { id: 2, nickname: '007○○', age: 32, gender: '여', title: '88사이즈 통통한데 사이즈 안보는곳 찾아요ㅠㅠ', category: '노래주점', pay: '300,000원', payType: '당일', date: '2025-12-25', region: '서울' },
    { id: 3, nickname: '윤○○', age: 25, gender: '여', title: '사이즈자신있는 여자두명 같이일구합니다 하이...', category: '룸싸롱', pay: '', payType: '면접 후 협의', date: '2025-12-25', isNew: true, region: '서울' },
    { id: 4, nickname: '꾸○○', age: 20, gender: '여', title: '숍 스웨 구해요', category: '마사지', pay: '600,000원', payType: '당일', date: '2025-12-24', region: '서울' },
    { id: 5, nickname: '○○○', age: 28, gender: '여', title: 'ㅈㄱㅅㅁㅅ찾아요', category: '기타', pay: '', payType: '면접 후 협의', date: '2025-12-24', region: '서울' },
    { id: 6, nickname: '체○○', age: 28, gender: '여', title: '77-88 사이즈 일할곳 구합니다 (서울권)', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-24', isNew: true, region: '서울' },
    { id: 7, nickname: '○○○', age: 32, gender: '여', title: '수원 영통', category: '룸싸롱', pay: '', payType: '면접 후 협의', date: '2025-12-24', region: '경기' },
    { id: 8, nickname: 'Binbo○○○', age: 20, gender: '여', title: '부산입니다', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-23', isNew: true, region: '부산' },
    { id: 9, nickname: '우○○', age: 27, gender: '여', title: '66사이즈 경기권 고정및 노도', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-23', isNew: true, region: '경기' },
    { id: 10, nickname: '나○○', age: 32, gender: '여', title: '66 동네알아봐요', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-23', isNew: true, region: '서울' },
    { id: 11, nickname: '후○○', age: 26, gender: '여', title: '66반-77 기타 노도등', category: '마사지', pay: '', payType: '면접 후 협의', date: '2025-12-23', region: '경기' },
    { id: 12, nickname: '일○○', age: 34, gender: '여', title: '상주가능한 기타구해요', category: '기타', pay: '', payType: '면접 후 협의', date: '2025-12-23', isNew: true, region: '서울' },
    { id: 13, nickname: '냥○○', age: 29, gender: '여', title: '서울 인천 경기 스웨디시만 구해요', category: '마사지', pay: '300,000원', payType: '당일', date: '2025-12-22', region: '서울/인천/경기' },
    { id: 14, nickname: '진○○', age: 26, gender: '여', title: '전국 숙식 가능 으로 구해요', category: '마사지', pay: '500,000원', payType: '당일', date: '2025-12-22', region: '전국' },
    { id: 15, nickname: 'ㅇ○○', age: 25, gender: '여', title: '투잡가능한곳 구합니다', category: '룸싸롱', pay: '500,000원', payType: '당일', date: '2025-12-22', region: '서울' },
    { id: 16, nickname: '정○○', age: 31, gender: '여', title: '수원 강아지랑 같이일할수있는 길거리피알구해...', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-22', region: '경기' },
    { id: 17, nickname: 'godmy○○', age: 34, gender: '여', title: '노래방도우미', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-22', region: '서울' },
    { id: 18, nickname: '냥○○', age: 26, gender: '여', title: '경기북부나 근처 스웨', category: '마사지', pay: '130,000원', payType: '시급', date: '2025-12-22', region: '경기' },
];

const categories = ['전체', '마사지', '노래주점', '룸싸롱', '기타'];
const regions = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주'];

const JobSeekerListPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // 필터링
    const filteredSeekers = allJobSeekers.filter(seeker => {
        const matchesSearch = seeker.title.includes(searchQuery) || seeker.nickname.includes(searchQuery);
        const matchesCategory = selectedCategory === '전체' || seeker.category === selectedCategory;
        const matchesRegion = selectedRegion === '전체' || seeker.region.includes(selectedRegion);
        return matchesSearch && matchesCategory && matchesRegion;
    });

    // 페이지네이션
    const totalPages = Math.ceil(filteredSeekers.length / itemsPerPage);
    const paginatedSeekers = filteredSeekers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">최신인재정보</h1>
                        <p className="text-text-muted">총 <span className="text-primary font-bold">{filteredSeekers.length}</span>명의 구직자가 등록되어 있습니다</p>
                    </div>
                    <Link
                        to="/job-seeker"
                        className="bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <User size={20} />
                        구직 등록하기
                    </Link>
                </div>

                {/* 검색 및 필터 */}
                <div className="bg-accent/30 rounded-xl border border-white/10 p-6 mb-6">
                    <div className="flex flex-wrap gap-4">
                        {/* 검색창 */}
                        <div className="flex-1 min-w-[200px] relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="제목 또는 닉네임 검색"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-text-muted focus:border-primary outline-none"
                            />
                        </div>

                        {/* 업종 필터 */}
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-text-muted" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                                className="bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat === '전체' ? '업종 전체' : cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* 지역 필터 */}
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-text-muted" />
                            <select
                                value={selectedRegion}
                                onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
                                className="bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            >
                                {regions.map(reg => (
                                    <option key={reg} value={reg}>{reg === '전체' ? '지역 전체' : reg}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 테이블 */}
                <div className="bg-accent/30 rounded-xl border border-white/10 overflow-hidden">
                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-12 gap-3 px-6 py-4 bg-gradient-to-r from-pink-500/20 to-pink-600/10 text-sm font-bold border-b border-white/10">
                        <div className="col-span-2 flex items-center gap-2 text-white">
                            <User size={14} />
                            이름
                        </div>
                        <div className="col-span-1 text-text-muted text-center">성별</div>
                        <div className="col-span-4 text-white">제목</div>
                        <div className="col-span-2 flex items-center gap-1 text-text-muted">
                            <Briefcase size={14} />
                            희망업종
                        </div>
                        <div className="col-span-2 flex items-center gap-1 text-text-muted">
                            <DollarSign size={14} />
                            희망급여
                        </div>
                        <div className="col-span-1 text-right flex items-center gap-1 justify-end text-text-muted">
                            <Calendar size={14} />
                            작성일
                        </div>
                    </div>

                    {/* 테이블 바디 */}
                    <div className="divide-y divide-white/5">
                        {paginatedSeekers.length > 0 ? (
                            paginatedSeekers.map((seeker) => (
                                <Link
                                    key={seeker.id}
                                    to={`/job-seeker/${seeker.id}`}
                                    className="grid grid-cols-12 gap-3 px-6 py-4 hover:bg-white/5 transition-colors items-center"
                                >
                                    {/* 이름 */}
                                    <div className="col-span-2 text-white font-medium">{seeker.nickname}</div>

                                    {/* 성별/나이 */}
                                    <div className="col-span-1 text-center text-text-muted text-sm">
                                        {seeker.age}/{seeker.gender}
                                    </div>

                                    {/* 제목 */}
                                    <div className="col-span-4 text-white truncate flex items-center gap-2">
                                        <span className="truncate">{seeker.title}</span>
                                        {seeker.isNew && (
                                            <span className="text-red-400 font-bold text-xs flex-shrink-0">N</span>
                                        )}
                                    </div>

                                    {/* 희망업종 */}
                                    <div className="col-span-2 text-text-muted text-sm">{seeker.category}</div>

                                    {/* 희망급여 - 강조 */}
                                    <div className="col-span-2">
                                        {seeker.pay ? (
                                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-300 text-xs font-bold px-2 py-1 rounded-full">
                                                <span className="text-pink-400">{seeker.payType}</span>
                                                {seeker.pay}
                                            </span>
                                        ) : (
                                            <span className="text-text-muted text-xs">{seeker.payType}</span>
                                        )}
                                    </div>

                                    {/* 작성일 */}
                                    <div className="col-span-1 text-right text-text-muted text-xs">
                                        {seeker.date.slice(5)}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-16 text-center text-text-muted">
                                <User size={48} className="mx-auto mb-4 opacity-30" />
                                <p>검색 결과가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-accent/50 rounded-lg hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} className="text-white" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === page
                                        ? 'bg-primary text-black'
                                        : 'bg-accent/50 text-white hover:bg-accent'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-accent/50 rounded-lg hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} className="text-white" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSeekerListPage;
