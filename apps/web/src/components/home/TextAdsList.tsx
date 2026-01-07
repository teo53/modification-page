import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Users } from 'lucide-react';

// =============================================================================
// 텍스트 광고 데이터 (좌측)
// =============================================================================
const textAds = [
    { id: 1, title: '강남 VIP룸', location: '서울', description: '☆☆☆정통 하이클럽 수위낮음 초보환영 ☆☆☆', pay: '면접 후 협의', category: '기타', days: 177, rotation: 59 },
    { id: 2, title: '♥체인소팬 VVIP♥', location: '서울 강북구', description: '♥체인소팬 VVIP♥', pay: '500,000원', payType: '당일', category: '기타', days: 258, rotation: 86 },
    { id: 3, title: '유흥파한해술클럽', location: '서울', description: '★하루 100~150만원★ 유흥파한해술클럽 에선 실현가능~!', pay: '500,000원', payType: '당일', category: '기타', days: 267, rotation: 89, badge: 'VIP' },
    { id: 4, title: '단밤', location: '서울 송파구', description: '가락,송파 No1. 에서 공주님들 모십니다.', pay: '500,000원', payType: '당일', category: '기타', days: 126, rotation: 34 },
    { id: 5, title: '□놀면뭐하니□말해야지...', location: '서울 강남구', description: '✅놀면뭐하니✅말해야지✅', pay: '500,000원', payType: '당일', category: '기타', days: 102, rotation: 34, badge: 'HOT' },
    { id: 6, title: '트리거', location: '서울', description: '강남최고대우펜적수OK보보장합니다', pay: '500,000원', payType: '당일', category: '기타', days: 294, rotation: 98 },
];

// =============================================================================
// 구직자 데이터 (우측)
// =============================================================================
const jobSeekers = [
    { id: 1, nickname: '안○○', age: 26, gender: '여', title: '인천 경기 스웨 구함', category: '마사지', pay: '300,000원', payType: '당일', date: '12-25', isNew: true },
    { id: 2, nickname: '007○○', age: 32, gender: '여', title: '88사이즈 통통한데 사이즈 안보는곳 찾아요ㅠㅠ', category: '노래주점', pay: '300,000원', payType: '당일', date: '12-25' },
    { id: 3, nickname: '윤○○', age: 25, gender: '여', title: '사이즈자신있는 여자두명 같이일구합니다 하이...', category: '룸싸롱', pay: '', payType: '면접 후 협의', date: '12-25', isNew: true },
    { id: 4, nickname: '꾸○○', age: 20, gender: '여', title: '숍 스웨 구해요', category: '마사지', pay: '600,000원', payType: '당일', date: '12-24' },
    { id: 5, nickname: '○○○', age: 28, gender: '여', title: 'ㅈㄱㅅㅁㅅ찾아요', category: '기타', pay: '', payType: '면접 후 협의', date: '12-24' },
    { id: 6, nickname: '체○○', age: 28, gender: '여', title: '77-88 사이즈 일할곳 구합니다 (서울권)', category: '노래주점', pay: '', payType: '면접 후 협의', date: '12-24', isNew: true },
    { id: 7, nickname: '○○○', age: 32, gender: '여', title: '수원 영통', category: '룸싸롱', pay: '', payType: '면접 후 협의', date: '12-24' },
    { id: 8, nickname: 'Binbo○○○', age: 20, gender: '여', title: '부산입니다', category: '노래주점', pay: '', payType: '면접 후 협의', date: '12-23', isNew: true },
];

interface TextAdsListProps {
    isEditMode?: boolean;
}

