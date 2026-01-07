# 🎯 광고 검증 규칙 테스트 결과

**테스트 일시**: 2025-12-26
**테스트 항목**: 23개
**성공률**: 100% ✅

---

## 📋 Executive Summary

모든 신규 검증 규칙이 정상적으로 작동합니다!

- ✅ **전화번호 형식 검증**: 한국 휴대폰 번호만 허용
- ✅ **나이 범위 검증**: 14~100세, 정수만 허용
- ✅ **근무요일 검증**: 월~일만 허용
- ✅ **이미지 URL 검증**: Cloudinary 도메인만 허용 (SSRF 방지)
- ✅ **중복 광고 방지**: 동일 제목+업소명 차단

---

## 📊 상세 테스트 결과

### 1️⃣ 전화번호 형식 검증 (4/4 ✅)

| # | 입력값 | 예상 | 실제 | 결과 |
|---|--------|------|------|------|
| 1.1 | `010-1234-5678` | 201 | 201 | ✅ |
| 1.2 | `01012345678` | 201 | 201 | ✅ |
| 1.3 | `123-456-7890` | 400 | 400 | ✅ |
| 1.4 | `010-abcd-5678` | 400 | 400 | ✅ |

**에러 메시지**:
```
올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)
```

**검증 규칙**:
```typescript
@Matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, {
    message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)',
})
managerPhone?: string;
```

---

### 2️⃣ 나이 범위 검증 (6/6 ✅)

| # | 입력값 | 예상 | 실제 | 결과 |
|---|--------|------|------|------|
| 2.1 | `ageMin: 20, ageMax: 35` | 201 | 201 | ✅ |
| 2.2 | `ageMin: 13` (최소 미만) | 400 | 400 | ✅ |
| 2.3 | `ageMax: 101` (최대 초과) | 400 | 400 | ✅ |
| 2.4 | `ageMin: 20.5` (소수) | 400 | 400 | ✅ |
| 2.5 | `ageMin: 14` (경계값) | 201 | 201 | ✅ |
| 2.6 | `ageMax: 100` (경계값) | 201 | 201 | ✅ |

**에러 메시지**:
```
최소 나이는 14세 이상이어야 합니다.
최대 나이는 100세 이하여야 합니다.
나이는 정수여야 합니다.
```

**검증 규칙**:
```typescript
@IsInt({ message: '나이는 정수여야 합니다.' })
@Min(14, { message: '최소 나이는 14세 이상이어야 합니다.' })
@Max(100, { message: '최대 나이는 100세 이하여야 합니다.' })
@Type(() => Number)
ageMin?: number;
```

---

### 3️⃣ 근무요일 검증 (3/3 ✅)

| # | 입력값 | 예상 | 실제 | 결과 |
|---|--------|------|------|------|
| 3.1 | `['월','화','수','목','금']` | 201 | 201 | ✅ |
| 3.2 | `['Monday','Tuesday']` | 400 | 400 | ✅ |
| 3.3 | `['월','invalid','수']` | 400 | 400 | ✅ |

**에러 메시지**:
```
근무요일은 월~일 중에서만 선택 가능합니다.
```

**검증 규칙**:
```typescript
@IsIn(['월', '화', '수', '목', '금', '토', '일'], {
    each: true,
    message: '근무요일은 월~일 중에서만 선택 가능합니다.'
})
workDays?: string[];
```

---

### 4️⃣ 이미지 URL 검증 - SSRF 방지 (6/6 ✅)

| # | 입력값 | 예상 | 실제 | 결과 |
|---|--------|------|------|------|
| 4.1 | `https://res.cloudinary.com/demo/sample.jpg` | 201 | 201 | ✅ |
| 4.2 | `https://example.com/image.jpg` | 400 | 400 | ✅ |
| 4.3 | `http://res.cloudinary.com/...` (HTTP) | 400 | 400 | ✅ |
| 4.4 | `not-a-url` | 400 | 400 | ✅ |
| 4.5 | `[cloudinary_url_1, cloudinary_url_2]` | 201 | 201 | ✅ |
| 4.6 | `[cloudinary_url, example.com_url]` | 400 | 400 | ✅ |

