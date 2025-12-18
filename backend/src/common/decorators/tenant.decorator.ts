// =============================================================================
// 📁 src/common/decorators/tenant.decorator.ts
// 🏷️  테넌트 정보 추출 데코레이터
// =============================================================================

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTenant = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.tenant;
    },
);

export const TenantId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.tenantId;
    },
);
