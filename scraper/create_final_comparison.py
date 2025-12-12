
import cv2
import numpy as np

# 아티팩트 폴더에 있는 파일들 (영어 경로)
path_original = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/ad_detail_36660_1765515552012.png"
path_generated = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/ai_generated.png"
output_path = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/comparison_final_correct.png"

def create_comparison():
    print(f"Loading original...")
    img1 = cv2.imread(path_original)
    
    print(f"Loading AI generated...")
    img2 = cv2.imread(path_generated)
    
    if img1 is None:
        print(f"❌ Cannot load original")
        return
    if img2 is None:
        print(f"❌ Cannot load generated")
        return

    print(f"✓ Original size: {img1.shape}")
    print(f"✓ Generated size: {img2.shape}")

    # 높이 맞추기
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    
    new_w2 = int(w2 * (h1 / h2))
    img2_resized = cv2.resize(img2, (new_w2, h1))
    
    # 간격
    gap = 20
    separator = np.zeros((h1, gap, 3), dtype=np.uint8)
    
    # 합치기
    combined = np.hstack((img1, separator, img2_resized))
    
    # 헤더
    header_height = 60
    header = np.zeros((header_height, combined.shape[1], 3), dtype=np.uint8)
    final_img = np.vstack((header, combined))
    
    # 텍스트
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(final_img, "ORIGINAL (Source Ad)", (50, 40), font, 1.0, (255, 255, 255), 2)
    cv2.putText(final_img, "AI GENERATED (Auto)", (w1 + gap + 50, 40), font, 1.0, (0, 255, 0), 2)
    
    cv2.imwrite(output_path, final_img)
    print(f"✅ Saved: {output_path}")

if __name__ == "__main__":
    create_comparison()
