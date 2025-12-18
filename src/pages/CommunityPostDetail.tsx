import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageSquare, Eye, Share2 } from 'lucide-react';
import { api } from '../utils/apiClient';

interface Comment {
    id: string;
    content: string;
    authorName: string;
    createdAt: string;
}

interface Post {
    id: string;
    category: string;
    title: string;
    content: string;
    authorName: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    comments?: Comment[];
}

const CommunityPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            try {
                const response = await api.get<any>(`/community/posts/${id}`);
                if (response.data) {
                    setPost(response.data);
                } else {
                    setError('게시글을 찾을 수 없습니다.');
                }
            } catch (err) {
                setError('게시글을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return;
        setCommentSubmitting(true);
        try {
            const response = await api.post<any>(`/community/posts/${id}/comments`, {
                content: commentContent
            });

            if (response.data) {
                // 댓글 목록 갱신 (단순 추가 또는 재조회)
                // 현재는 재조회 방식 권장
                const refreshResponse = await api.get<any>(`/community/posts/${id}`);
                if (refreshResponse.data) {
                    setPost(refreshResponse.data);
                }
                setCommentContent('');
            }
        } catch (err) {
            alert('댓글 작성 중 오류가 발생했습니다.');
        } finally {
            setCommentSubmitting(false);
        }
    };

    // 날짜 포맷 (YYYY.MM.DD HH:mm)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-text-muted">
                로딩 중...
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">{error || '게시글을 찾을 수 없습니다'}</h2>
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
                        <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary">
                            {post.category}
                        </span>
                        <span className="text-sm text-text-muted">{formatDate(post.createdAt)}</span>
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
                    <span className="text-text-muted">{post.authorName || '익명'}</span>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                            <Eye size={14} /> {post.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <ThumbsUp size={14} /> {post.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare size={14} /> {post.commentCount}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="text-white whitespace-pre-wrap leading-relaxed min-h-[200px]" dangerouslySetInnerHTML={{ __html: post.content }}>
                    {/* HTML content support if needed, otherwise use direct text */}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                        <ThumbsUp size={18} />
                        <span>추천 {post.likeCount}</span>
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
                    댓글 {post.commentCount}개
                </h3>

                {/* Comment Input */}
                <div className="mb-6">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="w-full bg-background border border-white/10 rounded-lg p-4 text-white placeholder:text-text-muted focus:border-primary outline-none resize-none"
                        rows={3}
                        placeholder="댓글을 입력하세요..."
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleCommentSubmit}
                            disabled={commentSubmitting}
                            className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {commentSubmitting ? '작성 중...' : '댓글 작성'}
                        </button>
                    </div>
                </div>

                {/* Comments from data */}
                <div className="space-y-4">
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-background border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-white">{comment.authorName || '익명'}</span>
                                    <span className="text-xs text-text-muted">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-white">{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-text-muted py-8">
                            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityPostDetail;
