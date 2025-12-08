import React from 'react';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';

const CommunityPage: React.FC = () => {
    const posts = [
        { id: 1, title: '강남 지역 면접 후기 공유합니다', author: '밤의여왕', views: 120, likes: 15, date: '2025.11.15', category: '면접후기' },
        { id: 2, title: '초보인데 팁 잘 받는 노하우 있나요?', author: '새내기', views: 85, likes: 8, date: '2025.11.15', category: '노하우' },
        { id: 3, title: '오늘 손님 진상 대처법 ㅠㅠ', author: '힘들다', views: 230, likes: 45, date: '2025.11.14', category: '자유게시판' },
        { id: 4, title: '이 가게 어떤가요? (질문)', author: '궁금해', views: 90, likes: 2, date: '2025.11.14', category: '업소정보' },
        { id: 5, title: '11월 이벤트 당첨자 발표', author: '관리자', views: 500, likes: 100, date: '2025.11.10', category: '공지사항', isNotice: true },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">커뮤니티</h1>
                <button className="bg-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                    글쓰기
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {['전체', '공지사항', '자유게시판', '면접후기', '노하우', '업소정보'].map((tab, i) => (
                    <button
                        key={i}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${i === 0 ? 'bg-white text-black' : 'bg-accent text-text-muted hover:bg-white/10'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Post List */}
            <div className="space-y-2">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={`p-4 rounded-xl border transition-all hover:bg-accent/50 cursor-pointer ${post.isNotice ? 'bg-primary/5 border-primary/20' : 'bg-accent border-white/5'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${post.isNotice ? 'bg-primary text-black' : 'bg-white/10 text-text-muted'
                                }`}>
                                {post.category}
                            </span>
                            <span className="text-xs text-text-muted">{post.date}</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                            {post.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-text-muted">
                            <span>{post.author}</span>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
                                <span className="flex items-center gap-1"><ThumbsUp size={12} /> {post.likes}</span>
                                <span className="flex items-center gap-1"><MessageSquare size={12} /> 5</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                <button className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-white/10">1</button>
                <button className="w-8 h-8 rounded-lg bg-transparent text-text-muted flex items-center justify-center hover:bg-white/10">2</button>
                <button className="w-8 h-8 rounded-lg bg-transparent text-text-muted flex items-center justify-center hover:bg-white/10">3</button>
            </div>
        </div>
    );
};

export default CommunityPage;
