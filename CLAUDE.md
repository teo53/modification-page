# Claude Code 작업 지침

## 🚨 디버깅 무한 루프 방지 규칙

### 규칙 1: 3회 실패 시 전면 재검토
동일한 유형의 오류가 3번 반복되면:
1. **즉시 멈추고** 현재 접근법 전체를 재검토
2. 오류 로그만 보지 말고 **근본 원인** 분석
3. "더 단순한 방법이 있는가?" 질문
4. 필요시 사용자에게 **접근법 변경 제안**

### 규칙 2: 단순한 것부터 시작
복잡한 최적화보다 **작동하는 단순한 솔루션** 우선:
```
❌ 처음부터 멀티스테이지 Docker 빌드
✅ 단일 스테이지로 작동 확인 → 그 다음 최적화
```

### 규칙 3: 변경사항 배포 확인
수정 후 오류 분석 전에 반드시 확인:
1. PR이 main에 **병합되었는가?**
2. 새 빌드가 **시작되었는가?**
3. 빌드 로그에 **수정사항이 반영되었는가?**

### 규칙 4: 로컬 테스트 우선
가능한 경우 원격 배포 전에 로컬에서 테스트:
```bash
# Docker 빌드 테스트
docker build -f infra/docker/Dockerfile.api -t test-api .
docker run -p 3000:3000 test-api
```

### 규칙 5: 기술 스택 이해 확인
작업 전 해당 기술의 특성 파악:
- **pnpm**: symlink 기반 → Docker 복사 시 문제
- **Prisma**: generate 필요, 버전 호환성 중요
- **NestJS**: dist/src/main.js 경로 구조

---

## 📁 프로젝트별 주의사항

### Docker 배포 (Railway)
```
✅ 단일 스테이지 빌드 사용 (infra/docker/Dockerfile.api)
✅ pnpm install → pnpm build → node dist/src/main
❌ 멀티스테이지에서 node_modules 복사 (symlink 깨짐)
❌ npx prisma generate (버전 불일치 위험)
```

### Prisma
```
✅ 프로젝트 버전 사용: pnpm build (package.json에 prisma generate 포함)
❌ npx prisma generate (최신 버전 다운로드됨)
❌ npx prisma@버전 (pnpm-lock.yaml과 불일치 가능)
```

### pnpm 워크스페이스
```
✅ workspace:* 의존성은 빌드 시점에 해결됨
✅ 단일 스테이지에서 모든 작업 완료
❌ node_modules를 Docker 스테이지 간 복사
❌ pnpm deploy 후 복잡한 파일 복사
```

---

## 🔧 문제 해결 체크리스트

### Railway 배포 실패 시
1. [ ] Build Logs 확인 (Deploy Logs 아님)
2. [ ] main 브랜치에 최신 코드 있는지 확인
3. [ ] Dockerfile 경로 설정 확인 (Settings > Build)
4. [ ] 환경 변수 설정 확인

### Prisma 오류 시
1. [ ] `@prisma/client` 버전 확인
2. [ ] `prisma` CLI 버전 확인
3. [ ] schema.prisma 문법이 해당 버전과 호환되는지 확인
4. [ ] prisma generate가 빌드 과정에 포함되어 있는지 확인

### node_modules 관련 오류 시
1. [ ] pnpm의 symlink 구조 고려
2. [ ] Docker에서 복사 vs 설치 방식 검토
3. [ ] 단일 스테이지 빌드로 단순화 고려

---

## 📋 작업 시작 전 확인사항

새로운 기능이나 버그 수정 시작 전:
1. 현재 배포 상태 확인
2. 관련 기술 스택의 특성 파악
3. 가장 단순한 접근법 먼저 시도
4. 로컬 테스트 가능 여부 확인
