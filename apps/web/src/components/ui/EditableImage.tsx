import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useContentEditor } from '../../contexts/ContentEditorContext';

interface EditableImageProps {
    sectionId?: string;
    itemId?: string;
    field?: string;
    src: string;
    alt: string;
    isEditMode?: boolean;
    className?: string;
}

const EditableImage: React.FC<EditableImageProps> = ({
    sectionId,
    itemId,
    field,
    src: initialSrc,
    alt,
    isEditMode = false,
    className = ''
}) => {
    const { getContent, updateContent } = sectionId && itemId && field ? useContentEditor() : { getContent: () => initialSrc, updateContent: () => { } };

    const shouldEdit = isEditMode && sectionId && itemId && field;
    const src = shouldEdit ? getContent(sectionId!, itemId!, field!, initialSrc) : initialSrc;

    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        if (!shouldEdit) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (!shouldEdit) return;
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (!shouldEdit) return;
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    updateContent(sectionId!, itemId!, field!, event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (!shouldEdit) {
        return <img src={src} alt={alt} className={className} />;
    }

    return (
        <div
            className={`relative group ${className} ${isDragging ? 'ring-2 ring-yellow-500 bg-yellow-500/20' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <img src={src} alt={alt} className={`w-full h-full object-cover transition-opacity ${isDragging ? 'opacity-50' : ''}`} />

            {/* Edit Overlay */}
            {(isHovered || isDragging) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
                    <Upload className={`w-8 h-8 text-white mb-2 ${isDragging ? 'animate-bounce text-yellow-500' : ''}`} />
                    <span className="text-white text-xs font-medium">
                        {isDragging ? '이미지 놓기' : '이미지 변경'}
                    </span>
                    <span className="text-white/50 text-[10px] mt-1">
                        PNG, GIF 드래그
                    </span>
                </div>
            )}
        </div>
    );
};

export default EditableImage;