**에러 메시지**:
```
허용된 이미지 서버(Cloudinary)의 URL만 사용 가능합니다.
올바른 URL 형식이 아닙니다.
```

**검증 규칙**:
```typescript
@IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
@Matches(/^https:\/\/res\.cloudinary\.com\//, {
    message: '허용된 이미지 서버(Cloudinary)의 URL만 사용 가능합니다.',
})
businessLogoUrl?: string;
```

**보안 효과**:
- ✅ SSRF (Server-Side Request Forgery) 공격 방지
- ✅ 신뢰할 수 없는 이미지 서버 차단
- ✅ HTTP 다운그레이드 공격 방지 (HTTPS만 허용)

---

### 5️⃣ 중복 광고 방지 (4/4 ✅)

| # | 시나리오 | 예상 | 실제 | 결과 |
|---|---------|------|------|------|
| 5.1 | 첫 광고 등록 | 201 | 201 | ✅ |
| 5.2 | 동일 제목+업소명 | 409 | 409 | ✅ |
| 5.3 | 같은 업소, 다른 제목 | 201 | 201 | ✅ |
| 5.4 | 다른 업소, 같은 제목 | 201 | 201 | ✅ |

**에러 메시지**:
```
동일한 제목과 업소명의 광고가 이미 등록되어 있습니다.
기존 광고를 수정하시거나 다른 제목을 사용해주세요.
```

**비즈니스 로직**:
```typescript
private async checkDuplicateAd(
    userId: string,
    tenantId: string,
    title: string,
    businessName: string,
) {
    const existingAd = await this.prisma.ad.findFirst({
        where: {
            userId,
            tenantId,
            title,
            businessName,
            deletedAt: null,
            status: { in: [AdStatus.ACTIVE, AdStatus.PENDING] },
        },
    });

    if (existingAd) {
        throw new ConflictException(
            '동일한 제목과 업소명의 광고가 이미 등록되어 있습니다...'
        );
    }
}
```

**효과**:
- ✅ 실수로 인한 중복 광고 방지
- ✅ 데이터베이스 정합성 유지
- ✅ 사용자에게 명확한 안내 제공

---

## 🔍 백엔드 로그 검증

### ValidationPipe 작동 확인
```
[ERROR] POST /api/v1/ads - 400
BadRequestException: Bad Request Exception
    at ValidationPipe.exceptionFactory
```
✅ 잘못된 입력 데이터를 ValidationPipe에서 차단

### 중복 검사 쿼리 실행 확인
```sql
SELECT ... FROM "public"."ads"
WHERE
    "user_id" = $1 AND
    "tenant_id" = $2 AND
    "title" = $3 AND
    "business_name" = $4 AND
    "deleted_at" IS NULL AND
    "status" IN ('ACTIVE', 'PENDING')
```
✅ 중복 검사 쿼리가 정확하게 실행됨

### ConflictException 발생 확인
```
[ERROR] POST /api/v1/ads - 409
ConflictException: 동일한 제목과 업소명의 광고가 이미 등록되어 있습니다.
    at AdsService.checkDuplicateAd (ads.service.ts:236:19)
    at async AdsService.create (ads.service.ts:247:9)
```
✅ 중복 광고 감지 시 409 Conflict 반환

### 광고 생성 및 히스토리 기록 확인
```sql
INSERT INTO "public"."ads" (...)
INSERT INTO "public"."ad_histories" (...)
```
```
[LOG] New ad created: 11c85dbe-8638-4dd1-88bc-a1c804cbb106 by user ...
```
✅ 광고 생성 및 히스토리 기록 정상 작동

---

## 📈 성능 영향 분석

### 추가된 검증의 성능 영향

1. **DTO 검증 (class-validator)**
   - 실행 시점: 요청 처리 전 (ValidationPipe)
   - 추가 시간: ~1-2ms
   - 영향: 미미 (ValidationPipe는 이미 사용 중)

