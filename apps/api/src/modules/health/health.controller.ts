// =============================================================================
// 📁 src/modules/health/health.controller.ts
// 🏷️  헬스체크 엔드포인트
// =============================================================================

import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
    constructor(private prisma: PrismaService) { }

    // 간단한 ping (데이터베이스 연결 없이) - Railway Healthcheck용
    @Public()
    @Get()
    ping() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'DalbitAlba API is running',
        };
    }

    // 상세 헬스체크 (데이터베이스 포함)
    @Public()
    @Get('detailed')
    async detailedCheck() {
        const dbHealthy = await this.checkDatabase();

        return {
            status: dbHealthy ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            services: {
                api: 'healthy',
                database: dbHealthy ? 'healthy' : 'unhealthy',
            },
        };
    }

    private async checkDatabase(): Promise<boolean> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return true;
        } catch {
            return false;
        }
    }
}
