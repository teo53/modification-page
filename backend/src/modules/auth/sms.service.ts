// =============================================================================
// 📁 src/modules/auth/sms.service.ts
// 🏷️  SMS 인증 서비스 (Solapi 연동)
// =============================================================================

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

interface VerificationCode {
    code: string;
    phone: string;
    expiresAt: Date;
    attempts: number;
}

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private readonly verificationCodes = new Map<string, VerificationCode>();

    // SMS API 설정
    private readonly apiKey: string;
    private readonly apiSecret: string;
    private readonly sender: string;
    private readonly isDemoMode: boolean;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.apiKey = this.configService.get('SMS_API_KEY') || '';
        this.apiSecret = this.configService.get('SMS_API_SECRET') || '';
        this.sender = this.configService.get('SMS_SENDER') || '';

        // API 키가 없으면 데모 모드
        this.isDemoMode = !this.apiKey || !this.apiSecret || !this.sender;

        if (this.isDemoMode) {
            this.logger.warn('SMS Service running in DEMO MODE - No real SMS will be sent');
            this.logger.warn('Set SMS_API_KEY, SMS_API_SECRET, SMS_SENDER in .env for production');
        } else {
            this.logger.log('SMS Service initialized with Solapi API');
        }
    }

    // ============================================
    // 인증번호 발송
    // ============================================
    async sendVerificationCode(phone: string): Promise<{ success: boolean; message: string; code?: string }> {
        // 전화번호 정규화
        const normalizedPhone = phone.replace(/\D/g, '');

        if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
            throw new BadRequestException('올바른 휴대폰 번호를 입력해주세요.');
        }

        // 너무 자주 요청하는지 확인 (Rate Limiting)
        const existing = this.verificationCodes.get(normalizedPhone);
        if (existing && existing.expiresAt > new Date()) {
            const timeDiff = (existing.expiresAt.getTime() - Date.now()) / 1000;
            if (timeDiff > 150) { // 30초 이내 재요청 방지
                throw new BadRequestException('잠시 후 다시 시도해주세요.');
            }
        }

        // 6자리 인증번호 생성
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 인증번호 저장 (3분 유효)
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
        this.verificationCodes.set(normalizedPhone, {
            code,
            phone: normalizedPhone,
            expiresAt,
            attempts: 0,
        });

        if (this.isDemoMode) {
            // 데모 모드: 실제 SMS 발송 없이 코드 반환
            this.logger.log(`[DEMO] Verification code for ${normalizedPhone}: ${code}`);
            return {
                success: true,
                message: '[데모 모드] 인증번호가 생성되었습니다.',
                code, // 데모 모드에서만 코드 반환
            };
        }

        // 실제 SMS 발송 (Solapi API)
        try {
            const response = await this.sendSolapi(normalizedPhone, `[달빛알바] 인증번호: ${code}`);

            if (response.success) {
                this.logger.log(`SMS sent to ${normalizedPhone}`);
                return {
                    success: true,
                    message: '인증번호가 발송되었습니다.',
                };
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            this.logger.error(`Failed to send SMS: ${error.message}`);
            throw new BadRequestException('SMS 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    }

    // ============================================
    // 인증번호 검증
    // ============================================
    async verifyCode(phone: string, code: string): Promise<{ success: boolean; message: string }> {
        const normalizedPhone = phone.replace(/\D/g, '');
        const stored = this.verificationCodes.get(normalizedPhone);

        if (!stored) {
            throw new BadRequestException('인증번호를 먼저 요청해주세요.');
        }

        // 만료 확인
        if (stored.expiresAt < new Date()) {
            this.verificationCodes.delete(normalizedPhone);
            throw new BadRequestException('인증번호가 만료되었습니다. 다시 요청해주세요.');
        }

        // 시도 횟수 확인 (최대 5회)
        if (stored.attempts >= 5) {
            this.verificationCodes.delete(normalizedPhone);
            throw new BadRequestException('인증 시도 횟수를 초과했습니다. 다시 요청해주세요.');
        }

        // 코드 확인
        if (stored.code !== code) {
            stored.attempts++;
            throw new BadRequestException(`인증번호가 일치하지 않습니다. (${5 - stored.attempts}회 남음)`);
        }

        // 인증 성공 - 저장 삭제
        this.verificationCodes.delete(normalizedPhone);

        this.logger.log(`Phone verified: ${normalizedPhone}`);

        return {
            success: true,
            message: '휴대폰 인증이 완료되었습니다.',
        };
    }

    // ============================================
    // Solapi API 호출
    // ============================================
    private async sendSolapi(to: string, text: string): Promise<{ success: boolean; message: string }> {
        try {
            // Solapi API v4 호출
            const timestamp = Date.now().toString();
            const signature = await this.generateSolapiSignature(timestamp);

            const response = await fetch('https://api.solapi.com/messages/v4/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HMAC-SHA256 apiKey=${this.apiKey}, date=${timestamp}, salt=${signature.salt}, signature=${signature.signature}`,
                },
                body: JSON.stringify({
                    message: {
                        to,
                        from: this.sender,
                        text,
                    },
                }),
            });

            const data = await response.json();

            if (response.ok && data.groupId) {
                return { success: true, message: 'SMS sent successfully' };
            } else {
                return { success: false, message: data.message || 'Failed to send SMS' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    private async generateSolapiSignature(timestamp: string): Promise<{ salt: string; signature: string }> {
        const crypto = await import('crypto');
        const salt = crypto.randomBytes(32).toString('hex');
        const message = timestamp + salt;
        const signature = crypto.createHmac('sha256', this.apiSecret)
            .update(message)
            .digest('hex');

        return { salt, signature };
    }

    // ============================================
    // 인증 상태 확인
    // ============================================
    isPhoneVerified(phone: string): boolean {
        // 실제로는 DB에서 확인해야 하지만, 세션/토큰 기반으로 처리
        return false;
    }
}
