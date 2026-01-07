#!/usr/bin/env python3
"""
📢 광고 상세페이지 생성기 v9.0 (Production Restored)
   품질 자가 검증 + 자동 재시도 + 후보 생성 시스템
"""
import sys
import os
import json
import base64
import re
import time
import logging
from pathlib import Path
from typing import Dict, Optional, List, Tuple
from dotenv import load_dotenv

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s [I] %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger()

load_dotenv()

# ============================================================
# 설정 (Configuration)
# ============================================================
CONFIG = {
    "MAX_RETRIES": 3,
    "API_TIMEOUT": 120,    # 초
    "MIN_QUALITY_SCORE": 80,  # 목표 품질 점수
    "MAX_CANDIDATES": 3,      # 최대 생성 후보 수
    "DEBUG_MODE": True
}


# ============================================================
# 학습된 규칙 로드
# ============================================================
def get_learned_rules_prompt() -> str:
    """이전 피드백에서 학습된 규칙을 프롬프트로 변환"""
    try:
        rules_path = Path(__file__).parent / "utils" / "learned_rules.json"
        if not rules_path.exists():
            return ""
            
        with open(rules_path, 'r', encoding='utf-8') as f:
            rules = json.load(f)
            
        prompt_text = "\n## 🧠 학습된 개선 규칙 (MUST FOLLOW):\n"
        for issue, count in rules.get("common_issues", {}).items():
            if count > 3:
                prompt_text += f"- 과거 '{issue}' 관련 문제가 빈번했습니다. 이 부분을 특별히 신경쓰세요.\n"
                
        # 최근 피드백 반영
        recent_feedback = rules.get("feedback_history", [])[-3:]
        if recent_feedback:
            prompt_text += "\n## ⚠️ 최근 지적 사항 (절대 반복 금지):\n"
            for fb in recent_feedback:
                prompt_text += f"- {fb['feedback']} (점수: {fb['score']})\n"
                
        return prompt_text
    except Exception:
        return ""


