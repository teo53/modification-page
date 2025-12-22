// Sample community data for demo mode
// 유흥업소 구인구직 관련 커뮤니티 샘플 콘텐츠
// 실제 queenalba.net 스타일을 참고하여 자연스러운 문체로 작성

export interface SampleCommunityPost {
    id: number;
    category: string;
    title: string;
    content: string;
    author: string;
    date: string;
    views: number;
    likes: number;
    comments: number;
}

export const sampleCommunityPosts: SampleCommunityPost[] = [
    // 자유게시판
    {
        id: 90001,
        category: '자유게시판',
        title: '오늘 첫 출근했어요! 긴장되네요ㅠㅠ',
        content: '강남쪽 텐카페에서 첫 출근했는데 생각보다 분위기가 좋았어요. 언니들도 친절하고 사장님도 신경 많이 써주시네요. 걱정 많이 했는데 다행이에요!',
        author: '새내기언니',
        date: '2025-12-18',
        views: 234,
        likes: 45,
        comments: 18
    },
    {
        id: 90002,
        category: '자유게시판',
        title: '12월 성수기라서 정신없네요',
        content: '연말이라 그런지 손님이 정말 많아요. 체력 관리 잘 하세요 여러분ㅠㅠ 저는 비타민 챙겨먹으면서 버티고 있어요.',
        author: '민트초코',
        date: '2025-12-18',
        views: 189,
        likes: 32,
        comments: 11
    },
    {
        id: 90003,
        category: '자유게시판',
        title: '주말 알바 하시는 분들 어떠세요?',
        content: '평일에 본업이 있어서 주말에만 일하는데, 주말에 나오시는 분들 계신가요? 경험이나 팁 공유해주세요~',
        author: '주말러',
        date: '2025-12-17',
        views: 167,
        likes: 28,
        comments: 23
    },
    {
        id: 90004,
        category: '자유게시판',
        title: '연말 보너스 받으신 분?',
        content: '저희 업소는 연말에 보너스 지급한다고 하던데, 다른 곳들은 어떤가요? 분위기 공유해주세요!',
        author: '기대중',
        date: '2025-12-17',
        views: 256,
        likes: 41,
        comments: 15
    },

    // 질문답변
    {
        id: 90005,
        category: '질문답변',
        title: '처음인데 어떤 옷을 준비해야 하나요?',
        content: '다음주에 면접 보러 가는데 옷은 어떤 걸 입고 가야 할까요? 너무 화려한 것도 그렇고... 선배님들 조언 부탁드려요!',
        author: '초보질문',
        date: '2025-12-18',
        views: 312,
        likes: 23,
        comments: 35
    },
    {
        id: 90006,
        category: '질문답변',
        title: '급여 정산은 보통 언제 해주나요?',
        content: '매일 주는 곳도 있고 주급, 월급 주는 곳도 있다고 들었는데 보통 어떤 방식이 많은가요? 일급이 안전할까요?',
        author: '궁금이',
        date: '2025-12-18',
        views: 198,
        likes: 18,
        comments: 22
    },
    {
        id: 90007,
        category: '질문답변',
        title: '룸살롱이랑 텐카페 차이가 뭔가요?',
        content: '업종마다 차이가 있다고 하는데, 룸살롱이랑 텐카페 분위기나 일하는 방식 차이 알려주세요.',
        author: '업종고민',
        date: '2025-12-17',
        views: 445,
        likes: 56,
        comments: 38
    },
    {
        id: 90008,
        category: '질문답변',
        title: '아르바이트도 4대보험 되나요?',
        content: '정규직처럼 4대보험 되는 곳도 있나요? 혹시 경험 있으신 분 답변 부탁드려요.',
        author: '보험문의',
        date: '2025-12-16',
        views: 223,
        likes: 15,
        comments: 19
    },

    // 업소후기
    {
        id: 90009,
        category: '업소후기',
        title: '강남 OO클럽 3개월 근무 후기 (별점: ★★★★☆)',
        content: '3개월 정도 일했는데 전체적으로 만족스러웠어요. 대우도 괜찮고 언니들 분위기도 좋았어요. 다만 주말에 좀 빡센 편이에요.',
        author: '후기언니',
        date: '2025-12-18',
        views: 567,
        likes: 89,
        comments: 31
    },
    {
        id: 90010,
        category: '업소후기',
        title: '성남 분당 쪽 텐카페 후기입니다',
        content: '신규 오픈한 곳인데 시설이 깔끔하고 사장님도 매너 있으세요. 아직 손님이 많진 않지만 분위기는 좋습니다.',
        author: '분당걸',
        date: '2025-12-17',
        views: 345,
        likes: 52,
        comments: 24
    },
    {
        id: 90011,
        category: '업소후기',
        title: '홍대 바 알바 후기 (솔직하게)',
        content: '분위기 좋고 젊은 손님들이 많아요. 다만 새벽까지 하는 게 체력적으로 힘들긴 해요. 음악 좋아하시면 추천!',
        author: '홍대러버',
        date: '2025-12-16',
        views: 412,
        likes: 63,
        comments: 28
    },

    // 지역정보
    {
        id: 90012,
        category: '지역정보',
        title: '강남역 근처 시급 정보 공유해요',
        content: '강남역 쪽은 보통 시급 3~4만원선이에요. 위치나 업종에 따라 다르긴 한데 참고하세요!',
        author: '정보통',
        date: '2025-12-18',
        views: 678,
        likes: 102,
        comments: 45
    },
    {
        id: 90013,
        category: '지역정보',
        title: '부산 해운대 쪽 분위기 어떤가요?',
        content: '서울에서 부산으로 이사 갈 예정인데 해운대 쪽 알바 시장 어떤지 아시는 분 계신가요?',
        author: '부산이주',
        date: '2025-12-17',
        views: 289,
        likes: 38,
        comments: 21
    },
    {
        id: 90014,
        category: '지역정보',
        title: '대전 둔산동 추천 업소 있나요?',
        content: '대전 쪽으로 이직 생각 중인데 둔산동이나 유성구 쪽 괜찮은 곳 추천해주세요.',
        author: '대전새내기',
        date: '2025-12-16',
        views: 198,
        likes: 24,
        comments: 17
    },

    // 구인구직
    {
        id: 90015,
        category: '구인구직',
        title: '강남 신규오픈 텐카페 같이 시작하실 분!',
        content: '12월 말에 오픈하는 텐카페인데 함께 시작할 언니들 구해요. 신규 오픈이라 조건 좋아요!',
        author: '오픈멤버',
        date: '2025-12-18',
        views: 456,
        likes: 67,
        comments: 52
    },
    {
        id: 90016,
        category: '구인구직',
        title: '주말만 가능한데 구직 중이에요',
        content: '평일은 다른 일을 해서 금토일만 가능합니다. 주말 알바 가능한 곳 연락 주세요~',
        author: '주말알바',
        date: '2025-12-17',
        views: 234,
        likes: 29,
        comments: 18
    },

    // 정보공유
    {
        id: 90017,
        category: '정보공유',
        title: '알바생이 꼭 알아야 할 권리 정리',
        content: '근로계약서 작성, 최저임금, 휴게시간 등 알바생이 반드시 알아야 할 권리들을 정리했어요. 모르면 손해 볼 수 있으니 꼭 읽어보세요!',
        author: '권리수호',
        date: '2025-12-18',
        views: 789,
        likes: 145,
        comments: 56
    },
    {
        id: 90018,
        category: '정보공유',
        title: '사기 업소 구별하는 법 (주의!)',
        content: '면접비 요구, 보증금 요구, 연락두절 등 사기 업소 특징 정리했어요. 새로 시작하시는 분들 조심하세요!',
        author: '안전지킴이',
        date: '2025-12-17',
        views: 934,
        likes: 203,
        comments: 78
    },
    {
        id: 90019,
        category: '정보공유',
        title: '체력 관리 팁 공유해요',
        content: '이 일 하면서 체력 관리가 제일 중요해요. 비타민, 운동, 수면 패턴 등 제가 실천하는 방법 공유합니다!',
        author: '건강관리',
        date: '2025-12-16',
        views: 567,
        likes: 89,
        comments: 42
    },
    {
        id: 90020,
        category: '정보공유',
        title: '세금 신고 어떻게 하나요?',
        content: '종합소득세 신고 해야 한다고 들었는데 정확히 어떻게 하는 건지 아시는 분 계신가요?',
        author: '세금고민',
        date: '2025-12-15',
        views: 423,
        likes: 56,
        comments: 38
    }
];

// By category
export const getSamplePostsByCategory = (category: string) => {
    if (category === '전체') return sampleCommunityPosts;
    return sampleCommunityPosts.filter(post => post.category === category);
};

// Get popular posts (sorted by views)
export const getPopularPosts = (limit: number = 5) => {
    return [...sampleCommunityPosts]
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
};

// Get recent posts
export const getRecentPosts = (limit: number = 5) => {
    return [...sampleCommunityPosts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
};
