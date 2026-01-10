// =============================================================================
// 📁 src/modules/email/email.module.ts
// 🏷️  이메일 모듈
// =============================================================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
    imports: [ConfigModule],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }
