import { Controller, Get, Post, Param, Query, UseGuards, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminController {
    constructor(private adminService: AdminService) { }

    // 관리자 CRM 통계
    @Get('stats')
    async getStats(@CurrentUser('tenantId') tenantId: string) {
        return this.adminService.getStats(tenantId);
    }

    // 승인 대기 광고 목록
    @Get('ads/pending')
    async getPendingAds(
        @CurrentUser('tenantId') tenantId: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getPendingAds(tenantId, limit ? parseInt(limit, 10) : 10);
    }

    // 광고 승인
    @Post('ads/:id/approve')
    async approveAd(
        @CurrentUser('tenantId') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.adminService.approveAd(tenantId, id);
    }

    // 광고 반려
    @Post('ads/:id/reject')
    async rejectAd(
        @CurrentUser('tenantId') tenantId: string,
        @Param('id') id: string,
        @Body('reason') reason?: string,
    ) {
        return this.adminService.rejectAd(tenantId, id, reason);
    }

    // 회원 목록 조회
    @Get('users')
    async getUsers(
        @CurrentUser('tenantId') tenantId: string,
        @Query('filter') filter?: 'all' | 'advertiser' | 'worker',
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getUsers(
            tenantId,
            filter || 'all',
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 20,
        );
    }
}
