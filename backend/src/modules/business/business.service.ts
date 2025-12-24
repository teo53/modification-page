// =============================================================================
// 📁 src/modules/business/business.service.ts
// 🏷️  사업자등록번호 검증 서비스
// =============================================================================

import { Injectable, Logger, BadRequestException } from '@nestjs/common';

interface BusinessValidationResult {
    valid: boolean;
    businessNumber: string;
    status: string;
    taxType: string;
    message: string;
}

@Injectable()
export class BusinessService {
    private readonly logger = new Logger(BusinessService.name);

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
     * 사업자등록번호 검증 API
     * - 형식 검증
     * - 체크섬 검증
     * - (향후) 국세청 API 연동 가능
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
            return {
                valid: false,
                businessNumber: normalized,
                status: '확인불가',
                taxType: '-',
                message: '유효하지 않은 사업자등록번호입니다. 번호를 다시 확인해주세요.',
            };
        }

        // 체크섬 유효 - 형식상 올바른 번호
        // 실제 사업자 상태는 국세청 API 연동 시 확인 가능
        this.logger.log(`Valid business number format: ${normalized}`);

        return {
            valid: true,
            businessNumber: normalized,
            status: '형식 검증 완료',
            taxType: '확인 필요',
            message: '사업자등록번호 형식이 올바릅니다.',
        };
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
