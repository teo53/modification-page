#!/usr/bin/env python3
"""
상세페이지 이미지 재가공 도구 (v2.0 - 병목 해결 버전)

사용법:
  python run_ad_generator.py [이미지경로 또는 URL]
  python run_ad_generator.py --skip-api [이미지경로]  # API 없이 기존 데이터 사용

주요 개선사항:
  - cv2/numpy 모듈 로드 최적화 (상단 import)
  - 각 단계별 시간 측정 및 출력
  - 즉시 출력 (flush=True)
  - --skip-api 옵션으로 빠른 테스트 지원
"""

import os
import sys
import json
import subprocess
import requests
import hashlib
import time
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# ========== 모듈 사전 로드 (병목 해결 #1) ==========
# cv2와 numpy를 상단에서 1회만 로드
print("📦 모듈 로드 중...", flush=True)
_load_start = time.time()
import cv2
import numpy as np
print(f"   ✅ cv2/numpy 로드 완료 ({time.time() - _load_start:.2f}초)", flush=True)

# 환경변수 로드
load_dotenv()

# 출력 디렉토리 설정
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


def log(msg: str):
    """즉시 출력 (버퍼링 방지)"""
    print(msg, flush=True)


def timed(func):
    """함수 실행 시간 측정 데코레이터"""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        log(f"   ⏱️ 소요시간: {elapsed:.2f}초")
        return result
    return wrapper


def download_image(url: str, output_dir: Path) -> str:
    """URL에서 이미지 다운로드"""
    log(f"📥 이미지 다운로드 중: {url[:50]}...")
    
    url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
    ext = url.split('.')[-1].split('?')[0][:4]
    filename = f"original_{url_hash}.{ext}"
    filepath = output_dir / filename
    
    try:
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        log(f"✅ 다운로드 완료: {filepath}")
        return str(filepath)
    except Exception as e:
        log(f"❌ 다운로드 실패: {e}")
        return None


@timed
def run_vision_ai(image_path: str, skip_api: bool = False) -> dict:
    """Vision AI로 이미지 분석"""
    log(f"\n🔍 [1/4] Vision AI 분석 중...")
    
    if skip_api:
        log("   ⏭️ API 스킵 모드 - 기존 데이터 사용")
        return None
    
    if not os.getenv("OPENAI_API_KEY"):
        log("⚠️ OPENAI_API_KEY가 없습니다. 기존 데이터를 사용합니다.")
        return None
    
    # 지연 import (API 호출 시에만)
    from vision_ocr import extract_text_from_image
    
    result = extract_text_from_image(image_path, model="gpt-4o")
    
    if result:
        try:
            clean_json = result.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_json)
            
            json_path = OUTPUT_DIR / "vision_result.json"
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            log(f"✅ Vision AI 분석 완료")
            return data
        except json.JSONDecodeError as e:
            log(f"❌ JSON 파싱 실패: {e}")
            return None
    
    return None


@timed
def generate_html(vision_data: dict) -> str:
    """Vision 데이터로 HTML 생성"""
    from generate_adaptive_html import generate_adaptive_html
    
    log(f"\n🎨 [2/4] HTML 생성 중...")
    
    json_path = Path(__file__).parent / "vision_layout_result.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(vision_data, f, indent=2, ensure_ascii=False)
    
    generate_adaptive_html()
    
    html_path = Path(__file__).parent / "detail_page_adaptive.html"
    log(f"✅ HTML 생성 완료")
    return str(html_path)


@timed
def capture_screenshot(html_path: str, output_name: str) -> str:
    """HTML을 이미지로 캡처"""
    log(f"\n📸 [3/4] 이미지 렌더링 중...")
    
    output_path = OUTPUT_DIR / output_name
    
    try:
        log(f"   🚀 Node.js 프로세스 시작...")
        result = subprocess.run(
            ["node", "capture_screenshot.js", html_path, str(output_path)],
            check=True, 
            cwd=Path(__file__).parent,
            timeout=60,
            capture_output=True,
            text=True
        )
        log(f"✅ 이미지 렌더링 완료: {output_path}")
        return str(output_path)
    except subprocess.TimeoutExpired:
        log(f"❌ 렌더링 타임아웃 (60초 초과)")
        return None
    except subprocess.CalledProcessError as e:
        log(f"❌ 렌더링 실패: {e}")
        if e.stderr:
            log(f"   stderr: {e.stderr[:200]}")
        return None


