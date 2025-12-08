import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';

// 현실적인 제목 템플릿 (오타, 구어체 포함)
const TITLE_TEMPLATES = {
    review: [
        '강남 룸 면접 다녀왔어요ㅋㅋ',
        '홍대 하이퍼블릭 후기!!',
        '신논현 텐프로 오늘 출근했어요',
        '선릉쪽 면접 봤는데 괜찮은듯',
        '압구정 VIP룸 후기 남겨요~',
        '청담동 하이퍼 다녀왔어요ㅎㅎ',
        '역삼 쩜오 면접 후기',
        '논현역 룸 첫출근 했어요!!',
    ],
    notice: [
        '공지사항',
        '이벤트 안내',
        '주의사항',
    ],
    best: [
        '이달의 베스트 업소 추천',
        '고수익 업소 리스트',
        '초보자 추천 업소',
    ],
    chat: [
        '손님응대 어케하나요??',
        '초보인데 괜찮을까요ㅠㅠ',
        '옷 뭐입고가야하나요?',
        '화장 어느정도 해야돼요??',
        '처음인데 팁좀 주세요ㅜㅜ',
        '면접때 뭐 물어보나요??',
        '일 끝나고 택시비 주나요?',
        '주급으로 받을수있나요??',
    ],
    legal: [
        '급여체불 당했는데 어케해야하나요ㅠㅠ',
        '계약서 작성 안했는데 문제되나요??',
        '미성년자는 일못하나요?',
        '폭행당했어요 신고해야하나요',
        '급여 안줘요 어케해요ㅠㅠ',
    ],
    event: [
        '11월 이벤트 진행중!!',
        '신규회원 포인트 지급',
        '후기 이벤트 당첨자 발표',
    ]
};

// 현실적인 닉네임
const AUTHORS = [
    '익명', 'ㅇㅇ', 'ㄱㄱ', 'ㅎㅎ', 'ㅋㅋ',
    '궁금', '도와줘', '정보구함', '질문있음', '뀨',
    '초보', '신입', '경력자', '아르바이트', '알바생',
    '현직자', '퇴사자', '면접봤어요', '출근중', '휴직중'
];

// 유니크 콘텐츠 생성 함수
const generateRealisticContent = (category: string, title: string, id: number): string => {
    // 제목에서 키워드 추출
    const locations = ['강남', '홍대', '신논현', '선릉', '역삼', '압구정', '청담', '신사', '논현'];
    const jobTypes = ['룸', '하이퍼블릭', '하이퍼', '텐프로', '쩜오', '클럽', '노래방', '퍼블릭'];

    let location = '강남';
    let jobType = '룸';

    for (const loc of locations) {
        if (title.includes(loc)) {
            location = loc;
            break;
        }
    }

    for (const jt of jobTypes) {
        if (title.includes(jt)) {
            jobType = jt;
            break;
        }
    }

    // ID 기반 시드로 일관성 있는 랜덤 생성
    const seed = id * 12345;
    const random = (max: number) => Math.floor((Math.abs(Math.sin(seed * (max + 1)) * 10000)) % max);

    // 동적 데이터
    const salary = 70 + random(40); // 70k~110k
    const nightBonus = 10 + random(20); // 10k~30k
    const distance = 1 + random(15); // 1~15분

    if (category === 'review') {
        return `오늘 ${location}쪽에서 면접봤어요!!\n\n매니저님 진짜 친절하시고 급여도 괜찮았어요ㅎㅎ 시급 ${salary}k고 야간수당 따로 ${nightBonus}k 줍니다!!\n\n${location}역에서 ${distance}분거리고 건물도 깔끔해요!!\n\n다음주부터 출근하기로 했어요!!`;
    }

    if (category === 'chat') {
        const questions = [
            `${location}쪽 ${jobType}에서 일하려고 하는데 초보도 할수있나요??`,
            `손님응대가 제일 걱정인데 어케하면되나요ㅜㅜ`,
            `옷이랑 화장은 어느정도 해야하나요??`,
        ];
        return questions[random(questions.length)];
    }

    if (category === 'legal') {
        return `${location} ${jobType}에서 일했는데 급여를 안줘요ㅠㅠ\n\n계약서는 작성했고 증거도 있는데 어케해야할까요??\n\n법적으로 어떻게 대응하면 좋을지 조언부탁드립니다ㅜㅜ`;
    }

    return `${title} 관련 내용입니다.`;
};

