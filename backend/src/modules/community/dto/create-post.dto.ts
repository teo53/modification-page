// =============================================================================
// 📁 src/modules/community/dto/create-post.dto.ts
// 🏷️  게시글 작성 DTO
// =============================================================================

import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEnum,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum PostCategoryDto {
    FREE = 'FREE',
    QNA = 'QNA',
    REVIEW = 'REVIEW',
    TIP = 'TIP',
    NEWS = 'NEWS',
}

export class CreatePostDto {
    @IsEnum(PostCategoryDto, { message: '올바른 카테고리를 선택해주세요.' })
    category: PostCategoryDto;

    @IsString()
    @IsNotEmpty({ message: '제목을 입력해주세요.' })
    @MinLength(2, { message: '제목은 2자 이상이어야 합니다.' })
    @MaxLength(100, { message: '제목은 100자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    title: string;

    @IsString()
    @IsNotEmpty({ message: '내용을 입력해주세요.' })
    @MinLength(10, { message: '내용은 10자 이상이어야 합니다.' })
    @MaxLength(50000, { message: '내용이 너무 깁니다.' })
    content: string;

    // 익명 작성 시
    @IsOptional()
    @IsString()
    @MaxLength(30)
    authorName?: string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password?: string;
}
