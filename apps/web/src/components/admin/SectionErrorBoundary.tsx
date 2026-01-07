import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
    sectionName: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * 섹션별 렌더링 에러를 포착하여 전체 에디터가 붕괴되는 것을 방지하는 Error Boundary
 */
class SectionErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error rendering section [${this.props.sectionName}]:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-40 flex flex-col items-center justify-center bg-red-500/5 border-2 border-red-500/20 rounded-xl gap-3 p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500/50" />
                    <div>
                        <h3 className="text-red-500 font-bold text-sm mb-1">렌더링 오류 발생</h3>
                        <p className="text-xs text-red-400/70 font-mono max-w-md truncate">
                            {this.state.error?.message || '알 수 없는 오류'}
                        </p>
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs rounded transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SectionErrorBoundary;
