// =============================================================================
// 📁 src/modules/ads/dto/create-ad.dto.ts
// 🏷️  광고 등록 DTO
// =============================================================================

import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsBoolean,
    IsNumber,
    IsArray,
    MaxLength,
    IsObject,
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
    @IsString()
    businessLogoUrl?: string;

    @IsOptional()
    @IsString()
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
    @IsString({ each: true })
    workDays?: string[];

    @IsOptional()
    @IsString()
    salaryType?: string;

    @IsOptional()
    @IsString()
    salaryAmount?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ageMin?: number;

    @IsOptional()
    @IsNumber()
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
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
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
