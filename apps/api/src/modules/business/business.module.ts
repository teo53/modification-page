// =============================================================================
// 📁 src/modules/business/business.module.ts
// 🏷️  사업자 검증 모듈
// =============================================================================

import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';

@Module({
    controllers: [BusinessController],
    providers: [BusinessService],
    exports: [BusinessService],
})
export class BusinessModule { }
