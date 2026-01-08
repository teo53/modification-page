# 보안 가이드 (Security Guide)

## 환경 변수 관리 (Environment Variable Management)

### 절대 하지 말아야 할 것 (Never Do This)

1. **`.env` 파일을 Git에 커밋하지 마세요**
   ```bash
   # .gitignore에 반드시 포함되어야 함
   .env
   .env.local
   .env.*.local
   ```

2. **프로덕션 키를 코드에 하드코딩하지 마세요**
   ```typescript
   // ❌ 잘못된 예
   const API_KEY = "sk-1234567890abcdef";

   // ✅ 올바른 예
   const API_KEY = process.env.API_KEY;
   ```

3. **민감한 정보를 클라이언트 코드에 노출하지 마세요**
   - `VITE_` 접두사가 붙은 변수만 프론트엔드에서 접근 가능
   - API 키, 시크릿은 백엔드에서만 사용

### 권장 환경 변수 관리 방법

#### 개발 환경
```bash
# .env 파일 복사
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# 값 수정 (에디터로 직접 수정)
nano apps/api/.env
```

#### 프로덕션 환경 (권장)

1. **Vercel/Netlify 등 호스팅 플랫폼 사용**
   - 대시보드에서 Environment Variables 설정
   - 자동 암호화 및 접근 제어

2. **비밀 관리 서비스 사용 (대규모 팀)**
   - [Doppler](https://doppler.com) - 무료 플랜 제공
   - [Infisical](https://infisical.com) - 오픈소스
   - AWS Secrets Manager / GCP Secret Manager

3. **CI/CD 환경**
   ```yaml
   # GitHub Actions 예시
   env:
     DATABASE_URL: ${{ secrets.DATABASE_URL }}
     JWT_SECRET: ${{ secrets.JWT_SECRET }}
   ```

## API 접근 제어 (API Access Control)

### 인증 체계

| 엔드포인트 | 인증 필요 | 역할 제한 |
|-----------|----------|----------|
| `GET /api/v1/ads` | ❌ | - |
| `POST /api/v1/ads` | ✅ | EMPLOYER, ADMIN |
| `GET /api/v1/admin/*` | ✅ | ADMIN |
| `PUT /api/v1/users/:id` | ✅ | 본인 또는 ADMIN |

### 역할 기반 접근 제어 (RBAC)

```typescript
// 사용자 역할 정의
type UserRole = 'user' | 'advertiser' | 'admin';

// 역할 확인 방법
const user = getCurrentUser();
if (user?.role === 'admin') {
  // 관리자 기능 허용
}
```

### 프론트엔드 라우트 보호

```typescript
// ProtectedRoute 사용
<Route path="/admin/*" element={
  <ProtectedRoute requiredRole="admin">
    <AdminCRM />
  </ProtectedRoute>
} />
```

## JWT 토큰 보안

### 토큰 저장
- ✅ `httpOnly` 쿠키 사용 (XSS 방지)
- ⚠️ localStorage 사용 시 XSS 취약점 주의

### 토큰 만료 설정 (권장)
```env
JWT_ACCESS_EXPIRATION=15m    # 액세스 토큰: 15분
JWT_REFRESH_EXPIRATION=7d    # 리프레시 토큰: 7일
```

## 스크래퍼 보안 주의사항

### 자격 증명 관리
```bash
# 스크래퍼 환경 변수 설정
cd scraper
cp .env.example .env
# .env 파일에 자격 증명 입력 (절대 커밋 금지)
```

### Rate Limiting
- 요청 간격: 최소 1-2초
- 동시 요청: 최대 3개
- 과도한 요청은 IP 차단 위험

### 법적 고려사항
- 대상 사이트의 `robots.txt` 확인
- 이용약관 검토 필수
- 수집 데이터의 상업적 사용 제한 확인

## 보안 체크리스트

### 배포 전 확인사항

- [ ] 모든 `.env` 파일이 `.gitignore`에 포함됨
- [ ] 하드코딩된 자격 증명 없음
- [ ] JWT_SECRET이 프로덕션용으로 변경됨 (최소 32자)
- [ ] CORS 설정이 프로덕션 도메인만 허용
- [ ] Rate limiting 활성화됨
- [ ] HTTPS 강제 적용됨
- [ ] 관리자 API에 역할 검증 적용됨

### 정기 점검사항

- [ ] 의존성 보안 취약점 스캔 (`npm audit`)
- [ ] 비밀 키 정기 교체 (최소 90일)
- [ ] 비정상 접근 로그 모니터링
- [ ] 세션/토큰 만료 정책 검토

## 보안 사고 대응

### 자격 증명 유출 시

1. **즉시 조치**
   - 유출된 키/토큰 즉시 폐기
   - 새 키 발급 및 배포

2. **영향 분석**
   - 유출 경로 파악
   - 접근 로그 확인

3. **재발 방지**
   - 유출 원인 제거
   - 팀 교육 실시

### 연락처

보안 취약점 발견 시: security@yourdomain.com
