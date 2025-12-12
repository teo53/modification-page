
import json
import os

def generate_html():
    # JSON 데이터 로드
    with open('vision_result.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # HTML 템플릿 (V2 디자인 기반)
    html_content = f"""
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;500;700;900&family=Playfair+Display:ital,wght@1,700&display=swap');
        
        body {{
            margin: 0;
            padding: 0;
            background-color: #000;
            font-family: 'Noto Sans KR', sans-serif;
            display: flex;
            justify-content: center;
        }}

        .container {{
            width: 520px;
            background: 
                radial-gradient(circle at 50% 0%, #4a004a 0%, transparent 50%),
                linear-gradient(180deg, #050505 0%, #1a0520 100%);
            position: relative;
            padding-bottom: 80px;
            color: white;
            min-height: 100vh;
        }}

        .header {{
            text-align: center;
            padding: 60px 20px 40px;
        }}

        .trophy {{ font-size: 60px; margin-bottom: 20px; }}
        
        h1 {{
            font-size: 48px;
            margin: 0;
            background: linear-gradient(to bottom, #fffbcc 0%, #ffd700 50%, #b8860b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}

        .glass-card {{
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            margin: 20px;
            padding: 30px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }}

        .catchphrase {{
            font-size: 24px;
            font-weight: 700;
            color: #ff69b4;
            margin-bottom: 20px;
        }}

        .content-body {{
            white-space: pre-line;
            font-size: 16px;
            line-height: 1.8;
            color: #ddd;
        }}

        .section-title {{
            font-size: 24px;
            font-weight: 700;
            color: #ffd700;
            text-align: center;
            margin: 40px 0 20px;
        }}

        .info-box {{
            background: linear-gradient(135deg, rgba(20,0,10,0.8), rgba(0,0,0,0.9));
            border: 1px solid #a48c48;
            padding: 20px;
            margin: 0 20px;
            text-align: center;
        }}
        
        .contact-box {{
            margin-top: 40px;
            text-align: center;
        }}
        
        .phone-number {{
            background: linear-gradient(90deg, #00bfff, #0077be);
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 28px;
            font-weight: 900;
            display: inline-block;
            margin-top: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="trophy">💎</div>
            <h1>{data.get('title', '제목 없음')}</h1>
        </div>

        <div class="glass-card">
            <div class="catchphrase">{data.get('catchphrase', '')}</div>
            <div class="content-body">{data.get('content_body', '')}</div>
        </div>

        <div class="section-title">모집 요강</div>
        <div class="info-box">
            <h3 style="color:#fff; margin:0 0 10px;">💰 급여</h3>
            <p style="color:#ffd700; font-size: 20px; margin:0;">{data.get('salary_info', '')}</p>
            
            <hr style="border-color:rgba(255,255,255,0.1); margin: 20px 0;">
            
            <h3 style="color:#fff; margin:0 0 10px;">📋 자격 & 조건</h3>
            <p style="color:#ddd; margin:0;">{data.get('qualifications', '')}</p>
            <p style="color:#aaa; margin-top:5px;">{data.get('working_conditions', '')}</p>
        </div>

        <div class="contact-box">
            <div style="color: #aaa; margin-bottom: 10px;">지원 및 문의</div>
            <div class="phone-number">{data['contact_info'].get('phone', '')}</div>
            <div style="font-size: 18px; margin-top: 15px; color: #ffeb3b;">
                KATALK: {data['contact_info'].get('kakao', '')}
            </div>
            <div style="font-size: 14px; color: #888; margin-top: 10px;">
                {data['contact_info'].get('etc', '')}
            </div>
        </div>
        
        <div style="text-align: center; color: #555; font-size: 10px; margin-top: 50px;">
            DESIGNED BY VISION AI
        </div>
    </div>
</body>
</html>
    """

    with open('detail_page_auto.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Generated detail_page_auto.html")

if __name__ == "__main__":
    generate_html()
