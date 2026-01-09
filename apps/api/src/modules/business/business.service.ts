// =============================================================================
// 📁 src/modules/business/business.service.ts
// 🏷️  사업자등록번호 검증 서비스 (국세청 API 연동)
// =============================================================================

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookService } from '../webhook/webhook.service';
import axios from 'axios';

interface BusinessValidationResult {
    valid: boolean;
    businessNumber: string;
    status: string;
    statusCode: string;
    taxType: string;
    closedDate?: string;
    message: string;
}

interface NTSBusinessStatus {
    b_no: string;           // 사업자등록번호
    b_stt: string;          // 납세자상태 (계속사업자, 휴업자, 폐업자 등)
    b_stt_cd: string;       // 납세자상태코드 (01: 계속, 02: 휴업, 03: 폐업)
    tax_type: string;       // 과세유형 (일반과세자, 간이과세자, 면세사업자 등)
    tax_type_cd: string;    // 과세유형코드
    end_dt: string;         // 폐업일자 (YYYYMMDD)
    utcc_yn: string;        // 단위과세전환여부 (Y/N)
    tax_type_change_dt: string; // 최근과세유형전환일자
    invoice_apply_dt: string;   // 세금계산서적용일자
}

interface NTSApiResponse {
    status_code: string;
    match_cnt: number;
    request_cnt: number;
    data: NTSBusinessStatus[];
}

@Injectable()
export class BusinessService {
    private readonly logger = new Logger(BusinessService.name);
    private readonly ntsApiKey: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly webhookService: WebhookService,
    ) {
        this.ntsApiKey = this.configService.get<string>('nts.apiKey') || '';
    }

    /**
     * 사업자등록번호 형식 검증 (하이픈 제거 후 10자리)
     */
    normalizeBusinessNumber(number: string): string {
        return number.replace(/\D/g, '');
    }

    /**
     * 사업자등록번호 체크섬 검증 (한국 공식 알고리즘)
     *
     * 알고리즘:
     * 1. 각 자릿수에 가중치 [1,3,7,1,3,7,1,3,5]를 곱함
     * 2. 8번째 자리 * 5의 10의 자리를 더함
     * 3. (10 - 합계 % 10) % 10이 마지막 자릿수와 일치해야 함
     */
    validateChecksum(number: string): boolean {
        const normalized = this.normalizeBusinessNumber(number);

        if (normalized.length !== 10) {
            return false;
        }

        // 모든 문자가 숫자인지 확인
        if (!/^\d{10}$/.test(normalized)) {
            return false;
        }

        const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += parseInt(normalized[i]) * weights[i];
        }

        // 8번째 자리 * 5의 10의 자리 추가
        sum += Math.floor((parseInt(normalized[8]) * 5) / 10);

        const checkDigit = (10 - (sum % 10)) % 10;
        const lastDigit = parseInt(normalized[9]);

        return checkDigit === lastDigit;
    }

    /**
     * 국세청 API를 통한 사업자등록 상태 조회
     */
    async verifyWithNTS(businessNumber: string): Promise<BusinessValidationResult> {
        const normalized = this.normalizeBusinessNumber(businessNumber);

        // 1. 길이 검증
        if (normalized.length !== 10) {
            throw new BadRequestException('사업자등록번호는 10자리여야 합니다.');
        }

        // 2. 체크섬 검증
        if (!this.validateChecksum(normalized)) {
            this.logger.warn(`Invalid business number checksum: ${normalized}`);
            const result: BusinessValidationResult = {
                valid: false,
                businessNumber: normalized,
                status: '확인불가',
                statusCode: 'INVALID',
                taxType: '-',
                message: '유효하지 않은 사업자등록번호 형식입니다.',
            };
            this.webhookService.sendWebhook('user.business.failed', result);
            return result;
        }

        // 3. 국세청 API 호출 (API 키가 있는 경우)
        if (this.ntsApiKey) {
            try {
                const response = await axios.post<NTSApiResponse>(
                    `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${encodeURIComponent(this.ntsApiKey)}`,
                    { b_no: [normalized] },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        timeout: 10000, // 10초 타임아웃
                    }
                );

                if (response.data.status_code === 'OK' && response.data.data?.length > 0) {
                    const businessInfo = response.data.data[0];
                    const isValid = businessInfo.b_stt_cd === '01'; // 01: 계속사업자

                    const result: BusinessValidationResult = {
                        valid: isValid,
                        businessNumber: businessInfo.b_no,
                        status: businessInfo.b_stt || '확인됨',
                        statusCode: businessInfo.b_stt_cd,
                        taxType: businessInfo.tax_type || '확인됨',
                        closedDate: businessInfo.end_dt || undefined,
                        message: isValid
                            ? '사업자등록 확인이 완료되었습니다.'
                            : `사업자 상태: ${businessInfo.b_stt}`,
                    };

                    this.logger.log(`NTS API verification: ${normalized} - ${result.status}`);
                    this.webhookService.sendWebhook(
                        isValid ? 'user.business.verified' : 'user.business.failed',
                        result
                    );
                    return result;
                }
            } catch (error) {
                this.logger.warn(`NTS API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                // API 호출 실패 시 로컬 검증 결과로 폴백
            }
        } else {
            this.logger.warn('NTS API key not configured, using local validation only');
        }

        // 4. API 호출 실패 또는 API 키 없음 - 로컬 검증 결과 반환
        const result: BusinessValidationResult = {
            valid: true,
            businessNumber: normalized,
            status: '형식 검증 완료',
            statusCode: 'LOCAL',
            taxType: '확인 필요',
            message: '사업자등록번호 형식이 확인되었습니다. (상세 정보는 서류 심사 시 확인됩니다)',
        };

        this.logger.log(`Local validation only: ${normalized}`);
        this.webhookService.sendWebhook('user.business.verified', result);
        return result;
    }

    /**
     * 기존 검증 (체크섬 + 로컬)
     */
    async validateBusinessNumber(number: string): Promise<BusinessValidationResult> {
        const normalized = this.normalizeBusinessNumber(number);

        // 길이 검증
        if (normalized.length !== 10) {
            throw new BadRequestException('사업자등록번호는 10자리여야 합니다.');
        }

        // 체크섬 검증
        const isValid = this.validateChecksum(normalized);

        if (!isValid) {
            this.logger.warn(`Invalid business number checksum: ${normalized}`);
            const result: BusinessValidationResult = {
                valid: false,
                businessNumber: normalized,
                status: '확인불가',
                statusCode: 'INVALID',
                taxType: '-',
                message: '유효하지 않은 사업자등록번호입니다. 번호를 다시 확인해주세요.',
            };
            this.webhookService.sendWebhook('user.business.failed', result);
            return result;
        }

        // 체크섬 유효 - 형식상 올바른 번호
        this.logger.log(`Valid business number format: ${normalized}`);

        const result: BusinessValidationResult = {
            valid: true,
            businessNumber: normalized,
            status: '형식 검증 완료',
            statusCode: 'LOCAL',
            taxType: '확인 필요',
            message: '사업자등록번호 형식이 올바릅니다.',
        };
        this.webhookService.sendWebhook('user.business.verified', result);
        return result;
    }

    /**
     * 사업자등록번호 포맷팅 (000-00-00000)
     */
    formatBusinessNumber(number: string): string {
        const normalized = this.normalizeBusinessNumber(number);
        if (normalized.length !== 10) return number;

        return `${normalized.slice(0, 3)}-${normalized.slice(3, 5)}-${normalized.slice(5)}`;
    }
}
