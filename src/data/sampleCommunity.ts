// Sample community data for demo mode
// All content is placeholder text for external demonstration

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
    {
        id: 90001,
        category: '자유게시판',
        title: '[샘플] 오늘 첫 출근했어요!',
        content: '샘플 게시글 내용입니다. 실제 서비스에서는 실제 사용자들의 게시글이 표시됩니다. 분위기도 좋고 사장님도 친절하셔서 앞으로 열심히 해볼게요!',
        author: '샘플유저1',
        date: '2025-12-17',
        views: 156,
        likes: 23,
        comments: 8
    },
    {
        id: 90002,
        category: '질문답변',
        title: '[샘플] 처음 시작하는데 팁 있을까요?',
        content: '샘플 질문 게시글입니다. 실제 서비스에서는 실제 사용자들의 질문과 답변이 표시됩니다. 선배님들 조언 부탁드려요!',
        author: '샘플유저2',
        date: '2025-12-17',
        views: 89,
        likes: 12,
        comments: 15
    },
    {
        id: 90003,
        category: '후기',
        title: '[샘플] 강남 ○○업소 후기 (좋았어요)',
        content: '샘플 후기 게시글입니다. 대우도 좋고 손님들도 매너 있었어요. 추천합니다!',
        author: '샘플유저3',
        date: '2025-12-17',
        views: 312,
        likes: 45,
        comments: 22
    },
    {
        id: 90004,
        category: '정보공유',
        title: '[샘플] 알바생이 알아야 할 법적 권리',
        content: '샘플 정보공유 게시글입니다. 근로계약서 작성법, 최저임금, 휴게시간 등 알바생이 반드시 알아야 할 권리들을 정리했습니다.',
        author: '샘플유저4',
        date: '2025-12-16',
        views: 567,
        likes: 89,
        comments: 34
    },
    {
        id: 90005,
        category: '자유게시판',
        title: '[샘플] 주말 알바 어떠세요?',
        content: '평일에는 다른 일을 하고 주말에만 일하시는 분들 계신가요? 경험담 공유해주세요!',
        author: '샘플유저5',
        date: '2025-12-16',
        views: 234,
        likes: 31,
        comments: 18
    },
    {
        id: 90006,
        category: '질문답변',
        title: '[샘플] 면접 볼 때 복장 어떻게 하나요?',
        content: '다음주에 첫 면접인데 어떤 옷을 입고 가야할지 모르겠어요. 조언 부탁드립니다!',
        author: '샘플유저6',
        date: '2025-12-16',
        views: 178,
        likes: 15,
        comments: 27
    },
    {
        id: 90007,
        category: '후기',
        title: '[샘플] 성남 ○○매장 3개월 근무 후기',
        content: '3개월 동안 근무하면서 느낀 점들을 공유합니다. 전반적으로 만족스러웠어요.',
        author: '샘플유저7',
        date: '2025-12-16',
        views: 423,
        likes: 56,
        comments: 19
    },
    {
        id: 90008,
        category: '정보공유',
        title: '[샘플] 교통비 지원받는 업소 찾는 팁',
        content: '교통비 지원해주는 업소들 찾는 방법과 팁을 공유해요. 참고하세요!',
        author: '샘플유저8',
        date: '2025-12-15',
        views: 289,
        likes: 42,
        comments: 11
    }
];

// By category
export const getSamplePostsByCategory = (category: string) => {
    if (category === '전체') return sampleCommunityPosts;
    return sampleCommunityPosts.filter(post => post.category === category);
};

