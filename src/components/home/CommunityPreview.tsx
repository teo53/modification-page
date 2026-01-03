import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, ThumbsUp, Sparkles } from 'lucide-react';

import communityData from '../../data/community_data.json';

const communityPosts = communityData.slice(0, 5);

const CommunityPreview: React.FC = () => {
    return (
        <section className="py-8 container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <MessageSquare className="text-primary" size={24} />
                    </div>
                    커뮤니티
                </h2>
                <Link to="/community" className="text-sm text-text-muted hover:text-primary">더보기 +</Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Popular Posts */}
                <div className="bg-surface rounded-xl border border-border p-6">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <Sparkles className="text-yellow-400" size={20} />
                        인기 게시글
                    </h3>
                    <div className="space-y-3">
                        {communityPosts.slice(0, 5).map((post) => (
                            <Link
                                key={post.id}
                                to={`/community/post/${post.id}`}
                                className="block group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                                                {post.category}
                                            </span>
                                            <span className="text-xs text-text-muted">{post.date}</span>
                                        </div>
                                        <p className="text-text-main group-hover:text-primary transition-colors truncate">
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
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Write */}
                <div className="bg-surface rounded-xl border border-border p-6">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary"></div>
                        </div>
                        빠른 글쓰기
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/community?category=job"
                                className="p-4 rounded-lg bg-accent border border-border hover:border-primary transition-colors text-center group"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                    <div className="w-5 h-5 rounded bg-blue-500"></div>
                                </div>
                                <div className="text-sm font-bold text-text-main">구인구직</div>
                            </Link>
                            <Link
                                to="/community?category=review"
                                className="p-4 rounded-lg bg-accent border border-border hover:border-primary transition-colors text-center group"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                                    <Sparkles size={20} className="text-yellow-500" />
                                </div>
                                <div className="text-sm font-bold text-text-main">업소후기</div>
                            </Link>
                            <Link
                                to="/community?category=region"
                                className="p-4 rounded-lg bg-accent border border-border hover:border-primary transition-colors text-center group"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-sm font-bold text-text-main">지역정보</div>
                            </Link>
                            <Link
                                to="/community?category=qna"
                                className="p-4 rounded-lg bg-accent border border-border hover:border-primary transition-colors text-center group"
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                </div>
                                <div className="text-sm font-bold text-text-main">질문답변</div>
                            </Link>
                        </div>
                        <Link
                            to="/community/write"
                            className="block w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors text-center"
                        >
                            + 새 글 작성하기
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityPreview;
