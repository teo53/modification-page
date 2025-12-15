#!/usr/bin/env python3
"""
상세페이지 간편 생성기 (독립 실행 버전)
- 외부 모듈 의존성 최소화
- 모든 함수 인라인 처리
- 단계별 즉시 실행

사용법:
  python quick_generate.py [이미지경로]
"""
import sys
import json
import os
from pathlib import Path

def main():
    print("=" * 50, flush=True)
    print("🚀 상세페이지 간편 생성기", flush=True)
    print("=" * 50, flush=True)
    
    # 입력 이미지 경로
    if len(sys.argv) < 2:
        print("사용법: python quick_generate.py [이미지경로]", flush=True)
        return
    
    image_path = sys.argv[1]
    base_dir = Path(__file__).parent
    output_dir = base_dir / "output"
    output_dir.mkdir(exist_ok=True)
    
    # Step 1: 기존 JSON 데이터 사용
    print("\n[1/3] 📄 기존 분석 데이터 로드 중...", flush=True)
    json_path = base_dir / "vision_layout_result.json"
    
    if not json_path.exists():
        # 기본 데이터 생성
        default_data = {
            "company_name": "플레이",
            "sections": [
                {"type": "emphasis", "content": "안녕하세요~~ SM 플레이 입니다!!"},
                {"type": "text", "content": "24시간 상담 가능해요"},
                {"type": "keyword", "content": "당일지급"},
                {"type": "keyword", "content": "100% 안전"},
                {"type": "contact", "phone": "010-3985-0255", "kakao": "smsm6973"}
            ]
        }
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(default_data, f, indent=2, ensure_ascii=False)
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("   ✅ 데이터 로드 완료", flush=True)
    
    # Step 2: HTML 직접 생성 (외부 모듈 없이)
    print("\n[2/3] 🎨 HTML 생성 중...", flush=True)
    
    company = data.get('company_name', '업체명')
    sections = data.get('sections', [])
    
    # 키워드 추출
    keywords = [s['content'] for s in sections if s.get('type') == 'keyword'][:3]
    
    # 강조문구
    emphasis_list = [s['content'] for s in sections if s.get('type') == 'emphasis']
    
    # 일반텍스트
    text_list = [s['content'] for s in sections if s.get('type') == 'text']
    
    # 연락처
    contact = next((s for s in sections if s.get('type') == 'contact'), None)
    
    # HTML 생성 (인라인 스타일)
    html = f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ background: #000; display: flex; justify-content: center; padding: 15px 0; }}
.container {{ width: 420px; background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%); padding: 25px 20px 30px; font-family: 'Malgun Gothic', sans-serif; }}
.company {{ font-size: 48px; font-weight: 900; text-align: center; color: #fff; margin-bottom: 20px; }}
.keywords {{ display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }}
.keyword {{ font-size: 16px; font-weight: 700; color: #1DB954; padding: 10px 18px; border: 2px solid #1DB954; border-radius: 25px; }}
.emphasis {{ background: rgba(29, 185, 84, 0.15); border: 1px solid #1DB954; border-radius: 10px; padding: 16px; margin-bottom: 12px; text-align: center; }}
.emphasis p {{ font-size: 16px; font-weight: 700; color: #fff; line-height: 1.7; }}
.text-box {{ border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 14px; margin-bottom: 12px; }}
.text-box p {{ font-size: 13px; color: #aaa; line-height: 1.8; text-align: center; }}
.contact {{ background: rgba(29,185,84,0.15); border: 1px solid #1DB954; border-radius: 10px; padding: 15px; margin-top: 15px; text-align: center; }}
.phone {{ font-size: 18px; font-weight: 700; color: #1DB954; }}
.kakao {{ font-size: 13px; color: #ffd700; margin-top: 5px; }}
.footer {{ text-align: center; margin-top: 20px; font-size: 11px; color: rgba(255,255,255,0.3); }}
</style>
</head>
<body>
<div class="container">
<div class="company">{company}</div>
<div class="keywords">
'''
    
    for kw in keywords:
        html += f'<span class="keyword">{kw}</span>\n'
    
    html += '</div>\n'
    
    for emp in emphasis_list:
        html += f'<div class="emphasis"><p>{emp}</p></div>\n'
    
    for txt in text_list:
        html += f'<div class="text-box"><p>{txt}</p></div>\n'
    
    if contact:
        phone = contact.get('phone', '')
        kakao = contact.get('kakao', '')
        html += f'''<div class="contact">
<div class="phone">{phone}</div>
<div class="kakao">카카오톡: {kakao}</div>
</div>'''
    
    html += '''
<div class="footer">AI REGENERATED</div>
</div>
</body>
</html>'''
    
    html_path = base_dir / "detail_page_quick.html"
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"   ✅ HTML 저장: {html_path}", flush=True)
    
    # Step 3: 안내
    print("\n[3/3] 📸 스크린샷 생성 방법:", flush=True)
    print(f"   node capture_screenshot.js detail_page_quick.html output/result.png", flush=True)
    
    print("\n" + "=" * 50, flush=True)
    print("✅ HTML 생성 완료!", flush=True)
    print(f"📁 파일 위치: {html_path}", flush=True)
    print("💡 브라우저에서 HTML 파일을 열어 확인하세요.", flush=True)

if __name__ == "__main__":
    main()
