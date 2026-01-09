import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, ThumbsUp, Sparkles } from 'lucide-react';

import communityData from '../../data/community_data.json';
import { sampleCommunityPosts } from '../../data/sampleCommunity';
import { useDataMode } from '../../contexts/DataModeContext';
import { getCurrentUser } from '../../utils/auth';

interface CommunityPreviewProps {
    isEditMode?: boolean;
}

const CommunityPreview: React.FC<CommunityPreviewProps> = ({ isEditMode = false }) => {
    const { useSampleData } = useDataMode();
    const [canAccessCommunity, setCanAccessCommunity] = useState(false);

    // Check if user can access community (female users, advertisers, or admin)
    useEffect(() => {
        const checkAccess = () => {
            const user = getCurrentUser();
            if (!user) {
                setCanAccessCommunity(false);
                return;
            }
            // Admin always has access
            if (user.role === 'admin') {
                setCanAccessCommunity(true);
                return;
            }
            // Female users have access
            if (user.gender === 'female') {
                setCanAccessCommunity(true);
                return;
            }
            // Advertisers have access (assuming they have active ads)
            if (user.type === 'advertiser') {
                setCanAccessCommunity(true);
                return;
            }
            setCanAccessCommunity(false);
        };

        checkAccess();

        // Listen for auth changes
        window.addEventListener('authStateChange', checkAccess);
        window.addEventListener('storage', checkAccess);
        return () => {
            window.removeEventListener('authStateChange', checkAccess);
            window.removeEventListener('storage', checkAccess);
        };
    }, []);

    // Don't render if user doesn't have community access
    if (!canAccessCommunity) return null;

    // Use sample data or real data based on admin toggle, but also checking localStorage fallback
    const sourcePosts = useSampleData ? sampleCommunityPosts : communityData;

    // Merge localStorage posts (fallback/demo)
    const localPostsRaw = JSON.parse(localStorage.getItem('lunaalba_community_posts') || '[]');
    // Map local posts to compatible format if needed (though they should be saved in compatible format)
    const localPosts = localPostsRaw.map((post: any) => ({
        ...post,
        // Ensure required fields for display
        category: post.category || '자유',
        date: post.date || new Date().toLocaleDateString(),
        views: post.views || 0,
        likes: post.likes || 0,
        comments: post.comments || 0,
        title: post.title || '제목 없음'
    }));

    // Merge: Local posts take precedence (newest first usually)
    // We combine sourcePosts (json/ts) + localPosts
    const combinedPosts = [...localPosts, ...sourcePosts];

    // Deduplicate by ID if needed (though sample IDs are string/number mixed usually)
    // Filter out duplicates based on ID
    const uniquePosts = Array.from(new Map(combinedPosts.map(item => [item.id, item])).values());

    // Sort by date (descending) - simple string comparison might work but date parsing is safer.
    // Assuming format "YYYY-MM-DD" or similar. 
    // If mixed formats, we might need a robust parser. For now, put local posts (newly created) at top.
    // Actually, localPosts are already added at the front of the array in CommunityWrite.
    // So if we just prepend them, they appear first.

    const communityPosts = uniquePosts.slice(0, 5);

    // Component wrapper for links
    const LinkComponent = isEditMode ? 'div' : Link;

    // Helper to get props (disable to if editMode)
    const getLinkProps = (to: string) => isEditMode ? {} : { to };

    // Helper for click handling in edit mode
    const handleClick = (e: React.MouseEvent) => {
        if (isEditMode) e.preventDefault();
    };

    return (
        <section className="py-8 container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <MessageSquare className="text-primary" size={24} />
                    </div>
                    커뮤니티
                </h2>
                <LinkComponent {...getLinkProps('/community') as any} onClick={handleClick} className="text-sm text-text-muted hover:text-primary cursor-pointer">더보기 +</LinkComponent>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Popular Posts */}
                <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Sparkles className="text-yellow-400" size={20} />
                            인기 게시글
                        </h3>
                        <LinkComponent
                            {...getLinkProps('/community') as any}
                            onClick={handleClick}
                            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 cursor-pointer"
                        >
                            더보기 →
                        </LinkComponent>
                    </div>
                    <div className="space-y-3">
                        {communityPosts.slice(0, 5).map((post) => (
                            <LinkComponent
                                key={post.id}
                                {...getLinkProps(`/community/${post.id}`) as any}
                                onClick={handleClick}
                                className="block group cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                                                {post.category}
                                            </span>
                                            <span className="text-xs text-text-muted">{post.date}</span>
                                        </div>
                                        <p className="text-white group-hover:text-primary transition-colors truncate">
                                            {post.title}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} />
                                                {post.views}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp size={12} />
                                                {post.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare size={12} />
                                                {post.comments}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </LinkComponent>
                        ))}
                    </div>
                </div>

                {/* Quick Write */}
                <div className="bg-accent/30 rounded-xl border border-white/5 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary"></div>
                        </div>
                        빠른 글쓰기
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <LinkComponent
                                {...getLinkProps('/community?category=job') as any}
                                onClick={handleClick}
                                className="p-4 rounded-lg bg-accent border border-white/10 hover:border-primary transition-colors text-center group cursor-pointer"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                    <div className="w-5 h-5 rounded bg-blue-500"></div>
                                </div>
                                <div className="text-sm font-bold text-white">구인구직</div>
                            </LinkComponent>
                            <LinkComponent
                                {...getLinkProps('/community?category=review') as any}
                                onClick={handleClick}
                                className="p-4 rounded-lg bg-accent border border-white/10 hover:border-primary transition-colors text-center group cursor-pointer"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                                    <Sparkles size={20} className="text-yellow-500" />
                                </div>
                                <div className="text-sm font-bold text-white">업소후기</div>
                            </LinkComponent>
                            <LinkComponent
                                {...getLinkProps('/community?category=region') as any}
                                onClick={handleClick}
                                className="p-4 rounded-lg bg-accent border border-white/10 hover:border-primary transition-colors text-center group cursor-pointer"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-sm font-bold text-white">지역정보</div>
                            </LinkComponent>
                            <LinkComponent
                                {...getLinkProps('/community?category=qna') as any}
                                onClick={handleClick}
                                className="p-4 rounded-lg bg-accent border border-white/10 hover:border-primary transition-colors text-center group cursor-pointer"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                </div>
                                <div className="text-sm font-bold text-white">질문답변</div>
                            </LinkComponent>
                        </div>
                        <LinkComponent
                            {...getLinkProps('/community/write') as any}
                            onClick={handleClick}
                            className="block w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors text-center cursor-pointer"
                        >
                            + 새 글 작성하기
                        </LinkComponent>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityPreview;
