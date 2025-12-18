import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye, AlertCircle } from 'lucide-react';
import { api } from '../utils/apiClient';

interface CommunityPost {
    id: string;
    category: string;
    title: string;
    authorName: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const CommunityPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 20, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const page = parseInt(searchParams.get('page') || '1');
    const selectedCategory = searchParams.get('category') || '전체';

    const categories = [
        { id: '전체', label: '전체' },
        { id: '구인구직', label: '구인구직' },
        { id: '업소후기', label: '업소후기' },
        { id: '지역정보', label: '지역정보' },
        { id: '질문답변', label: '질문답변' },
        { id: '자유게시판', label: '자유게시판' },
    ];

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // 카테고리 필터 처리 (백엔드가 '전체'일 경우 파라미터를 생략하거나 ALL 등을 요구하는지 확인 필요)
            // 여기서는 '전체'가 아닐 때만 category 파라미터 전송
            const queryCategory = selectedCategory === '전체' ? undefined : selectedCategory;

            // Query String 구성
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '20');
            if (queryCategory) params.append('category', queryCategory);

            const response = await api.get<any>(`/community/posts?${params.toString()}`);

            if (response.data) {
                setPosts(response.data.data || []);
                setMeta(response.data.meta || { total: 0, page: 1, limit: 20, totalPages: 1 });
            } else {
                setError(response.error || '데이터를 불러오지 못했습니다.');
            }
        } catch (err) {
            setError('게시글 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page, selectedCategory]);

    const handleCategoryChange = (category: string) => {
        setSearchParams({ category, page: '1' });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ category: selectedCategory, page: newPage.toString() });
    };

    // 날짜 포맷 (YYYY.MM.DD)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">커뮤니티</h1>
                <Link
                    to="/community/write"
                    className="bg-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    글쓰기
                </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                            ? 'bg-white text-black'
                            : 'bg-accent text-text-muted hover:bg-white/10'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Post List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="text-center py-12 text-text-muted">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 text-text-muted bg-accent rounded-xl border border-white/5">
                        등록된 게시글이 없습니다.
                    </div>
                ) : (
                    posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/community/post/${post.id}`}
                            className={`block p-4 rounded-xl border transition-all hover:bg-accent/50 bg-accent border-white/5`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/10 text-text-muted`}>
                                    {post.category}
                                </span>
                                <span className="text-xs text-text-muted">{formatDate(post.createdAt)}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                {post.title}
                            </h3>

                            <div className="flex items-center justify-between text-xs text-text-muted">
                                <span>{post.authorName || '익명'}</span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <Eye size={12} /> {post.viewCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp size={12} /> {post.likeCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare size={12} /> {post.commentCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-lg bg-transparent text-text-muted disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                        &lt;
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ${page === p
                                    ? 'bg-primary text-black'
                                    : 'bg-transparent text-text-muted hover:bg-white/10'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(Math.min(meta.totalPages, page + 1))}
                        disabled={page === meta.totalPages}
                        className="px-3 py-1 rounded-lg bg-transparent text-text-muted disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;
