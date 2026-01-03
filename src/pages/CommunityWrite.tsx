import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, X, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPost } from '../utils/communityStorage';

const categories = [
    { id: '구인구직', label: '구인구직', description: '구인/구직 관련 글' },
    { id: '업소후기', label: '업소후기', description: '업소 후기 및 정보 공유' },
    { id: '지역정보', label: '지역정보', description: '지역 관련 정보 공유' },
    { id: '질문답변', label: '질문답변', description: '궁금한 것을 질문하세요' },
    { id: '자유게시판', label: '자유게시판', description: '자유롭게 이야기하세요' },
];

const CommunityWrite: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || '자유게시판';

    const [formData, setFormData] = useState({
        category: initialCategory,
        title: '',
        content: '',
    });
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && images.length < 5) {
            const newImages: string[] = [];
            Array.from(files).slice(0, 5 - images.length).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        newImages.push(event.target.result as string);
                        if (newImages.length === Math.min(files.length, 5 - images.length)) {
                            setImages(prev => [...prev, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!formData.content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        // Save post to localStorage
        createPost({
            title: formData.title.trim(),
            content: formData.content.trim(),
            category: formData.category,
            images: images.length > 0 ? images : undefined,
        });

        setShowSuccess(true);
        setTimeout(() => {
            navigate('/community');
        }, 1500);
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-text-main mb-2">게시글 등록 완료</h2>
                    <p className="text-text-muted">잠시 후 커뮤니티 페이지로 이동합니다...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-card border-b border-border">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => navigate('/community')}
                        className="text-text-main"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-text-main">글쓰기</h1>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="text-primary font-bold disabled:opacity-50"
                    >
                        {isSubmitting ? '등록중...' : '등록'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-bold text-text-main mb-3">카테고리 선택</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    formData.category === cat.id
                                        ? 'bg-primary text-white'
                                        : 'bg-surface text-text-muted hover:bg-accent'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-text-main mb-2">제목</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="제목을 입력해주세요"
                        className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-main placeholder:text-text-muted focus:border-primary outline-none"
                        maxLength={100}
                    />
                    <div className="text-xs text-text-muted text-right mt-1">
                        {formData.title.length}/100
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-bold text-text-main mb-2">내용</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="내용을 입력해주세요"
                        rows={10}
                        className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-main placeholder:text-text-muted focus:border-primary outline-none resize-none"
                        maxLength={5000}
                    />
                    <div className="text-xs text-text-muted text-right mt-1">
                        {formData.content.length}/5000
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-text-main mb-2">
                        사진 첨부 <span className="text-text-muted font-normal">(최대 5장)</span>
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {/* Upload Button */}
                        <label className="flex-shrink-0 w-20 h-20 bg-surface border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                            <Camera size={24} className="text-text-muted mb-1" />
                            <span className="text-xs text-text-muted">{images.length}/5</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={images.length >= 5}
                            />
                        </label>

                        {/* Image Previews */}
                        {images.map((img, idx) => (
                            <div key={idx} className="relative flex-shrink-0 w-20 h-20">
                                <img
                                    src={img}
                                    alt={`preview ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guidelines */}
                <div className="bg-surface rounded-lg p-4 border border-border">
                    <h4 className="text-sm font-bold text-text-main mb-2">작성 시 유의사항</h4>
                    <ul className="text-xs text-text-muted space-y-1">
                        <li>- 개인정보가 포함된 내용은 삭제될 수 있습니다.</li>
                        <li>- 욕설, 비방 등 부적절한 내용은 삭제됩니다.</li>
                        <li>- 광고성 게시글은 관리자 승인 후 게시됩니다.</li>
                    </ul>
                </div>

                {/* Submit Button (Mobile) */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold disabled:opacity-50"
                >
                    {isSubmitting ? '등록 중...' : '게시글 등록하기'}
                </motion.button>
            </form>
        </div>
    );
};

export default CommunityWrite;
