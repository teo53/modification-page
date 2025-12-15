#!/usr/bin/env python3
"""
적응형 HTML 생성기 (v12 - 시각적 위계 적용)

개선사항:
- 키워드: 18px, 굵게, 녹색
- 강조문구: 16px, 녹색 배경 + 흰색 텍스트
- 일반본문: 13px, 연한 회색
"""

import json
import re
from pathlib import Path


def generate_adaptive_html(json_path: str = None, output_path: str = None):
    """Vision AI 결과 JSON을 읽어 HTML 생성"""
    base_dir = Path(__file__).parent
    json_path = json_path or base_dir / 'vision_layout_result.json'
    output_path = output_path or base_dir / 'detail_page_adaptive.html'
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    sections = data.get('sections', [])
    
    # 색상 (톤 다운)
    accent = '#1DB954'  # 세련된 녹색
    accent_bg = 'rgba(29, 185, 84, 0.15)'  # 배경용 투명 녹색
    
    # 워터마크 필터링
    def filter_watermark(text):
        if not text:
            return ''
        if 'http' in text.lower() or 'queenalba.net' in text.lower():
            return ''
        for wm in ['퀸알바', 'queenalba', 'QueenAlba', 'QUEENALBA']:
            if text.strip() == wm:
                return ''
            text = text.replace(wm, '').strip()
        return text
    
    # 업체명 추출
    raw_company = data.get('company_name', '')
    company_name = filter_watermark(raw_company)
    
    if not company_name:
        catchphrase = filter_watermark(data.get('catchphrase', ''))
        if catchphrase:
            company_name = catchphrase
    
    # 키워드 추출
    keywords = []
    for section in sections:
        if section.get('type') == 'keyword':
            content = filter_watermark(section.get('content', ''))
            if content:
                keywords.append(content)
    
    # 키워드 없으면 자동 감지
    if not keywords:
        keyword_patterns = [
            r'(\d+대\s*환영)', r'(당일\s*지급)', r'(총\s*차량\s*\d+대\s*운행)',
            r'(숙소\s*제공)', r'(초보\s*환영)'
        ]
        all_text = ' '.join([s.get('content', '') for s in sections])
        for pattern in keyword_patterns:
            match = re.search(pattern, all_text)
            if match:
                keywords.append(match.group(1))

    # CSS - 시각적 위계 적용 (시스템 폰트 사용으로 빠른 로딩)
    css_content = f"""
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        
        body {{
            background: #000;
            display: flex;
            justify-content: center;
            padding: 15px 0;
        }}
        
        .container {{
            width: 420px;
            background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
            padding: 25px 20px 30px;
            font-family: 'Malgun Gothic', '맑은 고딕', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }}
        
        /* 업체명 - 가장 크게 */
        .company-name {{
            font-size: 52px;
            font-weight: 900;
            text-align: center;
            color: #fff;
            margin-bottom: 20px;
            letter-spacing: -2px;
        }}
        
        /* 키워드 컨테이너 */
        .keyword-container {{
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }}
        
        /* 키워드 - 18px, 굵게, 녹색 */
        .keyword {{
            font-size: 18px;
            font-weight: 700;
            color: {accent};
            padding: 10px 20px;
            border: 2px solid {accent};
            border-radius: 25px;
            background: transparent;
        }}
        
        /* 강조문구 - 16px, 녹색 배경 + 흰색 텍스트 */
        .emphasis-box {{
            background: {accent_bg};
            border: 1px solid {accent};
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 12px;
        }}
        
        .emphasis-box p {{
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            line-height: 1.7;
            text-align: center;
            word-break: keep-all;
        }}
        
        /* 일반본문 - 13px, 연한 회색 */
        .text-box {{
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 12px;
        }}
        
        .text-box p {{
            font-size: 13px;
            font-weight: 400;
            color: #aaaaaa;
            line-height: 1.8;
            text-align: center;
            word-break: keep-all;
        }}
        
        /* 연락처 */
        .contact-box {{
            background: {accent_bg};
            border: 1px solid {accent};
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            text-align: center;
        }}
        
        .contact-phone {{
            font-size: 18px;
            font-weight: 700;
            color: {accent};
        }}
        
        .contact-sub {{
            font-size: 13px;
            color: #ffd700;
            margin-top: 5px;
        }}
        
        /* 푸터 */
        .footer {{
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
            color: rgba(255,255,255,0.3);
            letter-spacing: 2px;
        }}
    """

    # HTML 생성
    html_body = '<div class="container">'
    
    # 업체명
    if company_name:
        html_body += f'<div class="company-name">{escape_html(company_name)}</div>'
    
    # 키워드 태그
    if keywords:
        html_body += '<div class="keyword-container">'
        for kw in keywords[:3]:
            html_body += f'<span class="keyword">{escape_html(kw)}</span>'
        html_body += '</div>'
    
    # 섹션들 (타입별 스타일)
    for section in sections:
        stype = section.get('type', 'text')
        content = filter_watermark(section.get('content', ''))
        
        if not content or stype == 'keyword' or stype == 'contact':
            continue
        
        content_html = escape_html(content).replace('\n', '<br>')
        
        if stype in ('emphasis', 'highlight'):
            # 강조: 녹색 배경 + 흰색 텍스트
            html_body += f'<div class="emphasis-box"><p>{content_html}</p></div>'
        else:
            # 일반본문: 연한 회색
            html_body += f'<div class="text-box"><p>{content_html}</p></div>'
    
    # 연락처
    for section in sections:
        if section.get('type') == 'contact':
            phone = section.get('phone', '')
            kakao = section.get('kakao', '')
            
            has_valid = (phone and '미제공' not in phone) or (kakao and '미제공' not in kakao)
            if has_valid:
                html_body += '<div class="contact-box">'
                if phone and '미제공' not in phone:
                    html_body += f'<div class="contact-phone">{escape_html(phone)}</div>'
                if kakao and '미제공' not in kakao:
                    html_body += f'<div class="contact-sub">카카오톡: {escape_html(kakao)}</div>'
                html_body += '</div>'
            break
    
    html_body += '<div class="footer">AI REGENERATED</div>'
    html_body += '</div>'

    full_html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>{css_content}</style>
</head>
<body>
    {html_body}
</body>
</html>"""

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    
    print(f"Generated {output_path}")
    return str(output_path)


def escape_html(text):
    if not isinstance(text, str):
        text = str(text)
    return (text
        .replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace('"', '&quot;')
        .replace("'", '&#39;'))


if __name__ == "__main__":
    generate_adaptive_html()
