// =============================================================================
// 📁 src/modules/ads/ads.service.ts
// 🏷️  광고 서비스
// =============================================================================

import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { QueryAdDto } from './dto/query-ad.dto';
import { AdStatus, AdHistoryAction, UserRole } from '@prisma/client';
import { WebhookService } from '../webhook/webhook.service';

interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

@Injectable()
export class AdsService {
    private readonly logger = new Logger(AdsService.name);

    constructor(
        private prisma: PrismaService,
        private readonly webhookService: WebhookService,
    ) { }

    // ============================================
    // 광고 목록 조회
    // ============================================
    async findAll(tenantId: string, query: QueryAdDto): Promise<PaginatedResult<any>> {
        const {
            search,
            region,
            district,
            industry,
            status,
            productType,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
        } = query;

        // Where 조건
        const where: any = {
            tenantId,
            deletedAt: null,
            status: status ? (status.toUpperCase() as AdStatus) : AdStatus.ACTIVE,
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { businessName: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (region) where.region = region;
        if (district) where.district = district;
        if (industry) where.industryLevel2 = industry;

        // 상품 타입 필터 (product의 code 기준)
        if (productType) {
            where.product = { code: productType };
        }

        // 총 개수
        const total = await this.prisma.ad.count({ where });
        const totalPages = Math.ceil(total / limit);

        // 정렬
        const orderBy: any = {};
        orderBy[sortBy] = sortOrder.toLowerCase();

        // 데이터 조회
        const data = await this.prisma.ad.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        businessName: true,
                    },
                },
                product: {
                    select: {
                        name: true,
                        code: true,
                        sortPriority: true,
                    },
                },
            },
            orderBy: [
                { sortPriority: 'desc' },
                orderBy,
            ],
            skip: (page - 1) * limit,
            take: limit,
        });

        // 광고주별 통계 추가 (회차, 활동일수)
        const enrichedData = await Promise.all(
            data.map(async (ad) => {
                const stats = await this.getAdvertiserStats(ad.userId, tenantId);
                return {
                    ...ad,
                    advertiserStats: stats,
                };
            })
        );

        return {
            data: enrichedData,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

    // ============================================
    // 광고주 통계 조회 (회차, 활동일수)
    // ============================================
    async getAdvertiserStats(userId: string, tenantId: string) {
        // 해당 광고주의 전체 광고 수 (회차)
        const totalAds = await this.prisma.ad.count({
            where: {
                userId,
                tenantId,
                deletedAt: null,
            },
        });

        // 해당 광고주의 첫 광고 등록일
        const firstAd = await this.prisma.ad.findFirst({
            where: {
                userId,
                tenantId,
                deletedAt: null,
            },
            orderBy: { createdAt: 'asc' },
            select: { createdAt: true },
        });

        // 활동일수 계산 (첫 광고일로부터 현재까지)
        let activeDays = 0;
        if (firstAd) {
            const startDate = firstAd.createdAt;
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - startDate.getTime());
            activeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        return {
            rotationCount: totalAds,  // 광고 회차 (총 광고 수)
            activeDays: activeDays,   // 활동일수
        };
    }

    // ============================================
    // 광고 상세 조회
    // ============================================
    async findOne(tenantId: string, id: string) {
        const ad = await this.prisma.ad.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        businessName: true,
                        phone: true,
                    },
                },
                product: true,
            },
        });

        if (!ad) {
            throw new NotFoundException('광고를 찾을 수 없습니다.');
        }

        // 광고주 통계 추가 (회차, 활동일수)
        const advertiserStats = await this.getAdvertiserStats(ad.userId, tenantId);

        return {
            ...ad,
            advertiserStats,
        };
    }

    // ============================================
    // 중복 광고 확인
    // ============================================
    private async checkDuplicateAd(
        userId: string,
        tenantId: string,
        title: string,
        businessName: string,
    ) {
        const existingAd = await this.prisma.ad.findFirst({
            where: {
                userId,
                tenantId,
                title,
                businessName,
                deletedAt: null,
                status: { in: [AdStatus.ACTIVE, AdStatus.PENDING] },
            },
        });

        if (existingAd) {
            throw new ConflictException(
                '동일한 제목과 업소명의 광고가 이미 등록되어 있습니다. 기존 광고를 수정하시거나 다른 제목을 사용해주세요.',
            );
        }
    }

    // ============================================
    // 광고 등록
    // ============================================
    async create(tenantId: string, userId: string, dto: CreateAdDto, ipAddress?: string) {
        // 중복 광고 확인
        await this.checkDuplicateAd(userId, tenantId, dto.title, dto.businessName);

        const ad = await this.prisma.ad.create({
            data: {
                tenantId,
                userId,
                businessName: dto.businessName,
                managerName: dto.managerName,
                managerPhone: dto.managerPhone,
                contactKakao: dto.contactKakao,
                contactLine: dto.contactLine,
                contactTelegram: dto.contactTelegram,
                zonecode: dto.zonecode,
                roadAddress: dto.roadAddress,
                addressDetail: dto.addressDetail,
                businessLogoUrl: dto.businessLogoUrl,
                adLogoUrl: dto.adLogoUrl,
                title: dto.title,
                description: dto.description,
                industryLevel1: dto.industryLevel1,
                industryLevel2: dto.industryLevel2,
                region: dto.region,
                district: dto.district,
                town: dto.town,
                recruitmentType: dto.recruitmentType,
                recruitNumber: dto.recruitNumber,
                workHoursType: dto.workHoursType,
                workHoursStart: dto.workHoursStart,
                workHoursEnd: dto.workHoursEnd,
                workDays: dto.workDays || [],
                salaryType: dto.salaryType,
                salaryAmount: dto.salaryAmount,
                ageMin: dto.ageMin,
                ageMax: dto.ageMax,
                ageNoLimit: dto.ageNoLimit || false,
                gender: dto.gender,
                experience: dto.experience,
                daysOff: dto.daysOff,
                deadlineDate: dto.deadlineDate ? new Date(dto.deadlineDate) : null,
                deadlineAlways: dto.deadlineAlways || false,
                welfare: dto.welfare || [],
                preferredConditions: dto.preferredConditions || [],
                receptionMethods: dto.receptionMethods || [],
                requiredDocuments: dto.requiredDocuments || [],
                keywords: dto.keywords || [],
                themes: dto.themes || [],
                thumbnail: dto.thumbnail,
                images: dto.images || [],
                productId: dto.productId,
                highlightConfig: dto.highlightConfig || null,
                jumpUpConfig: dto.jumpUpConfig || null,
                isUrgent: dto.isUrgent || false,
                status: AdStatus.PENDING,
            },
        });

        // 히스토리 기록
        await this.createHistory(ad.id, AdHistoryAction.CREATED, null, userId, ipAddress);

        this.logger.log(`New ad created: ${ad.id} by user ${userId}`);

        // Webhook 전송
        this.webhookService.sendWebhook('ad.created', ad);

        return ad;
    }

    // ============================================
    // 광고 수정
    // ============================================
    async update(
        tenantId: string,
        id: string,
        userId: string,
        userRole: UserRole,
        dto: Partial<CreateAdDto>,
        ipAddress?: string,
    ) {
        const ad = await this.findOne(tenantId, id);

        // 권한 확인
        const isOwner = ad.userId === userId;
        const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(userRole);

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('수정 권한이 없습니다.');
        }

        // 변경 내역 추적
        const changes: Record<string, { old: any; new: any }> = {};
        Object.keys(dto).forEach((key) => {
            if (ad[key] !== undefined && ad[key] !== dto[key]) {
                changes[key] = { old: ad[key], new: dto[key] };
            }
        });

        const updatedAd = await this.prisma.ad.update({
            where: { id },
            data: {
                ...dto,
                deadlineDate: dto.deadlineDate ? new Date(dto.deadlineDate) : undefined,
                // 수정 시 재승인 필요 (관리자가 아닌 경우)
                status: !isAdmin ? AdStatus.PENDING : undefined,
            },
        });

        // 히스토리 기록
        await this.createHistory(id, AdHistoryAction.UPDATED, changes, userId, ipAddress);

        return updatedAd;
    }

    // ============================================
    // 광고 삭제 (소프트 삭제)
    // ============================================
    async remove(
        tenantId: string,
        id: string,
        userId: string,
        userRole: UserRole,
        ipAddress?: string,
    ) {
        const ad = await this.findOne(tenantId, id);

        // 권한 확인
        const isOwner = ad.userId === userId;
        const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('삭제 권한이 없습니다.');
        }

        await this.prisma.ad.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        // 히스토리 기록
        await this.createHistory(id, AdHistoryAction.DELETED, null, userId, ipAddress);

        return { message: '광고가 삭제되었습니다.' };
    }

    // ============================================
    // 조회수 증가
    // ============================================
    async incrementView(
        tenantId: string,
        id: string,
        ipHash: string,
        userId?: string,
        sessionId?: string,
        userAgent?: string,
        referer?: string,
    ) {
        // 중복 조회 방지 (같은 IP에서 1시간 내 재조회 불허)
        const recentView = await this.prisma.adView.findFirst({
            where: {
                adId: id,
                ipHash,
                createdAt: {
                    gte: new Date(Date.now() - 60 * 60 * 1000), // 1시간
                },
            },
        });

        if (!recentView) {
            // 조회 기록
            await this.prisma.adView.create({
                data: {
                    adId: id,
                    ipHash,
                    userId,
                    sessionId,
                    userAgent,
                    referer,
                },
            });

            // 조회수 증가
            await this.prisma.ad.update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            });
        }

        return { success: true };
    }

    // ============================================
    // 히스토리 기록
    // ============================================
    private async createHistory(
        adId: string,
        action: AdHistoryAction,
        changes?: any,
        performedBy?: string,
        ipAddress?: string,
    ) {
        await this.prisma.adHistory.create({
            data: {
                adId,
                action,
                changes: changes || undefined,
                performedBy,
                ipAddress,
            },
        });
    }

    // ============================================
    // 관리자: 광고 승인
    // ============================================
    async approve(tenantId: string, id: string, adminId: string, ipAddress?: string) {
        const ad = await this.findOne(tenantId, id);

        if (ad.status !== AdStatus.PENDING) {
            throw new ForbiddenException('승인 대기 상태가 아닙니다.');
        }

        const updatedAd = await this.prisma.ad.update({
            where: { id },
            data: {
                status: AdStatus.ACTIVE,
                startDate: new Date(),
            },
        });

        await this.createHistory(
            id,
            AdHistoryAction.STATUS_CHANGED,
            { status: { old: AdStatus.PENDING, new: AdStatus.ACTIVE } },
            adminId,
            ipAddress,
        );

        // 알림 발송 및 Webhook
        this.webhookService.sendWebhook('ad.status.changed', {
            id,
            status: AdStatus.ACTIVE,
            user: { id: ad.userId },
            adminId,
            timestamp: new Date(),
        });

        return updatedAd;
    }

    // ============================================
    // 관리자: 광고 거절
    // ============================================
    async reject(
        tenantId: string,
        id: string,
        adminId: string,
        reason: string,
        ipAddress?: string,
    ) {
        const ad = await this.findOne(tenantId, id);

        const updatedAd = await this.prisma.ad.update({
            where: { id },
            data: {
                status: AdStatus.REJECTED,
                rejectReason: reason,
            },
        });

        await this.createHistory(
            id,
            AdHistoryAction.STATUS_CHANGED,
            { status: { old: ad.status, new: AdStatus.REJECTED }, reason },
            adminId,
            ipAddress,
        );

        // 알림 발송 및 Webhook
        this.webhookService.sendWebhook('ad.status.changed', {
            id,
            status: AdStatus.REJECTED,
            reason,
            user: { id: ad.userId },
            adminId,
            timestamp: new Date(),
        });

        return updatedAd;
    }
}
