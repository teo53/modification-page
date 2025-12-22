// =============================================================================
// 📁 src/modules/auth/dto/signup.dto.ts
// 🏷️  회원가입 DTO (유효성 검증)
// =============================================================================

import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    MaxLength,
    IsBoolean,
    IsEnum,
    Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum SignupUserType {
    WORKER = 'worker',
    ADVERTISER = 'advertiser',
}

export class SignupDto {
    // 이메일
    @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
    @IsNotEmpty({ message: '이메일을 입력해주세요.' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    // 비밀번호 (강화된 정책: 8자 이상, 영문+숫자 필수)
    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    @MaxLength(100, { message: '비밀번호는 100자 이하여야 합니다.' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
        message: '비밀번호는 영문자와 숫자를 모두 포함해야 합니다.',
    })
    password: string;

    // 이름
    @IsString()
    @IsNotEmpty({ message: '이름을 입력해주세요.' })
    @MinLength(2, { message: '이름은 2자 이상이어야 합니다.' })
    @MaxLength(50, { message: '이름은 50자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    name: string;

    // 닉네임
    @IsString()
    @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
    @MinLength(2, { message: '닉네임은 2자 이상이어야 합니다.' })
    @MaxLength(30, { message: '닉네임은 30자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    nickname: string;

    // 휴대폰
    @IsString()
    @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
    @Matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, {
        message: '올바른 휴대폰 번호 형식을 입력해주세요.',
    })
    phone: string;

    // 회원 유형
    @IsEnum(SignupUserType, { message: '올바른 회원 유형을 선택해주세요.' })
    type: SignupUserType;

    // 주소 (선택)
    @IsOptional()
    @IsString()
    @MaxLength(200)
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    addressDetail?: string;

    // 사업자 정보 (광고주만)
    @IsOptional()
    @IsString()
    @MaxLength(100)
    businessName?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{3}-?[0-9]{2}-?[0-9]{5}$/, {
        message: '올바른 사업자등록번호 형식을 입력해주세요.',
    })
    businessNumber?: string;

    // 동의 항목
    @IsBoolean()
    @IsNotEmpty({ message: '이용약관에 동의해주세요.' })
    agreeTerms: boolean;

    @IsBoolean()
    @IsNotEmpty({ message: '개인정보처리방침에 동의해주세요.' })
    agreePrivacy: boolean;

    @IsOptional()
    @IsBoolean()
    agreeMarketing?: boolean;
}
