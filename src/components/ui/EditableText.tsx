import React, { useState, useRef } from 'react';
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
    const { getContent, updateContent } = sectionId && itemId && field ? useContentEditor() : { getContent: () => initialValue, updateContent: () => { } };

    // Safety check: if no IDs provided, just behave like normal text
    const shouldEdit = isEditMode && sectionId && itemId && field;

    const value = shouldEdit ? getContent(sectionId!, itemId!, field!, initialValue) : initialValue;
    const [isFocused, setIsFocused] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        setIsFocused(false);
        if (shouldEdit && contentRef.current) {
            const newValue = contentRef.current.innerText;
            if (newValue !== value) {
                updateContent(sectionId!, itemId!, field!, newValue);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            contentRef.current?.blur();
        }
    };

    const Component = as || 'span';

    if (!shouldEdit) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <Component className={className}>{value}</Component>;
    }

    // Styling for edit mode
    const editStyle = `
        relative outline-none transition-all duration-200 
        ${isFocused ? 'ring-2 ring-yellow-500/50 bg-white/10 rounded min-w-[20px] px-1' : 'hover:ring-1 hover:ring-white/30 hover:bg-white/5 rounded px-1 -mx-1'}
    `;

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
