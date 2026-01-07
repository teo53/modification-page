# 프론트엔드 검증 테스트 계획

## 📋 개요

백엔드에 추가된 검증 규칙이 프론트엔드 폼에서 어떻게 처리되는지 테스트합니다.

**목표**:
1. 백엔드 검증 에러가 프론트엔드에 제대로 표시되는지 확인
2. 프론트엔드 클라이언트 사이드 검증 부재 확인
3. 사용자 경험 개선을 위한 권장사항 제공

---

## 🔍 현재 프론트엔드 상태 분석

### 파일 구조
```
src/pages/PostAd.tsx                    # 메인 광고 등록 페이지
src/components/PostAd/
  ├── Step2RecruitmentInfo.tsx          # 모집 정보 입력 폼
  └── Step3ProductSelection.tsx         # 상품 선택
src/utils/adService.ts                  # API 호출 유틸
```

### 현재 검증 로직

#### PostAd.tsx (라인 287-290)
```typescript
// ❌ 매우 기본적인 검증만 존재
if (!formData.businessName || !formData.title) {
    setError('업소명과 공고 제목은 필수입니다.');
    return;
}
```

#### 문제점
- ✅ businessName, title만 검증
- ❌ 전화번호 형식 검증 없음
- ❌ 나이 범위 검증 없음
- ❌ 근무요일 값 검증 없음
- ❌ 이미지 URL 검증 없음
- ❌ 실시간 입력 검증 없음

---

## 🧪 테스트 시나리오

### 테스트 1: 전화번호 검증
**입력 필드**: `managerPhone`
**현재 상태**: 검증 없음

| Test Case | 입력값 | 예상 결과 | 실제 결과 |
|-----------|--------|----------|----------|
| 1.1 | `010-1234-5678` | ✅ 허용 | ? |
| 1.2 | `123-456-7890` | ❌ 에러 | ? |
| 1.3 | `010-abcd-5678` | ❌ 에러 | ? |
| 1.4 | 빈 값 (선택사항) | ✅ 허용 | ? |

**백엔드 에러 메시지**:
```
올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)
```

---

### 테스트 2: 나이 검증
**입력 필드**: `ageLimit.start`, `ageLimit.end`
**현재 상태**: 검증 없음

| Test Case | 입력값 | 예상 결과 | 실제 결과 |
|-----------|--------|----------|----------|
| 2.1 | `start: 20, end: 35` | ✅ 허용 | ? |
| 2.2 | `start: 13` | ❌ 에러 (최소 14) | ? |
| 2.3 | `end: 101` | ❌ 에러 (최대 100) | ? |
| 2.4 | `start: 20.5` | ❌ 에러 (정수만) | ? |

**백엔드 에러 메시지**:
```
최소 나이는 14세 이상이어야 합니다.
최대 나이는 100세 이하여야 합니다.
나이는 정수여야 합니다.
```

---

### 테스트 3: 근무요일 검증
**입력 필드**: `workDays` (배열)
**현재 상태**: 검증 없음

| Test Case | 입력값 | 예상 결과 | 실제 결과 |
|-----------|--------|----------|----------|
| 3.1 | `['월','화','수']` | ✅ 허용 | ? |
| 3.2 | `['Monday']` | ❌ 에러 | ? |
| 3.3 | `['invalid']` | ❌ 에러 | ? |

**백엔드 에러 메시지**:
```
근무요일은 월~일 중에서만 선택 가능합니다.
```

---

### 테스트 4: 이미지 URL 검증
**입력 필드**: `images`, `businessLogo`
**현재 상태**: 업로드 후 Cloudinary URL 자동 생성

**참고**:
- 프론트엔드는 fileService를 통해 Cloudinary에 직접 업로드
- 업로드 성공 시 자동으로 Cloudinary URL 반환
- **문제**: 사용자가 URL을 직접 입력하는 경로가 있다면 검증 필요

---

### 테스트 5: 중복 광고 검증
**검증 위치**: 백엔드만
**현재 상태**: 프론트엔드 검증 없음

| Test Case | 시나리오 | 예상 결과 |
|-----------|---------|----------|
| 5.1 | 동일 제목+업소명 재등록 | ❌ 409 에러 표시 |

**백엔드 에러 메시지**:
```
동일한 제목과 업소명의 광고가 이미 등록되어 있습니다.
기존 광고를 수정하시거나 다른 제목을 사용해주세요.
```

---

## 🔧 데이터 매핑 검증

### 프론트엔드 → 백엔드 필드 매핑

#### PostAd.tsx (라인 317-342) 생성하는 데이터
```typescript
const adData = {
    title: formData.title,                    // ✅ 매핑 OK
    businessName: formData.businessName,       // ✅ 매핑 OK
    location: `${city} ${district}`,          // ⚠️ 백엔드는 region, district 분리
    salary: formData.salary.amount,           // ⚠️ 백엔드는 salaryAmount + salaryType
    workHours: formData.workHours.type,       // ⚠️ 백엔드는 workHoursType, start, end
    description: formData.description,         // ✅ 매핑 OK
    contact: formData.managerPhone,           // ❌ 백엔드는 managerPhone 필드명 사용
    // ... 기타
}
```

