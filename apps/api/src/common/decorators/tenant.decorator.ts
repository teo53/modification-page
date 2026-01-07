// =============================================================================
// 📁 src/common/decorators/tenant.decorator.ts
// 🏷️  테넌트 정보 추출 데코레이터
// =============================================================================

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithTenant extends Request {
    tenant?: unknown;
    tenantId?: string;
}

export const CurrentTenant = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): unknown => {
        const request = ctx.switchToHttp().getRequest<RequestWithTenant>();
        return request.tenant;
    },
);

export const TenantId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string | undefined => {
        const request = ctx.switchToHttp().getRequest<RequestWithTenant>();
        return request.tenantId;
    },
);
