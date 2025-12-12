
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

    client = OpenAI(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": """
                    당신은 유흥 구인구직 광고 이미지를 분석하여 '원본의 레이아웃 순서대로' 콘텐츠를 추출하는 AI입니다.
                    고정된 형식이 아니라, 위에서 아래로 보이는 시각적 흐름(Flow)을 그대로 따라가며 데이터를 추출하세요.

                    다음 JSON 형식으로 출력하세요:
                    {
                        "theme": "luxury_dark", // 분위기에 따라 recommended theme (luxury_dark, bright_modern, pink_neon)
                        "sections": [
                            { "type": "header", "content": "제목 내용" },
                            { "type": "image_text", "content": "이미지 속 텍스트 내용" },
                            { "type": "text", "content": "일반 본문 내용" },
                            { "type": "highlight_box", "content": "강조된 박스 내용" },
                            { "type": "key_value", "content": {"label": "급여", "value": "500만원"} },
                            { "type": "contact", "content": {"phone": "...", "kakao": "..."} }
                        ]
                    }
                    
                    규칙:
                    1. 원본 이미지의 섹션 순서를 절대 바꾸지 마세요.
                    2. 오타는 문맥에 맞게 수정하세요.
                    3. 응답은 오직 JSON만 출력하세요.
                    """
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