#### 문제점
1. **필드명 불일치**:
   - Frontend: `contact` → Backend: `managerPhone`
   - Frontend: `salary.amount` → Backend: `salaryAmount`, `salaryType`

2. **누락된 필드** (백엔드 DTO에는 있지만 프론트엔드에서 안 보냄):
   - `managerName` ✅ (formData에 있음)
   - `contactKakao`, `contactLine`, `contactTelegram`
   - `zonecode`, `roadAddress`, `addressDetail`
   - `workDays` (배열)
   - `ageMin`, `ageMax`
   - `welfare`, `preferredConditions` 등

3. **데이터 타입 불일치**:
   - Frontend: `ageLimit.start` (number) → Backend: `ageMin` (number) ✅
   - Frontend: `images[].file` (File) → Backend: `images` (string[]) ✅ (업로드 후 URL로 변환)

---

## 📝 테스트 실행 방법

### 옵션 1: 수동 테스트 (권장)

1. **프론트엔드 개발 서버 실행**
   ```bash
   cd "C:\Users\mapdr\Desktop\queenalba-clone - 복사본"
   npm run dev
   ```

2. **브라우저에서 접속**
   ```
   http://localhost:5173/post-ad
   ```

3. **테스트 케이스 실행**
   - 광고주 계정으로 로그인 (`employer1@test.com` / `Employer123!@`)
   - 각 테스트 케이스별로 폼 작성
   - 제출 시 에러 메시지 확인
   - 브라우저 개발자 도구 네트워크 탭에서 응답 확인

### 옵션 2: API 직접 테스트

백엔드 테스트 스크립트 재활용:
```bash
cd "C:\Users\mapdr\Desktop\queenalba-clone - 복사본\backend"
node test-validations.js
```

---

## 🎯 예상 문제점

### 1. 백엔드 에러 메시지가 프론트엔드에 제대로 표시 안 됨

**현재 에러 핸들링** (PostAd.tsx 라인 401-403):
```typescript
} catch (error) {
    console.error(error);
    setError('광고 등록 중 오류가 발생했습니다.');  // ❌ 일반적 메시지만
}
```

**문제**:
- 백엔드의 구체적인 에러 메시지 무시
- 사용자는 무엇이 잘못되었는지 알 수 없음

**개선 필요**:
```typescript
} catch (error: any) {
    console.error(error);
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        '광고 등록 중 오류가 발생했습니다.';
    setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
}
```

### 2. 클라이언트 사이드 검증 부재

**현재**: 폼 제출 시에만 백엔드 검증
**문제**:
- 네트워크 요청 후에야 에러 확인
- 느린 피드백
- 나쁜 사용자 경험

**개선 필요**:
- 실시간 입력 검증
- 포커스 아웃 시 검증
- 제출 전 클라이언트 검증

### 3. 필드 매핑 불일치

**현재**:
```typescript
contact: formData.managerPhone,  // ❌ 필드명 불일치
```

**백엔드 기대**:
```typescript
managerPhone: "010-1234-5678"
```

---

## 💡 권장 개선사항

### 우선순위 1: 에러 핸들링 개선 (즉시)

**파일**: `src/pages/PostAd.tsx`, `src/utils/adService.ts`

```typescript
// adService.ts - createAdWithApi 개선
} catch (error: any) {
    console.error('Create ad error:', error);

    // 백엔드 검증 에러 메시지 추출
    const backendMessage = error.response?.data?.message;

    if (backendMessage) {
        return {
            success: false,
            message: Array.isArray(backendMessage)
                ? backendMessage.join('\n')
                : backendMessage
        };
    }

    return {
        success: false,
        message: error.message || '서버 연결에 실패했습니다.'
    };
}
```

### 우선순위 2: 필드 매핑 수정 (즉시)

**파일**: `src/pages/PostAd.tsx`

