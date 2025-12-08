import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageSquare, Eye, Share2 } from 'lucide-react';
import { MOCK_POSTS } from './CommunityPage';

const CommunityPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const post = MOCK_POSTS.find(p => p.id === Number(id));

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">게시글을 찾을 수 없습니다</h2>
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
                className="flex items-center gap-2 text-text-muted hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>목록으로</span>
            </button>

            {/* Post Content */}
            <div className="bg-accent rounded-xl border border-white/5 p-6 mb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${post.isNotice || post.isBest
                                ? 'bg-primary text-black'
                                : 'bg-white/10 text-text-muted'
                            }`}>
                            {post.categoryLabel}
                        </span>
                        <span className="text-sm text-text-muted">{post.date}</span>
                    </div>
                    <button className="text-text-muted hover:text-white transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-4">
                    {post.title}
                </h1>

                {/* Author & Stats */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
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

                {/* Content */}
                <div className="text-white whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                        <ThumbsUp size={18} />
                        <span>추천 {post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                        <Share2 size={18} />
                        <span>공유</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-accent rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                    댓글 {post.comments}개
                </h3>

                {/* Comment Input */}
                <div className="mb-6">
                    <textarea
                        className="w-full bg-background border border-white/10 rounded-lg p-4 text-white placeholder:text-text-muted focus:border-primary outline-none resize-none"
                        rows={3}
                        placeholder="댓글을 입력하세요..."
                    />
                    <div className="flex justify-end mt-2">
                        <button className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
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
                        <div key={idx} className="p-4 rounded-lg bg-background border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-white">{comment.author}</span>
                                <span className="text-xs text-text-muted">{comment.date}</span>
                            </div>
                            <p className="text-white">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityPostDetail;
