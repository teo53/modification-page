// =============================================================================
// 📁 src/common/decorators/roles.decorator.ts
// 🏷️  역할 기반 접근 제어 데코레이터
// =============================================================================

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
