import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';

import communityData from '../data/community_data.json';
import { getUserPosts } from '../utils/communityStorage';

// Category mapping
const categoryMap: { [key: string]: string } = {
    'job': '구인구직',
    'review': '업소후기',
    'region': '지역정보',
    'qna': '질문답변',
    'free': '자유게시판'
};

const CommunityPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    // Initialize category from URL params
    const initialCategory = useMemo(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categoryMap[categoryParam]) {
            return categoryMap[categoryParam];
        }
        return '전체';
    }, [searchParams]);

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [userPosts] = useState(() => getUserPosts());

    const categories = [
        { id: '전체', label: '전체' },
        { id: '구인구직', label: '구인구직' },
        { id: '업소후기', label: '업소후기' },
        { id: '지역정보', label: '지역정보' },
        { id: '질문답변', label: '질문답변' },
        { id: '자유게시판', label: '자유게시판' },
    ];

    // Merge user posts with static data (user posts first)
    const allPosts = useMemo(() => {
        const staticPosts = communityData.map(p => ({ ...p, isUserPost: false }));
        return [...userPosts, ...staticPosts];
    }, [userPosts]);

    const filteredPosts = selectedCategory === '전체'
        ? allPosts
        : allPosts.filter(p => p.category === selectedCategory);

    const displayPosts = filteredPosts.slice(0, 50);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-text-main">커뮤니티</h1>
                <Link to="/community/write" className="bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    글쓰기
                </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                            ? 'bg-primary text-white'
                            : 'bg-accent text-text-muted hover:bg-surface'
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
                        className={`block p-4 rounded-xl border transition-all hover:bg-surface bg-card border-border`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-surface text-text-muted`}>
                                    {post.category}
                                </span>
                                {post.isUserPost && (
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary">
                                        NEW
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-text-muted">{post.date}</span>
                        </div>

                        <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-1">
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
                <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold flex items-center justify-center">
                    1
                </button>
                <button className="w-8 h-8 rounded-lg bg-transparent text-text-muted flex items-center justify-center hover:bg-surface">
                    2
                </button>
                <button className="w-8 h-8 rounded-lg bg-transparent text-text-muted flex items-center justify-center hover:bg-surface">
                    3
                </button>
            </div>
        </div>
    );
};

export default CommunityPage;
