// =============================================================================
// 📁 src/modules/auth/dto/phone-verification.dto.ts
// 🏷️  휴대폰 인증 DTO
// =============================================================================

import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class SendVerificationCodeDto {
    @IsString()
    @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
    @Matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, {
        message: '올바른 휴대폰 번호 형식이 아닙니다.',
    })
    phone: string;
}

export class VerifyCodeDto {
    @IsString()
    @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: '인증번호를 입력해주세요.' })
    @Length(6, 6, { message: '인증번호는 6자리입니다.' })
    code: string;
}
