// =============================================================================
// 📁 src/modules/email/email.service.ts
// 🏷️  이메일 발송 서비스 (Nodemailer 기반)
// =============================================================================

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter | null = null;
    private readonly isTestMode: boolean;
    private readonly fromAddress: string;

    constructor(private configService: ConfigService) {
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPass = this.configService.get('SMTP_PASS');

        this.isTestMode = !smtpHost || !smtpUser;
        this.fromAddress = this.configService.get('EMAIL_FROM') || 'noreply@dalbitalba.com';

        if (!this.isTestMode) {
            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: this.configService.get('SMTP_PORT') || 587,
                secure: false,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
        }
    }

    /**
     * 이메일 발송
     */
    async sendEmail(options: EmailOptions): Promise<EmailResult> {
        if (this.isTestMode) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 [이메일 테스트 모드]');
            console.log(`   수신자: ${options.to}`);
            console.log(`   제목: ${options.subject}`);
            console.log(`   내용: ${options.html.substring(0, 100)}...`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            return { success: true, messageId: `test_${Date.now()}` };
        }

        try {
            const result = await this.transporter!.sendMail({
                from: this.fromAddress,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });

            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('[Email] 발송 실패:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '이메일 발송 실패',
            };
        }
    }

    /**
     * 회원가입 환영 이메일
     */
    async sendWelcomeEmail(to: string, name: string): Promise<EmailResult> {
        return this.sendEmail({
            to,
            subject: '[달빛알바] 회원가입을 환영합니다!',
            html: `
                <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #D4AF37 0%, #FF007F 100%); padding: 30px; border-radius: 16px; text-align: center;">
                        <h1 style="color: #000; margin: 0;">🌙 달빛알바</h1>
                    </div>
                    <div style="padding: 30px; background: #1a1a1a; color: #fff; border-radius: 0 0 16px 16px;">
                        <h2 style="color: #D4AF37;">안녕하세요, ${name}님!</h2>
                        <p>달빛알바 회원가입을 환영합니다.</p>
                        <p>이제 다양한 구인구직 서비스를 이용하실 수 있습니다.</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="https://www.dalbitalba.co.kr" 
                               style="background: #D4AF37; color: #000; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                                사이트 방문하기
                            </a>
                        </div>
                        <p style="color: #888; font-size: 14px;">
                            문의사항이 있으시면 언제든 고객센터로 연락주세요.
                        </p>
                    </div>
                </div>
            `,
        });
    }

    /**
     * 비밀번호 재설정 이메일
     */
    async sendPasswordResetEmail(to: string, resetToken: string): Promise<EmailResult> {
        const resetUrl = `https://www.dalbitalba.co.kr/reset-password?token=${resetToken}`;

        return this.sendEmail({
            to,
            subject: '[달빛알바] 비밀번호 재설정 안내',
            html: `
                <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #1a1a1a; padding: 30px; border-radius: 16px; border: 1px solid #333;">
                        <h1 style="color: #D4AF37; text-align: center;">🔐 비밀번호 재설정</h1>
                        <p style="color: #fff;">비밀번호 재설정을 요청하셨습니다.</p>
                        <p style="color: #fff;">아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${resetUrl}" 
                               style="background: #FF007F; color: #fff; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                                비밀번호 재설정
                            </a>
                        </div>
                        <p style="color: #888; font-size: 12px;">
                            이 링크는 1시간 동안 유효합니다.<br/>
                            본인이 요청하지 않은 경우, 이 이메일을 무시해주세요.
                        </p>
                    </div>
                </div>
            `,
        });
    }

    /**
     * 광고 승인 알림 이메일
     */
    async sendAdApprovalEmail(to: string, adTitle: string, isApproved: boolean, reason?: string): Promise<EmailResult> {
        const status = isApproved ? '승인' : '반려';
        const statusColor = isApproved ? '#4CAF50' : '#F44336';

        return this.sendEmail({
            to,
            subject: `[달빛알바] 광고가 ${status}되었습니다`,
            html: `
                <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #1a1a1a; padding: 30px; border-radius: 16px; border: 1px solid #333;">
                        <h2 style="color: ${statusColor};">광고 ${status} 안내</h2>
                        <div style="background: #222; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #888; margin: 0;">광고 제목</p>
                            <p style="color: #fff; font-size: 18px; margin: 5px 0;">${adTitle}</p>
                        </div>
                        ${!isApproved && reason ? `
                            <div style="background: #331a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #F44336;">
                                <p style="color: #888; margin: 0;">반려 사유</p>
                                <p style="color: #fff;">${reason}</p>
                            </div>
                        ` : ''}
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="https://www.dalbitalba.co.kr/advertiser" 
                               style="background: #D4AF37; color: #000; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                                광고 관리 바로가기
                            </a>
                        </div>
                    </div>
                </div>
            `,
        });
    }
}
