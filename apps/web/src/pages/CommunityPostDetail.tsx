import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageSquare, Eye, Share2, Lock } from 'lucide-react';
import DOMPurify from 'dompurify';
import { api } from '../utils/apiClient';
import ReportButton from '../components/common/ReportButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCurrentUser } from '../utils/auth';

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
    const [error] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    // Check community access permission
    const checkAccess = () => {
        const user = getCurrentUser();
        if (!user) return false;
        // Admin always has access
        if (user.role === 'admin') return true;
        // Female users have access
        if (user.gender === 'female') return true;
        // Advertisers have access
        if (user.type === 'advertiser') return true;
        return false;
    };

    const canAccess = checkAccess();

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            try {
                const response = await api.get<any>(`/community/posts/${id}`);
                if (response.data) {
                    setPost(response.data);
                } else {
                    // API에서 게시글을 찾지 못한 경우 샘플 데이터 표시
                    createSamplePost(id);
                }
            } catch (err) {
                // API 호출 실패 시 샘플 데이터 표시
                createSamplePost(id);
            } finally {
                setLoading(false);
            }
        };

        // 샘플 게시글 생성 함수
        const createSamplePost = (postId: string) => {
            const samplePost: Post = {
                id: postId,
                category: '자유게시판',
                title: `[샘플] 게시글 - ${postId}`,
                content: `<p>이 게시글은 샘플 데이터입니다.</p>
                <p>게시글 ID: ${postId}</p>
                <br/>
                <p>실제 게시글은 사용자가 작성하면 표시됩니다.</p>
                <br/>
                <p>커뮤니티 기능:</p>
                <ul>
                    <li>자유게시판</li>
                    <li>업소후기</li>
                    <li>구인구직</li>
                    <li>질문답변</li>
                </ul>`,
                authorName: '샘플 작성자',
                viewCount: Math.floor(Math.random() * 1000) + 100,
                likeCount: Math.floor(Math.random() * 50),
                commentCount: 0,
                createdAt: new Date().toISOString(),
                comments: []
            };
            setPost(samplePost);
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
        return <LoadingSpinner fullScreen text="게시글을 불러오는 중" />;
    }

    // Access denied - show message instead of content
    if (!canAccess) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-text-muted hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>목록으로</span>
                </button>

                <div className="bg-accent rounded-xl border border-white/5 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Lock size={32} className="text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">접근 권한이 필요합니다</h2>
                    <p className="text-text-muted mb-6">
                        커뮤니티 글 내용은 여성회원 또는 광고주 회원만 열람할 수 있습니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/login"
                            className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            로그인하기
                        </Link>
                        <Link
                            to="/signup"
                            className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                        >
                            회원가입
                        </Link>
                    </div>
                </div>
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
                <div
                    className="text-white whitespace-pre-wrap leading-relaxed min-h-[200px]"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content, {
                            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a', 'span', 'div'],
                            ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style']
                        })
                    }}
                >
                    {/* HTML content sanitized with DOMPurify to prevent XSS attacks */}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <ThumbsUp size={18} />
                            <span>추천 {post.likeCount}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <Share2 size={18} />
                            <span>공유</span>
                        </button>
                    </div>
                    <ReportButton targetType="post" targetId={post.id} targetTitle={post.title} />
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
