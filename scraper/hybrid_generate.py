#!/usr/bin/env python3
"""
하이브리드 상세페이지 생성기 v3.0
- HTML로 정확한 한글 레이아웃 생성
- Playwright로 스크린샷
- 나노바나나로 스타일 개선 (텍스트 유지)

사용법:
  python hybrid_generate.py [이미지경로]
"""
import sys
import os
import json
import base64
import re
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


def analyze_image(image_path: str) -> dict:
    """GPT-4o Vision으로 이미지 분석"""
    try:
        from openai import OpenAI
    except ImportError:
        print("   ❌ openai 패키지 필요: pip install openai")
        return None
    
    api_key_raw = os.getenv("OPENAI_API_KEY")
    if not api_key_raw:
        return None
    
    match = re.search(r"(sk-[a-zA-Z0-9\-_]+)", api_key_raw)
    if not match:
        return None
    
    try:
        with open(image_path, "rb") as f:
            base64_image = base64.b64encode(f.read()).decode('utf-8')
        
        client = OpenAI(api_key=match.group(1), timeout=30.0)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": """이 광고 이미지를 분석해서 JSON으로 변환해줘.

중요 규칙:
1. '퀸알바', 'queenalba', URL, 웹사이트 주소는 절대 포함하지 마
2. 실제 업체명/서비스명을 찾아 (예: 마감가, 플레이, 디올 등)
3. 워터마크나 사이트 로고는 무시해

출력 형식 (JSON만):
{"company":"실제업체명","keywords":["키워드1","키워드2"],"highlights":["강조문구1","강조문구2"],"phone":"010-XXXX-XXXX","kakao":"카카오ID"}"""},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}", "detail": "high"}}
                ]
            }],
            max_tokens=800
        )
        
        result = response.choices[0].message.content
        json_match = re.search(r'\{[\s\S]*\}', result)
        if json_match:
            return json.loads(json_match.group())
        return None
    except Exception as e:
        print(f"   ❌ 분석 오류: {e}")
        return None


def generate_html(data: dict, output_path: str) -> str:
    """정확한 한글 HTML 생성"""
    company = data.get("company", "업체명")
    keywords = data.get("keywords", [])[:4]
    highlights = data.get("highlights", [])[:3]
    phone = data.get("phone", "")
    kakao = data.get("kakao", "")
    
    html = f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}}
.container{{
    width:420px;
    min-height:750px;
    background:linear-gradient(180deg, #0a0a15 0%, #1a0a2e 50%, #0d0520 100%);
    padding:40px 25px;
    font-family:'Noto Sans KR',sans-serif;
    border-radius:20px;
    border:2px solid rgba(138,43,226,0.4);
    box-shadow:0 0 60px rgba(138,43,226,0.3), inset 0 0 40px rgba(0,0,0,0.5);
    position:relative;
    overflow:hidden;
}}
.container::before{{
    content:'';
    position:absolute;
    top:-50%;
    left:-50%;
    width:200%;
    height:200%;
    background:radial-gradient(circle at 30% 20%, rgba(138,43,226,0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(0,255,136,0.1) 0%, transparent 40%);
    pointer-events:none;
}}
.company{{
    font-size:52px;
    font-weight:900;
    text-align:center;
    color:#fff;
    margin-bottom:30px;
    text-shadow:0 0 40px rgba(138,43,226,0.8), 0 0 80px rgba(138,43,226,0.4);
    letter-spacing:-2px;
    position:relative;
    z-index:1;
}}
.keywords{{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:12px;
    margin-bottom:30px;
    position:relative;
    z-index:1;
}}
.keyword{{
    font-size:15px;
    font-weight:700;
    color:#00ff88;
    padding:12px 20px;
    border:2px solid #00ff88;
    border-radius:30px;
    background:rgba(0,255,136,0.12);
    box-shadow:0 0 20px rgba(0,255,136,0.25), inset 0 0 10px rgba(0,255,136,0.1);
    text-shadow:0 0 10px rgba(0,255,136,0.5);
}}
.highlight{{
    background:linear-gradient(135deg, rgba(138,43,226,0.25), rgba(138,43,226,0.15));
    border:1px solid rgba(138,43,226,0.5);
    border-radius:15px;
    padding:20px;
    margin-bottom:15px;
    text-align:center;
    position:relative;
    z-index:1;
    box-shadow:0 0 20px rgba(138,43,226,0.2);
}}
.highlight p{{
    font-size:17px;
    font-weight:700;
    color:#fff;
    line-height:1.8;
    text-shadow:0 0 10px rgba(255,255,255,0.3);
}}
.contact{{
    background:linear-gradient(135deg, rgba(0,255,136,0.2), rgba(138,43,226,0.2));
    border:2px solid #00ff88;
    border-radius:15px;
    padding:25px;
    margin-top:30px;
    text-align:center;
    position:relative;
    z-index:1;
    box-shadow:0 0 30px rgba(0,255,136,0.2);
}}
.phone{{
    font-size:26px;
    font-weight:800;
    color:#00ff88;
    text-shadow:0 0 20px rgba(0,255,136,0.5);
}}
.kakao{{
    font-size:15px;
    color:#ffd700;
    margin-top:10px;
    text-shadow:0 0 10px rgba(255,215,0,0.5);
}}
.footer{{
    text-align:center;
    margin-top:30px;
    font-size:11px;
    color:rgba(255,255,255,0.25);
    letter-spacing:3px;
    position:relative;
    z-index:1;
}}
</style>
</head>
<body>
<div class="container">
<div class="company">{company}</div>
<div class="keywords">'''
    
    for kw in keywords:
        html += f'<span class="keyword">{kw}</span>'
    
    html += '</div>'
    
    for h in highlights:
        html += f'<div class="highlight"><p>{h}</p></div>'
    
    if phone or kakao:
        html += '<div class="contact">'
        if phone:
            html += f'<div class="phone">{phone}</div>'
        if kakao:
            html += f'<div class="kakao">카카오톡: {kakao}</div>'
        html += '</div>'
    
    html += '<div class="footer">AI REGENERATED</div></div></body></html>'
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    return output_path


def capture_screenshot(html_path: str, output_path: str) -> str:
    """Playwright로 HTML 스크린샷"""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("   ⚠️ playwright 미설치, 수동 스크린샷 필요")
        print("   pip install playwright && playwright install chromium")
        return None
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={'width': 500, 'height': 900})
            page.goto(f'file:///{html_path}')
            page.wait_for_timeout(1000)  # 폰트 로딩 대기
            
            # 컨테이너만 캡처
            container = page.locator('.container')
            container.screenshot(path=output_path)
            
            browser.close()
        return output_path
    except Exception as e:
        print(f"   ❌ 스크린샷 오류: {e}")
        return None


def enhance_with_nanobanana(screenshot_path: str, output_path: str) -> str:
    """나노바나나로 스타일 개선 (텍스트 유지)"""
    try:
        from google import genai
    except ImportError:
        print("   ⚠️ google-genai 미설치")
        return None
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    
    try:
        client = genai.Client(api_key=api_key)
        
        # 이미지 로드
        with open(screenshot_path, 'rb') as f:
            image_data = f.read()
        
        prompt = """Enhance this advertisement image while PRESERVING ALL EXISTING TEXT EXACTLY AS IS.

