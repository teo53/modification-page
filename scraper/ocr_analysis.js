
import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 이미지 경로 (업로드된 파일)
const imagePath = 'C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/uploaded_image_1765521975811.png';

async function performOCR() {
    console.log(`Analyzing image layout: ${imagePath}`);

    try {
        const { data } = await Tesseract.recognize(imagePath, 'kor', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    process.stdout.write(`\rProgress: ${(m.progress * 100).toFixed(1)}%`);
                }
            }
        });

        console.log('\n\n[OCR Complete]');

        // 디버깅: 데이터 키 확인
        console.log('Result Keys:', Object.keys(data));

        // blocks가 바로 없으면 text만이라도 출력 시도
        if (!data.blocks) {
            if (data.data && data.data.blocks) {
                data = data.data; // 구조가 중첩된 경우 처리
                console.log('Adjusted data structure');
            }
        }

        // 블록(문단) 단위 분석
        console.log('\n--- Layout Analysis ---');

        let formattedText = '';

        console.log('Text Preview:', data.text ? data.text.substring(0, 200) + '...' : 'NO TEXT DETECTED');

        if (data.blocks && data.blocks.length > 0) {
            data.blocks.forEach((block) => {
                if (block.lines) {
                    block.lines.forEach((line) => {
                        const text = line.text.trim();
                        if (text) {
                            formattedText += text + '\n';
                        }
                    });
                    formattedText += '\n';
                }
            });
        } else if (data.lines && data.lines.length > 0) {
            // 블록이 없으면 라인 단위로 처리
            console.log('Using lines instead of blocks');
            data.lines.forEach((line) => {
                const text = line.text.trim();
                if (text) {
                    formattedText += text + '\n';
                }
            });
        } else {
            // 구조 정보가 없으면 원본 텍스트 사용
            console.log('Using raw text fallback');
            formattedText = data.text;
        }
        console.log(formattedText);

        // 결과 파일 저장
        const outputPath = path.join(__dirname, 'ocr_result.txt');
        fs.writeFileSync(outputPath, formattedText, 'utf8');
        console.log(`\nSaved result to: ${outputPath}`);

    } catch (error) {
        console.error('OCR Error:', error);
    }
}

performOCR();
