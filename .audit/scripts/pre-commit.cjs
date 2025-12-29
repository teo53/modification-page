#!/usr/bin/env node

/**
 * Pre-commit 감사 스크립트
 * 
 * Git commit 전에 자동 실행되어:
 * 1. ESLint 검사
 * 2. TypeScript 타입 검사
 * 3. 위험 패턴 검사
 * 4. CRITICAL 파일이면 Claude 감사 권장
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 색상
const c = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

console.log('\n' + c.bold + '🔒 CTO급 Pre-commit 감사 시작...' + c.reset + '\n');

// 설정 로드
let config;
try {
  const configPath = path.join(__dirname, '..', 'config.json');
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.log(c.yellow + '⚠️  config.json 없음, 기본 검사만 실행' + c.reset);
  config = null;
}

// Staged 파일 가져오기
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });
    return output.trim().split('\n').filter(f => f.length > 0);
  } catch (e) {
    return [];
  }
}

// 파일 위험도 판단
function getRiskLevel(filePath) {
  if (!config) return 'MEDIUM';

  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const [level, conf] of Object.entries(config.riskClassification)) {
    for (const pattern of conf.patterns) {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      if (regex.test(normalizedPath)) {
        return level;
      }
    }
  }
  return 'LOW';
}

// ESLint 실행
function runESLint(files) {
  console.log(c.blue + '1️⃣  ESLint 검사...' + c.reset);

  const jsFiles = files.filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
  if (jsFiles.length === 0) {
    console.log(c.green + '   ✓ JS/TS 파일 없음 - 스킵' + c.reset);
    return true;
  }

  try {
    execSync(`npx eslint ${jsFiles.join(' ')} --max-warnings=0`, {
      stdio: 'pipe',
      encoding: 'utf8'
    });
    console.log(c.green + '   ✓ ESLint 통과' + c.reset);
    return true;
  } catch (e) {
    console.log(c.red + '   ✗ ESLint 실패' + c.reset);
    console.log('\n' + (e.stdout || e.message));
    return false;
  }
}

// TypeScript 검사
function runTypeScript() {
  console.log(c.blue + '2️⃣  TypeScript 검사...' + c.reset);

  // tsconfig.json 존재 확인
  if (!fs.existsSync('tsconfig.json')) {
    console.log(c.green + '   ✓ TypeScript 미사용 - 스킵' + c.reset);
    return true;
  }

  try {
    execSync('npx tsc --noEmit', {
      stdio: 'pipe',
      encoding: 'utf8'
    });
    console.log(c.green + '   ✓ TypeScript 통과' + c.reset);
    return true;
  } catch (e) {
    console.log(c.red + '   ✗ TypeScript 실패' + c.reset);
    console.log('\n' + (e.stdout || e.message));
    return false;
  }
}

// 위험 패턴 검사 (quick-check.js 호출)
function runPatternCheck(files) {
  console.log(c.blue + '3️⃣  위험 패턴 검사...' + c.reset);

  const jsFiles = files.filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
  if (jsFiles.length === 0) {
    console.log(c.green + '   ✓ JS/TS 파일 없음 - 스킵' + c.reset);
    return { passed: true, criticalFiles: [] };
  }

  const quickCheckPath = path.join(__dirname, 'quick-check.cjs');
  const result = spawnSync('node', [quickCheckPath, ...jsFiles], {
    encoding: 'utf8',
    stdio: 'inherit'
  });

  return {
    passed: result.status === 0,
    criticalFiles: jsFiles.filter(f => getRiskLevel(f) === 'CRITICAL')
  };
}

// CRITICAL 파일 Claude 감사 권장
function suggestClaudeAudit(criticalFiles) {
  if (criticalFiles.length === 0) return;

  console.log('\n' + c.yellow + c.bold + '📋 Claude 감사 권장' + c.reset);
  console.log(c.yellow + '─────────────────────────────────────────────────────────' + c.reset);
  console.log(`\n다음 ${c.red}CRITICAL${c.reset} 파일이 변경되었습니다:`);

  for (const file of criticalFiles) {
    console.log(`   ${c.red}●${c.reset} ${file}`);
  }

  console.log(`
${c.cyan}Claude Code에서 다음 명령어로 감사하세요:${c.reset}

${c.bold}방금 수정한 CRITICAL 파일 감사해줘:${c.reset}
${criticalFiles.map(f => `- ${f}`).join('\n')}

체크:
1. SQL injection, XSS 취약점
2. 인증/인가 우회 가능성
3. 민감 정보 노출
4. 에러 처리 누락

문제 있으면 직접 수정하고 뭘 바꿨는지 알려줘.
`);
}

// 메인 실행
async function main() {
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log(c.yellow + 'staged된 파일이 없습니다.' + c.reset);
    process.exit(0);
  }

  console.log(`📁 ${stagedFiles.length}개 파일 검사\n`);

  // 파일별 위험도 표시
  const filesByRisk = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: []
  };

  for (const file of stagedFiles) {
    const risk = getRiskLevel(file);
    filesByRisk[risk].push(file);
  }

  for (const [level, files] of Object.entries(filesByRisk)) {
    if (files.length > 0) {
      const color = {
        CRITICAL: c.red,
        HIGH: c.yellow,
        MEDIUM: c.blue,
        LOW: c.green
      }[level];
      console.log(`${color}[${level}]${c.reset} ${files.length}개 파일`);
    }
  }
  console.log('');

  // 1. ESLint
  const eslintPassed = runESLint(stagedFiles);
  if (!eslintPassed) {
    console.log(`\n${c.red}${c.bold}❌ ESLint 오류로 커밋 차단${c.reset}`);
    console.log(`${c.yellow}Antigravity에게 "ESLint 오류 수정해줘" 요청하세요.${c.reset}\n`);
    process.exit(1);
  }

  // 2. TypeScript
  const tsPassed = runTypeScript();
  if (!tsPassed) {
    console.log(`\n${c.red}${c.bold}❌ TypeScript 오류로 커밋 차단${c.reset}`);
    console.log(`${c.yellow}Antigravity에게 "TypeScript 오류 수정해줘" 요청하세요.${c.reset}\n`);
    process.exit(1);
  }

  // 3. 위험 패턴
  const { passed: patternPassed, criticalFiles } = runPatternCheck(stagedFiles);
  if (!patternPassed) {
    console.log(`\n${c.red}${c.bold}❌ 위험 패턴 발견으로 커밋 차단${c.reset}`);
    console.log(`${c.yellow}위에 표시된 문제를 먼저 해결하세요.${c.reset}\n`);
    process.exit(1);
  }

  // 4. CRITICAL 파일 있으면 Claude 감사 권장
  suggestClaudeAudit(criticalFiles);

  // 완료
  console.log('\n' + c.bold + '═══════════════════════════════════════════════════════════' + c.reset);
  console.log(`${c.green}${c.bold}✅ 모든 검사 통과!${c.reset}`);
  console.log(c.bold + '═══════════════════════════════════════════════════════════' + c.reset + '\n');

  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
