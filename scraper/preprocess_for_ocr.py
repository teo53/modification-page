
import cv2
import numpy as np

# 경로 설정
input_path = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/ad_9154_detail_1765519000678.png"
output_path = "debug_preprocessed.png"

def preprocess_image(path):
    print(f"Preprocessing image: {path}")
    img = cv2.imread(path)
    
    if img is None:
        print("Image not found!")
        return None

    # 1. Grayscale 변환
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 2. 노이즈 제거 (Median Blur)
    # gray = cv2.medianBlur(gray, 3)
    
    # 3. 대비 개선 (CLAHE) - 어두운 영역의 글자도 잘 보이게
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    
    # 4. 이진화 (Adaptive Thresholding)
    # 배경이 복잡하므로 적응형 임계값 사용
    thresh = cv2.adaptiveThreshold(
        enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    
    # 5. 노이즈 제거 (Morphology)
    # 작은 점들을 제거하고 글자를 뚜렷하게
    kernel = np.ones((1,1), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
    
    # 6. (옵션) 색반전 확인
    # OCR은 보통 흰 배경에 검은 글씨를 좋아함
    # 현재 threshold 결과가 검은 배경에 흰 글씨라면 반전 필요
    # 가장자리 픽셀들을 확인해서 배경색 추정
    edges = opening[0:10, 0:10]
    white_pixels = np.sum(edges == 255)
    total_pixels = edges.size
    
    if white_pixels < total_pixels / 2:
        print("Detected dark background, inverting...")
        # 어두운 배경이면 이미 글자가 흰색(255)일 것임. 
        # 하지만 Tesseract/EasyOCR은 흰 배경(255)에 검은 글자(0)를 선호할 수 있음.
        # 일단 그대로 두거나, 반전시켜서 테스트.
        # 보통 threshold 결과 검은색(0)이 배경, 흰색(255)이 글자임.
        # 글자를 검은색으로 만들기 위해 반전
        final = cv2.bitwise_not(opening)
    else:
        final = opening

    # 결과 저장
    cv2.imwrite(output_path, final)
    print(f"Saved preprocessed image to: {output_path}")
    
    return final

if __name__ == "__main__":
    preprocess_image(input_path)
