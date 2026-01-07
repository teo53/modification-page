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
    },

    // 추가 게시글 - 자유게시판
    {
        id: 90021,
        category: '자유게시판',
        title: '요즘 손님들 분위기 어떠세요?',
        content: '연말이라 그런지 회식 손님들이 많아요. 다들 연말 분위기 어떠세요? 저는 크리스마스 시즌 때 팁이 좀 늘었어요ㅎㅎ',
        author: '연말분위기',
        date: '2025-12-19',
        views: 156,
        likes: 28,
        comments: 12
    },
    {
        id: 90022,
        category: '자유게시판',
        title: '새해 목표 세우신 분?',
        content: '2026년에는 더 좋은 곳으로 이직하고 싶어요. 다들 새해 목표 있으신가요? 같이 공유해봐요!',
        author: '새해희망',
        date: '2025-12-19',
        views: 89,
        likes: 15,
        comments: 8
    },
    {
        id: 90023,
        category: '자유게시판',
        title: '오랜만에 쉬는 날인데...',
        content: '오랜만에 쉬는 날이에요. 집에서 넷플릭스 보면서 쉬는 중~ 다들 쉬는 날 뭐하세요?',
        author: '휴식중',
        date: '2025-12-18',
        views: 67,
        likes: 11,
        comments: 5
    },
    {
        id: 90024,
        category: '자유게시판',
        title: '사장님이 칭찬해주셨어요!',
        content: '오늘 단골손님한테 칭찬 받았다고 사장님이 보너스 주셨어요ㅠㅠ 감동... 열심히 해야겠어요!',
        author: '기분좋음',
        date: '2025-12-17',
        views: 123,
        likes: 34,
        comments: 9
    },
    {
        id: 90025,
        category: '자유게시판',
        title: '다이어트 하시는 분 계세요?',
        content: '일하다 보니 살이 빠지긴 하는데, 건강하게 체중 관리하고 싶어요. 다이어트 팁 있으신 분?',
        author: '건강미인',
        date: '2025-12-16',
        views: 178,
        likes: 25,
        comments: 14
    },
    {
        id: 90026,
        category: '자유게시판',
        title: '겨울에 출근할 때 옷이 고민이에요',
        content: '추운데 예쁘게 입고 가기가 어려워요ㅠㅠ 겨울 출근룩 추천해주세요!',
        author: '패션고민',
        date: '2025-12-15',
        views: 145,
        likes: 19,
        comments: 11
    },

    // 추가 게시글 - 업소후기
    {
        id: 90027,
        category: '업소후기',
        title: '인천 부평 쪽 라운지 후기 (★★★★★)',
        content: '완전 추천해요! 사장님 마인드도 좋고 언니들 분위기도 좋아요. 시급도 괜찮은 편이에요. 3개월째 다니는 중!',
        author: '부평언니',
        date: '2025-12-19',
        views: 234,
        likes: 45,
        comments: 18
    },
    {
        id: 90028,
        category: '업소후기',
        title: '신촌 카페 알바 2주차 후기',
        content: '분위기 좋고 젊은 손님들이 많아서 편해요. 다만 주말에 좀 바쁘긴 해요. 전반적으로 만족!',
        author: '신촌새내기',
        date: '2025-12-18',
        views: 189,
        likes: 32,
        comments: 14
    },
    {
        id: 90029,
        category: '업소후기',
        title: '수원 쪽 가라오케 한 달 후기',
        content: '시설 깨끗하고 매니저분들 친절해요. 손님도 매너 있는 편이고요. 경기권 찾으시면 추천!',
        author: '수원후기',
        date: '2025-12-17',
        views: 267,
        likes: 41,
        comments: 19
    },
    {
        id: 90030,
        category: '업소후기',
        title: '역삼역 근처 룸 알바 솔직후기 (★★★☆☆)',
        content: '급여는 괜찮은데 업무강도가 좀 있어요. 초보분들은 적응 시간이 필요할 수도. 참고하세요~',
        author: '역삼후기',
        date: '2025-12-16',
        views: 312,
        likes: 38,
        comments: 22
    },

    // 추가 게시글 - 질문답변
    {
        id: 90031,
        category: '질문답변',
        title: '면접 볼 때 뭘 물어보나요?',
        content: '처음 면접 보러 가는데 긴장돼요ㅠㅠ 보통 어떤 질문들 하는지 알려주세요!',
        author: '면접긴장',
        date: '2025-12-19',
        views: 198,
        likes: 22,
        comments: 27
    },
    {
        id: 90032,
        category: '질문답변',
        title: '나이 제한 있나요?',
        content: '20대 초반인데 나이 제한 있는 곳이 많나요? 경험 있으신 분들 알려주세요~',
        author: '나이고민',
        date: '2025-12-18',
        views: 234,
        likes: 28,
        comments: 31
    },
    {
        id: 90033,
        category: '질문답변',
        title: '교통비 지원해주는 곳 있나요?',
        content: '집에서 좀 멀어서 교통비가 부담인데, 교통비 지원해주는 업소도 있다고 들었어요. 경험 있으신 분?',
        author: '교통비고민',
        date: '2025-12-17',
        views: 156,
        likes: 18,
        comments: 15
    },

    // 추가 게시글 - 구인구직
    {
        id: 90034,
        category: '구인구직',
        title: '경력 1년차 구직 중입니다',
        content: '강남/역삼/삼성 쪽 희망해요. 성실하게 일할 자신 있습니다. 연락 기다릴게요!',
        author: '경력1년',
        date: '2025-12-19',
        views: 178,
        likes: 24,
        comments: 16
    },
    {
        id: 90035,
        category: '구인구직',
        title: '서울 전지역 가능합니다 (경력 2년)',
        content: '텐카페, 라운지 경력 있어요. 서울 어디든 출퇴근 가능합니다. 조건 좋은 곳 연락주세요!',
        author: '서울가능',
        date: '2025-12-18',
        views: 234,
        likes: 35,
        comments: 22
    },
    {
        id: 90036,
        category: '구인구직',
        title: '단기 알바도 가능해요',
        content: '연말 성수기 단기 알바 구해요. 12월~1월 중 가능합니다. 경험 있습니다~',
        author: '단기알바',
        date: '2025-12-17',
        views: 145,
        likes: 19,
        comments: 12
    },

    // 추가 게시글 - 정보공유
    {
        id: 90037,
        category: '정보공유',
        title: '면접비 요구하는 곳은 무조건 피하세요!',
        content: '면접비, 선결제, 보증금 등을 요구하는 곳은 100% 사기입니다. 절대 돈 먼저 내지 마세요!',
        author: '사기조심',
        date: '2025-12-19',
        views: 456,
        likes: 89,
        comments: 34
    },
    {
        id: 90038,
        category: '정보공유',
        title: '좋은 업소 구분하는 방법',
        content: '첫 출근 전 확인할 것들: 1)근로계약서 작성 여부 2)정산 방식 3)선배들 분위기 4)시설 청결도. 이것만 봐도 어느 정도 판단 가능해요!',
        author: '정보통',
        date: '2025-12-18',
        views: 523,
        likes: 95,
        comments: 42
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
