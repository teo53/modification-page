
import easyocr
import os

# 이미지 경로
image_path = "debug_preprocessed.png"

def run_ocr(path):
    print(f"Running EasyOCR on: {path}")
    print("Loading language models... (this may take a while)")
    
    # 한국어, 영어 로드
    reader = easyocr.Reader(['ko', 'en'], gpu=False) 
    
    print("Recognizing text...")
    result = reader.readtext(path, detail=1, paragraph=False)
    
    # 텍스트 배치 분석 (Y좌표 기준 정렬)
    # result format: ([[x,y], [x,y]...], 'text', confidence)
    
    # Y좌표(중심) 기준으로 정렬
    result.sort(key=lambda r: (r[0][0][1] + r[0][2][1]) / 2)
    
    print("\n--- OCR Layout Result ---")
    
    formatted_text = ""
    last_y = 0
    
    for (box, text, conf) in result:
        # 박스 좌표
        (tl, tr, br, bl) = box
        current_y = (tl[1] + bl[1]) / 2
        
        # 문단 구분 (Y 간격이 40px 이상이면 줄바꿈 2번)
        if last_y > 0 and (current_y - last_y) > 40:
             formatted_text += "\n\n"
        # 줄바꿈 (Y 간격이 15px 이상이면 줄바꿈 1번)
        elif last_y > 0 and (current_y - last_y) > 15:
             formatted_text += "\n"
        else:
             formatted_text += " " # 같은 줄
             
        formatted_text += text
        last_y = current_y
        
    print(formatted_text)
    
    # 결과 저장
    with open("easyocr_result.txt", "w", encoding="utf-8") as f:
        f.write(formatted_text)
    print("\nSaved result to: easyocr_result.txt")

if __name__ == "__main__":
    run_ocr(image_path)
