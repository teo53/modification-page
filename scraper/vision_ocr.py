
import base64
import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 API 키 로드 (없으면 환경변수에서)
load_dotenv()

import re

# API 키 설정 (직접 입력하거나 .env 파일 사용)
# os.environ["OPENAI_API_KEY"] = "sk-..." 
api_key_raw = os.getenv("OPENAI_API_KEY")
api_key = None

if api_key_raw:
    # sk- 로 시작하는 영문/숫자/특수문자 문자열만 추출 (공백이나 한글 제외)
    match = re.search(r"(sk-[a-zA-Z0-9\-_]+)", api_key_raw)
    if match:
        api_key = match.group(1)
    else:
        print(f"⚠️ 경고: API 키 형식이 올바르지 않습니다. (입력값: {api_key_raw[:10]}...)")


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def extract_text_from_image(image_path, model="gpt-4o-mini"):
    """
    GPT-4o Vision을 사용하여 이미지에서 텍스트와 구조를 추출합니다.
    model: 'gpt-4o' (고성능) 또는 'gpt-4o-mini' (저비용)
    """
    if not api_key:
        print("❌ Error: OPENAI_API_KEY가 설정되지 않았습니다.")
        print("1. .env 파일을 만들고 OPENAI_API_KEY=sk-... 를 입력하거나")
        print("2. 시스템 환경변수에 키를 등록하세요.")
        return None

    print(f"🔍 Vision AI 분석 시작... (Model: {model})")
    print(f"   Target: {image_path}")

    base64_image = encode_image(image_path)

    client = OpenAI(api_key=api_key, timeout=60.0)  # 60초 타임아웃

    try:
        print("   ⏳ API 호출 중... (최대 60초)")
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": """당신은 광고 이미지를 분석하여 구조화된 JSON으로 변환하는 전문가입니다.

## 분석 기준

### 키워드 (type: "keyword")
- 15자 이하의 짧고 임팩트 있는 문구
- 예: "40대 환영", "총 차량 4대 운행", "당일지급", "숙소제공"

### 강조 문구 (type: "emphasis")  
- 색상이나 크기가 다른 강조된 문장
- 느낌표(!!)로 끝나는 경우 많음

### 일반 본문 (type: "text")
- 설명적인 긴 문장

## 출력 형식
```json
{
    "colors": {
        "background": "#배경색",
        "accent": "#강조색"
    },
    "company_name": "업체명",
    "sections": [
        {"type": "keyword", "content": "40대 환영"},
        {"type": "keyword", "content": "총 차량 4대 운행"},
        {"type": "emphasis", "content": "저희는 24시간 운영해요!!"},
        {"type": "text", "content": "일반 설명 본문입니다."},
        {"type": "contact", "phone": "010-XXXX-XXXX", "kakao": "아이디"}
    ]
}
```

## OCR 오류 수정
- 속늦쎈치고 → 속는셈치고
- 빼릿해요 → 빠릿해요
- 콜라서 → 골라서

## 중요 규칙
1. 키워드는 짧은 문구만 (15자 이하)
2. "퀸알바", "queenalba" → 절대 포함 금지
3. 연락처 없으면 contact 생략
4. JSON만 출력"""
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "이 이미지의 내용을 상세히 분석해서 JSON으로 알려줘."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}",
                                "detail": "high"  # high: 고해상도 분석, low: 저비용
                            }
                        }
                    ]
                }
            ],
            max_tokens=2000
        )
        
        result_text = response.choices[0].message.content
        return result_text

    except Exception as e:
        print(f"❌ API 호출 중 오류 발생: {e}")
        return None

if __name__ == "__main__":
    # 테스트할 이미지 경로
    test_image = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/ad_detail_36660_1765515552012.png"
    
    result = extract_text_from_image(test_image, model="gpt-4o-mini")
    
    if result:
        print("\n✅ 추출 성공! 결과 데이터:")
        print(result)
        
        # 결과를 파일로 저장
        with open("vision_result.json", "w", encoding="utf-8") as f:
            f.write(result)
