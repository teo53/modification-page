from PIL import Image, ImageDraw, ImageFont

# 이미지 경로
original_path = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/uploaded_image_1765519506922.png"
generated_path = r"C:/Users/mapdr/Desktop/queenalba-clone - 복사본/scraper/detail_page_hq_v2.png"

# 이미지 열기
img1 = Image.open(original_path)
img2 = Image.open(generated_path)

# 높이 맞추기 (img2 기준)
target_height = img2.height
aspect_ratio = img1.width / img1.height
new_width = int(target_height * aspect_ratio)
img1 = img1.resize((new_width, target_height))

# 새 캔버스 생성 (두 이미지 너비 합 + 간격)
gap = 20
total_width = img1.width + img2.width + gap
canvas = Image.new('RGB', (total_width, target_height), (30, 30, 30))

# 이미지 붙여넣기
canvas.paste(img1, (0, 0))
canvas.paste(img2, (img1.width + gap, 0))

# 텍스트 추가 (선택사항, 간단하게 라벨링)
# draw = ImageDraw.Draw(canvas)
# draw.text((10, 10), "ORIGINAL", fill="white")
# draw.text((img1.width + gap + 10, 10), "GENERATED", fill="white")

# 저장
output_path = r"C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/comparison_view.png"
canvas.save(output_path)
print(f"Saved comparison to: {output_path}")
