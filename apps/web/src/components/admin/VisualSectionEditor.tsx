/**
 * 달빛알바 프리미엄 비주얼 에디터 (VisualSectionEditor v6)
 * - Premium Dark Theme 적용 (브랜드 아이덴티티 반영)
 * - Contextual Editor 구조 (좌측 고정 패널 + 중앙 캔버스)
 * - 직관적인 편집 피드백 강화
 */
import React, { useState, Suspense } from 'react';
import {
    Eye, EyeOff, X, Monitor, Smartphone,
    Layout, Type,
    Grid, Image as ImageIcon, MousePointer2,
    Move, ArrowUp, ArrowDown
} from 'lucide-react';
import type { SiteConfig } from '../../config/siteConfig';

// 직접 임포트 (렌더링 안정성 확보)
import PremiumHeroAds from '../home/PremiumHeroAds';
import QuickMenuBar from '../home/QuickMenuBar';
import PremiumAdGrid from '../home/PremiumAdGrid';
import SpecialAdGrid from '../home/SpecialAdGrid';
import CommunityPreview from '../home/CommunityPreview';
import PremiumJobGrid from '../home/PremiumJobGrid';
import CompactAdGrid from '../home/CompactAdGrid';
import TextAdsList from '../home/TextAdsList';
import DenseAdList from '../home/DenseAdList';

const componentMap: Record<string, React.ComponentType> = {
    'premium-hero': PremiumHeroAds,
    'quick-menu': QuickMenuBar,
    'vip-ads': PremiumAdGrid,
    'special-ads': SpecialAdGrid,
    'community-preview': CommunityPreview,
    'premium-jobs': PremiumJobGrid,
    'compact-ads': CompactAdGrid,
    'text-ads': TextAdsList,
    'dense-list': DenseAdList
};

const sectionMeta: Record<string, { name: string; icon: React.ElementType; description: string }> = {
    'premium-hero': { name: '메인 히어로 배너', icon: ImageIcon, description: '최상단 다이아몬드/사파이어 등급 배너' },
    'quick-menu': { name: '퀵 메뉴 바', icon: Move, description: '바로가기 아이콘 메뉴' },
    'vip-ads': { name: 'VIP 프리미엄', icon: Grid, description: 'VIP 광고 그리드 영역' },
    'special-ads': { name: '스페셜 존', icon: Grid, description: '스페셜 광고 그리드 영역' },
    'community-preview': { name: '커뮤니티 최신글', icon: Type, description: '커뮤니티 게시글 미리보기' },
    'premium-jobs': { name: '프리미엄 채용', icon: Grid, description: '카드형 프리미엄 채용정보' },
    'compact-ads': { name: '우대 채용', icon: Grid, description: '리스트형 우대 채용정보' },
    'text-ads': { name: '줄광고 리스트', icon: Type, description: '텍스트 전용 광고 리스트' },
    'dense-list': { name: '실시간 채용', icon: Grid, description: '밀집형 채용 정보 리스트' }
};

interface VisualEditorProps {
    config: SiteConfig;
    setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

import SectionErrorBoundary from './SectionErrorBoundary';
import { ContentEditorProvider } from '../../contexts/ContentEditorContext';
import { DataModeProvider } from '../../contexts/DataModeContext';

// 캔버스 내부에서 섹션을 감싸는 래퍼
const SectionWrapper = ({
    section,
    isSelected,
    onSelect,
    onMove,
    onToggle,
    children
}: {
    section: any;
    isSelected: boolean;
    onSelect: () => void;
    onMove: (dir: 'up' | 'down') => void;
    onToggle: () => void;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={`
                relative group transition-all duration-200 ease-out border-2 box-border cursor-pointer
                ${isSelected
                    ? 'border-yellow-500/70 bg-yellow-500/5 z-20 shadow-[0_0_30px_-5px_rgba(234,179,8,0.1)]'
                    : 'border-transparent hover:border-yellow-500/30 hover:bg-white/5 hover:z-10'
                }
            `}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            {/* 섹션 라벨 & 컨트롤 (선택 시에만 표시) */}
            {(isSelected) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full shadow-lg z-30 transform transition-transform duration-200 scale-100 origin-bottom">
                    <span className="text-xs font-bold mr-2">{section.title}</span>
                    <button onClick={(e) => { e.stopPropagation(); onMove('up'); }} className="p-0.5 hover:bg-black/20 rounded"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onMove('down'); }} className="p-0.5 hover:bg-black/20 rounded"><ArrowDown className="w-3 h-3" /></button>
                    <div className="w-px h-2 bg-black/20 mx-1" />
                    <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-0.5 hover:bg-black/20 rounded">
                        {section.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 opacity-50" />}
                    </button>
                </div>
            )}

