import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    User, Phone, MapPin, Briefcase, Clock, Calendar,
    MessageCircle, ChevronLeft, AlertCircle
} from 'lucide-react';

// Mock data - 실제로는 API나 localStorage에서 가져와야 함
const allJobSeekers = [
    { id: 1, nickname: '안○○', age: 26, gender: '여', title: '인천 경기 스웨 구함', category: '마사지', pay: '300,000원', payType: '당일', date: '2025-12-25', isNew: true, region: '인천/경기', introduction: '경력 3년차 스웨디시 전문입니다. 친절하고 성실하게 일합니다.', experience: '스웨디시 3년', preferredWorkTime: '저녁 (18:00-24:00)', contactPhone: '010-****-1234', contactKakao: 'user1234' },
    { id: 2, nickname: '007○○', age: 32, gender: '여', title: '88사이즈 통통한데 사이즈 안보는곳 찾아요ㅠㅠ', category: '노래주점', pay: '300,000원', payType: '당일', date: '2025-12-25', region: '서울', introduction: '밝은 성격이고 노래 잘합니다.', experience: '노래주점 1년', preferredWorkTime: '저녁 (18:00-24:00)', contactPhone: '010-****-5678', contactKakao: 'user5678' },
    { id: 3, nickname: '윤○○', age: 25, gender: '여', title: '사이즈자신있는 여자두명 같이일구합니다 하이...', category: '룸싸롱', pay: '', payType: '면접 후 협의', date: '2025-12-25', isNew: true, region: '서울', introduction: '함께 일할 친구와 같이 구직합니다.', experience: '룸싸롱 2년', preferredWorkTime: '야간 전문', contactPhone: '010-****-9012' },
    { id: 4, nickname: '꾸○○', age: 20, gender: '여', title: '숍 스웨 구해요', category: '마사지', pay: '600,000원', payType: '당일', date: '2025-12-24', region: '서울', introduction: '신입이지만 열심히 배우겠습니다.', experience: '신입', preferredWorkTime: '시간 협의', contactPhone: '010-****-3456' },
    { id: 5, nickname: '○○○', age: 28, gender: '여', title: 'ㅈㄱㅅㅁㅅ찾아요', category: '기타', pay: '', payType: '면접 후 협의', date: '2025-12-24', region: '서울', introduction: '성실하게 일합니다.', experience: '기타 1년', preferredWorkTime: '시간 협의' },
    { id: 6, nickname: '체○○', age: 28, gender: '여', title: '77-88 사이즈 일할곳 구합니다 (서울권)', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-24', isNew: true, region: '서울', introduction: '활발하고 긍정적인 성격입니다.', experience: '노래주점 6개월', preferredWorkTime: '주말 야간' },
    { id: 7, nickname: '○○○', age: 32, gender: '여', title: '수원 영통', category: '룸싸롱', pay: '', payType: '면접 후 협의', date: '2025-12-24', region: '경기', introduction: '경력자입니다.', experience: '룸싸롱 5년', preferredWorkTime: '야간 전문' },
    { id: 8, nickname: 'Binbo○○○', age: 20, gender: '여', title: '부산입니다', category: '노래주점', pay: '', payType: '면접 후 협의', date: '2025-12-23', isNew: true, region: '부산', introduction: '부산에서 일할 곳 찾습니다.', experience: '신입', preferredWorkTime: '시간 협의' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformUserPost = (userPost: any) => ({
    id: userPost.id,
    nickname: userPost.name || '익명',
    age: parseInt(userPost.age) || 25,
    gender: userPost.gender === 'male' ? '남' : '여',
    title: userPost.introduction?.slice(0, 50) || '구직글',
    category: userPost.preferredJobTypes?.[0] || '기타',
    pay: userPost.preferredSalary || '',
    payType: userPost.preferredSalary ? '희망' : '면접 후 협의',
    date: new Date(userPost.createdAt).toISOString().slice(0, 10),
    isNew: true,
    region: userPost.preferredRegions?.join(', ') || '전국',
    introduction: userPost.introduction || '',
    experience: userPost.experience || '',
    preferredWorkTime: userPost.preferredWorkTime || '시간 협의',
    contactPhone: userPost.contactPhone || '',
    contactKakao: userPost.contactKakao || '',
});

const JobSeekerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // useMemo로 seeker 데이터를 계산 (useEffect 대신)
    const seeker = useMemo(() => {
        if (!id) return null;

        // localStorage에서 사용자 등록 구직글 확인
        const userPosts = JSON.parse(localStorage.getItem('lunaalba_job_posts') || '[]');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userPost = userPosts.find((p: any) => String(p.id) === id);

        if (userPost) {
            return transformUserPost(userPost);
        }

        // Mock 데이터에서 찾기
        const numId = parseInt(id, 10);
        return allJobSeekers.find(s => s.id === numId) || null;
    }, [id]);

    if (!seeker) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-accent rounded-xl border border-white/10 p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white">구직글을 찾을 수 없습니다</h2>
                    <p className="text-text-muted">요청하신 구직 정보가 존재하지 않습니다.</p>
                    <Link
                        to="/job-seeker-list"
                        className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        구직자 목록으로
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* 모바일 헤더 */}
            <div className="md:hidden sticky top-0 z-40 bg-accent/95 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <span className="font-bold text-white">구직자 상세</span>
                <div className="w-6" />
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* 프로필 카드 */}
                <div className="bg-accent rounded-2xl border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500/20 to-primary/20 p-6">
                        <div className="flex items-start gap-4">
                            {/* 프로필 아이콘 */}
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <User size={40} className="text-white/60" />
                            </div>

                            {/* 기본 정보 */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-2xl font-bold text-white">{seeker.nickname}</h1>
                                    {seeker.isNew && (
                                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">NEW</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3 text-sm text-text-muted">
                                    <span>{seeker.age}세</span>
                                    <span className={seeker.gender === '여' ? 'text-pink-400' : 'text-blue-400'}>
                                        {seeker.gender}성
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {seeker.region}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 제목 */}
                    <div className="p-6 border-t border-white/10">
                        <h2 className="text-lg text-white font-medium">{seeker.title}</h2>
                    </div>
                </div>

                {/* 희망 조건 */}
                <div className="bg-accent rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Briefcase size={20} className="text-primary" />
                        희망 조건
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-xl p-4">
                            <div className="text-text-muted text-sm mb-1">희망 업종</div>
                            <div className="text-white font-medium">{seeker.category}</div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4">
                            <div className="text-text-muted text-sm mb-1">희망 급여</div>
                            <div className="text-primary font-bold">
                                {seeker.pay || seeker.payType}
                            </div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4">
                            <div className="text-text-muted text-sm mb-1 flex items-center gap-1">
                                <Clock size={14} />
                                근무 시간대
                            </div>
                            <div className="text-white font-medium">{seeker.preferredWorkTime || '시간 협의'}</div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4">
                            <div className="text-text-muted text-sm mb-1 flex items-center gap-1">
                                <Calendar size={14} />
                                등록일
                            </div>
                            <div className="text-white font-medium">{seeker.date}</div>
                        </div>
                    </div>
                </div>

                {/* 자기소개 */}
                <div className="bg-accent rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        자기소개
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                        {seeker.introduction || '자기소개가 없습니다.'}
                    </p>
                    {seeker.experience && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="text-sm text-text-muted mb-1">경력</div>
                            <div className="text-white">{seeker.experience}</div>
                        </div>
                    )}
                </div>

                {/* 연락처 */}
                <div className="bg-accent rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Phone size={20} className="text-primary" />
                        연락처
                    </h3>
                    <div className="space-y-3">
                        {seeker.contactPhone && (
                            <a
                                href={`tel:${seeker.contactPhone}`}
                                className="flex items-center gap-3 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
                            >
                                <Phone size={20} className="text-primary" />
                                <span className="text-white">{seeker.contactPhone}</span>
                            </a>
                        )}
                        {seeker.contactKakao && (
                            <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl">
                                <MessageCircle size={20} className="text-yellow-400" />
                                <span className="text-white">카카오톡: {seeker.contactKakao}</span>
                            </div>
                        )}
                        {!seeker.contactPhone && !seeker.contactKakao && (
                            <div className="text-text-muted text-center py-4">
                                연락처 정보가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* 안내 문구 */}
                <div className="bg-gradient-to-r from-pink-500/20 to-primary/20 rounded-2xl border border-white/10 p-6 text-center">
                    <p className="text-white">
                        <span className="text-primary font-bold">'달빛알바에서 보고 연락드립니다'</span>
                        <br />
                        <span className="text-text-muted text-sm">라고 하시면 원활한 소통이 가능합니다.</span>
                    </p>
                </div>
            </div>

            {/* 모바일 하단 고정 버튼 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-accent/95 backdrop-blur-md border-t border-white/10 flex gap-3 z-40">
                {seeker.contactPhone ? (
                    <a
                        href={`tel:${seeker.contactPhone}`}
                        className="flex-1 py-3.5 rounded-xl bg-primary text-black font-bold flex items-center justify-center gap-2"
                    >
                        <Phone size={20} />
                        전화하기
                    </a>
                ) : (
                    <button
                        disabled
                        className="flex-1 py-3.5 rounded-xl bg-gray-500/50 text-gray-400 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                        <Phone size={20} />
                        연락처 없음
                    </button>
                )}
                <button className="flex-1 py-3.5 rounded-xl bg-[#FAE100] text-[#371D1E] font-bold flex items-center justify-center gap-2">
                    <MessageCircle size={20} />
                    카톡문의
                </button>
            </div>
        </div>
    );
};

export default JobSeekerDetailPage;
