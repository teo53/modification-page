// =============================================================================
// 📁 src/modules/auth/auth.controller.ts
// 🏷️  인증 API 컨트롤러
// =============================================================================

import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Req,
    Res,
    Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SmsService } from './sms.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { SendVerificationCodeDto, VerifyCodeDto, SendEmailVerificationCodeDto, VerifyEmailCodeDto } from './dto/phone-verification.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private smsService: SmsService,
        private configService: ConfigService,
    ) { }

    // ============================================
    // 회원가입
    // ============================================
    @Public()
    @Post('signup')
    @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 1시간(3600초)에 3회 제한 (브루트포스 방지)
    async signup(
        @Body() dto: SignupDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        // 테넌트 ID (헤더 또는 기본값)
        const tenantId = (req.headers['x-tenant-id'] as string) ||
            this.configService.get('defaultTenantId') ||
            'default';

        const result = await this.authService.signup(dto, tenantId);

        // Refresh Token을 HttpOnly 쿠키로 설정
        this.setRefreshTokenCookie(res, result.tokens.refreshToken);

        return {
            success: true,
            message: '회원가입이 완료되었습니다.',
            data: {
                user: result.user,
                accessToken: result.tokens.accessToken,
                expiresIn: result.tokens.expiresIn,
                // 모바일 앱용: refresh token도 body에 포함 (쿠키가 작동하지 않는 환경 지원)
                refreshToken: result.tokens.refreshToken,
            },
        };
    }

    // ============================================
    // 로그인
    // ============================================
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 1분(60초)에 5회 제한 (브루트포스 공격 방지)
    async login(
        @Body() dto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tenantId = (req.headers['x-tenant-id'] as string) ||
            this.configService.get('defaultTenantId') ||
            'default';

        const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;

        const result = await this.authService.login(dto, tenantId, ipAddress);

        // Refresh Token을 HttpOnly 쿠키로 설정
        this.setRefreshTokenCookie(res, result.tokens.refreshToken);

        return {
            success: true,
            message: '로그인되었습니다.',
            data: {
                user: result.user,
                accessToken: result.tokens.accessToken,
                expiresIn: result.tokens.expiresIn,
                // 모바일 앱용: refresh token도 body에 포함
                refreshToken: result.tokens.refreshToken,
            },
        };
    }

    // ============================================
    // 토큰 갱신
    // ============================================
    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Body() body: { refreshToken?: string },
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        // 모바일 앱: body에서 refreshToken 받음, 웹: 쿠키에서 받음
        const refreshToken = body?.refreshToken || (req.cookies?.refreshToken as string | undefined);

        if (!refreshToken) {
            return {
                success: false,
                message: '리프레시 토큰이 없습니다.',
            };
        }

        const tenantId = (req.headers['x-tenant-id'] as string) ||
            this.configService.get('defaultTenantId') ||
            'default';

        const tokens = await this.authService.refreshTokens(refreshToken, tenantId);

        // 새 Refresh Token 쿠키 설정 (웹용)
        this.setRefreshTokenCookie(res, tokens.refreshToken);

        return {
            success: true,
            message: '토큰이 갱신되었습니다.',
            data: {
                accessToken: tokens.accessToken,
                expiresIn: tokens.expiresIn,
                // 모바일 앱용: 새 refresh token도 body에 포함
                refreshToken: tokens.refreshToken,
            },
        };
    }

    // ============================================
    // 로그아웃
    // ============================================
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken as string | undefined;

        await this.authService.logout(refreshToken);

        // 쿠키 삭제
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return {
            success: true,
            message: '로그아웃되었습니다.',
        };
    }

    // ============================================
    // 모든 기기에서 로그아웃
    // ============================================
    @Post('logout-all')
    @HttpCode(HttpStatus.OK)
    async logoutAll(
        @CurrentUser('id') userId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logoutAll(userId);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return {
            success: true,
            message: '모든 기기에서 로그아웃되었습니다.',
        };
    }

    // ============================================
    // 현재 사용자 정보
    // ============================================
    @Get('me')
    async getMe(@CurrentUser() user: Record<string, unknown>) {
        return {
            success: true,
            data: user,
        };
    }

    // ============================================
    // 휴대폰 인증번호 발송
    // ============================================
    @Public()
    @Post('phone/send-code')
    @HttpCode(HttpStatus.OK)
    async sendVerificationCode(@Body() dto: SendVerificationCodeDto) {
        const result = await this.smsService.sendVerificationCode(dto.phone);
        return {
            success: result.success,
            message: result.message,
            // 데모/테스트 모드 플래그
            isDemoMode: result.isDemoMode ?? false,
            // 데모 모드에서만 코드 반환
            ...(result.code && { demoCode: result.code }),
        };
    }

    // ============================================
    // 휴대폰 인증번호 확인
    // ============================================
    @Public()
    @Post('phone/verify-code')
    @HttpCode(HttpStatus.OK)
    async verifyCode(@Body() dto: VerifyCodeDto) {
        const result = await this.smsService.verifyCode(dto.phone, dto.code);
        return {
            success: result.success,
            message: result.message,
        };
    }

    // ============================================
    // 이메일 인증번호 발송 (SMS 실패 시 대체)
    // ============================================
    @Public()
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 1분에 5회 제한
    @Post('email/send-code')
    @HttpCode(HttpStatus.OK)
    async sendEmailVerificationCode(@Body() dto: SendEmailVerificationCodeDto) {
        const result = await this.smsService.sendEmailVerificationCode(dto.email);
        return {
            success: result.success,
            message: result.message,
            // 데모/테스트 모드 플래그
            isDemoMode: result.isDemoMode ?? false,
            // 테스트 모드에서만 코드 반환
            ...(result.code && { demoCode: result.code }),
        };
    }

    // ============================================
    // 이메일 인증번호 확인
    // ============================================
    @Public()
    @Post('email/verify-code')
    @HttpCode(HttpStatus.OK)
    async verifyEmailCode(@Body() dto: VerifyEmailCodeDto) {
        const result = await this.smsService.verifyEmailCode(dto.email, dto.code);
        return {
            success: result.success,
            message: result.message,
        };
    }

    // ============================================
    // 헬퍼 메서드
    // ============================================
    private setRefreshTokenCookie(res: Response, token: string) {
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7일
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', token, {
            httpOnly: true,
            // 프로덕션에서는 HTTPS 필수
            secure: isProduction,
            // 'none': 크로스 오리진 지원 (모바일 앱 Capacitor 지원)
            // 'lax': 같은 사이트에서만 (기본 웹 브라우저)
            // 프로덕션에서는 'none' + secure: true로 크로스 오리진 지원
            sameSite: isProduction ? 'none' : 'lax',
            maxAge,
            path: '/',
        });
    }
}
