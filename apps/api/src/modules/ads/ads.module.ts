// =============================================================================
// 📁 src/modules/ads/ads.module.ts
// 🏷️  광고 모듈
// =============================================================================

import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';

@Module({
    controllers: [AdsController],
    providers: [AdsService],
    exports: [AdsService],
})
export class AdsModule { }
