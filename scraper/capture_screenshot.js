
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import url from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 타임아웃 설정 (30초)
const TIMEOUT_MS = 30000;

(async () => {
    let browser = null;

    try {
        // 명령줄 인자 처리
        const fileName = process.argv[2] || 'detail_page_v2.html';
        const outputName = process.argv[3] || 'detail_page_hq_v2.png';

        console.log('🚀 브라우저 시작 중...');

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            timeout: TIMEOUT_MS
        });

        const page = await browser.newPage();
        page.setDefaultTimeout(TIMEOUT_MS);
        page.setDefaultNavigationTimeout(TIMEOUT_MS);

        // 로컬 파일 경로 설정
        const fileUrl = url.pathToFileURL(path.resolve(__dirname, fileName)).href;
        const outputPath = path.resolve(__dirname, outputName);

        console.log(`📄 Open: ${fileUrl}`);
        console.log(`📸 Output: ${outputPath}`);

        // 모바일 뷰포트 설정
        await page.setViewport({ width: 520, height: 2500, deviceScaleFactor: 2 });

        // networkidle2로 변경 (networkidle0보다 빠름)
        await page.goto(fileUrl, {
            waitUntil: 'networkidle2',
            timeout: TIMEOUT_MS
        });

        // 컨텐츠 높이만큼 스크린샷
        const bodyHandle = await page.$('body');
        const boundingBox = await bodyHandle.boundingBox();

        await page.screenshot({
            path: outputPath,
            clip: {
                x: boundingBox.x,
                y: boundingBox.y,
                width: Math.min(boundingBox.width, 520),
                height: boundingBox.height
            }
        });

        console.log(`✅ Saved: ${outputPath}`);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
