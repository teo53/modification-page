#!/usr/bin/env python3
"""원본과 생성된 이미지 비교"""
import sys
print("📊 비교 이미지 생성 중...", flush=True)

import cv2
import numpy as np
from pathlib import Path

def imread_korean(filepath):
    stream = np.fromfile(filepath, dtype=np.uint8)
    return cv2.imdecode(stream, cv2.IMREAD_COLOR)

# 경로 설정
original = sys.argv[1] if len(sys.argv) > 1 else "C:/Users/mapdr/.gemini/antigravity/brain/3e7707a5-fa0e-4693-9c70-416d3f094128/uploaded_image_1765782451094.png"
generated = sys.argv[2] if len(sys.argv) > 2 else "output/result.png"
output = sys.argv[3] if len(sys.argv) > 3 else "output/comparison_final.png"

print(f"   원본: {original}", flush=True)
print(f"   생성: {generated}", flush=True)

img1 = imread_korean(original)
img2 = imread_korean(generated)

if img1 is None or img2 is None:
    print("❌ 이미지 로드 실패", flush=True)
    sys.exit(1)

# 높이 맞추기
h1, w1 = img1.shape[:2]
h2, w2 = img2.shape[:2]
target_h = max(h1, h2)

img1 = cv2.resize(img1, (int(w1 * target_h / h1), target_h))
img2 = cv2.resize(img2, (int(w2 * target_h / h2), target_h))

# 합치기
gap = np.ones((target_h, 10, 3), dtype=np.uint8) * 255
combined = np.hstack([img1, gap, img2])

# 헤더
header = np.ones((80, combined.shape[1], 3), dtype=np.uint8) * 30
cv2.putText(header, "ORIGINAL", (50, 55), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 2)
cv2.putText(header, "AI REGENERATED", (img1.shape[1] + 60, 55), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 2)

final = np.vstack([header, combined])

# 저장
_, encoded = cv2.imencode('.png', final)
encoded.tofile(output)
print(f"✅ 비교 이미지 저장: {output}", flush=True)
