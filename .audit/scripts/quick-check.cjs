#!/usr/bin/env node

/**
 * 빠른 패턴 체크 스크립트
 * 
 * 사용법:
 *   node quick-check.js [파일경로...]
 *   node quick-check.js pages/api/auth/login.ts
 *   node quick-check.js --staged  (git staged 파일만)
 * 
 * Claude 호출 없이 위험 패턴만 빠르게 체크 (1초 내)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 색상 코드
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// 설정 로드
let config;
try {
  const configPath = path.join(__dirname, '..', 'config.json');
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error('❌ config.json을 찾을 수 없습니다.');
  process.exit(1);
}

// 위험 패턴 정규식으로 변환
const dangerPatterns = Object.entries(config.dangerPatterns).map(([name, info]) => ({
  name,
  pattern: new RegExp(info.pattern, 'gi'),
  severity: info.severity,
  description: info.description,
  fix: info.fix
}));

// 위험도별 파일 패턴
const riskPatterns = config.riskClassification;

/**
 * 파일의 위험 등급 판단
 */
function getRiskLevel(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  for (const [level, config] of Object.entries(riskPatterns)) {
    for (const pattern of config.patterns) {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      if (regex.test(normalizedPath)) {
        return level;
      }
    }
  }
  return 'LOW';
}

/**
 * 파일 내용 검사
 */
function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { error: '파일 없음' };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  const riskLevel = getRiskLevel(filePath);

  for (const { name, pattern, severity, description, fix } of dangerPatterns) {
    // LOW 파일은 CRITICAL만 체크
    if (riskLevel === 'LOW' && severity !== 'CRITICAL') continue;
    
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        issues.push({
          name,
          severity,
          line: i + 1,
          content: lines[i].trim().substring(0, 60),
          description,
          fix
        });
      }
      // 정규식 lastIndex 리셋
      pattern.lastIndex = 0;
    }
  }

  return {
    filePath,
    riskLevel,
    issues
  };
}

/**
 * 결과 출력
 */
function printResults(results) {
  const criticals = [];
  const highs = [];
  const others = [];

  for (const result of results) {
    if (result.error) continue;
    
    for (const issue of result.issues) {
      const item = { ...issue, file: result.filePath };
      if (issue.severity === 'CRITICAL') criticals.push(item);
      else if (issue.severity === 'HIGH') highs.push(item);
      else others.push(item);
    }
  }

  console.log('\n' + colors.bold + '═══════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bold + '                    🔍 빠른 패턴 체크 결과' + colors.reset);
  console.log(colors.bold + '═══════════════════════════════════════════════════════════' + colors.reset);

  // 파일별 위험도 표시
  console.log('\n📁 검사한 파일:');
  for (const result of results) {
    if (result.error) continue;
    const levelColor = {
      'CRITICAL': colors.red,
      'HIGH': colors.yellow,
      'MEDIUM': colors.blue,
      'LOW': colors.green
    }[result.riskLevel];
    console.log(`   ${levelColor}[${result.riskLevel}]${colors.reset} ${result.filePath}`);
  }

  // CRITICAL 이슈
  if (criticals.length > 0) {
    console.log('\n' + colors.red + colors.bold + '🚨 CRITICAL 이슈 (즉시 수정 필수)' + colors.reset);
    console.log(colors.red + '─────────────────────────────────────────────────────────' + colors.reset);
    
    for (const issue of criticals) {
      console.log(`\n${colors.red}❌ ${issue.name}${colors.reset}`);
      console.log(`   파일: ${issue.file}:${issue.line}`);
      console.log(`   코드: ${colors.cyan}${issue.content}${colors.reset}`);
      console.log(`   ${colors.yellow}위험: ${issue.description}${colors.reset}`);
      console.log(`   ${colors.green}해결: ${issue.fix}${colors.reset}`);
    }
  }

  // HIGH 이슈
  if (highs.length > 0) {
    console.log('\n' + colors.yellow + colors.bold + '⚠️  HIGH 이슈 (확인 권장)' + colors.reset);
    console.log(colors.yellow + '─────────────────────────────────────────────────────────' + colors.reset);
    
    for (const issue of highs) {
      console.log(`\n${colors.yellow}⚠️  ${issue.name}${colors.reset}`);
      console.log(`   파일: ${issue.file}:${issue.line}`);
      console.log(`   해결: ${issue.fix}`);
    }
  }

  // 요약
  console.log('\n' + colors.bold + '═══════════════════════════════════════════════════════════' + colors.reset);
  console.log(`📊 요약: CRITICAL ${colors.red}${criticals.length}${colors.reset} | HIGH ${colors.yellow}${highs.length}${colors.reset} | 기타 ${others.length}`);
  
  if (criticals.length > 0) {
    console.log(`\n${colors.red}${colors.bold}❌ CRITICAL 이슈가 있어 커밋이 차단됩니다.${colors.reset}`);
    console.log(`${colors.yellow}해결 후 다시 시도하세요.${colors.reset}\n`);
    return false;
  } else if (highs.length > 0) {
    console.log(`\n${colors.yellow}⚠️  HIGH 이슈가 있습니다. 확인 후 진행하세요.${colors.reset}\n`);
    return true;
  } else {
    console.log(`\n${colors.green}✅ 위험 패턴 없음!${colors.reset}\n`);
    return true;
  }
}

/**
 * Git staged 파일 가져오기
 */
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });
    return output.trim().split('\n').filter(f => f && /\.(ts|tsx|js|jsx)$/.test(f));
  } catch (e) {
    return [];
  }
}

/**
 * 메인 실행
 */
function main() {
  const args = process.argv.slice(2);
  let files = [];

  if (args.includes('--staged')) {
    files = getStagedFiles();
    if (files.length === 0) {
      console.log('📝 staged된 JS/TS 파일이 없습니다.');
      process.exit(0);
    }
  } else if (args.length > 0) {
    files = args.filter(f => !f.startsWith('-'));
  } else {
    console.log('사용법: node quick-check.js [파일...] 또는 --staged');
    process.exit(0);
  }

  console.log(`\n🔍 ${files.length}개 파일 검사 중...`);
  
  const results = files.map(checkFile);
  const passed = printResults(results);
  
  process.exit(passed ? 0 : 1);
}

main();
