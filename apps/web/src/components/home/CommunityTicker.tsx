import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { api } from '../../utils/apiClient';
import { sampleCommunityPosts } from '../../data/sampleCommunity';

interface TickerPost {
    id: string;
    title: string;
    category: string;
    createdAt: string;
    commentCount?: number;
}

const CommunityTicker: React.FC = () => {
    const [posts, setPosts] = useState<TickerPost[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load posts from API or fallback to sample data
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await api.get<any>('/community/posts?limit=10');
                if (response.data?.data && response.data.data.length > 0) {
                    setPosts(response.data.data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        category: p.category,
                        createdAt: p.createdAt,
                        commentCount: p.commentCount || 0
                    })));
                    return;
                }
            } catch (err) {
                // Silently fall back to sample data
            }

            // Fallback to localStorage + sample data
            const localPosts = JSON.parse(localStorage.getItem('lunaalba_community_posts') || '[]');
            const combined = [...localPosts, ...sampleCommunityPosts].slice(0, 10);
            setPosts(combined.map((p: any) => ({
                id: String(p.id),
                title: p.title,
                category: p.category,
                createdAt: p.date || p.createdAt,
                commentCount: p.comments || p.commentCount || 0
            })));
        };

        loadPosts();
    }, []);

    // Auto-scroll animation
    useEffect(() => {
        if (posts.length <= 1 || isPaused) return;

        intervalRef.current = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % posts.length);
                setIsAnimating(false);
            }, 300);
        }, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [posts.length, isPaused]);

    if (posts.length === 0) return null;

    const currentPost = posts[currentIndex];
    const nextPost = posts[(currentIndex + 1) % posts.length];

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'FREE': 'bg-blue-500/20 text-blue-400',
            'QNA': 'bg-purple-500/20 text-purple-400',
            'REVIEW': 'bg-yellow-500/20 text-yellow-400',
            'TIP': 'bg-green-500/20 text-green-400',
            'NEWS': 'bg-red-500/20 text-red-400',
            '자유게시판': 'bg-blue-500/20 text-blue-400',
            '질문답변': 'bg-purple-500/20 text-purple-400',
            '업소후기': 'bg-yellow-500/20 text-yellow-400',
            '지역정보': 'bg-green-500/20 text-green-400',
            '구인구직': 'bg-red-500/20 text-red-400',
        };
        return colors[category] || 'bg-primary/20 text-primary';
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'FREE': '자유',
            'QNA': 'Q&A',
            'REVIEW': '후기',
            'TIP': '정보',
            'NEWS': '구인',
        };
        return labels[category] || category;
    };

    return (
        <div
            className="bg-gradient-to-r from-accent/80 via-accent/60 to-accent/80 border-b border-white/5 backdrop-blur-sm"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center h-11">
                    {/* Icon & Label */}
                    <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                        <div className="relative">
                            <MessageSquare size={16} className="text-primary" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                        <span className="text-xs font-bold text-primary whitespace-nowrap">
                            실시간
                        </span>
                    </div>

                    {/* Ticker Content */}
                    <Link
                        to={`/community/post/${currentPost.id}`}
                        className="flex-1 overflow-hidden mx-4 group"
                    >
                        <div className="relative h-6 overflow-hidden">
                            {/* Current Post */}
                            <div
                                className={`absolute inset-0 flex items-center gap-2 transition-transform duration-300 ${
                                    isAnimating ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                                }`}
                            >
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${getCategoryColor(currentPost.category)}`}>
                                    {getCategoryLabel(currentPost.category)}
                                </span>
                                <span className="text-sm text-white/90 truncate group-hover:text-primary transition-colors">
                                    {currentPost.title}
                                </span>
                                {currentPost.commentCount > 0 && (
                                    <span className="text-[10px] text-primary font-bold shrink-0">
                                        [{currentPost.commentCount}]
                                    </span>
                                )}
                            </div>

                            {/* Next Post (for animation) */}
                            <div
                                className={`absolute inset-0 flex items-center gap-2 transition-transform duration-300 ${
                                    isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                }`}
                            >
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${getCategoryColor(nextPost.category)}`}>
                                    {getCategoryLabel(nextPost.category)}
                                </span>
                                <span className="text-sm text-white/90 truncate">
                                    {nextPost.title}
                                </span>
                                {nextPost.commentCount > 0 && (
                                    <span className="text-[10px] text-primary font-bold shrink-0">
                                        [{nextPost.commentCount}]
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* More Link */}
                    <Link
                        to="/community"
                        className="flex items-center gap-1 pl-4 border-l border-white/10 text-xs text-text-muted hover:text-primary transition-colors shrink-0"
                    >
                        더보기
                        <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CommunityTicker;
