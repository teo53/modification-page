// =============================================================================
// 📁 src/modules/auth/auth.service.spec.ts
// 🧪 인증 서비스 유닛 테스트
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SignupUserType } from './dto/signup.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
}));

// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mock-uuid-token'),
}));

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: any;
    let jwtService: any;
    let configService: any;

    const mockUser = {
        id: 'user-123',
        tenantId: 'tenant-1',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        role: UserRole.SEEKER,
        name: 'Test User',
        nickname: 'testuser',
        phone: '01012345678',
        isActive: true,
        isBanned: false,
        banReason: null,
        deletedAt: null,
        businessName: null,
        lastLoginAt: null,
        lastLoginIp: null,
    };

    beforeEach(async () => {
        const mockPrismaService = {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
            refreshToken: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                create: jest.fn(),
                delete: jest.fn(),
                deleteMany: jest.fn(),
            },
        };

        const mockJwtService = {
            sign: jest.fn().mockReturnValue('mock-access-token'),
        };

        const mockConfigService = {
            get: jest.fn((key: string) => {
                const config: Record<string, string> = {
                    'jwt.accessExpiration': '15m',
                    'jwt.refreshExpiration': '7d',
                    'defaultTenantId': 'default-tenant',
                };
                return config[key];
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get(PrismaService);
        jwtService = module.get(JwtService);
        configService = module.get(ConfigService);
    });

    describe('signup', () => {
        const signupDto = {
            email: 'newuser@example.com',
            password: 'password123!',
            name: 'New User',
            nickname: 'newuser',
            phone: '010-1234-5678',
            type: SignupUserType.WORKER,
            agreeTerms: true,
            agreePrivacy: true,
        };

        it('should register a new user successfully', async () => {
            const tenantId = 'tenant-1';

            prismaService.user.findUnique.mockResolvedValue(null);
            prismaService.user.create.mockResolvedValue({
                ...mockUser,
                email: signupDto.email,
                name: signupDto.name,
            });
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'token-id',
                userId: 'user-123',
                token: 'mock-uuid-token',
                family: 'mock-uuid-token',
                expiresAt: new Date(),
                createdAt: new Date(),
                deviceInfo: null,
                ipAddress: null,
            });

            const result = await service.signup(signupDto, tenantId);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('tokens');
            expect(result.user.email).toBe(signupDto.email);
            expect(result.tokens.accessToken).toBe('mock-access-token');
            expect(prismaService.user.create).toHaveBeenCalled();
        });

        it('should throw ConflictException if email already exists', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);

            await expect(service.signup(signupDto, 'tenant-1')).rejects.toThrow(
                ConflictException,
            );
        });

        it('should throw BadRequestException if terms not agreed', async () => {
            const invalidDto = { ...signupDto, agreeTerms: false };
            prismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.signup(invalidDto, 'tenant-1')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should set EMPLOYER role for advertiser type', async () => {
            const advertiserDto = { ...signupDto, type: SignupUserType.ADVERTISER };
            prismaService.user.findUnique.mockResolvedValue(null);
            prismaService.user.create.mockResolvedValue({
                ...mockUser,
                role: UserRole.EMPLOYER,
            });
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'token-id',
                userId: 'user-123',
                token: 'mock-uuid-token',
                family: 'mock-uuid-token',
                expiresAt: new Date(),
                createdAt: new Date(),
                deviceInfo: null,
                ipAddress: null,
            });

            const result = await service.signup(advertiserDto, 'tenant-1');

            expect(prismaService.user.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        role: UserRole.EMPLOYER,
                    }),
                }),
            );
        });
    });

    describe('login', () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'password123!',
        };

        it('should login successfully with valid credentials', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            prismaService.user.update.mockResolvedValue(mockUser);
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'token-id',
                userId: 'user-123',
                token: 'mock-uuid-token',
                family: 'mock-uuid-token',
                expiresAt: new Date(),
                createdAt: new Date(),
                deviceInfo: null,
                ipAddress: null,
            });

            const result = await service.login(loginDto, 'tenant-1');

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('tokens');
            expect(result.user.email).toBe(loginDto.email);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.login(loginDto, 'tenant-1')).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException if user is inactive', async () => {
            prismaService.user.findUnique.mockResolvedValue({
                ...mockUser,
                isActive: false,
            });

            await expect(service.login(loginDto, 'tenant-1')).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException if user is banned', async () => {
            prismaService.user.findUnique.mockResolvedValue({
                ...mockUser,
                isBanned: true,
                banReason: 'Policy violation',
            });

            await expect(service.login(loginDto, 'tenant-1')).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

            await expect(service.login(loginDto, 'tenant-1')).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should update last login info on successful login', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            prismaService.user.update.mockResolvedValue(mockUser);
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'token-id',
                userId: 'user-123',
                token: 'mock-uuid-token',
                family: 'mock-uuid-token',
                expiresAt: new Date(),
                createdAt: new Date(),
                deviceInfo: null,
                ipAddress: null,
            });

            await service.login(loginDto, 'tenant-1', '127.0.0.1');

            expect(prismaService.user.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        lastLoginIp: '127.0.0.1',
                    }),
                }),
            );
        });
    });

    describe('logout', () => {
        it('should delete refresh token on logout', async () => {
            prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

            const result = await service.logout('mock-refresh-token');

            expect(result.message).toBe('로그아웃되었습니다.');
            expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { token: 'mock-refresh-token' },
            });
        });

        it('should handle logout with no token gracefully', async () => {
            const result = await service.logout('');

            expect(result.message).toBe('로그아웃되었습니다.');
        });
    });

    describe('logoutAll', () => {
        it('should delete all refresh tokens for user', async () => {
            prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 3 });

            const result = await service.logoutAll('user-123');

            expect(result.message).toBe('모든 기기에서 로그아웃되었습니다.');
            expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { userId: 'user-123' },
            });
        });
    });

    describe('refreshTokens', () => {
        const mockStoredToken = {
            id: 'token-id',
            userId: 'user-123',
            token: 'valid-refresh-token',
            family: 'token-family',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            user: mockUser,
        };

        it('should refresh tokens successfully', async () => {
            prismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            prismaService.refreshToken.findMany.mockResolvedValue([]);
            prismaService.refreshToken.delete.mockResolvedValue(mockStoredToken);
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'new-token-id',
                userId: 'user-123',
                token: 'mock-uuid-token',
                family: 'token-family',
                expiresAt: new Date(),
                createdAt: new Date(),
                deviceInfo: null,
                ipAddress: null,
            });

            const result = await service.refreshTokens('valid-refresh-token', 'tenant-1');

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });

        it('should throw UnauthorizedException if token not found', async () => {
            prismaService.refreshToken.findUnique.mockResolvedValue(null);

            await expect(
                service.refreshTokens('invalid-token', 'tenant-1'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if token expired', async () => {
            prismaService.refreshToken.findUnique.mockResolvedValue({
                ...mockStoredToken,
                expiresAt: new Date(Date.now() - 1000),
            });
            prismaService.refreshToken.delete.mockResolvedValue(mockStoredToken);

            await expect(
                service.refreshTokens('expired-token', 'tenant-1'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should detect token reuse and invalidate all family tokens', async () => {
            prismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            prismaService.refreshToken.findMany.mockResolvedValue([
                { ...mockStoredToken, id: 'other-token' },
            ]);
            prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 2 });

            await expect(
                service.refreshTokens('reused-token', 'tenant-1'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('validateUser', () => {
        it('should return user if found and active', async () => {
            prismaService.user.findUnique.mockResolvedValue({
                id: 'user-123',
                tenantId: 'tenant-1',
                email: 'test@example.com',
                role: UserRole.SEEKER,
                name: 'Test User',
                nickname: 'testuser',
                isActive: true,
                isBanned: false,
            });

            const payload = {
                sub: 'user-123',
                email: 'test@example.com',
                role: UserRole.SEEKER,
                tenantId: 'tenant-1',
            };

            const result = await service.validateUser(payload);

            expect(result).toBeDefined();
            expect(result?.id).toBe('user-123');
        });

        it('should return null if user is inactive', async () => {
            prismaService.user.findUnique.mockResolvedValue({
                id: 'user-123',
                isActive: false,
                isBanned: false,
            });

            const payload = {
                sub: 'user-123',
                email: 'test@example.com',
                role: UserRole.SEEKER,
                tenantId: 'tenant-1',
            };

            const result = await service.validateUser(payload);

            expect(result).toBeNull();
        });

        it('should return null if user is banned', async () => {
            prismaService.user.findUnique.mockResolvedValue({
                id: 'user-123',
                isActive: true,
                isBanned: true,
            });

            const payload = {
                sub: 'user-123',
                email: 'test@example.com',
                role: UserRole.SEEKER,
                tenantId: 'tenant-1',
            };

            const result = await service.validateUser(payload);

            expect(result).toBeNull();
        });
    });
});
