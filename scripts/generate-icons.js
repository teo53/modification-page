import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const svgPath = join(projectRoot, 'public/icons/icon.svg');

// PWA icon sizes
const pwaIconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Android mipmap sizes
const androidSizes = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192
};

async function generateIcons() {
  console.log('Generating icons from SVG...');

  // Generate PWA icons
  for (const size of pwaIconSizes) {
    const outputPath = join(projectRoot, `public/icons/icon-${size}x${size}.png`);
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Generate Apple Touch Icon
  const appleTouchPath = join(projectRoot, 'public/icons/apple-touch-icon.png');
  await sharp(svgPath)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);
  console.log('Generated: apple-touch-icon.png');

  // Generate favicon
  const faviconPath = join(projectRoot, 'public/favicon.png');
  await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  console.log('Generated: favicon.png');

  // Generate Android icons
  const androidResPath = join(projectRoot, 'android/app/src/main/res');

  for (const [density, size] of Object.entries(androidSizes)) {
    const mipmapDir = join(androidResPath, `mipmap-${density}`);

    // Ensure directory exists
    await mkdir(mipmapDir, { recursive: true });

    // Generate ic_launcher.png
    const launcherPath = join(mipmapDir, 'ic_launcher.png');
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(launcherPath);
    console.log(`Generated: mipmap-${density}/ic_launcher.png`);

    // Generate ic_launcher_round.png
    const roundPath = join(mipmapDir, 'ic_launcher_round.png');
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(roundPath);
    console.log(`Generated: mipmap-${density}/ic_launcher_round.png`);

    // Generate ic_launcher_foreground.png (slightly larger for adaptive icon)
    const foregroundSize = Math.round(size * 1.5);
    const foregroundPath = join(mipmapDir, 'ic_launcher_foreground.png');
    await sharp(svgPath)
      .resize(foregroundSize, foregroundSize)
      .extend({
        top: Math.round((foregroundSize * 0.25)),
        bottom: Math.round((foregroundSize * 0.25)),
        left: Math.round((foregroundSize * 0.25)),
        right: Math.round((foregroundSize * 0.25)),
        background: { r: 58, g: 58, b: 58, alpha: 1 }
      })
      .resize(foregroundSize, foregroundSize)
      .png()
      .toFile(foregroundPath);
    console.log(`Generated: mipmap-${density}/ic_launcher_foreground.png`);
  }

  console.log('\\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