const TextAdsList: React.FC<TextAdsListProps> = ({ isEditMode = false }) => {
    const LinkComponent = isEditMode ? 'div' : Link;
    const getLinkProps = (to: string) => isEditMode ? {} : { to };
    const handleClick = (e: React.MouseEvent) => {
        if (isEditMode) e.preventDefault();
    };

    return (
        <section className="py-8 container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-6">

                {/* ============================================= */}
                {/* 좌측: 추천채용 (텍스트 광고) */}
                {/* ============================================= */}
                <div className="bg-accent/30 rounded-xl border border-white/5 overflow-hidden">
                    {/* 헤더 - 보라색 그라데이션 */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Sparkles size={18} />
                            추천채용
                        </h2>
                        <LinkComponent {...getLinkProps('/post-ad') as any} onClick={handleClick} className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer">
                            광고신청 +
                        </LinkComponent>
                    </div>

                    {/* 광고 목록 */}
                    <div className="divide-y divide-white/5">
                        {textAds.map((ad) => (
                            <LinkComponent
                                key={ad.id}
                                {...getLinkProps(`/ad/${ad.id}`) as any}
                                onClick={handleClick}
                                className="block p-4 hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                                {/* 상단: 배지 + 제목 + 지역 */}
                                <div className="flex items-center gap-2 mb-2">
                                    {ad.badge === 'HOT' && (
                                        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">HOT</span>
                                    )}
                                    {ad.badge === 'VIP' && (
                                        <span className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">VIP</span>
                                    )}
                                    <span className="text-pink-400 font-bold text-sm">{ad.title}</span>
                                    <span className="text-text-muted text-xs ml-auto">{ad.location}</span>
                                </div>

                                {/* 설명 */}
                                <p className="text-white/80 text-sm mb-3 truncate group-hover:text-white transition-colors">
                                    {ad.description}
                                </p>

                                {/* 하단: 급여(강조) + 카테고리 + 활동일 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* 급여 - 강조된 배지 */}
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30">
                                            {ad.payType || '당일'} {ad.pay}
                                        </span>
                                        <span className="text-text-muted text-xs">{ad.category}</span>
                                    </div>
                                    <span className="text-xs text-text-muted">
                                        <span className="text-primary font-bold">{ad.rotation}회</span> {ad.days}일
                                    </span>
                                </div>
                            </LinkComponent>
                        ))}
                    </div>

                    {/* 더보기 */}
                    <LinkComponent
                        {...getLinkProps('/search') as any}
                        onClick={handleClick}
                        className="flex items-center justify-center gap-1 py-3 text-sm text-text-muted hover:text-primary border-t border-white/5 transition-colors cursor-pointer"
                    >
                        더보기 <ChevronRight size={14} />
                    </LinkComponent>
                </div>

                {/* ============================================= */}
                {/* 우측: 최신인재정보 (구직자 게시판) */}
                {/* ============================================= */}
                <div className="bg-accent/30 rounded-xl border border-white/5 overflow-hidden">
                    {/* 헤더 - 핑크 그라데이션 */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users size={18} />
                            최신인재정보
                        </h2>
                        <LinkComponent {...getLinkProps('/job-seeker-list') as any} onClick={handleClick} className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer">
                            MORE
                        </LinkComponent>
                    </div>

                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-white/5 text-[11px] text-text-muted font-bold border-b border-white/5">
                        <div className="col-span-2">이름</div>
                        <div className="col-span-1 text-center">성별</div>
                        <div className="col-span-4">제목</div>
                        <div className="col-span-2">희망업종</div>
                        <div className="col-span-2">희망급여</div>
                        <div className="col-span-1 text-right">작성일</div>
                    </div>

                    {/* 구직자 목록 */}
                    <div className="divide-y divide-white/5">
                        {jobSeekers.map((seeker) => (
                            <LinkComponent
                                key={seeker.id}
                                {...getLinkProps(`/job-seeker/${seeker.id}`) as any}
                                onClick={handleClick}
                                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/5 transition-colors items-center text-sm cursor-pointer"
                            >
                                {/* 이름 */}
                                <div className="col-span-2 text-white font-medium truncate">{seeker.nickname}</div>

                                {/* 성별/나이 */}
                                <div className="col-span-1 text-center text-text-muted text-xs">{seeker.age}/{seeker.gender}</div>

                                {/* 제목 */}
                                <div className="col-span-4 truncate text-white flex items-center gap-1">
                                    <span className="truncate">{seeker.title}</span>
                                    {seeker.isNew && <span className="text-red-400 font-bold text-xs flex-shrink-0">N</span>}
                                </div>

                                {/* 희망업종 */}
                                <div className="col-span-2 text-text-muted text-xs truncate">{seeker.category}</div>

                                {/* 희망급여 - 강조 */}
                                <div className="col-span-2">
                                    {seeker.pay ? (
                                        <span className="inline-flex items-center bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-500/30">
                                            {seeker.payType} {seeker.pay}
                                        </span>
                                    ) : (
                                        <span className="text-text-muted text-[10px]">{seeker.payType}</span>
                                    )}
                                </div>

                                {/* 작성일 */}
                                <div className="col-span-1 text-right text-text-muted text-xs">{seeker.date}</div>
                            </LinkComponent>
                        ))}
                    </div>

                    {/* 더보기 - 구직자 목록 페이지로 링크 */}
                    <LinkComponent
                        {...getLinkProps('/job-seeker-list') as any}
                        onClick={handleClick}
                        className="flex items-center justify-center gap-1 py-3 text-sm text-text-muted hover:text-primary border-t border-white/5 transition-colors cursor-pointer"
                    >
                        더보기 <ChevronRight size={14} />
                    </LinkComponent>
                </div>
            </div>
        </section>
    );
};

export default TextAdsList;
