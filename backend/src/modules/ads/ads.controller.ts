// =============================================================================
// 📁 src/modules/ads/ads.controller.ts
// 🏷️  광고 API 컨트롤러
// =============================================================================

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { QueryAdDto } from './dto/query-ad.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('ads')
export class AdsController {
    constructor(
        private adsService: AdsService,
        private configService: ConfigService,
    ) { }

    // ============================================
    // 광고 목록 조회 (공개)
    // ============================================
    @Public()
    @Get()
    async findAll(@Query() query: QueryAdDto, @Req() req: Request) {
        const tenantId = this.getTenantId(req);
        const result = await this.adsService.findAll(tenantId, query);

        return {
            success: true,
            ...result,
        };
    }

    // ============================================
    // 광고 상세 조회 (공개)
    // ============================================
    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request) {
        const tenantId = this.getTenantId(req);
        const ad = await this.adsService.findOne(tenantId, id);

        return {
            success: true,
            data: ad,
        };
    }

    // ============================================
    // 광고 등록 (광고주+)
    // ============================================
    @Post()
    @UseGuards(RolesGuard)
    @Roles('EMPLOYER', 'ADMIN', 'SUPER_ADMIN')
    async create(
        @Body() dto: CreateAdDto,
        @CurrentUser('id') userId: string,
        @Req() req: Request,
    ) {
        const tenantId = this.getTenantId(req);
        const ipAddress = this.getIpAddress(req);

        const ad = await this.adsService.create(tenantId, userId, dto, ipAddress);

        return {
            success: true,
            message: '광고가 등록되었습니다. 관리자 승인 후 게시됩니다.',
            data: ad,
        };
    }

    // ============================================
    // 광고 수정 (소유자/관리자)
    // ============================================
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: Partial<CreateAdDto>,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Req() req: Request,
    ) {
        const tenantId = this.getTenantId(req);
        const ipAddress = this.getIpAddress(req);

        const ad = await this.adsService.update(
            tenantId,
            id,
            userId,
            userRole as any,
            dto,
            ipAddress,
        );

        return {
            success: true,
            message: '광고가 수정되었습니다.',
            data: ad,
        };
    }

    // ============================================
    // 광고 삭제 (소유자/관리자)
    // ============================================
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Req() req: Request,
    ) {
        const tenantId = this.getTenantId(req);
        const ipAddress = this.getIpAddress(req);

        const result = await this.adsService.remove(
            tenantId,
            id,
            userId,
            userRole as any,
            ipAddress,
        );

        return {
            success: true,
            ...result,
        };
    }

    // ============================================
    // 조회수 증가 (공개)
    // ============================================
    @Public()
    @Post(':id/view')
    @HttpCode(HttpStatus.OK)
    async incrementView(
        @Param('id') id: string,
        @Req() req: Request,
        @CurrentUser('id') userId?: string,
    ) {
        const tenantId = this.getTenantId(req);
        const ipHash = this.hashIp(this.getIpAddress(req));
        const sessionId = req.cookies?.sessionId;
        const userAgent = req.headers['user-agent'];
        const referer = req.headers['referer'];

        const result = await this.adsService.incrementView(
            tenantId,
            id,
            ipHash,
            userId,
            sessionId,
            userAgent,
            referer,
        );

        return {
            success: true,
            ...result,
        };
    }

    // ============================================
    // 헬퍼 메서드
    // ============================================
    private getTenantId(req: Request): string {
        return (req.headers['x-tenant-id'] as string) ||
            this.configService.get('defaultTenantId') ||
            'default';
    }

    private getIpAddress(req: Request): string {
        return (req.headers['x-forwarded-for'] as string) ||
            req.ip ||
            'unknown';
    }

    private hashIp(ip: string): string {
        return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    }
}
