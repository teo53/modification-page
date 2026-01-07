
import cv2
import numpy as np

# 이미지 경로
image_path = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/uploaded_image_1765521975811.png"

def analyze_layout(img_path):
    print(f"Analyzing layout for: {img_path}")
    img = cv2.imread(img_path)
    if img is None:
        print("Error: Could not read image")
        return

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 텍스트 영역 강조 (Thresholding + Morphology)
    # 글자가 밝은 색이라고 가정 (어두운 배경)
    # 1. 엣지 검출 또는 Threshold
    # 반전이 필요할 수도 있으니 적응형으로
    
    # 글자가 밝은색(네온)인 경우가 많음
    _, binary = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)
    
    # 텍스트 덩어리를 만들기 위해 가로로 길게 팽창
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 5))
    dilated = cv2.dilate(binary, kernel, iterations=1)
    
    # 윤곽선 검출
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # 결과 이미지 복사
    result_img = img.copy()
    
    # 텍스트 블록 리스트
    text_blocks = []
    
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        
        # 너무 작은 영역은 무시 (노이즈)
        if w < 20 or h < 10:
            continue
            
        # 사각형 그리기 (초록색)
        cv2.rectangle(result_img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
        text_blocks.append((y, x, w, h))
        
    # Y좌표 기준으로 정렬 (위에서 아래로)
    text_blocks.sort()
    
    # 문단 구분 분석
    print(f"\nDetected {len(text_blocks)} text blocks.")
    print("--- Structure Analysis ---")
    
    last_y = 0
    paragraph_count = 0
    
    for i, (y, x, w, h) in enumerate(text_blocks):
        # 이전 블록과의 간격 계산
        gap = y - last_y
        
        # 간격이 크면 새로운 문단으로 간주 (임계값 50px)
        if i > 0 and gap > 50:
            paragraph_count += 1
            # 문단 구분선 그리기 (빨간색)
            cv2.line(result_img, (0, y - gap//2), (img.shape[1], y - gap//2), (0, 0, 255), 1)
            print(f"[New Paragraph Detected at Y={y}]")
            
        last_y = y + h
        
    output_path = "layout_debug.png"
    cv2.imwrite(output_path, result_img)
    print(f"Saved visual layout analysis to: {output_path}")

if __name__ == "__main__":
    analyze_layout(image_path)
