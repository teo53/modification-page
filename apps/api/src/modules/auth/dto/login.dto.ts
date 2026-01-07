// =============================================================================
// 📁 src/modules/auth/dto/login.dto.ts
// 🏷️  로그인 DTO
// =============================================================================

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
    @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
    @IsNotEmpty({ message: '이메일을 입력해주세요.' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    password: string;
}
