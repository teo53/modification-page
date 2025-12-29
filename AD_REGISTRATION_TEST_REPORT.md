# 광고 등록 프로세스 테스트 보고서

## 📋 테스트 요약

**테스트 일시**: 2025-12-26
**테스트 범위**: 광고 등록 전체 프로세스 (생성, 수정, 삭제, 권한 검증)
**결과**: ✅ 모든 핵심 테스트 통과

---

## ✅ 테스트 결과

### 1. 광고 등록 - 정상 케이스
**Status**: ✅ PASS

**테스트 내용**:
- Employer 계정으로 로그인
- 필수 및 선택 필드를 모두 포함한 광고 등록
- 응답 검증

**결과**:
```json
{
  "success": true,
  "message": "광고가 등록되었습니다. 관리자 승인 후 게시됩니다.",
  "data": {
    "id": "88c84e67-f653-4194-9577-d3ee215cfb69",
    "status": "PENDING",
    "rotationCount": 1,
    "firstAdDate": "2025-12-26T04:28:54.737Z"
  }
}
```

**확인 사항**:
- ✅ 광고가 PENDING 상태로 생성됨
- ✅ rotationCount 자동 계산 (1)
- ✅ firstAdDate 자동 설정
- ✅ 히스토리 기록 (CREATED action)
- ✅ 광고주 통계 계산 정상 작동

---

### 2. 광고 등록 - 실패 케이스

#### 2.1 필수 필드 누락 (businessName)
**Status**: ✅ PASS

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["업소명을 입력해주세요.", "businessName must be a string"]
}
```

#### 2.2 필수 필드 누락 (title)
**Status**: ✅ PASS

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["공고 제목을 입력해주세요.", "title must be a string"]
}
```

#### 2.3 잘못된 데이터 타입
**Status**: ✅ PASS

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["ageMin must be a number conforming to the specified constraints"]
}
```

#### 2.4 권한 없는 사용자 (SEEKER)
**Status**: ✅ PASS

```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Forbidden resource"
}
```

**확인 사항**:
- ✅ RolesGuard가 SEEKER 역할을 차단
- ✅ EMPLOYER, ADMIN, SUPER_ADMIN만 광고 등록 가능

---

### 3. 광고 수정/삭제 권한 테스트

#### 3.1 소유자가 자신의 광고 수정
**Status**: ✅ PASS
**Result**: HTTP 200 - 수정 성공

#### 3.2 비소유자가 타인의 광고 수정 시도
**Status**: ✅ PASS
**Result**: HTTP 403 - 권한 없음으로 차단

#### 3.3 비소유자가 타인의 광고 삭제 시도
**Status**: ✅ PASS
**Result**: HTTP 403 - 권한 없음으로 차단

**확인 사항**:
- ✅ ads.service.ts에서 isOwner || isAdmin 체크 정상 작동
- ✅ 수정/삭제 시 히스토리 기록
- ✅ IP 주소 기록
- ✅ 광고주가 수정 시 상태가 PENDING으로 변경 (재승인 필요)

---

## 🔍 발견된 이슈 및 개선 사항

### 🟡 중요도: 높음

#### 1. DTO 검증 개선 필요

**현재 문제점**:
```typescript
// create-ad.dto.ts
@IsString()
@IsOptional()
@MaxLength(20)
managerPhone?: string;  // 형식 검증 없음
```

**개선 방안**:
```typescript
@IsString()
@IsOptional()
@Matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, {
  message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
})
@MaxLength(20)
managerPhone?: string;

// 추가 필요한 검증
@IsInt()
@Min(0)
@Max(1000000000)
salaryAmount?: number;  // 현재 string으로 되어 있음

@IsInt()
@Min(14)
@Max(100)
ageMin?: number;

@IsInt()
@Min(14)
@Max(100)
ageMax?: number;

// 커스텀 검증: ageMax >= ageMin
```

#### 2. 배열 필드 검증 강화

**현재 문제점**:
```typescript
@IsArray()
@IsString({ each: true })
workDays?: string[];  // 값의 유효성 검증 없음
```

**개선 방안**:
```typescript
import { IsIn } from 'class-validator';

@IsArray()
@IsOptional()
@IsIn(['월', '화', '수', '목', '금', '토', '일'], { each: true })
workDays?: string[];

@IsArray()
@IsOptional()
@IsIn(['식사 제공', '교통비 지원', '기숙사 제공', '4대보험', '퇴직금', '야근수당', '상여금'], { each: true })
welfare?: string[];
```

#### 3. 날짜 검증 추가

**개선 방안**:
```typescript
import { IsDateString } from 'class-validator';

@IsOptional()
@IsDateString()
@Matches(/^\d{4}-\d{2}-\d{2}$/, {
  message: '날짜 형식은 YYYY-MM-DD 이어야 합니다.'
})
deadlineDate?: string;

// 커스텀 검증: deadlineDate는 미래 날짜여야 함
```

#### 4. 에러 메시지 중복 제거

**현재 문제점**:
```json
{
  "message": [
    "businessName must be shorter than or equal to 100 characters",
    "업소명을 입력해주세요.",
    "businessName must be a string"
  ]
}
```

**개선 방안**:
- ValidationPipe 설정에서 `forbidUnknownValues: true` 추가
- 에러 메시지 포맷 커스터마이징

---

### 🟡 중요도: 중간

#### 5. 비즈니스 로직 개선

**5.1 광고 승인 워크플로우**

**현재 로직**:
```typescript
// ads.service.ts:268
status: AdStatus.PENDING,  // 모든 광고가 승인 대기

// ads.service.ts:315
status: !isAdmin ? AdStatus.PENDING : undefined,  // 수정 시 재승인 필요
```

**개선 방안**:
- 신규 광고주의 첫 광고는 PENDING
- 기존 승인된 광고주는 자동 ACTIVE (설정 가능)
- 중요 필드 수정 시에만 재승인 필요 (제목, 급여, 지역 등)
- 사소한 수정은 재승인 불필요 (설명, 이미지 등)

**5.2 중복 광고 방지**

**추가 필요**:
```typescript
// 같은 업소에서 동일한 제목의 광고를 중복 등록하는 것을 방지
async checkDuplicateAd(userId: string, title: string, businessName: string) {
  const existingAd = await this.prisma.ad.findFirst({
    where: {
      userId,
      title,
      businessName,
      deletedAt: null,
      status: { in: [AdStatus.ACTIVE, AdStatus.PENDING] }
    }
  });

  if (existingAd) {
    throw new ConflictException('동일한 광고가 이미 등록되어 있습니다.');
  }
}
```

**5.3 광고 만료 처리**

**추가 필요**:
```typescript
// Cron job으로 매일 자정에 실행
@Cron('0 0 * * *')
async expireAds() {
  const expiredAds = await this.prisma.ad.updateMany({
    where: {
      status: AdStatus.ACTIVE,
      endDate: { lte: new Date() }
    },
    data: {
      status: AdStatus.EXPIRED
    }
  });

  this.logger.log(`Expired ${expiredAds.count} ads`);
}
```

#### 6. 보안 강화

**6.1 파일 업로드 검증**
```typescript
// create-ad.dto.ts
@IsOptional()
@IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
@Matches(/^https:\/\/res\.cloudinary\.com\//, {
  message: '허용된 이미지 서버만 사용 가능합니다.'
})
thumbnail?: string;
```

**6.2 XSS 방지**
```typescript
import { sanitize } from 'class-sanitizer';

@IsOptional()
@IsString()
@MaxLength(10000)
@Transform(({ value }) => sanitize(value))  // HTML 태그 제거
description?: string;
```

---

### 🟢 중요도: 낮음

#### 7. 사용자 경험 개선

**7.1 검색 기능 강화**
- 현재 `contains` 검색만 지원
- Elasticsearch 또는 PostgreSQL Full-Text Search 도입 검토

**7.2 광고 통계 캐싱**
```typescript
// ads.service.ts:142 - 매번 DB 조회하는 것을 Redis로 캐싱
async getAdvertiserStats(userId: string, tenantId: string) {
  const cacheKey = `stats:${userId}:${tenantId}`;

  // Redis에서 먼저 조회
  let stats = await this.redis.get(cacheKey);
  if (stats) return JSON.parse(stats);

  // 없으면 DB 조회 후 캐싱 (TTL: 1시간)
  stats = await this.calculateStats(userId, tenantId);
  await this.redis.setex(cacheKey, 3600, JSON.stringify(stats));

  return stats;
}
```

---

## 📝 권장 구현 순서

### Phase 1: DTO 검증 강화 (1-2시간)
1. 전화번호, 이메일 형식 검증 추가
2. 나이, 급여 범위 검증 추가
3. 배열 필드 값 제한 (IsIn 사용)
4. 날짜 형식 및 미래 날짜 검증

### Phase 2: 비즈니스 로직 개선 (2-3시간)
1. 중복 광고 방지 로직 추가
2. 광고 승인 워크플로우 개선
3. 광고 만료 처리 Cron Job 추가
4. 커스텀 검증 데코레이터 작성

### Phase 3: 보안 및 성능 개선 (3-4시간)
1. 파일 업로드 URL 검증
2. XSS 방지 sanitization
3. 광고 통계 Redis 캐싱
4. 에러 메시지 포맷 개선

---

## 🎯 결론

### ✅ 잘 된 점
1. **권한 관리**: RolesGuard를 통한 역할 기반 접근 제어가 올바르게 작동
2. **감사 추적**: AdHistory를 통한 모든 변경 기록 저장
3. **기본 검증**: class-validator를 통한 기본적인 필드 검증
4. **소프트 삭제**: deletedAt을 통한 데이터 복구 가능성 유지

### ⚠️ 개선 필요 사항
1. **DTO 검증 부족**: 형식, 범위, 논리적 제약 조건 검증 미흡
2. **중복 방지 없음**: 동일 광고 중복 등록 가능
3. **만료 처리 없음**: 광고 자동 만료 로직 부재
4. **성능 최적화**: 통계 조회 시 매번 DB 접근

### 💡 핵심 권장사항
**우선순위 1**: DTO 검증 강화 (보안 및 데이터 무결성)
**우선순위 2**: 중복 방지 로직 추가 (사용자 경험)
**우선순위 3**: 광고 만료 처리 (비즈니스 로직 완성도)

---

## 📌 테스트 아티팩트

### 생성된 테스트 계정
- **employer1@test.com** (EMPLOYER) - Password: `Employer123!@`
- **seeker_test@test.com** (SEEKER) - Password: `Seeker123!@#$`

### 생성된 테스트 광고
- **Ad ID**: `88c84e67-f653-4194-9577-d3ee215cfb69`
- **Status**: PENDING
- **Owner**: employer1@test.com

### 테스트 스크립트
- `backend/create-employer.js` - Employer 계정 생성
- `backend/create-seeker.js` - Seeker 계정 생성
- `backend/test-seeker-simple.js` - 권한 테스트
- `backend/test-permissions.js` - 수정/삭제 권한 테스트

---

**보고서 작성자**: Claude Code
**테스트 프레임워크**: Manual API Testing with Node.js
