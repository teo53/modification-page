# APK 버전 관리 가이드

## 개요
APK 빌드 시 버전 충돌을 방지하기 위한 가이드입니다.

## 버전 관리 구조

### 파일 위치
- `android/app/version.properties`: 현재 버전 코드 저장
- `android/app/build.gradle`: 버전 읽기 및 빌드 설정

### 현재 버전 확인
```bash
cat android/app/version.properties
```

## 버전 업데이트 방법

### 방법 1: 수동 업데이트 (권장)
APK 빌드 전에 수동으로 버전을 올립니다:

```bash
# 현재 버전 확인
cat android/app/version.properties

# 버전 코드 수동 업데이트 (예: 2 -> 3)
echo "VERSION_CODE=3" > android/app/version.properties
```

### 방법 2: Gradle Task 사용
```bash
cd android
./gradlew incrementVersion
cd ..
```

### 방법 3: CI/CD에서 자동 증가
GitHub Actions 또는 CI 파이프라인에서:

```yaml
- name: Increment Version
  run: |
    VERSION=$(cat android/app/version.properties | grep VERSION_CODE | cut -d'=' -f2)
    NEW_VERSION=$((VERSION + 1))
    echo "VERSION_CODE=$NEW_VERSION" > android/app/version.properties
```

## 빌드 프로세스

### 로컬 APK 빌드
```bash
# 1. 웹 빌드
npm run build

# 2. Capacitor 동기화
npx cap sync android

# 3. (선택) 버전 증가
echo "VERSION_CODE=$(( $(cat android/app/version.properties | grep VERSION_CODE | cut -d'=' -f2) + 1 ))" > android/app/version.properties

# 4. APK 빌드
cd android
./gradlew assembleRelease
cd ..
```

### APK 파일 위치
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## 주의사항

### ❌ 하지 말 것
1. 빌드 중에 version.properties 파일을 수동으로 변경하지 마세요
2. 동일한 버전 코드로 Play Store에 업로드하지 마세요
3. 버전을 내리지 마세요 (항상 증가만 가능)

### ✅ 해야 할 것
1. 빌드 **전에** 버전을 확인하고 필요시 증가
2. 변경된 version.properties를 git에 커밋
3. CI/CD에서는 빌드 성공 후에만 버전 파일 커밋

## 버전 형식

```
versionCode: 정수 (1, 2, 3, ...)
versionName: "1.0.{versionCode}" (예: 1.0.3)
```

## 문제 해결

### "Version code already exists" 에러
버전 코드가 이미 Play Store에 존재합니다.
```bash
# 버전 확인 및 증가
cat android/app/version.properties
echo "VERSION_CODE=10" > android/app/version.properties
```

### 빌드 실패 시 롤백
version.properties가 손상된 경우:
```bash
echo "VERSION_CODE=1" > android/app/version.properties
```

## 브랜치별 버전 관리

| 브랜치 | 버전 정책 |
|--------|-----------|
| main | 안정화된 버전만 |
| develop | 개발 중 버전 |
| feature/* | 버전 변경 금지 |
| release/* | 버전 증가 후 커밋 |

## 체크리스트

- [ ] 현재 버전 확인
- [ ] 필요시 버전 증가
- [ ] npm run build 성공
- [ ] npx cap sync android 성공
- [ ] APK 빌드 성공
- [ ] version.properties 커밋
