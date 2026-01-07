// =============================================================================
// 📁 src/modules/community/dto/create-comment.dto.ts
// 🏷️  댓글 작성 DTO
// =============================================================================

import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: '내용을 입력해주세요.' })
    @MinLength(1, { message: '내용을 입력해주세요.' })
    @MaxLength(2000, { message: '내용은 2000자 이하여야 합니다.' })
    content: string;

    // 대댓글
    @IsOptional()
    @IsString()
    parentId?: string;

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