@timed
def create_comparison(original_path: str, generated_path: str, output_name: str) -> str:
    """원본과 재가공 이미지 비교 생성 (cv2는 이미 상단에서 로드됨)"""
    log(f"\n📊 [4/4] 비교 이미지 생성 중...")
    
    def imread_korean(filepath):
        """한글 경로 지원 이미지 읽기"""
        try:
            stream = np.fromfile(filepath, dtype=np.uint8)
            return cv2.imdecode(stream, cv2.IMREAD_COLOR)
        except Exception as e:
            log(f"  이미지 읽기 실패: {e}")
            return None
    
    img_orig = imread_korean(original_path)
    img_gen = imread_korean(generated_path)
    
    if img_orig is None or img_gen is None:
        log(f"❌ 이미지 로드 실패")
        return None
    
    # 높이 맞추기
    h1, w1 = img_orig.shape[:2]
    h2, w2 = img_gen.shape[:2]
    
    target_height = max(h1, h2)
    
    scale1 = target_height / h1
    scale2 = target_height / h2
    
    img1_resized = cv2.resize(img_orig, (int(w1 * scale1), target_height))
    img2_resized = cv2.resize(img_gen, (int(w2 * scale2), target_height))
    
    # 구분선
    gap = 10
    separator = np.ones((target_height, gap, 3), dtype=np.uint8) * 255
    
    # 가로로 합치기
    combined = np.hstack([img1_resized, separator, img2_resized])
    
    # 헤더 추가
    header_height = 80
    header = np.ones((header_height, combined.shape[1], 3), dtype=np.uint8) * 30
    
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(header, "ORIGINAL", (50, 55), font, 1.5, (255, 255, 255), 2)
    cv2.putText(header, "AI REGENERATED", (img1_resized.shape[1] + gap + 50, 55), font, 1.5, (0, 255, 0), 2)
    
    # 헤더 + 본문 합치기
    final = np.vstack([header, combined])
    
    # 저장
    output_path = OUTPUT_DIR / output_name
    _, encoded = cv2.imencode('.png', final)
    encoded.tofile(str(output_path))
    
    log(f"✅ 비교 이미지 생성 완료: {output_path}")
    return str(output_path)


def main():
    # 인자 파싱
    skip_api = "--skip-api" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    
    if len(args) < 1:
        print(__doc__)
        return
    
    input_source = args[0]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    log("=" * 60)
    log("🚀 상세페이지 이미지 재가공 도구 v2.0")
    log("=" * 60)
    
    total_start = time.time()
    
    # 1. 이미지 준비
    if input_source.startswith("http"):
        original_path = download_image(input_source, OUTPUT_DIR)
        if not original_path:
            return
    else:
        if not os.path.exists(input_source):
            log(f"❌ 파일을 찾을 수 없습니다: {input_source}")
            return
        original_path = input_source
    
    # 2. Vision AI 분석
    vision_data = run_vision_ai(original_path, skip_api=skip_api)
    
    if not vision_data:
        mock_path = Path(__file__).parent / "vision_layout_result.json"
        if mock_path.exists():
            log("ℹ️ 기존 분석 데이터를 사용합니다.")
            with open(mock_path, 'r', encoding='utf-8') as f:
                vision_data = json.load(f)
        else:
            log("❌ Vision AI 실패 및 기존 데이터 없음")
            return
    
    # 3. HTML 생성
    html_path = generate_html(vision_data)
    
    # 4. 이미지 캡처
    generated_name = f"regenerated_{timestamp}.png"
    generated_path = capture_screenshot("detail_page_adaptive.html", generated_name)
    
    if not generated_path:
        return
    
    # 5. 비교 이미지 생성
    comparison_name = f"comparison_{timestamp}.png"
    comparison_path = create_comparison(original_path, generated_path, comparison_name)
    
    # 결과 출력
    total_elapsed = time.time() - total_start
    log("\n" + "=" * 60)
    log("✨ 작업 완료!")
    log("=" * 60)
    log(f"📁 원본:      {original_path}")
    log(f"📁 재가공:    {generated_path}")
    log(f"📁 비교:      {comparison_path}")
    log(f"📁 출력 폴더: {OUTPUT_DIR}")
    log(f"⏱️ 총 소요시간: {total_elapsed:.2f}초")


if __name__ == "__main__":
    main()
