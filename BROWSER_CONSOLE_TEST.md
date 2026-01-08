# 브라우저 콘솔 테스트 가이드

## 📋 준비사항

1. **백엔드 서버 실행 확인**
   ```bash
   # 백엔드 터미널에서
   cd backend
   npm run start:dev
   # http://localhost:4000 실행 중이어야 함
   ```

2. **프론트엔드 서버 실행**
   ```bash
   # 프론트엔드 터미널에서
   npm run dev
   # http://localhost:5173 접속 가능해야 함
   ```

3. **브라우저에서 접속**
   ```
   http://localhost:5173/login
   ```

4. **광고주 계정으로 로그인**
   - 테스트 계정 정보는 `.env` 파일 또는 시스템 관리자에게 문의하세요
   - 환경 변수: `TEST_EMPLOYER_EMAIL`, `TEST_EMPLOYER_PASSWORD`

5. **광고 등록 페이지로 이동**
   ```
   http://localhost:5173/post-ad
   ```

---

## 🧪 브라우저 콘솔 테스트

개발자 도구 (F12) → Console 탭에서 아래 코드를 실행하세요.

### 테스트 1: 잘못된 전화번호 형식

```javascript
// 테스트용 광고 데이터 (잘못된 전화번호)
const testData = {
    businessName: "Console Test Business",
    title: "Console Test Ad",
    managerPhone: "123-456-7890",  // ❌ 잘못된 형식
    region: "서울",
    district: "강남구"
};

// API 호출
fetch('http://localhost:4000/api/v1/ads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
    console.log('✅ Response:', data);
    if (data.message) {
        console.log('📝 Error Message:', data.message);
    }
})
.catch(err => console.error('❌ Error:', err));
```

**예상 결과**:
```json
{
  "statusCode": 400,
  "message": ["올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)"],
  "error": "Bad Request"
}
```

---

### 테스트 2: 나이 범위 초과

```javascript
const testData = {
    businessName: "Console Test Business 2",
    title: "Console Test Ad 2",
    ageMin: 13,  // ❌ 최소 14세 미만
    ageMax: 101  // ❌ 최대 100세 초과
};

fetch('http://localhost:4000/api/v1/ads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
    console.log('✅ Response:', data);
    if (data.message) {
        console.log('📝 Error Messages:');
        data.message.forEach(msg => console.log('  -', msg));
    }
});
```

**예상 결과**:
```json
{
  "statusCode": 400,
  "message": [
    "최소 나이는 14세 이상이어야 합니다.",
    "최대 나이는 100세 이하여야 합니다."
  ]
}
```

---

### 테스트 3: 잘못된 근무요일

```javascript
const testData = {
    businessName: "Console Test Business 3",
    title: "Console Test Ad 3",
    workDays: ["Monday", "Tuesday"]  // ❌ 영어 요일명
};

fetch('http://localhost:4000/api/v1/ads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
    console.log('✅ Response:', data);
    if (data.message) {
        console.log('📝 Error Message:', data.message);
    }
});
```

**예상 결과**:
```json
{
  "statusCode": 400,
  "message": ["근무요일은 월~일 중에서만 선택 가능합니다."]
}
```

---

### 테스트 4: 잘못된 이미지 URL

```javascript
const testData = {
    businessName: "Console Test Business 4",
    title: "Console Test Ad 4",
    businessLogoUrl: "https://example.com/image.jpg"  // ❌ Cloudinary 아님
};

fetch('http://localhost:4000/api/v1/ads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
    console.log('✅ Response:', data);
    if (data.message) {
        console.log('📝 Error Message:', data.message);
    }
});
```

**예상 결과**:
```json
{
  "statusCode": 400,
  "message": ["허용된 이미지 서버(Cloudinary)의 URL만 사용 가능합니다."]
}
```

---

### 테스트 5: 중복 광고 등록

