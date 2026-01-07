// =============================================================================
// 📁 src/modules/sms/sms.service.ts
// 🏷️  SMS 발송 서비스 (CoolSMS 연동 준비)
// =============================================================================

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SmsResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

@Injectable()
export class SmsService {
    private readonly apiKey: string;
    private readonly apiSecret: string;
    private readonly sender: string;
    private readonly isTestMode: boolean;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get('COOLSMS_API_KEY') || '';
        this.apiSecret = this.configService.get('COOLSMS_API_SECRET') || '';
        this.sender = this.configService.get('SMS_SENDER_NUMBER') || '';
        this.isTestMode = !this.apiKey || this.configService.get('SMS_TEST_MODE') === 'true';
    }

    /**
     * SMS 발송
     */
    async sendSms(to: string, message: string): Promise<SmsResult> {
        // 전화번호 정규화 (하이픈 제거)
        const normalizedPhone = to.replace(/-/g, '');

        if (this.isTestMode) {
            // 테스트 모드: 콘솔에만 출력
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📱 [SMS 테스트 모드]');
            console.log(`   수신자: ${normalizedPhone}`);
            console.log(`   내용: ${message}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            return {
                success: true,
                messageId: `test_${Date.now()}`,
            };
        }

        try {
            // CoolSMS API 호출 (실제 연동 시 활성화)
            // const response = await this.callCoolSmsApi(normalizedPhone, message);
            // return { success: true, messageId: response.messageId };

            // 임시: API 키가 없으면 테스트 모드로 처리
            console.log('[SMS] API 키가 설정되지 않아 테스트 모드로 발송');
            return {
                success: true,
                messageId: `test_${Date.now()}`,
            };
        } catch (error) {
            console.error('[SMS] 발송 실패:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'SMS 발송 실패',
            };
        }
    }

    /**
     * 인증번호 발송
     */
    async sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string; error?: string }> {
        // 6자리 인증번호 생성
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const message = `[달빛알바] 인증번호는 [${code}]입니다. 3분 내에 입력해주세요.`;

        const result = await this.sendSms(phone, message);

        if (result.success) {
            // 인증번호 저장 (Redis 또는 메모리 캐시 사용 권장)
            // 현재는 간단히 반환
            return { success: true, code };
        }

        return { success: false, error: result.error };
    }

    /**
     * CoolSMS API 호출 (실제 연동용)
     * 가입 후 API Key 발급 받아서 사용
     */
    // private async callCoolSmsApi(to: string, message: string) {
    //     const timestamp = Date.now().toString();
    //     const salt = crypto.randomBytes(16).toString('hex');
    //     const signature = crypto
    //         .createHmac('sha256', this.apiSecret)
    //         .update(`${timestamp}${salt}`)
    //         .digest('hex');
    //
    //     const response = await fetch('https://api.coolsms.co.kr/messages/v4/send', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `HMAC-SHA256 apiKey=${this.apiKey}, date=${timestamp}, salt=${salt}, signature=${signature}`,
    //         },
    //         body: JSON.stringify({
    //             message: {
    //                 to,
    //                 from: this.sender,
    //                 text: message,
    //             },
    //         }),
    //     });
    //
    //     if (!response.ok) {
    //         throw new Error('CoolSMS API 오류');
    //     }
    //
    //     return response.json();
    // }
}
