// =============================================================================
// 📁 test/ads.e2e-spec.ts
// 🧪 광고 E2E 테스트
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('Ads (e2e)', () => {
    let app: INestApplication<App>;
    let accessToken: string;
    let createdAdId: string;

    const testUser = {
        email: `ads-e2e-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'Ads Test User',
        nickname: `adsuser${Date.now()}`,
        phone: '010-5555-1234',
        type: 'advertiser',  // 광고주로 가입
        businessName: 'Test Business Inc.',
        agreeTerms: true,
        agreePrivacy: true,
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('/api/v1');
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        app.use(cookieParser());
        await app.init();

        // Register a test advertiser user
        const signupResponse = await request(app.getHttpServer())
            .post('/api/v1/auth/signup')
            .send(testUser);

        accessToken = signupResponse.body.data?.tokens?.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /api/v1/ads', () => {
        it('should return paginated list of ads', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/ads')
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.meta).toHaveProperty('total');
            expect(response.body.meta).toHaveProperty('page');
            expect(response.body.meta).toHaveProperty('limit');
        });

        it('should filter ads by region', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/ads?region=서울')
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });

        it('should filter ads by search term', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/ads?search=test')
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });

        it('should support pagination', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/ads?page=1&limit=10')
                .expect(200);

            expect(response.body.meta.page).toBe(1);
            expect(response.body.meta.limit).toBe(10);
        });
    });

    describe('POST /api/v1/ads', () => {
        it('should create a new ad as authenticated advertiser', async () => {
            const adData = {
                businessName: 'E2E Test Business',
                title: `E2E Test Ad ${Date.now()}`,
                description: '<p>This is a test ad created by E2E tests.</p>',
                region: '서울',
                district: '강남구',
                industryLevel1: '유흥',
                industryLevel2: '클럽',
                salaryType: 'HOURLY',
                salaryAmount: 50000,
                workingHours: '20:00 - 03:00',
            };

            const response = await request(app.getHttpServer())
                .post('/api/v1/ads')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(adData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('status', 'PENDING');
            expect(response.body).toHaveProperty('businessName', adData.businessName);

            createdAdId = response.body.id;
        });

        it('should reject ad creation without auth', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/ads')
                .send({
                    businessName: 'Unauthorized Business',
                    title: 'Unauthorized Ad',
                })
                .expect(401);
        });
    });

    describe('GET /api/v1/ads/:id', () => {
        it('should return single ad by id', async () => {
            if (!createdAdId) return;

            const response = await request(app.getHttpServer())
                .get(`/api/v1/ads/${createdAdId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', createdAdId);
            expect(response.body).toHaveProperty('businessName');
        });

        it('should return 404 for non-existent ad', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/ads/non-existent-id')
                .expect(404);
        });
    });

    describe('PATCH /api/v1/ads/:id', () => {
        it('should update own ad', async () => {
            if (!createdAdId) return;

            const updateData = {
                title: `Updated E2E Test Ad ${Date.now()}`,
            };

            const response = await request(app.getHttpServer())
                .patch(`/api/v1/ads/${createdAdId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('title', updateData.title);
            // 수정 후 다시 PENDING 상태로 변경
            expect(response.body).toHaveProperty('status', 'PENDING');
        });

        it('should reject update without auth', async () => {
            if (!createdAdId) return;

            await request(app.getHttpServer())
                .patch(`/api/v1/ads/${createdAdId}`)
                .send({ title: 'Hacked Title' })
                .expect(401);
        });
    });

    describe('POST /api/v1/ads/:id/view', () => {
        it('should increment view count', async () => {
            if (!createdAdId) return;

            const response = await request(app.getHttpServer())
                .post(`/api/v1/ads/${createdAdId}/view`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
        });
    });

    describe('DELETE /api/v1/ads/:id', () => {
        it('should soft delete own ad', async () => {
            if (!createdAdId) return;

            const response = await request(app.getHttpServer())
                .delete(`/api/v1/ads/${createdAdId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
        });

        it('should reject deletion without auth', async () => {
            await request(app.getHttpServer())
                .delete('/api/v1/ads/some-ad-id')
                .expect(401);
        });
    });
});
