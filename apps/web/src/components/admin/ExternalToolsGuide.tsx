// Admin CRM - 외부 분석 도구 가이드

import React from 'react';
import { Activity } from 'lucide-react';

export const ExternalToolsGuide: React.FC = () => {
    return (
        <div className="mt-8 bg-accent rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Activity size={20} className="text-blue-400" />
                    <h3 className="font-bold text-white">외부 분석 도구 연동</h3>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {/* Microsoft Clarity */}
                <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 font-bold text-lg">C</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Microsoft Clarity</h4>
                            <p className="text-xs text-text-muted">무료 세션 녹화 + 히트맵</p>
                        </div>
                        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">무료</span>
                    </div>
                    <ul className="text-sm text-text-muted space-y-1 mb-3">
                        <li>✓ 실시간 세션 녹화 (사용자 마우스 움직임)</li>
                        <li>✓ 클릭/스크롤 히트맵</li>
                        <li>✓ 분노 클릭(Rage Click) 감지</li>
                        <li>✓ 무제한 무료</li>
                    </ul>
                    <a
                        href="https://clarity.microsoft.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                        clarity.microsoft.com에서 프로젝트 생성 →
                    </a>
                </div>

                {/* Hotjar */}
                <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-orange-400 font-bold text-lg">H</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Hotjar</h4>
                            <p className="text-xs text-text-muted">프리미엄 사용자 분석</p>
                        </div>
                        <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">유료 (무료 플랜 있음)</span>
                    </div>
                    <ul className="text-sm text-text-muted space-y-1">
                        <li>✓ 고급 세션 녹화</li>
                        <li>✓ 설문조사 및 피드백</li>
                        <li>✓ 퍼널 분석</li>
                    </ul>
                </div>

                {/* Google Analytics */}
                <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-green-400 font-bold text-lg">G</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Google Analytics 4</h4>
                            <p className="text-xs text-text-muted">종합 웹 분석</p>
                        </div>
                        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">무료</span>
                    </div>
                    <ul className="text-sm text-text-muted space-y-1">
                        <li>✓ 페이지뷰, 세션, 사용자 분석</li>
                        <li>✓ 전환 추적</li>
                        <li>✓ 실시간 리포트</li>
                    </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-sm text-yellow-400">
                        💡 <strong>설정 방법:</strong> index.html에 Clarity 스크립트가 이미 추가되어 있습니다.
                        clarity.microsoft.com에서 프로젝트를 생성하고 'YOUR_CLARITY_PROJECT_ID'를 실제 ID로 교체하세요.
                    </p>
                </div>
            </div>
        </div>
    );
};
