// =============================================================================
// 📁 src/modules/auth/auth.service.ts
// 🏷️  인증 서비스 (회원가입/로그인/토큰 관리)
// =============================================================================

import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { SignupDto, SignupUserType } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    tenantId: string;
}

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string | null;
        nickname: string | null;
        role: UserRole;
        phone: string | null;
        businessName: string | null;
    };
    tokens: TokenResponse;
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    // ============================================
    // 회원가입
    // ============================================
    async signup(dto: SignupDto, tenantId: string): Promise<AuthResponse> {
        // 이메일 중복 확인
        const existingUser = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId,
                    email: dto.email,
                },
            },
        });

        if (existingUser) {
            throw new ConflictException('이미 등록된 이메일입니다.');
        }

        // 약관 동의 확인
        if (!dto.agreeTerms || !dto.agreePrivacy) {
            throw new BadRequestException('필수 약관에 동의해주세요.');
        }

        // 비밀번호 해싱
        const passwordHash = await bcrypt.hash(dto.password, 12);

        // 역할 결정
        const role = dto.type === SignupUserType.ADVERTISER
            ? UserRole.EMPLOYER
            : UserRole.SEEKER;

        // 사용자 생성
        const user = await this.prisma.user.create({
            data: {
                tenantId,
                email: dto.email,
                passwordHash,
                role,
                name: dto.name,
                nickname: dto.nickname,
                phone: dto.phone?.replace(/-/g, ''),
                address: dto.address,
                addressDetail: dto.addressDetail,
                businessName: dto.businessName,
                businessNumber: dto.businessNumber?.replace(/-/g, ''),
                agreeTerms: dto.agreeTerms,
                agreePrivacy: dto.agreePrivacy,
                agreeMarketing: dto.agreeMarketing || false,
            },
        });

        this.logger.log(`New user registered: ${user.email} (${user.role})`);

        // 토큰 생성
        const tokens = await this.generateTokens(user.id, user.email, user.role, tenantId);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                role: user.role,
                phone: user.phone,
                businessName: user.businessName,
            },
            tokens,
        };
    }

    // ============================================
    // 로그인
    // ============================================
    async login(dto: LoginDto, tenantId: string, ipAddress?: string): Promise<AuthResponse> {
        // 사용자 조회
        const user = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId,
                    email: dto.email,
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
        }

        // 계정 상태 확인
        if (!user.isActive) {
            throw new UnauthorizedException('비활성화된 계정입니다.');
        }

        if (user.isBanned) {
            throw new UnauthorizedException(`차단된 계정입니다. 사유: ${user.banReason || '문의 바랍니다.'}`);
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('탈퇴한 계정입니다.');
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
        }

        // 마지막 로그인 정보 업데이트
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                lastLoginIp: ipAddress,
            },
        });

        this.logger.log(`User logged in: ${user.email}`);

        // 토큰 생성
        const tokens = await this.generateTokens(user.id, user.email, user.role, tenantId);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                role: user.role,
                phone: user.phone,
                businessName: user.businessName,
            },
            tokens,
        };
    }

    // ============================================
    // 토큰 갱신
    // ============================================
    async refreshTokens(refreshToken: string, tenantId: string): Promise<TokenResponse> {
        // Refresh Token 조회
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        // 만료 확인
        if (storedToken.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
            throw new UnauthorizedException('토큰이 만료되었습니다. 다시 로그인해주세요.');
        }

        // 토큰 재사용 탐지 (같은 family의 다른 토큰이 있는지)
        const familyTokens = await this.prisma.refreshToken.findMany({
            where: {
                family: storedToken.family,
                id: { not: storedToken.id },
            },
        });

        if (familyTokens.length > 0) {
            // 토큰 재사용 감지 - 모든 family 토큰 삭제
            this.logger.warn(`Token reuse detected for user: ${storedToken.user.email}`);
            await this.prisma.refreshToken.deleteMany({
                where: { family: storedToken.family },
            });
            throw new UnauthorizedException('보안 위험이 감지되었습니다. 다시 로그인해주세요.');
        }

        // 기존 토큰 삭제
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

        // 새 토큰 생성 (같은 family 유지)
        return this.generateTokens(
            storedToken.user.id,
            storedToken.user.email,
            storedToken.user.role,
            tenantId,
            storedToken.family,
        );
    }

    // ============================================
    // 로그아웃
    // ============================================
    async logout(refreshToken: string): Promise<{ message: string }> {
        if (refreshToken) {
            await this.prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        return { message: '로그아웃되었습니다.' };
    }

    // 모든 기기에서 로그아웃
    async logoutAll(userId: string): Promise<{ message: string }> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });

        return { message: '모든 기기에서 로그아웃되었습니다.' };
    }

    // ============================================
    // 토큰 생성
    // ============================================
    private async generateTokens(
        userId: string,
        email: string,
        role: UserRole,
        tenantId: string,
        existingFamily?: string,
    ): Promise<TokenResponse> {
        const payload: JwtPayload = {
            sub: userId,
            email,
            role,
            tenantId,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('jwt.accessExpiration') || '15m',
        });

        const refreshToken = uuidv4();
        const family = existingFamily || uuidv4();

        // Refresh Token 저장
        const refreshExpiration = this.configService.get('jwt.refreshExpiration') || '7d';
        const expiresAt = this.calculateExpiration(refreshExpiration);

        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
                family,
                expiresAt,
            },
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15분 (초 단위)
        };
    }

    private calculateExpiration(duration: string): Date {
        const now = new Date();
        const match = duration.match(/^(\d+)([dhms])$/);

        if (!match) {
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 기본 7일
        }

        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case 'd':
                return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
            case 'h':
                return new Date(now.getTime() + value * 60 * 60 * 1000);
            case 'm':
                return new Date(now.getTime() + value * 60 * 1000);
            case 's':
                return new Date(now.getTime() + value * 1000);
            default:
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
    }

    // ============================================
    // 사용자 검증 (JWT Strategy용)
    // ============================================
    async validateUser(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                tenantId: true,
                email: true,
                role: true,
                name: true,
                nickname: true,
                isActive: true,
                isBanned: true,
            },
        });

        if (!user || !user.isActive || user.isBanned) {
            return null;
        }

        return user;
    }
}
