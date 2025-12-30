import React, { createContext, useContext, useState, ReactNode } from 'react';

type ContentValue = string; // Text or Image URL

interface ContentEditorContextType {
    // Map: sectionId -> itemId -> field -> value
    edits: Record<string, Record<string, Record<string, ContentValue>>>;
    updateContent: (sectionId: string, itemId: string, field: string, value: ContentValue) => void;
    getContent: (sectionId: string, itemId: string, field: string, initialValue: string) => string;
}

const ContentEditorContext = createContext<ContentEditorContextType | undefined>(undefined);

export const ContentEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [edits, setEdits] = useState<Record<string, Record<string, Record<string, ContentValue>>>>({});

    const updateContent = (sectionId: string, itemId: string, field: string, value: ContentValue) => {
        setEdits(prev => ({
            ...prev,
            [sectionId]: {
                ...(prev[sectionId] || {}),
                [itemId]: {
                    ...(prev[sectionId]?.[itemId] || {}),
                    [field]: value
                }
            }
        }));
    };

    const getContent = (sectionId: string, itemId: string, field: string, initialValue: string) => {
        return edits[sectionId]?.[itemId]?.[field] ?? initialValue;
    };

    return (
        <ContentEditorContext.Provider value={{ edits, updateContent, getContent }}>
            {children}
        </ContentEditorContext.Provider>
    );
};

export const useContentEditor = () => {
    const context = useContext(ContentEditorContext);
    if (!context) {
        throw new Error('useContentEditor must be used within a ContentEditorProvider');
    }
    return context;
};
