import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageSquare, Eye, Share2 } from 'lucide-react';
import communityData from '../data/community_data.json';
import { getPostById, toggleLike, isPostLiked, incrementViews } from '../utils/communityStorage';

const CommunityPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Try to find in user posts first, then static data
    const userPost = getPostById(Number(id));
    const staticPost = communityData.find(p => p.id === Number(id));
    const post = userPost || staticPost;

    useEffect(() => {
        if (userPost) {
            incrementViews(userPost.id);
            setLiked(isPostLiked(userPost.id));
            setLikeCount(userPost.likes);
        } else if (staticPost) {
            setLikeCount(staticPost.likes);
        }
    }, [id]);

    const handleLike = () => {
        if (userPost) {
            const newLikes = toggleLike(userPost.id);
            setLikeCount(newLikes);
            setLiked(!liked);
        }
    };

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-main mb-4">게시글을 찾을 수 없습니다</h2>
                    <Link to="/community" className="text-primary hover:underline">
                        커뮤니티로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back Button */}
            <button
                onClick={() => navigate('/community')}
                className="flex items-center gap-2 text-text-muted hover:text-text-main mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>목록으로</span>
            </button>

            {/* Post Content */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary">
                            {post.category}
                        </span>
                        <span className="text-sm text-text-muted">{post.date}</span>
                    </div>
                    <button className="text-text-muted hover:text-text-main transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-text-main mb-4">
                    {post.title}
                </h1>

                {/* Author & Stats */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                    <span className="text-text-muted">{post.author}</span>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                            <Eye size={14} /> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <ThumbsUp size={14} /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare size={14} /> {post.comments}
                        </span>
                    </div>
                </div>

                {/* Images (for user posts) */}
                {userPost?.images && userPost.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {userPost.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`image ${idx + 1}`}
                                className="w-full rounded-lg object-cover max-h-64"
                            />
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="text-text-main whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            liked
                                ? 'bg-primary/20 text-primary'
                                : 'bg-surface hover:bg-accent text-text-main'
                        }`}
                    >
                        <ThumbsUp size={18} />
                        <span>추천 {likeCount}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-accent text-text-main transition-colors">
                        <Share2 size={18} />
                        <span>공유</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-bold text-text-main mb-4">
                    댓글 {post.comments}개
                </h3>

                {/* Comment Input */}
                <div className="mb-6">
                    <textarea
                        className="w-full bg-surface border border-border rounded-lg p-4 text-text-main placeholder:text-text-muted focus:border-primary outline-none resize-none"
                        rows={3}
                        placeholder="댓글을 입력하세요..."
                    />
                    <div className="flex justify-end mt-2">
                        <button className="bg-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                            댓글 작성
                        </button>
                    </div>
                </div>

                {/* Sample Comments */}
                <div className="space-y-4">
                    {[
                        { author: 'ㅇㅇ', content: '정보 감사합니다!!', date: '2025.12.08 17:20' },
                        { author: '궁금', content: '저도 궁금했는데 도움됐어요ㅎㅎ', date: '2025.12.08 17:15' },
                        { author: 'ㄱㄱ', content: '좋은정보 ㄱㅅㄱㅅ', date: '2025.12.08 17:10' },
                    ].map((comment, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-surface border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-text-main">{comment.author}</span>
                                <span className="text-xs text-text-muted">{comment.date}</span>
                            </div>
                            <p className="text-text-main">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityPostDetail;
