// =============================================================================
// 📁 src/modules/ads/ads.service.spec.ts
// 🧪 광고 서비스 유닛 테스트
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { AdsService } from './ads.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { AdStatus, AdHistoryAction, UserRole } from '@prisma/client';

describe('AdsService', () => {
    let service: AdsService;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prismaService: any;

    const mockAd = {
        id: 'ad-123',
        tenantId: 'tenant-1',
        userId: 'user-123',
        businessName: 'Test Business',
        title: 'Test Ad Title',
        description: 'Test description',
        status: AdStatus.ACTIVE,
        viewCount: 100,
        clickCount: 50,
        applyCount: 10,
        sortPriority: 0,
        region: '서울',
        district: '강남구',
        industryLevel2: '업종',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user: {
            id: 'user-123',
            nickname: 'testuser',
            businessName: 'Test Business',
        },
        product: {
            name: 'Premium',
            code: 'premium',
            sortPriority: 100,
        },
    };

    beforeEach(async () => {
        const mockPrismaService = {
            ad: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                count: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
            adView: {
                findFirst: jest.fn(),
                create: jest.fn(),
            },
            adHistory: {
                create: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<AdsService>(AdsService);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        prismaService = module.get(PrismaService);
    });

    describe('findAll', () => {
        it('should return paginated list of ads', async () => {
            prismaService.ad.count.mockResolvedValue(50);
            prismaService.ad.findMany.mockResolvedValue([mockAd]);

            const result = await service.findAll('tenant-1', {});

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta');
            expect(result.meta.total).toBe(50);
            expect(result.data).toHaveLength(1);
        });

        it('should apply search filter correctly', async () => {
            prismaService.ad.count.mockResolvedValue(1);
            prismaService.ad.findMany.mockResolvedValue([mockAd]);

            await service.findAll('tenant-1', { search: 'Test' });

            expect(prismaService.ad.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        OR: expect.arrayContaining([
                            expect.objectContaining({ title: { contains: 'Test', mode: 'insensitive' } }),
                        ]),
                    }),
                }),
            );
        });

        it('should apply region filter correctly', async () => {
            prismaService.ad.count.mockResolvedValue(1);
            prismaService.ad.findMany.mockResolvedValue([mockAd]);

            await service.findAll('tenant-1', { region: '서울' });

            expect(prismaService.ad.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        region: '서울',
                    }),
                }),
            );
        });

        it('should calculate pagination correctly', async () => {
            prismaService.ad.count.mockResolvedValue(100);
            prismaService.ad.findMany.mockResolvedValue([mockAd]);

            const result = await service.findAll('tenant-1', { page: 2, limit: 20 });

            expect(result.meta.page).toBe(2);
            expect(result.meta.limit).toBe(20);
            expect(result.meta.totalPages).toBe(5);
            expect(result.meta.hasNextPage).toBe(true);
            expect(result.meta.hasPrevPage).toBe(true);
        });
    });

    describe('findOne', () => {
        it('should return single ad by id', async () => {
            prismaService.ad.findFirst.mockResolvedValue(mockAd);

            const result = await service.findOne('tenant-1', 'ad-123');

            expect(result).toBeDefined();
            expect(result.id).toBe('ad-123');
        });

        it('should throw NotFoundException if ad not found', async () => {
            prismaService.ad.findFirst.mockResolvedValue(null);

            await expect(service.findOne('tenant-1', 'nonexistent')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        const createAdDto = {
            businessName: 'New Business',
            title: 'New Ad',
            description: 'New description',
            region: '서울',
            district: '강남구',
        };

        it('should create new ad successfully', async () => {
            prismaService.ad.create.mockResolvedValue({
                ...mockAd,
                id: 'new-ad-id',
                status: AdStatus.PENDING,
            });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const result = await service.create('tenant-1', 'user-123', createAdDto as CreateAdDto);

            expect(result).toBeDefined();
            expect(prismaService.ad.create).toHaveBeenCalled();
            expect(prismaService.adHistory.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        action: AdHistoryAction.CREATED,
                    }),
                }),
            );
        });

        it('should create ad with PENDING status', async () => {
            prismaService.ad.create.mockResolvedValue({
                ...mockAd,
                status: AdStatus.PENDING,
            });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await service.create('tenant-1', 'user-123', createAdDto as CreateAdDto);

            expect(prismaService.ad.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        status: AdStatus.PENDING,
                    }),
                }),
            );
        });
    });

    describe('update', () => {
        const updateDto = { title: 'Updated Title' };

        it('should update ad successfully as owner', async () => {
            prismaService.ad.findFirst.mockResolvedValue(mockAd);
            prismaService.ad.update.mockResolvedValue({ ...mockAd, ...updateDto });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            const result = await service.update(
                'tenant-1',
                'ad-123',
                'user-123',
                UserRole.SEEKER,
                updateDto,
            );

            expect(result.title).toBe('Updated Title');
        });

        it('should update ad successfully as admin', async () => {
            prismaService.ad.findFirst.mockResolvedValue({ ...mockAd, userId: 'other-user' });
            prismaService.ad.update.mockResolvedValue({ ...mockAd, ...updateDto });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            const result = await service.update(
                'tenant-1',
                'ad-123',
                'admin-user',
                UserRole.ADMIN,
                updateDto,
            );

            expect(result).toBeDefined();
        });

        it('should throw ForbiddenException if not owner and not admin', async () => {
            prismaService.ad.findFirst.mockResolvedValue({ ...mockAd, userId: 'other-user' });

            await expect(
                service.update('tenant-1', 'ad-123', 'user-123', UserRole.SEEKER, updateDto),
            ).rejects.toThrow(ForbiddenException);
        });

        it('should set status to PENDING when non-admin updates', async () => {
            prismaService.ad.findFirst.mockResolvedValue(mockAd);
            prismaService.ad.update.mockResolvedValue({ ...mockAd, status: AdStatus.PENDING });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            await service.update('tenant-1', 'ad-123', 'user-123', UserRole.SEEKER, updateDto);

            expect(prismaService.ad.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        status: AdStatus.PENDING,
                    }),
                }),
            );
        });
    });

    describe('remove', () => {
        it('should soft delete ad as owner', async () => {
            prismaService.ad.findFirst.mockResolvedValue(mockAd);
            prismaService.ad.update.mockResolvedValue({ ...mockAd, deletedAt: new Date() });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            const result = await service.remove('tenant-1', 'ad-123', 'user-123', UserRole.SEEKER);

            expect(result.message).toBe('광고가 삭제되었습니다.');
            expect(prismaService.ad.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        deletedAt: expect.any(Date),
                    }),
                }),
            );
        });

        it('should allow admin to delete any ad', async () => {
            prismaService.ad.findFirst.mockResolvedValue({ ...mockAd, userId: 'other-user' });
            prismaService.ad.update.mockResolvedValue({ ...mockAd, deletedAt: new Date() });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            const result = await service.remove('tenant-1', 'ad-123', 'admin', UserRole.ADMIN);

            expect(result.message).toBe('광고가 삭제되었습니다.');
        });

        it('should throw ForbiddenException if not owner and not admin', async () => {
            prismaService.ad.findFirst.mockResolvedValue({ ...mockAd, userId: 'other-user' });

            await expect(
                service.remove('tenant-1', 'ad-123', 'user-123', UserRole.SEEKER),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('incrementView', () => {
        it('should increment view count for new visitor', async () => {
            prismaService.adView.findFirst.mockResolvedValue(null);
            prismaService.adView.create.mockResolvedValue({ id: 'view-id' });
            prismaService.ad.update.mockResolvedValue({ ...mockAd, viewCount: 101 });

            const result = await service.incrementView('tenant-1', 'ad-123', 'ip-hash');

            expect(result.success).toBe(true);
            expect(prismaService.adView.create).toHaveBeenCalled();
            expect(prismaService.ad.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { viewCount: { increment: 1 } },
                }),
            );
        });

        it('should not increment view for recent visitor (within 1 hour)', async () => {
            prismaService.adView.findFirst.mockResolvedValue({ id: 'existing-view' });

            const result = await service.incrementView('tenant-1', 'ad-123', 'ip-hash');

            expect(result.success).toBe(true);
            expect(prismaService.adView.create).not.toHaveBeenCalled();
            expect(prismaService.ad.update).not.toHaveBeenCalled();
        });
    });

    describe('approve', () => {
        it('should approve pending ad', async () => {
            prismaService.ad.findFirst.mockResolvedValue({ ...mockAd, status: AdStatus.PENDING });
            prismaService.ad.update.mockResolvedValue({ ...mockAd, status: AdStatus.ACTIVE });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            const result = await service.approve('tenant-1', 'ad-123', 'admin-user');

            expect(result.status).toBe(AdStatus.ACTIVE);
        });

        it('should throw ForbiddenException if ad not pending', async () => {
            prismaService.ad.findFirst.mockResolvedValue({ ...mockAd, status: AdStatus.ACTIVE });

            await expect(
                service.approve('tenant-1', 'ad-123', 'admin-user'),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('reject', () => {
        it('should reject ad with reason', async () => {
            prismaService.ad.findFirst.mockResolvedValue({ ...mockAd, status: AdStatus.PENDING });
            prismaService.ad.update.mockResolvedValue({
                ...mockAd,
                status: AdStatus.REJECTED,
                rejectReason: 'Policy violation',
            });
            prismaService.adHistory.create.mockResolvedValue({ id: 'history-id' });

            const result = await service.reject(
                'tenant-1',
                'ad-123',
                'admin-user',
                'Policy violation',
            );

            expect(result.status).toBe(AdStatus.REJECTED);
            expect(result.rejectReason).toBe('Policy violation');
        });
    });
});
