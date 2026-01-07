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
     * 사업자등록번호 검증
     * POST /api/business/validate
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
     * POST /api/business/check-format
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
