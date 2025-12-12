
import requests
import os
import json
import subprocess
from PIL import Image
import cv2
import numpy as np

# 원본 이미지 URL (사용자 제공)
ORIGINAL_URL = "https://queenalba.net/wys2/file_attach/2025/12/05/1764913294-97.jpg"

# 영어 경로로 저장 (한글 경로 문제 방지)
ARTIFACT_DIR = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce"
ORIGINAL_PATH = os.path.join(ARTIFACT_DIR, "source_original.jpg")
GENERATED_PATH = os.path.join(ARTIFACT_DIR, "source_generated.png")
COMPARISON_PATH = os.path.join(ARTIFACT_DIR, "final_comparison.png")

def download_image(url, save_path):
    print(f"📥 Downloading: {url}")
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"✅ Saved to: {save_path}")
        return True
    else:
        print(f"❌ Failed: HTTP {response.status_code}")
        return False

def run_vision_ai(image_path):
    print(f"\n🔍 Running Vision AI on: {image_path}")
    # vision_ocr.py의 함수를 직접 import해서 사용
    from vision_ocr import extract_text_from_image
    
    result = extract_text_from_image(image_path, model="gpt-4o-mini")
    if result:
        # JSON 파싱
        clean_json = result.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_json)
        with open('vision_layout_result.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print("✅ Vision AI data saved")
        return True
    return False

def generate_html_and_screenshot():
    print("\n🎨 Generating HTML...")
    from generate_adaptive_html import generate_adaptive_html
    generate_adaptive_html()
    
    print("📸 Capturing screenshot...")
    subprocess.run(["node", "capture_screenshot.js", "detail_page_adaptive.html", "temp_generated.png"], check=True, shell=True)
    
    # 결과물을 아티팩트 폴더로 이동
    import shutil
    shutil.copy("temp_generated.png", GENERATED_PATH)
    print(f"✅ Generated image saved to: {GENERATED_PATH}")

def create_comparison():
    print("\n📊 Creating comparison...")
    img1 = cv2.imread(ORIGINAL_PATH)
    img2 = cv2.imread(GENERATED_PATH)
    
    if img1 is None or img2 is None:
        print("❌ Failed to load images")
        return
    
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    
    # 높이를 맞추기
    max_h = max(h1, h2)
    
    # 원본 리사이즈 (높이 맞춤)
    new_w1 = int(w1 * (max_h / h1))
    img1_resized = cv2.resize(img1, (new_w1, max_h))
    
    # 생성본 리사이즈 (높이 맞춤)
    new_w2 = int(w2 * (max_h / h2))
    img2_resized = cv2.resize(img2, (new_w2, max_h))
    
    # 간격
    gap = 20
    separator = np.zeros((max_h, gap, 3), dtype=np.uint8)
    
    # 합치기
    combined = np.hstack((img1_resized, separator, img2_resized))
    
    # 헤더
    header_height = 80
    header = np.zeros((header_height, combined.shape[1], 3), dtype=np.uint8)
    final_img = np.vstack((header, combined))
    
    # 텍스트
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(final_img, "ORIGINAL (Scraped)", (50, 50), font, 1.2, (255, 255, 255), 2)
    cv2.putText(final_img, "AI GENERATED", (new_w1 + gap + 50, 50), font, 1.2, (0, 255, 0), 2)
    
    cv2.imwrite(COMPARISON_PATH, final_img)
    print(f"✅ Comparison saved to: {COMPARISON_PATH}")

def main():
    print("=" * 50)
    print("🚀 Full Pipeline: Scraper -> Vision AI -> Generator")
    print("=" * 50)
    
    # 1. 원본 다운로드
    if not download_image(ORIGINAL_URL, ORIGINAL_PATH):
        return
    
    # 2. Vision AI 분석
    if not run_vision_ai(ORIGINAL_PATH):
        print("⚠️ Vision AI failed, using mock data...")
    
    # 3. HTML 생성 + 스크린샷
    generate_html_and_screenshot()
    
    # 4. 비교 이미지 생성
    create_comparison()
    
    print("\n" + "=" * 50)
    print("✨ DONE! Check: " + COMPARISON_PATH)
    print("=" * 50)

if __name__ == "__main__":
    main()