// 게시글 생성
const generatePosts = () => {
    const posts: any[] = [];
    let postId = 1;

    // 공지사항 (10개)
    for (let i = 0; i < 10; i++) {
        const template = TITLE_TEMPLATES.notice[i % TITLE_TEMPLATES.notice.length];
        posts.push({
            id: postId++,
            title: template,
            author: '관리자',
            category: 'notice',
            categoryLabel: '공지사항',
            content: `${template} 내용입니다.`,
            views: 500 + i * 50,
            likes: 50 + i * 5,
            comments: 10 + i * 2,
            date: `2025.12.${String(8 - Math.floor(i / 3)).padStart(2, '0')}`,
            isNotice: true
        });
    }

    // 베스트 게시글 (50개)
    for (let i = 0; i < 50; i++) {
        const template = TITLE_TEMPLATES.best[i % TITLE_TEMPLATES.best.length];
        posts.push({
            id: postId++,
            title: template,
            author: AUTHORS[i % AUTHORS.length],
            category: 'best',
            categoryLabel: '베스트',
            content: generateRealisticContent('review', template, postId),
            views: 300 + i * 10,
            likes: 40 + i * 2,
            comments: 8 + i,
            date: `2025.12.${String(8 - Math.floor(i / 10)).padStart(2, '0')}`,
            isBest: true
        });
    }

    // 방문후기 (250개)
    for (let i = 0; i < 250; i++) {
        const template = TITLE_TEMPLATES.review[i % TITLE_TEMPLATES.review.length];
        posts.push({
            id: postId++,
            title: template,
            author: AUTHORS[i % AUTHORS.length],
            category: 'review',
            categoryLabel: '후기',
            content: generateRealisticContent('review', template, postId),
            views: 50 + i * 2,
            likes: 5 + i,
            comments: 2 + Math.floor(i / 10),
            date: `2025.12.${String(8 - Math.floor(i / 40)).padStart(2, '0')}`
        });
    }

    // 잡담 (250개)
    for (let i = 0; i < 250; i++) {
        const template = TITLE_TEMPLATES.chat[i % TITLE_TEMPLATES.chat.length];
        posts.push({
            id: postId++,
            title: template,
            author: AUTHORS[i % AUTHORS.length],
            category: 'chat',
            categoryLabel: '잡담',
            content: generateRealisticContent('chat', template, postId),
            views: 30 + i,
            likes: 3 + Math.floor(i / 10),
            comments: 1 + Math.floor(i / 20),
            date: `2025.12.${String(8 - Math.floor(i / 40)).padStart(2, '0')}`
        });
    }

    // 법률상담 (100개)
    for (let i = 0; i < 100; i++) {
        const template = TITLE_TEMPLATES.legal[i % TITLE_TEMPLATES.legal.length];
        posts.push({
            id: postId++,
            title: template,
            author: AUTHORS[i % AUTHORS.length],
            category: 'legal',
            categoryLabel: '법률',
            content: generateRealisticContent('legal', template, postId),
            views: 100 + i * 5,
            likes: 10 + i,
            comments: 5 + Math.floor(i / 10),
            date: `2025.12.${String(8 - Math.floor(i / 20)).padStart(2, '0')}`
        });
    }

    // 이벤트 (40개)
    for (let i = 0; i < 40; i++) {
        const template = TITLE_TEMPLATES.event[i % TITLE_TEMPLATES.event.length];
        posts.push({
            id: postId++,
            title: template,
            author: '관리자',
            category: 'event',
            categoryLabel: '이벤트',
            content: `${template} 자세한 내용은 본문을 확인해주세요!`,
            views: 200 + i * 10,
            likes: 20 + i * 3,
            comments: 10 + i,
            date: `2025.12.${String(8 - Math.floor(i / 10)).padStart(2, '0')}`
        });
    }

    return posts;
};

const MOCK_POSTS = generatePosts();

const CommunityPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: '전체' },
        { id: 'notice', label: '공지사항' },
        { id: 'best', label: '베스트' },
        { id: 'review', label: '후기' },
        { id: 'chat', label: '잡담' },
        { id: 'legal', label: '법률' },
        { id: 'event', label: '이벤트' },
    ];

    const filteredPosts = selectedCategory === 'all'
        ? MOCK_POSTS
        : MOCK_POSTS.filter(p => p.category === selectedCategory);

    const displayPosts = filteredPosts.slice(0, 50);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">커뮤니티</h1>
                <button className="bg-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    글쓰기
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                            ? 'bg-white text-black'
                            : 'bg-accent text-text-muted hover:bg-white/10'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Post List */}
            <div className="space-y-2">
                {displayPosts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/community/post/${post.id}`}
                        className={`block p-4 rounded-xl border transition-all hover:bg-accent/50 ${post.isNotice || post.isBest
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-accent border-white/5'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${post.isNotice || post.isBest
                                ? 'bg-primary text-black'
                                : 'bg-white/10 text-text-muted'
                                }`}>
                                {post.categoryLabel}
                            </span>
                            <span className="text-xs text-text-muted">{post.date}</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                            {post.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-text-muted">
                            <span>{post.author}</span>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <Eye size={12} /> {post.views}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ThumbsUp size={12} /> {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare size={12} /> {post.comments}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                <button className="w-8 h-8 rounded-lg bg-primary text-black font-bold flex items-center justify-center">
                    1
                </button>
                <button className="w-8 h-8 rounded-lg bg-transparent text-text-muted flex items-center justify-center hover:bg-white/10">
                    2
                </button>
                <button className="w-8 h-8 rounded-lg bg-transparent text-text-muted flex items-center justify-center hover:bg-white/10">
                    3
                </button>
            </div>
        </div>
    );
};

export { MOCK_POSTS };
export default CommunityPage;
