// =============================================================================
// 📁 test/auth.e2e-spec.ts
// 🧪 인증 E2E 테스트
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('Auth (e2e)', () => {
    let app: INestApplication<App>;
    let accessToken: string;
    let refreshTokenCookie: string;

    const testUser = {
        email: `e2e-test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'E2E Test User',
        nickname: `e2euser${Date.now()}`,
        phone: '010-1234-5678',
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
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/v1/auth/signup', () => {
        it('should register a new user', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/auth/signup')
                .send(testUser)
                .expect(201);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('tokens');
            expect(response.body.data.user.email).toBe(testUser.email);

            accessToken = response.body.data.tokens.accessToken;

            // Capture refresh token from cookies
            const cookies = response.headers['set-cookie'];
            if (cookies) {
                refreshTokenCookie = Array.isArray(cookies)
                    ? cookies.find((c: string) => c.includes('refreshToken'))
                    : cookies;
            }
        });

        it('should reject duplicate email', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/signup')
                .send(testUser)
                .expect(409);
        });

        it('should reject invalid email format', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/signup')
                .send({ ...testUser, email: 'invalid-email' })
                .expect(400);
        });

        it('should reject missing terms agreement', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/signup')
                .send({
                    ...testUser,
                    email: 'another@example.com',
                    agreeTerms: false,
                })
                .expect(400);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('tokens');

            accessToken = response.body.data.tokens.accessToken;
        });

        it('should reject invalid password', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPassword123!',
                })
                .expect(401);
        });

        it('should reject non-existent user', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'SomePassword123!',
                })
                .expect(401);
        });
    });

    describe('GET /api/v1/auth/me', () => {
        it('should return current user with valid token', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.data).toHaveProperty('email', testUser.email);
        });

        it('should reject request without token', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/auth/me')
                .expect(401);
        });

        it('should reject invalid token', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should logout successfully', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
        });
    });
});
