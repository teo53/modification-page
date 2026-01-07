// =============================================================================
// 📁 src/common/decorators/public.decorator.ts
// 🏷️  공개 엔드포인트 표시 (인증 불필요)
// =============================================================================

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
