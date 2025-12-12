
import os
import sys
import json
import subprocess
from dotenv import load_dotenv
from vision_ocr import extract_text_from_image
from generate_adaptive_html import generate_adaptive_html as create_html_file

# 환경변수 로드
load_dotenv()

def main():
    if len(sys.argv) < 2:
        print("사용법: python run_ad_generator.py [이미지파일경로]")
        print("예시: python run_ad_generator.py ad_detail.png")
        return

    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(f"❌ 파일을 찾을 수 없습니다: {image_path}")
        return

    print(f"🚀 광고 이미지 생성 시작: {image_path}")

    # 1. Vision AI로 텍스트/구조 추출
    print("\n[1/3] Vision AI 분석 중...")
    
    # API 키 확인 및 Vision AI 호출
    json_result = None
    if os.getenv("OPENAI_API_KEY"):
        json_result = extract_text_from_image(image_path, model="gpt-4o-mini")
    else:
        print("⚠️ OPENAI_API_KEY가 없습니다. (Mock Mode로 실행합니다)")

    if json_result:
        # JSON 파싱 및 저장 (vision_layout_result.json)
        try:
            clean_json = json_result.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_json)
            with open('vision_layout_result.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print("✅ Vision AI 데이터 추출 및 저장 완료")
        except json.JSONDecodeError:
            print("❌ JSON 파싱 실패. AI 응답 원문을 확인하세요.")
            return
    else:
        # 실패 시 혹은 키 없을 시 기존 파일(Mock) 사용
        if os.path.exists('vision_layout_result.json'):
             print("ℹ️ 기존(또는 가상) JSON 데이터를 사용하여 HTML을 생성합니다.")
        else:
             print("❌ Vision AI 수행 실패 및 기존 데이터 없음. 종료합니다.")
             return

    # 2. HTML 생성
    print("\n[2/3] HTML 생성 중...")
    # generate_adaptive_html.py를 모듈로 쓰려면 약간 수정 필요할 수 있음.
    # 여기서는 generate_adaptive_html.py를 직접 import해서 함수 호출 (위에서 import 함)
    # 단, generate_adaptive_html.py가 함수 내에서 파일을 읽으므로, 파일이 존재해야 함. 
    # (이미 위에서 vision_layout_result.json을 저장했으므로 OK)
    
    try:
        # generate_adaptive_html.py를 조금 수정해야 import해서 쓸 수 있음.
        # 일단 subprocess로 실행하는 게 안전할 수도 있지만, import 시도.
        # create_html_file() 함수가 없으면 에러가 날 테니 확인 필요.
        # (앞선 단계에서 generate_adaptive_html() 함수를 정의했음)
        create_html_file() 
        print("✅ HTML 생성 완료 (detail_page_adaptive.html)")
    except Exception as e:
        print(f"❌ HTML 생성 실패: {e}")
        return

    # 3. 이미지 캡처 (Node.js)
    print("\n[3/3] 이미지 렌더링 중...")
    
    # 출력 파일명 생성 (원본이름_converted.png)
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    output_png = f"{base_name}_converted.png"
    
    try:
        # node capture_screenshot.js [html_file] [output_file]
        subprocess.run(["node", "capture_screenshot.js", "detail_page_adaptive.html", output_png], check=True, shell=True)
        print(f"\n✨ 모든 작업 완료! 결과 파일: {output_png}")
    except subprocess.CalledProcessError:
        print("❌ 이미지 캡처 실패 (Node.js 에러)")

if __name__ == "__main__":
    main()
