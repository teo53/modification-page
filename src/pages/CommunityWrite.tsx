import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, X, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import RichTextEditor from '../components/ui/RichTextEditor';

const CommunityWrite: React.FC = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const [formData, setFormData] = useState({
        category: 'FREE',  // 백엔드 enum 값 사용
        title: '',
        content: ''
    });
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 백엔드 카테고리 Enum 매핑 (value: API 값, label: 표시명)
    const categories = [
        { value: 'FREE', label: '자유게시판' },
        { value: 'QNA', label: '질문답변' },
        { value: 'REVIEW', label: '업소후기' },
        { value: 'TIP', label: '지역정보' },
        { value: 'NEWS', label: '구인구직' }
    ];

    // Redirect if not logged in
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-accent rounded-xl border border-white/10 p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-yellow-500">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white">로그인이 필요합니다</h2>
                    <p className="text-text-muted">글을 작성하려면 먼저 로그인해주세요.</p>
                    <div className="flex gap-2 justify-center pt-4">
                        <button
                            onClick={() => navigate('/community')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            돌아가기
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).slice(0, 5 - images.length);
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }

        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            // Try Backend API First
            try {
                const { api } = await import('../utils/apiClient');
                // 실제 백엔드가 연결되어 있다면 이 호출이 성공해야 함
                // 하지만 현재 개발/데모 환경에서는 실패할 가능성이 높음 (404 등)
                await api.post('/community/posts', {
                    category: formData.category,
                    title: formData.title,
                    content: formData.content
                });
            } catch (apiError) {
                // API 호출 실패 시 (백엔드 미구현 또는 연결 실패)
                // 로컬 스토리지에 저장하는 폴백 로직 실행
                console.warn('API call failed, saving to localStorage:', apiError);

                const existingPosts = JSON.parse(localStorage.getItem('lunaalba_community_posts') || '[]');

                const newPost = {
                    id: Date.now(), // Use timestamp as ID
                    category: categories.find(c => c.value === formData.category)?.label || '자유',
                    title: formData.title,
                    author: user?.nickname || user?.name || '익명',
                    date: new Date().toLocaleDateString(),
                    views: 0,
                    comments: 0,
                    isHot: false,
                    isNew: true,
                    content: formData.content // 목록에는 표시 안될 수 있지만 상세에는 필요
                };

                localStorage.setItem('lunaalba_community_posts', JSON.stringify([newPost, ...existingPosts]));
            }

            alert('게시글이 등록되었습니다.');
            navigate('/community');
        } catch (err: any) {
            console.error('Failed to create post:', err);
            setError(err.message || '게시글 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/community')}
                        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>돌아가기</span>
                    </button>
                    <h1 className="text-lg font-bold text-white">글쓰기</h1>
                    <div className="w-20"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                            <AlertCircle size={18} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-muted">카테고리</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${formData.category === cat.value
                                        ? 'bg-primary text-black'
                                        : 'bg-accent text-text-muted hover:bg-white/10'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-muted">
                            제목 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-accent border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-colors"
                            placeholder="제목을 입력하세요"
                            maxLength={100}
                        />
                        <div className="text-xs text-text-muted text-right">{formData.title.length}/100</div>
                    </div>

                    {/* Content - Rich Text Editor */}
                    <div className="space-y-2">
                        <RichTextEditor
                            value={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="내용을 입력하세요..."
                            simpleMode={true}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-muted">
                            이미지 첨부 <span className="text-text-muted/50">(최대 5장)</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-accent border border-white/10">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                                    >
                                        <X size={12} className="text-white" />
                                    </button>
                                </div>
                            ))}
                            {images.length < 5 && (
                                <label className="w-20 h-20 rounded-lg bg-accent border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                    <Image size={24} className="text-text-muted" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                등록 중...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                게시글 등록
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommunityWrite;
