import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, Copy, Phone } from 'lucide-react';

// Toast 타입 정의
type ToastType = 'success' | 'error' | 'info' | 'demo';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
    duration?: number;
    copyText?: string; // 복사할 텍스트 (인증번호 등)
}

interface ToastContextType {
    showToast: (toast: Omit<Toast, 'id'>) => void;
    showDemoCode: (code: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Hook
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// Toast Item Component
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (toast.duration !== 0) {
            const timer = setTimeout(onClose, toast.duration || 5000);
            return () => clearTimeout(timer);
        }
    }, [toast.duration, onClose]);

    const handleCopy = async () => {
        if (toast.copyText) {
            try {
                await navigator.clipboard.writeText(toast.copyText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('복사 실패:', err);
            }
        }
    };

    const icons = {
        success: <CheckCircle className="text-green-400" size={20} />,
        error: <AlertCircle className="text-red-400" size={20} />,
        info: <Info className="text-blue-400" size={20} />,
        demo: <Phone className="text-primary" size={20} />,
    };

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/30',
        error: 'bg-red-500/10 border-red-500/30',
        info: 'bg-blue-500/10 border-blue-500/30',
        demo: 'bg-primary/10 border-primary/30',
    };

    return (
        <div
            className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-lg animate-slide-in ${bgColors[toast.type]}`}
            style={{ maxWidth: '400px' }}
        >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm">{toast.title}</div>
                <div className="text-text-muted text-sm mt-0.5">{toast.message}</div>

                {toast.copyText && (
                    <button
                        onClick={handleCopy}
                        className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                    >
                        <span className="font-mono font-bold text-primary">{toast.copyText}</span>
                        <Copy size={14} className={copied ? 'text-green-400' : 'text-text-muted'} />
                        <span className="text-xs text-text-muted">
                            {copied ? '복사됨!' : '복사'}
                        </span>
                    </button>
                )}
            </div>
            <button
                onClick={onClose}
                className="text-text-muted hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setToasts(prev => [...prev, { ...toast, id }]);
    }, []);

    const showDemoCode = useCallback((code: string) => {
        showToast({
            type: 'demo',
            title: '📱 테스트 모드',
            message: '아래 인증번호를 입력해주세요. 실제 서비스에서는 SMS로 전송됩니다.',
            copyText: code,
            duration: 0, // 자동으로 닫히지 않음
        });
    }, [showToast]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, showDemoCode }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// CSS Animation (add to index.css if not exists)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
.animate-slide-in {
    animation: slide-in 0.3s ease-out;
}
`;
if (!document.head.querySelector('style[data-toast]')) {
    styleSheet.setAttribute('data-toast', 'true');
    document.head.appendChild(styleSheet);
}

export default ToastProvider;
