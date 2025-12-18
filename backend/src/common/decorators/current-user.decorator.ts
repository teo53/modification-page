// =============================================================================
// 📁 src/common/decorators/current-user.decorator.ts
// 🏷️  현재 로그인 사용자 추출 데코레이터
// =============================================================================

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return null;
        }

        return data ? user[data] : user;
    },
);
