// =============================================================================
// 📁 src/common/guards/roles.guard.ts
// 🏷️  역할 기반 접근 제어 가드
// =============================================================================

import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as { id: string; role: string } | undefined;

        if (!user) {
            // 보안 이벤트: 인증되지 않은 사용자의 보호된 리소스 접근 시도
            this.logger.warn(`Access denied: No user context for ${request.method} ${request.url}`);
            return false;
        }

        const hasRole = requiredRoles.some((role) => user.role === role);

        if (!hasRole) {
            // 보안 이벤트: 권한 없는 사용자의 접근 시도
            this.logger.warn(
                `Access denied: User ${user.id} (role: ${user.role}) attempted to access ${request.method} ${request.url} (required roles: ${requiredRoles.join(', ')})`,
            );
        }

        return hasRole;
    }
}