```javascript
// 1단계: 첫 광고 등록
const firstAd = {
    businessName: "Duplicate Test Business",
    title: "Duplicate Test Title"
};

fetch('http://localhost:4000/api/v1/ads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(firstAd)
})
.then(res => res.json())
.then(data => {
    console.log('1️⃣ First ad:', data);

    // 2단계: 동일한 광고 다시 등록 시도
    return fetch('http://localhost:4000/api/v1/ads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(firstAd)
    });
})
.then(res => res.json())
.then(data => {
    console.log('2️⃣ Duplicate attempt:', data);
    if (data.statusCode === 409) {
        console.log('✅ 중복 방지 작동!');
        console.log('📝 Message:', data.message);
    }
});
```

**예상 결과**:
```json
{
  "statusCode": 409,
  "message": "동일한 제목과 업소명의 광고가 이미 등록되어 있습니다. 기존 광고를 수정하시거나 다른 제목을 사용해주세요.",
  "error": "Conflict"
}
```

---

### 테스트 6: 올바른 데이터로 광고 등록

```javascript
const validAd = {
    businessName: "Valid Test Business",
    title: "Valid Test Ad",
    managerPhone: "010-1234-5678",  // ✅ 올바른 형식
    ageMin: 20,                     // ✅ 14~100 범위
    ageMax: 35,                     // ✅ 14~100 범위
    workDays: ["월", "화", "수"],   // ✅ 한글 요일
    region: "서울",
    district: "강남구"
};

fetch('http://localhost:4000/api/v1/ads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(validAd)
})
.then(res => res.json())
.then(data => {
    console.log('✅ Response:', data);
    if (data.success) {
        console.log('🎉 광고 등록 성공!');
        console.log('📝 Ad ID:', data.data?.id);
        console.log('📊 Status:', data.data?.status);
    }
});
```

**예상 결과**:
```json
{
  "success": true,
  "message": "광고가 등록되었습니다. 관리자 승인 후 게시됩니다.",
  "data": {
    "id": "...",
    "status": "PENDING",
    "businessName": "Valid Test Business",
    "title": "Valid Test Ad",
    ...
  }
}
```

---

## 📊 테스트 결과 기록

| # | 테스트 케이스 | 예상 상태 | 실제 상태 | 에러 메시지 표시 | 비고 |
|---|-------------|----------|----------|----------------|------|
| 1 | 잘못된 전화번호 | 400 | | | |
| 2 | 나이 범위 초과 | 400 | | | |
| 3 | 잘못된 근무요일 | 400 | | | |
| 4 | 잘못된 이미지 URL | 400 | | | |
| 5 | 중복 광고 | 409 | | | |
| 6 | 올바른 데이터 | 201 | | | |

---

## 🔍 네트워크 탭 확인

1. **개발자 도구 (F12)**
2. **Network 탭 선택**
3. **Fetch/XHR 필터 적용**
4. **요청 클릭 → Response 확인**

**확인사항**:
- Status Code (400, 409, 201 등)
- Response Body의 `message` 필드
- Request Body의 데이터 구조

---

## 💡 프론트엔드 UI 테스트

### 실제 폼에서 테스트

1. **광고 등록 폼 작성**
   - http://localhost:5173/post-ad

2. **Step 1: 업소 정보**
   - 업소명: "UI Test Business"
   - 담당자 전화번호: "123-456-7890" (잘못된 형식)

3. **Step 2: 모집 정보**
   - 공고 제목: "UI Test Ad"
   - 나이: 최소 13, 최대 101 (범위 초과)

4. **Step 3: 상품 선택**
   - 아무 상품이나 선택

5. **제출 버튼 클릭**

6. **에러 메시지 확인**
   - 빨간색 경고 박스에 에러 메시지가 표시되어야 함
   - 메시지 내용이 구체적이어야 함 (단순 "오류가 발생했습니다" X)

---

## ✅ 체크리스트

- [ ] 백엔드 서버 실행 중 (http://localhost:4000)
- [ ] 프론트엔드 서버 실행 중 (http://localhost:5173)
- [ ] 광고주 계정으로 로그인
- [ ] 브라우저 콘솔 테스트 1-6 실행
- [ ] 네트워크 탭에서 응답 확인
- [ ] 실제 폼에서 UI 테스트
- [ ] 에러 메시지가 사용자에게 표시되는지 확인

---

**작성일**: 2025-12-26
**업데이트**: adService.ts 에러 핸들링 개선 완료
**상태**: 테스트 준비 완료
