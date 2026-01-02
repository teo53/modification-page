import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    onAgree?: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, title, content, onAgree }) => {
    const [hasScrolledToBottom, setHasScrolledToBottom] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const isBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
        if (isBottom) {
            setHasScrolledToBottom(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="font-bold text-xl text-text-main">{title}</h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-main">
                        <X size={24} />
                    </button>
                </div>

                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="p-6 overflow-y-auto flex-1 text-sm text-text-muted whitespace-pre-line"
                >
                    {content}
                </div>

                <div className="p-6 border-t border-border">
                    {onAgree ? (
                        <button
                            onClick={onAgree}
                            disabled={!hasScrolledToBottom}
                            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {hasScrolledToBottom ? '동의하고 계속하기' : '내용을 끝까지 읽어주세요'}
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full bg-surface text-text-main font-bold py-3 rounded-lg hover:bg-border transition-colors"
                        >
                            닫기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
