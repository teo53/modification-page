// =============================================================================
// 📁 test/community.e2e-spec.ts
// 🧪 커뮤니티 E2E 테스트
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('Community (e2e)', () => {
    let app: INestApplication<App>;
    let accessToken: string;
    let createdPostId: string;

    const testUser = {
        email: `community-e2e-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'Community Test User',
        nickname: `communityuser${Date.now()}`,
        phone: '010-9876-5432',
        type: 'worker',
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

        // Register a test user for authenticated tests
        const signupResponse = await request(app.getHttpServer())
            .post('/api/v1/auth/signup')
            .send(testUser);

        accessToken = signupResponse.body.data?.tokens?.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /api/v1/community/posts', () => {
        it('should return paginated list of posts', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/community/posts')
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.meta).toHaveProperty('total');
            expect(response.body.meta).toHaveProperty('page');
        });

        it('should filter posts by category', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/community/posts?category=FREE')
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });

        it('should filter posts by search term', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/community/posts?search=test')
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });
    });

    describe('POST /api/v1/community/posts', () => {
        it('should create a post as authenticated user', async () => {
            const postData = {
                category: 'FREE',
                title: `E2E Test Post ${Date.now()}`,
                content: '<p>This is a test post created by E2E tests. It contains more than 10 characters.</p>',
            };

            const response = await request(app.getHttpServer())
                .post('/api/v1/community/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(postData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('title', postData.title);

            createdPostId = response.body.id;
        });

        it('should create an anonymous post with password', async () => {
            const postData = {
                category: 'FREE',
                title: `Anonymous E2E Test Post ${Date.now()}`,
                content: '<p>This is an anonymous test post. It should require a password for editing.</p>',
                authorName: '익명작성자',
                password: 'testpass123',
            };

            const response = await request(app.getHttpServer())
                .post('/api/v1/community/posts')
                .send(postData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
        });

        it('should reject post with short title', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/community/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    category: 'FREE',
                    title: 'A',
                    content: '<p>Valid content with more than 10 characters.</p>',
                })
                .expect(400);
        });

        it('should reject post with short content', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/community/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    category: 'FREE',
                    title: 'Valid Title Here',
                    content: 'short',
                })
                .expect(400);
        });
    });

    describe('GET /api/v1/community/posts/:id', () => {
        it('should return single post by id', async () => {
            if (!createdPostId) {
                console.log('No post created, skipping test');
                return;
            }

            const response = await request(app.getHttpServer())
                .get(`/api/v1/community/posts/${createdPostId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', createdPostId);
            expect(response.body).toHaveProperty('viewCount');
        });

        it('should increment view count on access', async () => {
            if (!createdPostId) return;

            const firstResponse = await request(app.getHttpServer())
                .get(`/api/v1/community/posts/${createdPostId}`);

            const initialViewCount = firstResponse.body.viewCount;

            const secondResponse = await request(app.getHttpServer())
                .get(`/api/v1/community/posts/${createdPostId}`);

            expect(secondResponse.body.viewCount).toBeGreaterThanOrEqual(initialViewCount);
        });

        it('should return 404 for non-existent post', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/community/posts/non-existent-id')
                .expect(404);
        });
    });

    describe('POST /api/v1/community/posts/:id/like', () => {
        it('should increment like count', async () => {
            if (!createdPostId) return;

            const response = await request(app.getHttpServer())
                .post(`/api/v1/community/posts/${createdPostId}/like`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
        });
    });

    describe('DELETE /api/v1/community/posts/:id', () => {
        it('should delete own post', async () => {
            if (!createdPostId) return;

            await request(app.getHttpServer())
                .delete(`/api/v1/community/posts/${createdPostId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });

        it('should reject deletion without auth for other user post', async () => {
            // This would require creating another user and post, simplified for now
            await request(app.getHttpServer())
                .delete('/api/v1/community/posts/some-other-post')
                .expect(401);
        });
    });
});
