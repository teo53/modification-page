import React, { useState, useRef, useCallback } from 'react';
import { useContentEditor } from '../../contexts/ContentEditorContext';

interface EditableTextProps<T extends React.ElementType = 'span'> {
    sectionId?: string;
    itemId?: string;
    field?: string;
    initialValue: string;
    isEditMode?: boolean;
    className?: string;
    multiline?: boolean;
    as?: T;
}

const EditableText = <T extends React.ElementType = 'span'>({
    sectionId,
    itemId,
    field,
    initialValue,
    isEditMode = false,
    className = '',
    multiline = false,
    as
}: EditableTextProps<T> & React.ComponentPropsWithoutRef<T>) => {
    // Hook을 항상 호출 (React Hooks 규칙 준수)
    const contentEditor = useContentEditor();

    // Safety check: if no IDs provided, just behave like normal text
    const shouldEdit = isEditMode && sectionId && itemId && field;

    // 조건에 따라 context 함수 또는 fallback 사용
    const getContent = shouldEdit
        ? contentEditor.getContent
        : () => initialValue;

    const value = shouldEdit ? getContent(sectionId!, itemId!, field!, initialValue) : initialValue;
    const [isFocused, setIsFocused] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        if (shouldEdit && contentRef.current) {
            const newValue = contentRef.current.innerText;
            if (newValue !== value) {
                contentEditor.updateContent(sectionId!, itemId!, field!, newValue);
            }
        }
    }, [shouldEdit, value, contentEditor, sectionId, itemId, field]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            contentRef.current?.blur();
        }
    };

    const Component = as || 'span';

    if (!shouldEdit) {
        return <Component className={className}>{value}</Component>;
    }

    // Styling for edit mode
    const editStyle = `
        relative outline-none transition-all duration-200
        ${isFocused ? 'ring-2 ring-yellow-500/50 bg-white/10 rounded min-w-[20px] px-1' : 'hover:ring-1 hover:ring-white/30 hover:bg-white/5 rounded px-1 -mx-1'}
    `;

    return (
        <Component
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`${className} ${editStyle}`}
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );
};

export default EditableText;
