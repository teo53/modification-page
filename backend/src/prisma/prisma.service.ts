// =============================================================================
// 📁 src/prisma/prisma.service.ts
// 🏷️  Prisma 데이터베이스 서비스
// =============================================================================

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Database connected successfully');
        } catch (error) {
            this.logger.error('❌ Database connection failed', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database disconnected');
    }

    // 소프트 삭제 미들웨어 확장 가능
    async cleanupExpiredTokens(): Promise<number> {
        const { count } = await this.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        return count;
    }
}
