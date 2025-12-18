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

    @Public()
    @Get()
    async check() {
        const dbHealthy = await this.checkDatabase();

        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
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
