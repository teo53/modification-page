// =============================================================================
// 📁 src/modules/auth/sms.service.ts
// 🏷️  SMS/이메일 인증 서비스 (Solapi 연동)
// =============================================================================

import { Injectable, Logger, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';

interface VerificationCode {
    code: string;
    identifier: string; // phone or email
    expiresAt: Date;
    attempts: number;
}

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private readonly verificationCodes = new Map<string, VerificationCode>();
    private readonly emailVerificationCodes = new Map<string, VerificationCode>();

    // SMS API 설정
    private readonly apiKey: string;
    private readonly apiSecret: string;
    private readonly sender: string;
    private readonly isDemoMode: boolean;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
        @Inject(forwardRef(() => EmailService))
        private emailService: EmailService,
    ) {
        this.apiKey = this.configService.get('SMS_API_KEY') || '';
        this.apiSecret = this.configService.get('SMS_API_SECRET') || '';
        this.sender = this.configService.get('SMS_SENDER') || '';

        // API 키가 없으면 데모 모드
        this.isDemoMode = !this.apiKey || !this.apiSecret || !this.sender;

        if (this.isDemoMode) {
            this.logger.warn('SMS Service running in DEMO MODE - No real SMS will be sent');
            this.logger.warn('Set SMS_API_KEY, SMS_API_SECRET, SMS_SENDER in .env for production');
            this.logger.warn(`Current values: apiKey=${this.apiKey ? '[SET]' : '[EMPTY]'}, apiSecret=${this.apiSecret ? '[SET]' : '[EMPTY]'}, sender=${this.sender || '[EMPTY]'}`);
        } else {
            this.logger.log('SMS Service initialized with Solapi API');
            this.logger.log(`Sender number: ${this.sender}`);
        }
    }

    // ============================================
    // 인증번호 발송
    // ============================================
    async sendVerificationCode(phone: string): Promise<{ success: boolean; message: string; code?: string; isDemoMode?: boolean }> {
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
                const remainingSeconds = Math.ceil(timeDiff - 150);
                throw new BadRequestException(`잠시 후 다시 시도해주세요. (${remainingSeconds}초 후)`);
            }
        }

        // 6자리 인증번호 생성
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 인증번호 저장 (3분 유효)
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
        this.verificationCodes.set(normalizedPhone, {
            code,
            identifier: normalizedPhone,
            expiresAt,
            attempts: 0,
        });

        this.logger.log(`Verification code generated for ${normalizedPhone.slice(-4)}: ${this.isDemoMode ? code : '[hidden]'}`);

        if (this.isDemoMode) {
            // 데모 모드: 실제 SMS 발송 없이 코드 반환
            this.logger.log(`[DEMO] Verification code for ${normalizedPhone}: ${code}`);
            return {
                success: true,
                message: '[테스트 모드] 인증번호가 생성되었습니다. 아래 번호를 입력해주세요.',
                code, // 데모 모드에서만 코드 반환
                isDemoMode: true,
            };
        }

        // 실제 SMS 발송 (Solapi API)
        const response = await this.sendSolapi(normalizedPhone, `[달빛알바] 인증번호: ${code}`);

        if (response.success) {
            this.logger.log(`SMS sent to ${normalizedPhone}`);
            return {
                success: true,
                message: '인증번호가 발송되었습니다. SMS를 확인해주세요.',
                isDemoMode: false,
            };
        } else {
            // SMS 발송 실패 - 저장된 인증번호 삭제 (보안상 중요)
            this.verificationCodes.delete(normalizedPhone);
            this.logger.error(`SMS send failed: ${response.message}`);
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

            // 전화번호 형식: Solapi는 국가코드 없이 01012345678 형식 사용
            const formattedTo = to.replace(/\D/g, ''); // 숫자만 추출

            // 발신번호도 숫자만 추출
            const formattedFrom = this.sender.replace(/\D/g, '');

            const requestBody = {
                message: {
                    to: formattedTo,
                    from: formattedFrom,
                    text,
                },
            };

            this.logger.log(`Solapi API Request: to=${formattedTo}, from=${formattedFrom}, text length=${text.length}`);

            const response = await fetch('https://api.solapi.com/messages/v4/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HMAC-SHA256 apiKey=${this.apiKey}, date=${timestamp}, salt=${signature.salt}, signature=${signature.signature}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            this.logger.log(`Solapi API Response: status=${response.status}, data=${JSON.stringify(data)}`);

            if (response.ok && data.groupId) {
                return { success: true, message: 'SMS sent successfully' };
            } else {
                // 상세 에러 메시지 로깅
                const errorMessage = data.errorMessage || data.message || data.errorCode || 'Unknown error';
                this.logger.error(`Solapi error: ${errorMessage}, full response: ${JSON.stringify(data)}`);
                return { success: false, message: errorMessage };
            }
        } catch (error) {
            this.logger.error(`Solapi exception: ${error.message}`, error.stack);
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

    // ============================================
    // 이메일 인증번호 발송
    // ============================================
    async sendEmailVerificationCode(email: string): Promise<{ success: boolean; message: string; code?: string; isDemoMode?: boolean }> {
        // 이메일 정규화
        const normalizedEmail = email.toLowerCase().trim();

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            throw new BadRequestException('올바른 이메일 형식을 입력해주세요.');
        }

        // 너무 자주 요청하는지 확인 (Rate Limiting)
        const existing = this.emailVerificationCodes.get(normalizedEmail);
        if (existing && existing.expiresAt > new Date()) {
            const timeDiff = (existing.expiresAt.getTime() - Date.now()) / 1000;
            if (timeDiff > 150) { // 30초 이내 재요청 방지
                const remainingSeconds = Math.ceil(timeDiff - 150);
                throw new BadRequestException(`잠시 후 다시 시도해주세요. (${remainingSeconds}초 후)`);
            }
        }

        // 6자리 인증번호 생성
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 인증번호 저장 (3분 유효)
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
        this.emailVerificationCodes.set(normalizedEmail, {
            code,
            identifier: normalizedEmail,
            expiresAt,
            attempts: 0,
        });

        this.logger.log(`Email verification code generated for ${normalizedEmail.slice(0, 3)}***`);

        // 이메일 발송
        const result = await this.emailService.sendVerificationCode(normalizedEmail, code);

        if (result.success) {
            this.logger.log(`Email verification sent to ${normalizedEmail}`);

            // 테스트 모드인 경우 (SMTP 미설정) 코드 반환
            const isTestMode = !this.configService.get('SMTP_HOST') || !this.configService.get('SMTP_USER');
            if (isTestMode) {
                return {
                    success: true,
                    message: '[테스트 모드] 인증번호가 생성되었습니다. 아래 번호를 입력해주세요.',
                    code,
                    isDemoMode: true,
                };
            }

            return {
                success: true,
                message: '인증번호가 이메일로 발송되었습니다. 메일함을 확인해주세요.',
                isDemoMode: false,
            };
        } else {
            // 이메일 발송 실패 - 저장된 인증번호 삭제
            this.emailVerificationCodes.delete(normalizedEmail);
            this.logger.error(`Email send failed: ${result.error}`);
            throw new BadRequestException('이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    }

    // ============================================
    // 이메일 인증번호 검증
    // ============================================
    async verifyEmailCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
        const normalizedEmail = email.toLowerCase().trim();
        const stored = this.emailVerificationCodes.get(normalizedEmail);

        if (!stored) {
            throw new BadRequestException('인증번호를 먼저 요청해주세요.');
        }

        // 만료 확인
        if (stored.expiresAt < new Date()) {
            this.emailVerificationCodes.delete(normalizedEmail);
            throw new BadRequestException('인증번호가 만료되었습니다. 다시 요청해주세요.');
        }

        // 시도 횟수 확인 (최대 5회)
        if (stored.attempts >= 5) {
            this.emailVerificationCodes.delete(normalizedEmail);
            throw new BadRequestException('인증 시도 횟수를 초과했습니다. 다시 요청해주세요.');
        }

        // 코드 확인
        if (stored.code !== code) {
            stored.attempts++;
            throw new BadRequestException(`인증번호가 일치하지 않습니다. (${5 - stored.attempts}회 남음)`);
        }

        // 인증 성공 - 저장 삭제
        this.emailVerificationCodes.delete(normalizedEmail);

        this.logger.log(`Email verified: ${normalizedEmail}`);

        return {
            success: true,
            message: '이메일 인증이 완료되었습니다.',
        };
    }
}
