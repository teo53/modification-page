// =============================================================================
// 📁 src/modules/ads/dto/query-ad.dto.ts
// 🏷️  광고 조회 쿼리 DTO
// =============================================================================

import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AdStatus } from '@prisma/client';

export class QueryAdDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsOptional()
    @IsEnum(AdStatus)
    status?: AdStatus;

    @IsOptional()
    @IsString()
    productType?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toUpperCase())
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
