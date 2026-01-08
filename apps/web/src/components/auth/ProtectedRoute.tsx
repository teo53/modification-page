import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'advertiser' | 'user';
    requireAuth?: boolean;
}

/**
 * ProtectedRoute - 인증 및 권한 확인 컴포넌트
 *
 * @param children - 보호된 컴포넌트
 * @param requiredRole - 필요한 역할 ('admin', 'advertiser', 'user')
 * @param requireAuth - 로그인 필수 여부 (기본값: true)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requireAuth = true
}) => {
    const location = useLocation();
    const user = getCurrentUser();

    // 로그인 필수인데 로그인 안됨
    if (requireAuth && !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 역할 기반 접근 제어
    if (requiredRole && user) {
        switch (requiredRole) {
            case 'admin':
                // role 필드로 관리자 확인 (이메일 기반 X)
                if (user.role !== 'admin') {
                    return <Navigate to="/" replace />;
                }
                break;
            case 'advertiser':
                // 광고주는 type 필드로 확인 (type: 'advertiser' 또는 admin 역할)
                if (user.type !== 'advertiser' && user.role !== 'admin') {
                    return <Navigate to="/" replace />;
                }
                break;
            case 'user':
                // 일반 사용자는 로그인만 되어 있으면 됨
                break;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
