// =============================================================================
// 📁 src/common/decorators/current-user.decorator.ts
// 🏷️  현재 로그인 사용자 추출 데코레이터
// =============================================================================

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
    user?: Record<string, unknown>;
}

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext): unknown => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;

        if (!user) {
            return null;
        }

        return data ? user[data] : user;
    },
);
