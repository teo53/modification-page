---
description: Main/Branch 자동 분류 및 안정성 검증 워크플로우
---

# Branch 관리 정책

## 🔥 핵심 원칙
> 완전히 안정화되지 않은 코드는 어떤 경우에도 main에 등록할 수 없다.

## Main 포함 기준
다음 **모두** 충족 시 main 병합 가능:
- 기능 100% 완성
- UI/UX 정상, 반응형 정상
- 콘솔 에러 없음
- 브라우저 테스트 통과
- 기존 기능과 충돌 없음
- 배포해도 문제 없는 수준

## Branch 분리 기준
다음 중 **하나라도** 해당되면 branch 작업:
- 기능 개발 중 / UI 변경 / 실험 코드
- 리팩토링 / 테스트 미완료
- 구조 개편 / 기존 코드 주석 처리

### 브랜치명 규칙
- `feature/기능명` - 새 기능
- `fix/버그명` - 버그 수정
- `refactor/개편명` - 리팩토링
- `experiment/실험명` - 실험
- `hotfix/긴급패치` - 긴급 수정

## Merge 전 QA 체크리스트

// turbo-all

### 기능 안정성
```bash
npm run build
npm run lint
```

### 브라우저 테스트
1. Chrome 테스트
2. Edge 테스트
3. 모바일 반응형 확인

### 코드 품질
- 콘솔 에러 0
- 임시 코드/log 제거
- 경고 메시지 검토

### Git 절차
```bash
git pull origin main
git checkout feature/브랜치명
# 작업 후
git add .
git commit -m "feat: 설명"
git push origin feature/브랜치명
```

## 출력 형식
```
[Branch Decision]
- 분류: (main 등록 가능 / branch 필요)
- 판단 이유:

[Recommended Branch Name]
- feature/______

[Stability Assessment]
- 리스크 평가
- 추가 테스트 권장사항
```
