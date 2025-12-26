import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Prisma Enum 임포트
import { AdStatus, UserRole, PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    // 관리자 CRM 통계 조회
    async getStats() {
        // 총 회원수
        const totalUsers = await this.prisma.user.count();

        // 오늘 가입한 회원
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUsers = await this.prisma.user.count({
            where: {
                createdAt: { gte: today }
            }
        });

        // 총 광고 수
        const totalAds = await this.prisma.ad.count();

        // 승인 대기 광고
        const pendingAds = await this.prisma.ad.count({
            where: { status: AdStatus.PENDING }
        });

        // 활성 광고
        const activeAds = await this.prisma.ad.count({
            where: { status: AdStatus.ACTIVE }
        });

        // 신고 접수 건수
        const reportsCount = await this.prisma.report.count({
            where: { status: 'PENDING' }
        });

        // 월 매출 계산 (이번 달 결제 합계)
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        let monthlyRevenue = 0;
        try {
            const payments = await this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    createdAt: { gte: monthStart },
                    status: PaymentStatus.COMPLETED
                }
            });
            monthlyRevenue = payments._sum.amount || 0;
        } catch {
            monthlyRevenue = 0;
        }

        // 광고주 수 (EMPLOYER = 광고주)
        const advertiserCount = await this.prisma.user.count({
            where: { role: UserRole.EMPLOYER }
        });

        // 일반 회원 수 (SEEKER = 구직자)
        const workerCount = await this.prisma.user.count({
            where: { role: UserRole.SEEKER }
        });

        // 커뮤니티 게시글 수
        const totalPosts = await this.prisma.communityPost.count();

        return {
            users: {
                total: totalUsers,
                today: todayUsers,
                advertisers: advertiserCount,
                workers: workerCount,
            },
            ads: {
                total: totalAds,
                pending: pendingAds,
                active: activeAds,
            },
            revenue: {
                monthly: monthlyRevenue,
                formatted: this.formatRevenue(monthlyRevenue),
            },
            reports: {
                count: reportsCount,
            },
            community: {
                totalPosts,
            },
            timestamp: new Date().toISOString(),
        };
    }

    // 승인 대기 광고 목록 조회
    async getPendingAds(limit = 10) {
        return this.prisma.ad.findMany({
            where: { status: AdStatus.PENDING },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        nickname: true,
                    }
                }
            }
        });
    }

    // 광고 승인
    async approveAd(adId: string) {
        return this.prisma.ad.update({
            where: { id: adId },
            data: { status: AdStatus.ACTIVE }
        });
    }

    // 광고 반려
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async rejectAd(adId: string, _reason?: string) {
        return this.prisma.ad.update({
            where: { id: adId },
            data: {
                status: AdStatus.REJECTED,
            }
        });
    }

    // 회원 목록 조회
    async getUsers(filter?: 'all' | 'advertiser' | 'worker', page = 1, limit = 20) {
        const where = filter === 'advertiser'
            ? { role: UserRole.EMPLOYER }
            : filter === 'worker'
                ? { role: UserRole.SEEKER }
                : {};

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                    role: true,
                    createdAt: true,
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // 매출 포맷팅 헬퍼
    private formatRevenue(amount: number): string {
        if (amount >= 1000000000) {
            return `${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`;
        }
        return amount.toString();
    }
}
