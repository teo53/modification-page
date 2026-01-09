// =============================================================================
// 📁 src/modules/business/business.controller.ts
// 🏷️  사업자등록번호 검증 API 컨트롤러
// =============================================================================

import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { Public } from '../../common/decorators/public.decorator';

class ValidateBusinessDto {
    businessNumber: string;
}

@Controller('business')
export class BusinessController {
    constructor(private readonly businessService: BusinessService) { }

    /**
     * 국세청 API를 통한 사업자등록번호 검증
     * POST /api/v1/business/verify
     */
    @Public()
    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async verifyBusinessNumber(@Body() dto: ValidateBusinessDto) {
        const result = await this.businessService.verifyWithNTS(dto.businessNumber);

        return {
            success: result.valid,
            valid: result.valid,
            message: result.message,
            data: {
                businessNumber: this.businessService.formatBusinessNumber(result.businessNumber),
                status: result.status,
                statusCode: result.statusCode,
                taxType: result.taxType,
                closedDate: result.closedDate,
            },
        };
    }

    /**
     * 사업자등록번호 검증 (기존 - 체크섬만)
     * POST /api/v1/business/validate
     */
    @Public()
    @Post('validate')
    @HttpCode(HttpStatus.OK)
    async validateBusinessNumber(@Body() dto: ValidateBusinessDto) {
        const result = await this.businessService.validateBusinessNumber(dto.businessNumber);

        return {
            success: result.valid,
            data: {
                businessNumber: this.businessService.formatBusinessNumber(result.businessNumber),
                status: result.status,
                taxType: result.taxType,
            },
            message: result.message,
        };
    }

    /**
     * 사업자등록번호 형식 확인 (체크섬만)
     * POST /api/v1/business/check-format
     */
    @Public()
    @Post('check-format')
    @HttpCode(HttpStatus.OK)
    async checkFormat(@Body() dto: ValidateBusinessDto) {
        const isValid = this.businessService.validateChecksum(dto.businessNumber);

        return {
            success: true,
            data: {
                valid: isValid,
                formatted: this.businessService.formatBusinessNumber(dto.businessNumber),
            },
            message: isValid ? '유효한 형식입니다.' : '유효하지 않은 형식입니다.',
        };
    }
}
