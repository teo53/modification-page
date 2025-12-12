
import json
import os

def generate_adaptive_html():
    # JSON 로드
    with open('vision_layout_result.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    sections = data.get('sections', [])
    theme = data.get('theme', 'luxury_dark')

    # 기본 CSS 스타일
    css_content = """
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;500;700;900&family=Playfair+Display:ital,wght@1,700&display=swap');
        
        body {
            margin: 0; padding: 0; background-color: #000;
            font-family: 'Noto Sans KR', sans-serif;
            display: flex; justify-content: center;
        }
        .container {
            width: 520px;
            background: radial-gradient(circle at 50% 0%, #4a004a 0%, transparent 50%), linear-gradient(180deg, #050505 0%, #1a0520 100%);
            min-height: 100vh; padding-bottom: 80px; color: white;
            box-shadow: 0 0 50px rgba(128, 0, 128, 0.2);
        }
        
        /* 공통 스타일 요소 */
        .header { text-align: center; padding: 60px 20px 40px; }
        .header h1 {
            font-size: 48px; margin: 0;
            background: linear-gradient(to bottom, #fffbcc 0%, #ffd700 50%, #b8860b 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        
        .catchphrase {
            font-size: 24px; font-weight: 700; color: #ff69b4;
            text-align: center; margin: 20px 0; white-space: pre-line;
            text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
        }
        
        .text-block {
            margin: 20px; color: #ddd; font-size: 15px; line-height: 1.6;
            white-space: pre-line; text-align: center;
        }
        
        .highlight-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid #ff69b4; border-radius: 15px;
            padding: 20px; margin: 20px; text-align: center;
            color: #fff; font-weight: 700; white-space: pre-line;
            box-shadow: 0 0 15px rgba(255, 105, 180, 0.2);
        }
        
        .key-value-row {
            display: flex; justify-content: space-between; align-items: center;
            background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent);
            border-left: 4px solid #ffd700;
            padding: 15px 20px; margin: 10px 20px;
        }
        .kv-label { font-weight: 700; color: #ffd700; }
        .kv-value { font-weight: 900; color: #fff; font-size: 18px; }
        
        .section-title {
            text-align: center; font-size: 26px; font-weight: 900;
            margin: 50px 0 20px; color: #fff;
            border-top: 1px solid rgba(255,255,255,0.2);
            border-bottom: 1px solid rgba(255,255,255,0.2);
            padding: 10px 0;
        }
        
        .contact-box {
            text-align: center; margin-top: 50px; padding: 30px 20px;
            background: linear-gradient(to top, #220033, transparent);
        }
        .phone { font-size: 32px; font-weight: 900; color: #00bfff; margin-bottom: 10px; }
        .kakao { font-size: 20px; color: #ffeb3b; }
    """

    html_body = '<div class="container">'
    
    for section in sections:
        stype = section['type']
        content = section['content']
        
        if stype == "header":
            html_body += f'<div class="header"><h1>{content}</h1></div>'
        
        elif stype == "catchphrase":
            html_body += f'<div class="catchphrase">{content}</div>'
            
        elif stype == "text":
            html_body += f'<div class="text-block">{content}</div>'
            
        elif stype == "highlight_box":
            html_body += f'<div class="highlight-box">{content}</div>'
            
        elif stype == "key_value":
            label = content['label']
            value = content['value']
            html_body += f'''
            <div class="key-value-row">
                <span class="kv-label">{label}</span>
                <span class="kv-value">{value}</span>
            </div>
            '''
            
        elif stype == "section_title":
            html_body += f'<div class="section-title">{content}</div>'
            
        elif stype == "contact":
            phone = content.get('phone', '')
            kakao = content.get('kakao', '')
            html_body += f'''
            <div class="contact-box">
                <div class="phone">{phone}</div>
                <div class="kakao">KATALK : {kakao}</div>
            </div>
            '''

    html_body += '<div style="text-align:center; color:#555; font-size:10px; margin:20px 0;">DESIGNED BY ADAPTIVE AI</div>'
    html_body += '</div>' # container end

    full_html = f"""
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>{css_content}</style>
</head>
<body>
    {html_body}
</body>
</html>
    """

    with open('detail_page_adaptive.html', 'w', encoding='utf-8') as f:
        f.write(full_html)
    print("Generated detail_page_adaptive.html")

if __name__ == "__main__":
    generate_adaptive_html()
