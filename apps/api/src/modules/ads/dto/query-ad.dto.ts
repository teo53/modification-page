// =============================================================================
// 📁 src/modules/ads/dto/query-ad.dto.ts
// 🏷️  광고 조회 쿼리 DTO
// =============================================================================

import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// 허용된 정렬 필드 목록 (SQL Injection 방지)
export const ALLOWED_SORT_FIELDS = [
    'createdAt',
    'updatedAt',
    'viewCount',
    'clickCount',
    'applyCount',
    'sortPriority',
    'salaryAmount',
    'title',
] as const;

export type AllowedSortField = (typeof ALLOWED_SORT_FIELDS)[number];

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
    @IsString()
    status?: string;

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
    @IsIn(ALLOWED_SORT_FIELDS, {
        message: `정렬 필드는 다음 중 하나여야 합니다: ${ALLOWED_SORT_FIELDS.join(', ')}`,
    })
    sortBy?: AllowedSortField = 'createdAt';

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC', 'asc', 'desc'], {
        message: '정렬 순서는 ASC 또는 DESC여야 합니다.',
    })
    @Transform(({ value }) => value?.toUpperCase())
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
