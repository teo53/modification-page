// =============================================================================
// 📁 src/prisma/prisma.module.ts
// 🏷️  Prisma 모듈 (전역)
// =============================================================================

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