```typescript
// handlePaymentComplete에서 finalAdData 생성 시
const finalAdData = {
    // 업소 정보
    businessName: formData.businessName,
    managerName: formData.managerName,
    managerPhone: formData.managerPhone,        // ✅ 필드명 일치
    contactKakao: formData.messengers.kakao,
    contactLine: formData.messengers.line,
    contactTelegram: formData.messengers.telegram,

    // 주소
    zonecode: formData.address.zonecode,
    roadAddress: formData.address.roadAddress,
    addressDetail: formData.address.detailAddress,

    // 모집 정보
    title: formData.title,
    description: formData.description,

    // 업종
    industryLevel1: formData.industry.level1,
    industryLevel2: formData.industry.level2,

    // 지역
    region: formData.location.city,
    district: formData.location.district,
    town: formData.location.town,

    // 근무 조건
    workHoursType: formData.workHours.type,
    workHoursStart: formData.workHours.start,
    workHoursEnd: formData.workHours.end,
    workDays: formData.workDays,

    // 급여
    salaryType: formData.salary.type,
    salaryAmount: formData.salary.amount,

    // 나이
    ageMin: formData.ageLimit.start,
    ageMax: formData.ageLimit.end,
    ageNoLimit: formData.ageLimit.noLimit,

    // 기타
    gender: formData.gender,
    experience: formData.experience,
    daysOff: formData.daysOff,

    // 복지/조건
    welfare: formData.welfare,
    preferredConditions: formData.preferredConditions,
    receptionMethods: formData.receptionMethods,
    requiredDocuments: formData.requiredDocuments,

    // 키워드/테마
    keywords: formData.keywords,
    themes: formData.themes,

    // 이미지
    images: uploadedImageUrls,
    thumbnail: uploadedImageUrls[0] || undefined,
    businessLogoUrl: businessLogoUrl || undefined,

    // 광고 옵션
    productId: selectedProducts[productType] ? productType : undefined,
    highlightConfig: highlightSettings,
    jumpUpConfig: jumpUpSettings.enabled ? jumpUpSettings : undefined,
};
```

### 우선순위 3: 클라이언트 검증 추가 (단기)

**새 파일**: `src/utils/formValidation.ts`

```typescript
// 전화번호 검증
export const validatePhoneNumber = (phone: string): { valid: boolean; message?: string } => {
    if (!phone) return { valid: true }; // 선택사항

    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone)) {
        return {
            valid: false,
            message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
        };
    }

    return { valid: true };
};

// 나이 검증
export const validateAge = (age: number, type: 'min' | 'max'): { valid: boolean; message?: string } => {
    if (!age) return { valid: true }; // 선택사항

    if (!Number.isInteger(age)) {
        return { valid: false, message: '나이는 정수여야 합니다.' };
    }

    if (age < 14) {
        return { valid: false, message: '최소 나이는 14세 이상이어야 합니다.' };
    }

    if (age > 100) {
        return { valid: false, message: '최대 나이는 100세 이하여야 합니다.' };
    }

    return { valid: true };
};

// 근무요일 검증
export const validateWorkDays = (days: string[]): { valid: boolean; message?: string } => {
    const validDays = ['월', '화', '수', '목', '금', '토', '일'];

    for (const day of days) {
        if (!validDays.includes(day)) {
            return {
                valid: false,
                message: '근무요일은 월~일 중에서만 선택 가능합니다.'
            };
        }
    }

    return { valid: true };
};
```

### 우선순위 4: 실시간 검증 UI (중기)

**PostAd.tsx에 추가**:

```typescript
import { validatePhoneNumber, validateAge } from '../utils/formValidation';

// 전화번호 입력 시
const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, managerPhone: value });

    const validation = validatePhoneNumber(value);
    if (!validation.valid) {
        setFieldErrors({ ...fieldErrors, managerPhone: validation.message });
    } else {
        const { managerPhone, ...rest } = fieldErrors;
        setFieldErrors(rest);
    }
};

// JSX에서
<input
    type="text"
    value={formData.managerPhone}
    onChange={(e) => handlePhoneChange(e.target.value)}
    className={fieldErrors.managerPhone ? 'border-red-500' : ''}
/>
{fieldErrors.managerPhone && (
    <p className="text-red-400 text-sm mt-1">{fieldErrors.managerPhone}</p>
)}
```

---

## 📊 테스트 결과 기록 양식

테스트 실행 후 아래 표를 작성하세요:

### 전화번호 검증

| Test | 입력값 | 예상 | 결과 | 에러 메시지 | 비고 |
|------|--------|------|------|------------|------|
| 1.1 | 010-1234-5678 | ✅ | | | |
| 1.2 | 123-456-7890 | ❌ | | | |
| 1.3 | 010-abcd-5678 | ❌ | | | |

### 나이 검증

| Test | 입력값 | 예상 | 결과 | 에러 메시지 | 비고 |
|------|--------|------|------|------------|------|
| 2.1 | 20-35 | ✅ | | | |
| 2.2 | 13 | ❌ | | | |
| 2.3 | 101 | ❌ | | | |

---

## 🎯 성공 기준

1. ✅ 백엔드 에러 메시지가 프론트엔드에 표시됨
2. ✅ 사용자가 무엇이 잘못되었는지 이해할 수 있음
3. ✅ 필드 매핑이 백엔드 DTO와 일치
4. ⭐ (선택) 제출 전 클라이언트 검증으로 빠른 피드백

---

**작성일**: 2025-12-26
**작성자**: Claude Code
**상태**: 테스트 대기