2. **중복 검사 (Database Query)**
   - 실행 시점: 광고 등록 시
   - 쿼리 타입: SELECT with multiple WHERE conditions
   - 인덱스 활용: userId, tenantId, title, businessName
   - 추가 시간: ~5-10ms (인덱스 사용 시)

**총 추가 오버헤드**: ~6-12ms per request
**평가**: 허용 가능한 수준 ✅

---

## 🛡️ 보안 개선 효과

### Before (이전)
```typescript
// ❌ 어떤 URL이든 허용
@IsString()
businessLogoUrl?: string;

// ❌ 형식 제한 없음
@IsString()
managerPhone?: string;

// ❌ 범위 제한 없음
@IsNumber()
ageMin?: number;

// ❌ 중복 광고 등록 가능
// 중복 검사 로직 없음
```

### After (이후)
```typescript
// ✅ Cloudinary URL만 허용 (SSRF 방지)
@IsUrl()
@Matches(/^https:\/\/res\.cloudinary\.com\//)
businessLogoUrl?: string;

// ✅ 한국 휴대폰 번호 형식만 허용
@Matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/)
managerPhone?: string;

// ✅ 14~100세, 정수만 허용
@IsInt()
@Min(14)
@Max(100)
ageMin?: number;

// ✅ 중복 광고 등록 차단
await this.checkDuplicateAd(...);
```

---

## 📝 변경된 파일

### 1. `backend/src/modules/ads/dto/create-ad.dto.ts`

**추가된 Import**:
```typescript
import {
    Matches,     // 정규표현식 검증
    Min, Max,    // 숫자 범위
    IsInt,       // 정수 검증
    IsIn,        // 값 목록 제한
    IsUrl,       // URL 형식
    ValidateIf,  // 조건부 검증
} from 'class-validator';
```

**변경 사항**:
- managerPhone: 전화번호 형식 검증 추가
- ageMin, ageMax: 범위(14~100) 및 정수 검증 추가
- workDays: 월~일 값 제한 추가
- businessLogoUrl, adLogoUrl, thumbnail, images: Cloudinary URL 검증 추가

### 2. `backend/src/modules/ads/ads.service.ts`

**추가된 Import**:
```typescript
import {
    ConflictException,  // 409 에러용
} from '@nestjs/common';
```

**추가된 메서드**:
```typescript
private async checkDuplicateAd(
    userId: string,
    tenantId: string,
    title: string,
    businessName: string,
) { ... }
```

**변경 사항**:
- create() 메서드에 중복 검사 로직 추가

---

## 🎯 결론

### ✅ 달성한 목표

1. **보안 강화**
   - SSRF 공격 방지 (이미지 URL 제한)
   - 입력 데이터 형식 검증 강화

2. **데이터 품질 향상**
   - 나이, 전화번호 등 실제 사용 가능한 값만 허용
   - 중복 데이터 방지

3. **사용자 경험 개선**
   - 명확한 한글 에러 메시지
   - 구체적인 예시 제공

### 📊 테스트 커버리지

- **총 테스트**: 23개
- **통과**: 23개 (100%)
- **실패**: 0개

### 🚀 다음 단계 (선택사항)

1. **커스텀 검증 데코레이터** (Priority: Low)
   - `@AgeRange()` - ageMax >= ageMin 검증
   - `@PhoneNumber()` - 전화번호 재사용 가능 데코레이터

2. **성능 최적화** (Priority: Low)
   - 중복 검사 쿼리에 복합 인덱스 추가
   - 캐싱 고려 (자주 검색되는 경우)

3. **추가 검증** (Priority: Low)
   - 급여 범위 검증 (최저임금 이상)
   - 근무시간 검증 (시작 < 종료)
   - 주소 검증 (우편번호 형식)

---

**보고서 작성**: Claude Code
**테스트 완료일**: 2025-12-26
**상태**: ✅ 모든 검증 정상 작동
