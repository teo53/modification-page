// Admin CRM - 보안 상태 패널

import React from 'react';
import { Shield } from 'lucide-react';
import { SecurityStatusCard } from './StatCards';

interface SecurityPanelProps {
    useSampleData: boolean;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ useSampleData }) => {
    return (
        <div className="mb-8 bg-accent rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Shield size={18} className="text-green-400" />
                    보안 및 배포 상태
                </h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <SecurityStatusCard
                    label="비밀번호 암호화"
                    value="SHA-256 해시"
                    status="active"
                />
                <SecurityStatusCard
                    label="크롤링 차단"
                    value="robots.txt 활성"
                    status="active"
                />
                <SecurityStatusCard
                    label="개발자도구 차단"
                    value="프로덕션 전용"
                    status="warning"
                />
                <SecurityStatusCard
                    label="배포 모드"
                    value={useSampleData ? '홍보/시연용' : '실제 운영'}
                    status={useSampleData ? 'warning' : 'active'}
                />
            </div>
            {useSampleData && (
                <div className="px-4 pb-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-sm text-yellow-400">
                            <strong>🎨 홍보 모드 활성화됨</strong> - 모든 광고, 사용자 정보가 샘플 데이터로 대체됩니다.
                            이 상태로 배포하면 실제 데이터가 외부에 노출되지 않습니다.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
