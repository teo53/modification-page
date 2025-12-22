import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye, AlertCircle, Lock, UserX } from 'lucide-react';
import { api } from '../utils/apiClient';
import { getCurrentUser } from '../utils/auth';
import { getAdStats } from '../utils/adStorage';
import { sampleCommunityPosts } from '../data/sampleCommunity';

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

// 커뮤니티 접근 권한 체크
const checkCommunityAccess = (): { canAccess: boolean; reason: string } => {
    const user = getCurrentUser();

    if (!user) {
        return { canAccess: false, reason: 'login' };
    }

    // 관리자 계정은 무조건 접근 허용
    if (user.email === 'admin@lunaalba.com' || user.email === 'admin@example.com') {
        return { canAccess: true, reason: '' };
    }

    // 광고주인 경우: active 광고가 있어야 함
    if (user.type === 'advertiser') {
        const stats = getAdStats();
        if (stats.active > 0) {
            return { canAccess: true, reason: '' };
        }
        return { canAccess: false, reason: 'no_active_ads' };
    }

    // 구직자인 경우: 여성회원만
    if (user.type === 'worker') {
        if (user.gender === 'female') {
            return { canAccess: true, reason: '' };
        }
        return { canAccess: false, reason: 'male_member' };
    }

    return { canAccess: false, reason: 'unknown' };
};

const CommunityPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 20, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [accessCheck] = useState(() => checkCommunityAccess());

    const page = parseInt(searchParams.get('page') || '1');
    const selectedCategory = searchParams.get('category') || '전체';

    // 백엔드 카테고리 Enum 매핑 (표시명 → API 값)
    const categories = [
        { id: '전체', value: '', label: '전체' },
        { id: 'FREE', value: 'FREE', label: '자유게시판' },
        { id: 'QNA', value: 'QNA', label: '질문답변' },
        { id: 'REVIEW', value: 'REVIEW', label: '업소후기' },
        { id: 'TIP', value: 'TIP', label: '지역정보' },
        { id: 'NEWS', value: 'NEWS', label: '구인구직' },
    ];

    const loadInitialData = () => {
        // 1. 로컬 스토리지 데이터 가져오기
        const localPostsRaw = JSON.parse(localStorage.getItem('lunaalba_community_posts') || '[]');
        const localPosts = localPostsRaw.map((post: any) => ({
            id: String(post.id),
            category: post.category,
            title: post.title,
            authorName: post.author || '익명',
            viewCount: post.views || 0,
            likeCount: post.likes || 0,
            commentCount: post.comments || 0,
            createdAt: post.date || new Date().toISOString()
        }));

        // 2. 샘플 데이터 가져오기
        const samplePosts = sampleCommunityPosts.map((post: any) => ({
            id: String(post.id),
            category: post.category,
            title: post.title,
            authorName: post.author,
            viewCount: post.views,
            likeCount: post.likes || 0,
            commentCount: post.comments,
            createdAt: post.date
        }));

        // 3. 우선 로컬+샘플 데이터 병합하여 반환
        return [...localPosts, ...samplePosts];
    };

    const processPosts = (basePosts: CommunityPost[], apiPosts: CommunityPost[] = []) => {
        // 중복 제거 및 최신순 정렬
        const allPosts = [...basePosts, ...apiPosts];
        const uniquePostsMap = new Map();

        allPosts.forEach(post => {
            if (!uniquePostsMap.has(post.id)) {
                uniquePostsMap.set(post.id, post);
            }
        });

        const uniquePosts = Array.from(uniquePostsMap.values());

        uniquePosts.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA;
        });

        // 필터링
        const filterLabel = categories.find(c => c.id === selectedCategory)?.label;
        let filtered = uniquePosts;
        if (selectedCategory !== '전체' && filterLabel) {
            filtered = uniquePosts.filter(p => p.category === filterLabel || p.category === selectedCategory);
        }

        // 전체 카운트 계산
        const total = filtered.length;
        const limit = 20;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginated = filtered.slice(startIndex, startIndex + limit);

        return { paginated, total, totalPages };
    };

    const fetchPosts = async () => {
        if (!accessCheck.canAccess) return;

        // 1. 즉시 로컬 데이터 보여주기 (로딩 딜레이 없음)
        const initialPosts = loadInitialData();
        const initialResult = processPosts(initialPosts, []);

        setPosts(initialResult.paginated);
        setMeta({ total: initialResult.total, page, limit: 20, totalPages: initialResult.totalPages });

        // 로컬 데이터가 있으면 로딩 상태를 보여주지 않음 (사용자 경험 향상)
        if (initialResult.paginated.length === 0) {
            setLoading(true);
        }

        try {
            // 2. 백그라운드에서 API 호출
            const selectedCat = categories.find(c => c.id === selectedCategory);
            const queryCategory = selectedCat?.value || undefined;

            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '20');
            if (queryCategory) params.append('category', queryCategory);

            const response = await api.get<any>(`/community/posts?${params.toString()}`);

            if (response.data && response.data.data) {
                // API 데이터가 오면 로컬 데이터와 병합하여 업데이트
                const apiResult = processPosts(initialPosts, response.data.data);
                setPosts(apiResult.paginated);
                setMeta({ total: apiResult.total, page, limit: 20, totalPages: apiResult.totalPages });
            }
        } catch (err) {
            console.warn('API fetch failed, keeping local data:', err);
            // API 실패해도 이미 로컬 데이터가 보여지고 있으므로 에러 표시 안 함 (조용히 실패)
        } finally {
            setLoading(false);
        }
    };

    // 재시도 함수
    const handleRetry = () => {
        setError('');
        fetchPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, [page, selectedCategory, accessCheck.canAccess]);

    const handleCategoryChange = (category: string) => {
        setSearchParams({ category, page: '1' });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ category: selectedCategory, page: newPage.toString() });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 접근 제한 화면
    if (!accessCheck.canAccess) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-lg mx-auto text-center">
                    <div className="bg-accent/30 rounded-2xl p-8 border border-white/5">
                        {accessCheck.reason === 'login' ? (
                            <>
                                <Lock size={64} className="mx-auto mb-6 text-primary" />
                                <h1 className="text-2xl font-bold text-white mb-4">로그인이 필요합니다</h1>
                                <p className="text-text-muted mb-6">
                                    커뮤니티 이용을 위해 로그인해주세요.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Link to="/login" className="bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90">
                                        로그인
                                    </Link>
                                    <Link to="/signup" className="bg-accent text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 border border-white/10">
                                        회원가입
                                    </Link>
                                </div>
                            </>
                        ) : accessCheck.reason === 'no_active_ads' ? (
                            <>
                                <AlertCircle size={64} className="mx-auto mb-6 text-yellow-400" />
                                <h1 className="text-2xl font-bold text-white mb-4">광고 등록이 필요합니다</h1>
                                <p className="text-text-muted mb-6">
                                    광고주 회원님은 <span className="text-primary font-bold">진행중인 광고</span>가 있어야<br />
                                    커뮤니티를 이용하실 수 있습니다.
                                </p>
                                <Link to="/post-ad" className="inline-block bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90">
                                    광고 등록하기
                                </Link>
                            </>
                        ) : accessCheck.reason === 'male_member' ? (
                            <>
                                <UserX size={64} className="mx-auto mb-6 text-red-400" />
                                <h1 className="text-2xl font-bold text-white mb-4">접근 제한</h1>
                                <p className="text-text-muted mb-6">
                                    커뮤니티는 <span className="text-pink-400 font-bold">여성회원</span> 전용입니다.<br />
                                    광고주 회원이시라면 광고 등록 후 이용 가능합니다.
                                </p>
                                <Link to="/" className="inline-block bg-accent text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 border border-white/10">
                                    홈으로
                                </Link>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={64} className="mx-auto mb-6 text-red-400" />
                                <h1 className="text-2xl font-bold text-white mb-4">접근할 수 없습니다</h1>
                                <p className="text-text-muted mb-6">
                                    커뮤니티 이용 권한이 없습니다.
                                </p>
                                <Link to="/" className="inline-block bg-accent text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 border border-white/10">
                                    홈으로
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

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
                <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
                    <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle size={18} />
                        <span className="text-sm">{error}</span>
                    </div>
                    <button
                        onClick={handleRetry}
                        className="text-sm px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors whitespace-nowrap"
                    >
                        다시 시도
                    </button>
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
