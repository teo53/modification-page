// =============================================================================
// 📁 src/modules/community/community.module.ts
// 🏷️  커뮤니티 모듈
// =============================================================================

import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { CommunityAccessGuard } from '../../common/guards/community-access.guard';

@Module({
    controllers: [CommunityController],
    providers: [CommunityService, CommunityAccessGuard],
    exports: [CommunityService],
})
export class CommunityModule { }
