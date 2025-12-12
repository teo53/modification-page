
import cv2
import numpy as np
import os

# 경로 설정
path_original = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/ad_detail_36660_1765515552012.png"
path_generated = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/final_result_real.png"
output_path = "comparison_final.png"

def create_comparison():
    print("Loading images...")
    img1 = cv2.imread(path_original)
    img2 = cv2.imread(path_generated)
    
    if img1 is None or img2 is None:
        print("이미지를 불러올 수 없습니다.")
        return

    # 높이 맞추기 (img1 기준)
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    
    # img2를 img1 높이에 맞춰 비율 리사이즈
    new_w2 = int(w2 * (h1 / h2))
    img2_resized = cv2.resize(img2, (new_w2, h1))
    
    # 두 이미지 사이 간격 (검은색 바)
    gap = 20
    separator = np.zeros((h1, gap, 3), dtype=np.uint8)
    
    # 이미지 합치기 (가로)
    combined = np.hstack((img1, separator, img2_resized))
    
    # 상단에 라벨 추가를 위한 여백 만들기
    header_height = 60
    header = np.zeros((header_height, combined.shape[1], 3), dtype=np.uint8)
    final_img = np.vstack((header, combined))
    
    # 텍스트 추가 (OpenCV 기본 폰트 사용)
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(final_img, "ORIGINAL (Reference)", (50, 40), font, 1.0, (255, 255, 255), 2)
    cv2.putText(final_img, "AI GENERATED (Automated)", (w1 + gap + 50, 40), font, 1.0, (0, 255, 0), 2)
    
    cv2.imwrite(output_path, final_img)
    print(f"Saved comparison to {output_path}")

if __name__ == "__main__":
    create_comparison()