# ============================================================
# 데이터 정확성 검증 (Validator)
# ============================================================
def verify_extracted_data(image_path: str, data: Dict, client) -> Tuple[Dict, bool]:
    """GPT-4o Vision으로 데이터 정밀 검증"""
    try:
        with open(image_path, "rb") as f:
            base64_image = base64.b64encode(f.read()).decode('utf-8')
            
        verify_prompt = f"""
        당신은 데이터 검증 전문가입니다. 원본 이미지와 추출된 JSON 데이터를 비교하여 정밀 검증하세요.

        ## 추출된 데이터:
        {json.dumps(data, ensure_ascii=False, indent=2)}

        ## ⚠️ 초정밀 검증 규칙 (Critical):
        1. **단위 환각 금지**: 이미지에 없는 '만', '원', '천' 단위를 절대 붙이지 마세요.
        2. **숫자 정확성**: 0의 개수와 쉼표(,) 유무를 이미지 그대로 유지하세요. (6000 vs 60000)
        3. **데이터 보존**: 검증 과정에서 섹션이 삭제되거나 내용이 줄어들면 안 됩니다.

        ## 출력 형식 (JSON only):
        - 오류 없음: {{"verified": true}}
        - 오류 수정: 수정된 전체 JSON
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": verify_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}", "detail": "high"}}
                ]
            }],
            max_tokens=4000
        )
        
        result = response.choices[0].message.content
        json_match = re.search(r'\{[\s\S]*\}', result)
        
        if json_match:
            verified_data = json.loads(json_match.group())
            if verified_data.get("verified") is True:
                return data, False
            
            # ⚠️ 데이터 손실 방지 (Safety Check)
            orig_len = len(str(data))
            new_len = len(str(verified_data))
            if new_len < orig_len * 0.8: # 내용이 20% 이상 줄어들면 거부
                logger.warning("⚠️ 검증기가 데이터를 과도하게 삭제하여 원본을 유지합니다.")
                return data, False

            # 스타일 정보 보존
            if "style" in data and "style" not in verified_data:
                verified_data["style"] = data["style"]
                
            return verified_data, True
            
    except Exception as e:
        logger.error(f"검증 오류: {e}")
        
    return data, False


# ============================================================
# 콘텐츠 추출 (Retry Logic)
# ============================================================
def extract_content_with_retry(image_path: str) -> Optional[Dict]:
    """이미지에서 콘텐츠 추출 (재시도 포함)"""
    try:
        from openai import OpenAI
    except ImportError:
        logger.error("openai 패키지 필요")
        return None
    
    api_key_raw = os.getenv("OPENAI_API_KEY")
    match = re.search(r"(sk-[a-zA-Z0-9\-_]+)", api_key_raw)
    if not match: return None
    
    client = OpenAI(api_key=match.group(1), timeout=CONFIG["API_TIMEOUT"])
    
    try:
        with open(image_path, "rb") as f:
            base64_image = base64.b64encode(f.read()).decode('utf-8')
    except IOError: return None
    
    # [Robust Prompt v5.0 Integrated]
    prompt = """당신은 OCR 전문가입니다. 이미지의 모든 텍스트를 **빠짐없이, 있는 그대로** 추출하세요.

    ## ⚠️ 절대 원칙 (Data Integrity)
    1. **요약 금지 & 누락 금지**: 텍스트를 절대 요약하지 마세요. 조사, 특수문자, 괄호 안의 내용까지 모두 그대로 옮기세요.
    2. **단위/숫자 정확성**: '만', '원', '천' 등의 단위와 숫자의 0 개수를 이미지 그대로 옮기세요. (6000 vs 60000 엄격 구분)
    3. **형식 유지**: 이미지에 보이는 문장 구조와 줄바꿈을 최대한 반영하세요.

    ## 추출 구조 (JSON)
    모든 텍스트를 생략 없이 아래 구조에 담으세요:
    
    ```json
    {
        "company": "업체명 (가장 크게 보이는 타이틀)",
        "subtitle": "서브 슬로건",
        "highlight_tags": ["특징1", "특징2"],
        "sections": [
            {
                "title": "섹션 제목 (예: 급여조건, 근무시간)",
                "content": "해당 섹션의 모든 텍스트 내용 (줄바꿈 \\n 포함)"
            }
        ],
        "contact": {
            "phone": "전화번호",
            "kakao": "카톡아이디",
            "details": "기타 연락처 정보"
        },
        "style": {
            "background": "hex code",
            "primary_color": "hex",
            "accent_color": "hex",
            "text_color": "hex",
            "has_gradient": true,
            "has_decorations": true,
            "layout_style": "dark_premium"
        }
    }
    ```
    """
    
    # 학습된 규칙 주입
    learned_rules = get_learned_rules_prompt()
    if learned_rules:
        prompt += f"\n{learned_rules}"

    for attempt in range(CONFIG["MAX_RETRIES"]):
        try:
            logger.info(f"API 호출 시도 {attempt + 1}/{CONFIG['MAX_RETRIES']}")
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}", "detail": "high"}}
                    ]
                }],
                max_tokens=4000
            )
            
            result = response.choices[0].message.content
            json_match = re.search(r'\{[\s\S]*\}', result)
            
            if json_match:
                data = json.loads(json_match.group())
                
                # 데이터 검증 실행
                logger.info("🕵️ 데이터 정확성 검증 중...")
                validated_data, changed = verify_extracted_data(image_path, data, client)
                
                if changed:
                    logger.info("♻️ 검증 단계에서 데이터 자동 수정됨")
                    return validated_data
                
                return data
            
        except Exception as e:
            logger.warning(f"API 오류: {e}")
            time.sleep(2)
            
    return None


# ============================================================
# HTML 생성 (High-Opacity Glassmorphism Logic)
# ============================================================
def generate_ad_html(data: Dict, output_path: str) -> str:
    sections = data.get("sections", [])
    contact = data.get("contact", {})
    style = data.get("style", {})
    
    bg_color = style.get("background", "#0d0520")
    primary = style.get("primary_color", "#ffd700")
    accent = style.get("accent_color", "#ff6b9d")
    
    # [Design Logic v9.2: High-Opacity Glass]
    # 가독성을 위해 불투명도 92% 적용, 유리 질감 유지
    def get_luminance(hex_color):
        hex_color = hex_color.lstrip('#')
        if len(hex_color) != 6: return 0.5
        r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
        return (0.299*r + 0.587*g + 0.114*b)/255

    bg_lum = get_luminance(bg_color)
    
    if bg_lum < 0.5: # 다크 모드
        card_bg = "rgba(255, 255, 255, 0.92)" 
        text_color = "#111111"
        glass_border = "rgba(255,255,255,0.6)"
        glass_shadow = "0 8px 32px rgba(0,0,0,0.3)"
    else: # 라이트 모드
        card_bg = "rgba(10, 10, 20, 0.92)"
        text_color = "#ffffff"
        glass_border = "rgba(255,255,255,0.2)"
        glass_shadow = "0 8px 32px rgba(0,0,0,0.2)"

    # 그라데이션
    bg_gradient = bg_color
    if style.get("has_gradient", True):
        bg_gradient = f"linear-gradient(135deg, {bg_color}, {bg_color}88)"

    # HTML 템플릿
    html = f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{
    width:420px;
    background:{bg_gradient};
    font-family:'Noto Sans KR',sans-serif;
    color:{text_color};
    padding:20px;
}}
.container{{
    position:relative;
    overflow:hidden;
}}
.header{{
    text-align:center;
    padding:40px 10px 30px;
}}
.company{{
    font-size:36px;
    font-weight:900;
    line-height:1.3;
    background:linear-gradient(135deg, {primary}, {accent});
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    text-shadow:0 2px 10px rgba(0,0,0,0.2);
}}
.subtitle{{
    font-size:15px;
    margin-top:10px;
    opacity:0.9;
    background:rgba(0,0,0,0.3);
    padding:5px 15px;
    border-radius:20px;
    display:inline-block;
}}
.tags{{margin-top:15px;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;}}
.tag{{
    background:linear-gradient(135deg, {primary}88, {accent}88);
    padding:6px 14px;
    border-radius:15px;
    font-size:12px;
    font-weight:bold;
    color:#fff;
    box-shadow:0 2px 8px {primary}44;
}}
.section{{
    background:{card_bg};
    backdrop-filter:blur(12px);
    border:1px solid {glass_border};
    border-left:4px solid {primary};
    border-radius:16px;
    padding:20px;
    margin-bottom:15px;
    box-shadow:{glass_shadow};
    color:{text_color};
}}
.section-title{{
    font-size:18px;
    font-weight:800;
    color:{primary if bg_lum < 0.5 else accent};
    margin-bottom:10px;
    border-bottom:1px solid {primary}44;
    padding-bottom:8px;
}}
.section-content{{
    font-size:14px;
    line-height:1.6;
    white-space:pre-line;
}}
.contact{{
    background:{card_bg};
    border:1px solid {glass_border};
    border-radius:20px;
    padding:25px;
    text-align:center;
    margin-top:30px;
    box-shadow:{glass_shadow};
    color:{text_color};
}}
.phone{{
    font-size:24px;
    font-weight:900;
    color:{primary if bg_lum < 0.5 else accent};
    margin-bottom:8px;
}}
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="company">{data.get("company", "TITLE")}</div>
        <div class="subtitle">{data.get("subtitle", "")}</div>
        <div class="tags">
            {''.join(f'<span class="tag">{t}</span>' for t in data.get("highlight_tags", [])[:4])}
        </div>
    </div>
    
    <div class="sections">
'''
    for sec in sections:
        html += f'''
        <div class="section">
            <div class="section-title">{sec.get("title", "정보")}</div>
            <div class="section-content">{sec.get("content", "")}</div>
        </div>'''

    html += f'''
    </div>
    
    <div class="contact">
        <div class="phone">{contact.get("phone", "")}</div>
        <div class="kakao">{contact.get("kakao", "")}</div>
        <div class="details">{contact.get("details", "")}</div>
    </div>
</div>
</body>
</html>'''

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    return output_path


# ============================================================
# 유틸리티 (스크린샷, 품질 검사)
# ============================================================
def capture_screenshot(html_path: str, output_path: str) -> str:
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={'width': 450, 'height': 1200})
            page.goto(f'file:///{html_path}')
            page.wait_for_timeout(1000)
            page.locator('.container').screenshot(path=output_path)
            browser.close()
        return output_path
    except Exception: return None

def check_quality_score(image_path: str, client) -> int:
    try:
        with open(image_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": "이 광고 이미지의 품질을 100점 만점으로 평가하고 점수(숫자)만 출력해. 가독성, 정보량, 디자인을 고려해."},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
                ]
            }],
            max_tokens=10
        )
        return int(re.search(r'\d+', resp.choices[0].message.content).group())
    except: return 70


# ============================================================
# 메인 파이프라인 (Candidate Loop)
# ============================================================
def main():
    print("="*60)
    print("📢 광고 상세페이지 생성기 v9.0 (Production Restored)")
    print("   품질 자가 검증 + 자동 재시도 시스템")
    print("="*60)
    
    if len(sys.argv) < 2: return
    image_path = sys.argv[1]
    
    # 1. 콘텐츠 추출
    print("[1/4] 📍 콘텐츠 추출...")
    data = extract_content_with_retry(image_path)
    if not data: return
    
    # 2. 후보 생성 루프 (최대 3개)
    best_score = 0
    best_file = None
    output_dir = Path(__file__).parent / "output"
    output_dir.mkdir(exist_ok=True)
    
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    print("\n[2/4] 🎯 후보 생성 및 품질 검증")
    for i in range(CONFIG["MAX_CANDIDATES"]):
        print(f"\n--- 후보 {i+1} ---")
        
        # 스타일 변형 (미세 조정)
        if i > 0:
            data["style"]["layout_style"] = "v2" if i == 1 else "v3"
            
        html_path = output_dir / f"candidate_{i+1}.html"
        img_path = output_dir / f"candidate_{i+1}.png"
        
        generate_ad_html(data, str(html_path))
        capture_screenshot(str(html_path), str(img_path))
        
        score = check_quality_score(str(img_path), client)
        print(f"      📊 품질 점수: {score}/100")
        
        if score > best_score:
            best_score = score
            best_file = img_path
            
        if score >= CONFIG["MIN_QUALITY_SCORE"]:
            print("🚀 목표 품질 달성! 조기 종료.")
            break
            
    # 3. 최종 선택
    if best_file:
        print("\n" + "="*60)
        print("🏆 최고 품질 후보 선택!")
        print(f"      📊 최종 품질: {best_score}")
        final_path = output_dir / "ad_final.png"
        import shutil
        shutil.copy(best_file, final_path)
        print(f"✅ 생성 완료: {final_path}")
        print("="*60)

if __name__ == "__main__":
    main()
