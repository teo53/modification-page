// =============================================================================
// CommunityAccessGuard - 커뮤니티 접근 제어 가드
// 접근 조건:
// 1. 인증된 사용자만 접근 가능
// 2. ADMIN/SUPER_ADMIN/MODERATOR: 항상 허용
// 3. EMPLOYER: 활성 광고가 있는 경우에만 허용
// 4. SEEKER: 여성(FEMALE)인 경우에만 허용
// =============================================================================

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { UserRole, Gender, AdStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

interface AuthenticatedUser {
    id: string;
    role: UserRole;
    gender: Gender | null;
    tenantId: string;
}

@Injectable()
export class CommunityAccessGuard implements CanActivate {
    private readonly logger = new Logger(CommunityAccessGuard.name);

    constructor(private prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as AuthenticatedUser | undefined;

        // 1. 인증 확인
        if (!user) {
            this.logger.warn('Community access denied: Not authenticated');
            throw new ForbiddenException('로그인이 필요합니다.');
        }

        // 2. 관리자 권한 체크 (ADMIN, SUPER_ADMIN, MODERATOR)
        const adminRoles: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR];
        if (adminRoles.includes(user.role)) {
            return true;
        }

        // 3. 광고주(EMPLOYER) 체크 - 활성 광고가 있어야 함
        if (user.role === UserRole.EMPLOYER) {
            const activeAdCount = await this.prisma.ad.count({
                where: {
                    userId: user.id,
                    status: AdStatus.ACTIVE,
                },
            });

            if (activeAdCount > 0) {
                return true;
            }

            this.logger.warn(`Community access denied: EMPLOYER ${user.id} has no active ads`);
            throw new ForbiddenException(
                '광고주 회원님은 진행중인 광고가 있어야 커뮤니티를 이용하실 수 있습니다.',
            );
        }

        // 4. 구직자(SEEKER) 체크 - 여성만 허용
        if (user.role === UserRole.SEEKER) {
            if (user.gender === Gender.FEMALE) {
                return true;
            }

            this.logger.warn(`Community access denied: SEEKER ${user.id} is not female`);
            throw new ForbiddenException(
                '커뮤니티는 여성회원 전용입니다.',
            );
        }

        // 기타 역할은 접근 불가
        this.logger.warn(`Community access denied: Unknown role ${user.role} for user ${user.id}`);
        throw new ForbiddenException('커뮤니티 이용 권한이 없습니다.');
    }
}
