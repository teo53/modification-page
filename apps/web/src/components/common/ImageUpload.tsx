// Image Upload Component
// 드래그 앤 드롭 및 클릭 업로드 지원

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, IS_UPLOAD_TEST_MODE } from '../../utils/uploadService';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    placeholder?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    placeholder = '이미지를 업로드하세요',
    className = ''
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        setError(null);
        setIsUploading(true);

        try {
            const result = await uploadImage(file, 'ads');

            if (result.success && result.url) {
                onChange(result.url);
            } else {
                setError(result.error || '업로드 실패');
            }
        } catch (err) {
            setError('업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            setError('이미지 파일만 업로드 가능합니다.');
        }
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {value ? (
                // 이미지 미리보기
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-background group">
                    <img
                        src={value}
                        alt="업로드된 이미지"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            onClick={handleClick}
                            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            title="이미지 변경"
                        >
                            <Upload size={20} className="text-white" />
                        </button>
                        <button
                            onClick={handleRemove}
                            className="p-3 rounded-full bg-red-500/50 hover:bg-red-500/70 transition-colors"
                            title="이미지 삭제"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                    {IS_UPLOAD_TEST_MODE && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded bg-yellow-500/80 text-xs text-black font-medium">
                            테스트 모드
                        </div>
                    )}
                </div>
            ) : (
                // 업로드 영역
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        relative h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer
                        flex flex-col items-center justify-center gap-3
                        ${isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-white/20 hover:border-primary/50 bg-background/50'
                        }
                        ${isUploading ? 'pointer-events-none' : ''}
                    `}
                >
                    {isUploading ? (
                        <>
                            <Loader2 size={40} className="text-primary animate-spin" />
                            <p className="text-text-muted text-sm">업로드 중...</p>
                        </>
                    ) : (
                        <>
                            <div className="p-4 rounded-full bg-primary/10">
                                <ImageIcon size={32} className="text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-medium">{placeholder}</p>
                                <p className="text-text-muted text-sm mt-1">
                                    클릭하거나 파일을 드래그하세요
                                </p>
                                <p className="text-text-muted/50 text-xs mt-2">
                                    JPG, PNG, GIF (최대 10MB)
                                </p>
                            </div>
                        </>
                    )}

                    {IS_UPLOAD_TEST_MODE && !isUploading && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded bg-yellow-500/80 text-xs text-black font-medium">
                            테스트 모드
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};

export default ImageUpload;
