// =============================================================================
// 📁 src/modules/ads/dto/create-ad.dto.ts
// 🏷️  광고 등록 DTO
// =============================================================================

import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsBoolean,
    IsArray,
    MaxLength,
    IsObject,
    Matches,
    Min,
    Max,
    IsInt,
    IsIn,
    IsUrl,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateAdDto {
    // ==============================
    // 업소 정보 (Step 1)
    // ==============================
    @IsString()
    @IsNotEmpty({ message: '업소명을 입력해주세요.' })
    @MaxLength(100)
    businessName: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    managerName?: string;

    @IsOptional()
    @IsString()
    @Matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, {
        message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)',
    })
    @MaxLength(20)
    managerPhone?: string;

    @IsOptional()
    @IsString()
    contactKakao?: string;

    @IsOptional()
    @IsString()
    contactLine?: string;

    @IsOptional()
    @IsString()
    contactTelegram?: string;

    @IsOptional()
    @IsString()
    zonecode?: string;

    @IsOptional()
    @IsString()
    roadAddress?: string;

    @IsOptional()
    @IsString()
    addressDetail?: string;

    @IsOptional()
    @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
    @Matches(/^https:\/\/res\.cloudinary\.com\//, {
        message: '허용된 이미지 서버(Cloudinary)의 URL만 사용 가능합니다.',
    })
    businessLogoUrl?: string;

    @IsOptional()
    @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
    @Matches(/^https:\/\/res\.cloudinary\.com\//, {
        message: '허용된 이미지 서버(Cloudinary)의 URL만 사용 가능합니다.',
    })
    adLogoUrl?: string;

    // ==============================
    // 모집 정보 (Step 2)
    // ==============================
    @IsString()
    @IsNotEmpty({ message: '공고 제목을 입력해주세요.' })
    @MaxLength(100)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(10000)
    description?: string;

    @IsOptional()
    @IsString()
    industryLevel1?: string;

    @IsOptional()
    @IsString()
    industryLevel2?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    town?: string;

    @IsOptional()
    @IsString()
    recruitmentType?: string;

    @IsOptional()
    @IsString()
    recruitNumber?: string;

    @IsOptional()
    @IsString()
    workHoursType?: string;

    @IsOptional()
    @IsString()
    workHoursStart?: string;

    @IsOptional()
    @IsString()
    workHoursEnd?: string;

    @IsOptional()
    @IsArray()
    @IsIn(['월', '화', '수', '목', '금', '토', '일'], { each: true, message: '근무요일은 월~일 중에서만 선택 가능합니다.' })
    workDays?: string[];

    @IsOptional()
    @IsString()
    salaryType?: string;

    @IsOptional()
    @IsString()
    salaryAmount?: string;

    @IsOptional()
    @IsInt({ message: '나이는 정수여야 합니다.' })
    @Min(14, { message: '최소 나이는 14세 이상이어야 합니다.' })
    @Max(100, { message: '최대 나이는 100세 이하여야 합니다.' })
    @Type(() => Number)
    ageMin?: number;

    @IsOptional()
    @IsInt({ message: '나이는 정수여야 합니다.' })
    @Min(14, { message: '최소 나이는 14세 이상이어야 합니다.' })
    @Max(100, { message: '최대 나이는 100세 이하여야 합니다.' })
    @Type(() => Number)
    ageMax?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    ageNoLimit?: boolean;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsString()
    daysOff?: string;

    @IsOptional()
    @IsString()
    deadlineDate?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    deadlineAlways?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    welfare?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    preferredConditions?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    receptionMethods?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    requiredDocuments?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keywords?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    themes?: string[];

    // ==============================
    // 이미지
    // ==============================
    @IsOptional()
    @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
    @Matches(/^https:\/\/res\.cloudinary\.com\//, {
        message: '허용된 이미지 서버(Cloudinary)의 URL만 사용 가능합니다.',
    })
    thumbnail?: string;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true, message: '올바른 URL 형식이 아닙니다.' })
    @Matches(/^https:\/\/res\.cloudinary\.com\//, {
        each: true,
        message: '허용된 이미지 서버(Cloudinary)의 URL만 사용 가능합니다.',
    })
    images?: string[];

    // ==============================
    // 광고 옵션 (Step 3)
    // ==============================
    @IsOptional()
    @IsString()
    productId?: string;

    @IsOptional()
    @IsObject()
    highlightConfig?: {
        color: string;
        text: string;
        range?: { start: number; end: number };
    };

    @IsOptional()
    @IsObject()
    jumpUpConfig?: {
        enabled: boolean;
        interval: number;
        count: number;
    };

    @IsOptional()
    @IsBoolean()
    isUrgent?: boolean;
}