            {/* 숨겨진 섹션 표시 */}
            {!section.isVisible && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-10 flex items-center justify-center border border-white/5 pointer-events-none">
                    <div className="flex items-center gap-2 text-white/40 bg-black/50 px-4 py-2 rounded-lg pointer-events-auto">
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm font-medium">숨겨진 섹션</span>
                    </div>
                </div>
            )}

            {/* 실제 컴포넌트 */}
            <div className={!section.isVisible ? 'opacity-20 grayscale pointer-events-none' : ''}>
                <SectionErrorBoundary sectionName={section.title}>
                    <Suspense fallback={<div className="h-32 flex items-center justify-center text-white/20">Loading...</div>}>
                        {children}
                    </Suspense>
                </SectionErrorBoundary>
            </div>
        </div>
    );
};

const VisualSectionEditor: React.FC<VisualEditorProps> = ({ config, setConfig, setHasChanges }) => {
    // State
    const [viewMode, setViewMode] = useState<'pc' | 'mobile'>('pc');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const sortedSections = [...config.homeSections].sort((a, b) => a.order - b.order);

    const selectedSection = sortedSections.find(s => s.id === selectedId);

    // 섹션 데이터 업데이트
    const updateSection = (id: string, field: string, value: unknown) => {
        const newSections = config.homeSections.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setConfig({ ...config, homeSections: newSections });
        setHasChanges(true);
    };

    // 순서 변경
    const moveSection = (id: string, direction: 'up' | 'down') => {
        const idx = sortedSections.findIndex(s => s.id === id);
        if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sortedSections.length - 1)) return;

        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        const reordered = [...sortedSections];
        [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];

        setConfig({ ...config, homeSections: reordered.map((s, i) => ({ ...s, order: i + 1 })) });
        setHasChanges(true);
    };

    // 설정 패널 렌더링 로직
    const renderSettingsPanel = () => {
        if (!selectedSection) return null;

        const isGridSection = [
            'vip-ads', 'special-ads', 'premium-jobs', 'compact-ads', 'dense-list'
        ].includes(selectedSection.id);

        const isQuickMenu = selectedSection.id === 'quick-menu';
        const isTextList = selectedSection.id === 'text-ads';

        return (
            <div className="animate-in slide-in-from-left-4 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">{selectedSection.title}</h2>
                        <p className="text-xs text-white/40">섹션 세부 설정</p>
                    </div>
                    <button
                        onClick={() => setSelectedId(null)}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 설정 폼 */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">표시 이름</label>
                        <input
                            type="text"
                            value={selectedSection.title}
                            onChange={(e) => updateSection(selectedSection.id, 'title', e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all"
                        />
                    </div>

                    {/* 섹션별 맞춤 설정 */}
                    {(isGridSection || isQuickMenu || isTextList) && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">레이아웃 옵션</label>

                            <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-4 border border-white/5">
                                {/* 가로 아이템 수 (그리드, 퀵메뉴) */}
                                {(isGridSection || isQuickMenu) && (
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-white/70">가로 아이템 수</span>
                                            <span className="text-yellow-500 font-mono">{selectedSection.itemsPerRow || 4}</span>
                                        </div>
                                        <input
                                            type="range" min="2" max={isQuickMenu ? 8 : 6}
                                            value={selectedSection.itemsPerRow || 4}
                                            onChange={(e) => updateSection(selectedSection.id, 'itemsPerRow', Number(e.target.value))}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-white/20 mt-1 px-1">
                                            <span>2</span><span>{isQuickMenu ? 8 : 6}</span>
                                        </div>
                                    </div>
                                )}

                                {/* 최대 노출 수 (그리드, 텍스트) */}
                                {(isGridSection || isTextList) && (
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-white/70">최대 노출 수</span>
                                            <span className="text-yellow-500 font-mono">{selectedSection.maxItems || 8}</span>
                                        </div>
                                        <input
                                            type="range" min="4" max="40" step="4"
                                            value={selectedSection.maxItems || 8}
                                            onChange={(e) => updateSection(selectedSection.id, 'maxItems', Number(e.target.value))}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-white/5">
                        <button
                            onClick={() => updateSection(selectedSection.id, 'isVisible', !selectedSection.isVisible)}
                            className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedSection.isVisible
                                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}
                        >
                            {selectedSection.isVisible ? (
                                <>
                                    <Eye className="w-4 h-4" /> 현재 표시 중
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" /> 현재 숨김 처리됨
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DataModeProvider>
            <ContentEditorProvider>
                <div className="fixed inset-0 z-50 bg-[#050505] text-white flex overflow-hidden font-sans">
                    {/* 1. 좌측 컨트롤 패널 */}
                    <div className="w-80 flex-shrink-0 bg-[#0f0f0f] border-r border-white/5 flex flex-col shadow-xl z-20">
                        <div className="h-16 flex items-center px-5 border-b border-white/5 bg-[#141414]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                <h1 className="font-bold text-lg tracking-tight text-white/90">DESIGN STUDIO</h1>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            {selectedSection ? renderSettingsPanel() : (
                                /* 기본 모드: 섹션 트리 뷰 */
                                <div className="animate-in slide-in-from-left-4 duration-200">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-white mb-1">홈 구성요소</h2>
                                        <p className="text-xs text-white/40">섹션을 선택하여 편집하세요.</p>
                                    </div>

                                    <div className="space-y-2">
                                        {sortedSections.map((section) => {
                                            const Meta = sectionMeta[section.id] || { icon: Layout, name: '' };
                                            return (
                                                <div
                                                    key={section.id}
                                                    onClick={() => setSelectedId(section.id)}
                                                    className={`
                                                    group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                                                    ${!section.isVisible ? 'opacity-50' : ''}
                                                    ${selectedId === section.id ? 'bg-white/5 border-white/10' : 'border-transparent hover:bg-white/5'}
                                                `}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:text-yellow-500 transition-colors">
                                                        <Meta.icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-white/90 truncate">{section.title}</div>
                                                        <div className="text-[10px] text-white/40 truncate">{Meta.name}</div>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MousePointer2 className="w-3 h-3 text-white/30" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 p-4 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl border border-yellow-500/20">
                                        <h3 className="text-sm font-bold text-yellow-500 mb-1">💡 Pro Tip</h3>
                                        <p className="text-xs text-white/60 leading-relaxed">
                                            우측 캔버스에서 섹션을 직접 클릭해도 설정 메뉴가 열립니다.
                                            <br />
                                            <span className="text-white/40 mt-1 block">
                                                텍스트나 이미지를 클릭하여 직접 수정할 수 있습니다.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                            <button onClick={() => window.location.reload()} className="w-full mt-2 text-white/40 hover:text-white text-xs py-2 transition-colors">
                                저장하지 않고 나가기
                            </button>
                        </div>
                    </div>

                    {/* 2. 중앙 캔버스 영역 */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative">
                        <div className="h-16 flex items-center justify-center border-b border-white/5 relative z-20">
                            <div className="bg-[#1a1a1a] rounded-lg p-1 flex border border-white/5">
                                <button
                                    onClick={() => setViewMode('pc')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'pc' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
                                >
                                    <Monitor className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('mobile')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
                                >
                                    <Smartphone className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 flex justify-center perspective-[1000px]">
                            <div className={`bg-[#111] transition-all duration-500 ease-in-out origin-top shadow-2xl shadow-black ${viewMode === 'pc' ? 'w-full max-w-[1240px]' : 'w-[375px] my-4 rounded-[40px] border-[8px] border-[#222] overflow-hidden min-h-[800px]'}`}>
                                {viewMode === 'mobile' && (
                                    <div className="h-7 bg-[#222] w-full absolute top-0 left-0 z-20 rounded-t-[32px] flex justify-center items-end pb-1">
                                        <div className="w-16 h-4 bg-[#0a0a0a] rounded-full"></div>
                                    </div>
                                )}

                                <div className={`bg-[#0a0a0a] min-h-full ${viewMode === 'mobile' ? 'pt-8' : ''}`}>
                                    {sortedSections.map((section) => {
                                        const Component = componentMap[section.id];
                                        if (!Component) return null;

                                        return (
                                            <SectionWrapper
                                                key={section.id}
                                                section={section}
                                                isSelected={selectedId === section.id}
                                                onSelect={() => setSelectedId(section.id)}
                                                onMove={(dir: 'up' | 'down') => moveSection(section.id, dir)}
                                                onToggle={() => updateSection(section.id, 'isVisible', !section.isVisible)}
                                            >
                                                {/* Pass layout props and isEditMode */}
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                <Component {...section as any} isEditMode={true} />
                                            </SectionWrapper>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContentEditorProvider>
        </DataModeProvider>
    );
};

export default VisualSectionEditor;