Enhancement instructions:
- Add subtle glow and neon effects to borders
- Enhance the gradient background with more depth
- Add subtle particle or light effects in background
- Make colors more vibrant and premium-looking
- DO NOT change, remove, or modify any text
- DO NOT add any new text
- Keep the exact same layout and positioning

The Korean text must remain exactly as shown - do not attempt to recreate or modify it."""

        print("   ⏳ 스타일 개선 중... (약 15-30초)")
        
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[
                {"text": prompt},
                {"inline_data": {"mime_type": "image/png", "data": base64.b64encode(image_data).decode()}}
            ],
        )
        
        # 이미지 추출
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                with open(output_path, 'wb') as f:
                    f.write(part.inline_data.data)
                return output_path
        
        return None
    except Exception as e:
        print(f"   ❌ 나노바나나 오류: {e}")
        return None


def main():
    print("=" * 50)
    print("🎨 하이브리드 상세페이지 생성기 v3.0")
    print("   (HTML 한글 + 나노바나나 스타일)")
    print("=" * 50)
    
    if len(sys.argv) < 2:
        print("\n사용법: python hybrid_generate.py [이미지경로]")
        return
    
    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"\n❌ 파일 없음: {image_path}")
        return
    
    base_dir = Path(__file__).parent
    output_dir = base_dir / "output"
    output_dir.mkdir(exist_ok=True)
    
    # Step 1: 이미지 분석
    print("\n[1/4] 🔍 이미지 분석 중... (약 5초)")
    data = analyze_image(image_path)
    
    if not data:
        print("   ❌ 분석 실패")
        return
    
    print(f"   ✅ 완료! 업체명: {data.get('company', '미확인')}")
    
    # JSON 저장
    with open(base_dir / "analysis.json", 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Step 2: HTML 생성
    print("\n[2/4] 📄 HTML 생성 중...")
    html_path = base_dir / "detail_page.html"
    generate_html(data, str(html_path))
    print(f"   ✅ 완료: {html_path}")
    
    # Step 3: 스크린샷
    print("\n[3/4] 📸 스크린샷 캡처 중...")
    screenshot_path = output_dir / "html_screenshot.png"
    screenshot = capture_screenshot(str(html_path).replace('\\', '/'), str(screenshot_path))
    
    if not screenshot:
        print("   ⚠️ Playwright 스크린샷 실패")
        print("   HTML 파일을 브라우저에서 열어 수동으로 스크린샷하세요")
        screenshot_path = None
    else:
        print(f"   ✅ 완료: {screenshot_path}")
    
    # Step 4: 나노바나나 스타일 개선 (스크린샷이 있을 때만)
    if screenshot_path and screenshot_path.exists():
        print("\n[4/4] 🍌 나노바나나 스타일 개선 중...")
        final_path = output_dir / "final_ad.png"
        enhanced = enhance_with_nanobanana(str(screenshot_path), str(final_path))
        
        if enhanced:
            print(f"   ✅ 최종 이미지: {final_path}")
        else:
            print(f"   ⚠️ 스타일 개선 실패, 원본 스크린샷 사용: {screenshot_path}")
    else:
        print("\n[4/4] ⏭️ 스크린샷 없음, 스타일 개선 건너뜀")
    
    print("\n" + "=" * 50)
    print("✅ 완료!")
    print("=" * 50)


if __name__ == "__main__":
    main()
