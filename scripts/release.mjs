#!/usr/bin/env node

/**
 * Release Script - Automated versioning for LunaAlba monorepo
 *
 * Usage:
 *   pnpm release:patch   # 1.0.0 -> 1.0.1
 *   pnpm release:minor   # 1.0.0 -> 1.1.0
 *   pnpm release:major   # 1.0.0 -> 2.0.0
 *
 * This script:
 * 1. Bumps version in root package.json
 * 2. Syncs version to all workspace packages
 * 3. Updates Android versionName and versionCode
 * 4. Creates a git tag (optional)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Parse CLI arguments
const releaseType = process.argv[2];
if (!['patch', 'minor', 'major'].includes(releaseType)) {
  console.error('Usage: node release.mjs <patch|minor|major>');
  process.exit(1);
}

/**
 * Read JSON file
 */
function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

/**
 * Write JSON file
 */
function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

/**
 * Bump version string
 */
function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${parts[0] + 1}.0.0`;
    case 'minor':
      return `${parts[0]}.${parts[1] + 1}.0`;
    case 'patch':
      return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
    default:
      return version;
  }
}

/**
 * Calculate Android versionCode from semver
 * Format: MAJOR * 10000 + MINOR * 100 + PATCH
 */
function calculateVersionCode(version) {
  const parts = version.split('.').map(Number);
  return parts[0] * 10000 + parts[1] * 100 + parts[2];
}

/**
 * Update Android build.gradle
 */
function updateAndroidVersion(version, versionCode) {
  const gradlePath = join(ROOT_DIR, 'apps', 'mobile', 'android', 'app', 'build.gradle');

  if (!existsSync(gradlePath)) {
    // Try old location
    const oldGradlePath = join(ROOT_DIR, 'android', 'app', 'build.gradle');
    if (existsSync(oldGradlePath)) {
      let content = readFileSync(oldGradlePath, 'utf-8');

      // Update versionCode
      content = content.replace(
        /versionCode\s+\d+/,
        `versionCode ${versionCode}`
      );

      // Update versionName
      content = content.replace(
        /versionName\s+"[^"]+"/,
        `versionName "${version}"`
      );

      writeFileSync(oldGradlePath, content);
      console.log(`  Updated: android/app/build.gradle`);
    } else {
      console.log('  Skipped: Android build.gradle not found');
    }
    return;
  }

  let content = readFileSync(gradlePath, 'utf-8');

  content = content.replace(
    /versionCode\s+\d+/,
    `versionCode ${versionCode}`
  );

  content = content.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${version}"`
  );

  writeFileSync(gradlePath, content);
  console.log(`  Updated: apps/mobile/android/app/build.gradle`);
}

/**
 * Update Capacitor config
 */
function updateCapacitorConfig(version) {
  const configPath = join(ROOT_DIR, 'apps', 'mobile', 'capacitor.config.ts');

  if (!existsSync(configPath)) {
    // Try old location
    const oldConfigPath = join(ROOT_DIR, 'capacitor.config.ts');
    if (existsSync(oldConfigPath)) {
      let content = readFileSync(oldConfigPath, 'utf-8');

      // Add or update version in config
      if (content.includes('appVersion:')) {
        content = content.replace(
          /appVersion:\s*'[^']+'/,
          `appVersion: '${version}'`
        );
      }

      writeFileSync(oldConfigPath, content);
      console.log(`  Updated: capacitor.config.ts`);
    }
    return;
  }

  let content = readFileSync(configPath, 'utf-8');

  if (content.includes('appVersion:')) {
    content = content.replace(
      /appVersion:\s*'[^']+'/,
      `appVersion: '${version}'`
    );
    writeFileSync(configPath, content);
    console.log(`  Updated: apps/mobile/capacitor.config.ts`);
  }
}

/**
 * Main release function
 */
async function release() {
  console.log(`\n🚀 Starting ${releaseType} release...\n`);

  // Read root package.json
  const rootPkgPath = join(ROOT_DIR, 'package.json');
  const rootPkg = readJson(rootPkgPath);
  const currentVersion = rootPkg.version;
  const newVersion = bumpVersion(currentVersion, releaseType);
  const versionCode = calculateVersionCode(newVersion);

  console.log(`Version: ${currentVersion} → ${newVersion}`);
  console.log(`Android versionCode: ${versionCode}\n`);

  // Update root package.json
  rootPkg.version = newVersion;
  writeJson(rootPkgPath, rootPkg);
  console.log(`  Updated: package.json`);

  // Update workspace packages
  const workspaces = [
    'apps/web/package.json',
    'apps/api/package.json',
    'apps/mobile/package.json',
    'packages/types/package.json',
  ];

  for (const workspace of workspaces) {
    const pkgPath = join(ROOT_DIR, workspace);
    if (existsSync(pkgPath)) {
      const pkg = readJson(pkgPath);
      pkg.version = newVersion;
      writeJson(pkgPath, pkg);
      console.log(`  Updated: ${workspace}`);
    }
  }

  // Update Android version
  updateAndroidVersion(newVersion, versionCode);

  // Update Capacitor config
  updateCapacitorConfig(newVersion);

  console.log(`\n✅ Release ${newVersion} prepared!\n`);
  console.log('Next steps:');
  console.log('  1. Review changes: git diff');
  console.log('  2. Commit: git commit -am "release: v' + newVersion + '"');
  console.log('  3. Tag: git tag v' + newVersion);
  console.log('  4. Push: git push && git push --tags');
}

release().catch((err) => {
  console.error('Release failed:', err);
  process.exit(1);
});
