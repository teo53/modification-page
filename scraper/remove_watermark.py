"""
워터마크 제거 스크립트
====================
1. 상단/하단 퀸알바 바 제거 (크롭)
2. 배경 워터마크 제거 (AI 인페인팅)

사용법:
    python remove_watermark.py [이미지파일 또는 폴더]
    
예시:
    python remove_watermark.py image.jpg
    python remove_watermark.py ./images/
    
의존성 설치:
    pip install opencv-python numpy pillow requests
"""

import cv2
import numpy as np
from PIL import Image
import os
import sys
import argparse
from pathlib import Path


class WatermarkRemover:
    def __init__(self, output_dir="cleaned_images"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
        # 퀸알바 헤더/푸터 색상 (RGB) - 감지용
        self.header_colors = [
            (0, 0, 0),        # 검정 배경
            (138, 43, 226),   # 보라색 텍스트
            (0, 191, 255),    # 하늘색 텍스트
            (255, 0, 255),    # 마젠타
        ]
        
        # 워터마크 텍스트 감지용 (queenalba.net)
        self.watermark_color_low = np.array([100, 100, 100])  # 회색 계열
        self.watermark_color_high = np.array([180, 180, 180])
    
    def detect_header_footer(self, img: np.ndarray, threshold=0.3):
        """
        이미지에서 퀸알바 헤더/푸터 영역을 감지
        
        Returns:
            (header_height, footer_height): 크롭해야 할 픽셀 높이
        """
        height, width = img.shape[:2]
        
        # 상단 스캔 (최대 20% 영역까지)
        header_height = 0
        scan_limit = int(height * 0.2)
        
        for y in range(min(200, scan_limit)):  # 최대 200px 또는 20%
            row = img[y, :]
            # 검정색 비율 확인
            black_ratio = np.mean(np.all(row < 50, axis=1))
            # 또는 특정 색상 패턴 확인
            if black_ratio > threshold:
                header_height = y + 1
            else:
                # 연속으로 5줄 이상 일반 컨텐츠면 헤더 끝
                if y > header_height + 10:
                    break
        
        # 하단 스캔
        footer_height = 0
        for y in range(height - 1, max(height - 200, height - scan_limit), -1):
            row = img[y, :]
            black_ratio = np.mean(np.all(row < 50, axis=1))
            if black_ratio > threshold:
                footer_height = height - y
            else:
                if height - y > footer_height + 10:
                    break
        
        return header_height, footer_height
    
    def detect_colored_bars(self, img: np.ndarray):
        """
        색상 기반으로 헤더/푸터 바 감지 (보라/분홍/검정 그라데이션)
        """
        height, width = img.shape[:2]
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # 헤더 감지: 상단에서 시작하여 일반 콘텐츠까지
        header_end = 0
        for y in range(min(300, height // 4)):
            row_hsv = hsv[y, :]
            # 채도와 명도가 낮은 영역 (검정/어두운 색) 감지
            dark_ratio = np.mean(row_hsv[:, 2] < 50)  # V (명도) < 50
            # 또는 보라/분홍 색상 감지 (H: 270-330도 => 135-165 in OpenCV)
            purple_mask = ((row_hsv[:, 0] > 120) & (row_hsv[:, 0] < 170))
            purple_ratio = np.mean(purple_mask)
            
            if dark_ratio > 0.5 or purple_ratio > 0.3:
                header_end = y + 1
        
        # 푸터 감지
        footer_start = height
        for y in range(height - 1, max(height - 300, height * 3 // 4), -1):
            row_hsv = hsv[y, :]
            dark_ratio = np.mean(row_hsv[:, 2] < 50)
            purple_mask = ((row_hsv[:, 0] > 120) & (row_hsv[:, 0] < 170))
            purple_ratio = np.mean(purple_mask)
            
            if dark_ratio > 0.5 or purple_ratio > 0.3:
                footer_start = y
        
        return header_end, height - footer_start
    
    def crop_header_footer(self, img: np.ndarray, margin=2):
        """
        헤더와 푸터를 감지하여 크롭
        퀸알바 바: 주로 검정 배경에 보라/핑크/하늘색 텍스트
        """
        height, width = img.shape[:2]
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # 상단 헤더 감지
        header_crop = 0
        for y in range(min(150, height // 10)):  # 최대 150px 또는 10%
            row = img[y, :]
            row_hsv = hsv[y, :]
            
            # 검정색 비율 (V < 30)
            dark_ratio = np.mean(row_hsv[:, 2] < 30)
            
            # 보라/분홍색 비율 (H: 120-170, S > 50)
            purple_mask = (row_hsv[:, 0] > 120) & (row_hsv[:, 0] < 170) & (row_hsv[:, 2] > 50)
            purple_ratio = np.mean(purple_mask)
            
            # 하늘색 비율 (H: 90-120, S > 50)
            cyan_mask = (row_hsv[:, 0] > 90) & (row_hsv[:, 0] < 130) & (row_hsv[:, 2] > 100)
            cyan_ratio = np.mean(cyan_mask)
            
            # 헤더 바로 판단 (검정이 많거나 보라/핑크 색상이 있는 경우)
            if dark_ratio > 0.7 or purple_ratio > 0.2 or cyan_ratio > 0.2:
                header_crop = y + 1
            elif y > header_crop + 20:
                # 연속 20줄 이상 일반 콘텐츠면 헤더 끝
                break
        
        # 하단 푸터 감지
        footer_crop = 0
        for y in range(height - 1, max(height - 150, height * 9 // 10), -1):
            row = img[y, :]
            row_hsv = hsv[y, :]
            
            dark_ratio = np.mean(row_hsv[:, 2] < 30)
            purple_mask = (row_hsv[:, 0] > 120) & (row_hsv[:, 0] < 170) & (row_hsv[:, 2] > 50)
            purple_ratio = np.mean(purple_mask)
            cyan_mask = (row_hsv[:, 0] > 90) & (row_hsv[:, 0] < 130) & (row_hsv[:, 2] > 100)
            cyan_ratio = np.mean(cyan_mask)
            
            if dark_ratio > 0.7 or purple_ratio > 0.2 or cyan_ratio > 0.2:
                footer_crop = height - y
            elif height - y > footer_crop + 20:
                break
        
        # 안전을 위해 너무 적게 크롭하지 않도록 최소값 설정
        # 하지만 너무 많이 크롭하지 않도록 최대값도 설정
        header_crop = max(30, min(header_crop + margin, 100))  # 30~100px
        footer_crop = max(30, min(footer_crop + margin, 100))  # 30~100px
        
        # 크롭
        cropped = img[header_crop:height - footer_crop, :]
        
        print(f"  크롭: 상단 {header_crop}px, 하단 {footer_crop}px 제거")
        return cropped
    
    def create_watermark_mask(self, img: np.ndarray):
        """
        배경 워터마크 영역에 대한 마스크 생성
        'queenalba.net' 텍스트 패턴 감지
        """
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        height, width = gray.shape
        
        # 워터마크는 보통 중간 밝기의 반투명 텍스트
        # 에지 검출로 텍스트 패턴 찾기
        edges = cv2.Canny(gray, 50, 150)
        
        # 모폴로지 연산으로 텍스트 영역 확장
        kernel = np.ones((3, 3), np.uint8)
        dilated = cv2.dilate(edges, kernel, iterations=2)
        
        # 워터마크는 반복 패턴이므로 일정 간격으로 나타남
        # 밝기 변화가 적은 영역에서의 텍스트 = 워터마크
        
        # 로컬 표준편차 계산
        blur = cv2.GaussianBlur(gray, (21, 21), 0)
        local_var = np.abs(gray.astype(float) - blur.astype(float))
        
        # 워터마크 영역: 중간 정도의 변화가 있는 곳
        mask = ((local_var > 5) & (local_var < 30)).astype(np.uint8) * 255
        
        # 마스크 확장
        mask = cv2.dilate(mask, kernel, iterations=1)
        
        return mask
    
    def remove_watermark_inpaint(self, img: np.ndarray):
        """
        OpenCV 인페인팅으로 워터마크 제거 시도
        """
        mask = self.create_watermark_mask(img)
        
        # 마스크가 너무 크면 인페인팅이 효과적이지 않으므로 제한
        mask_ratio = np.sum(mask > 0) / mask.size
        if mask_ratio > 0.3:
            print(f"  ⚠️ 배경 워터마크 감지됨 ({mask_ratio:.1%}), 원본 유지 (손상 방지)")
            return img  # 원본 유지
        
        # 인페인팅 적용
        result = cv2.inpaint(img, mask, 3, cv2.INPAINT_TELEA)
        
        print(f"  인페인팅 적용: 마스크 영역 {mask_ratio:.1%}")
        return result
    
    def reduce_watermark_brightness(self, img: np.ndarray):
        """
        원본 유지 모드 - 배경 워터마크는 건드리지 않음
        """
        print("  원본 유지 (배경 워터마크 처리 생략)")
        return img  # 원본 그대로 반환
    
    def process_image(self, image_path: str, skip_inpaint=False):
        """
        단일 이미지 처리
        """
        print(f"\n📷 처리 중: {image_path}")
        
        # 이미지 로드
        img = cv2.imread(image_path)
        if img is None:
            print(f"  ❌ 이미지를 불러올 수 없습니다")
            return None
        
        original_size = img.shape[:2]
        print(f"  원본 크기: {original_size[1]}x{original_size[0]}")
        
        # 1단계: 상단/하단 바 크롭
        cropped = self.crop_header_footer(img)
        
        # 2단계: 배경 워터마크 제거 시도
        if not skip_inpaint:
            try:
                result = self.remove_watermark_inpaint(cropped)
            except Exception as e:
                print(f"  ⚠️ 인페인팅 실패: {e}")
                result = self.reduce_watermark_brightness(cropped)
        else:
            result = self.reduce_watermark_brightness(cropped)
        
        # 결과 저장
        filename = Path(image_path).stem + "_cleaned" + Path(image_path).suffix
        output_path = os.path.join(self.output_dir, filename)
        cv2.imwrite(output_path, result)
        
        new_size = result.shape[:2]
        print(f"  ✅ 저장됨: {output_path}")
        print(f"  새 크기: {new_size[1]}x{new_size[0]}")
        
        return output_path
    
    def process_directory(self, directory: str, skip_inpaint=False):
        """
        디렉토리 내 모든 이미지 처리
        """
        supported_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}
        
        image_files = []
        for ext in supported_extensions:
            image_files.extend(Path(directory).glob(f'*{ext}'))
            image_files.extend(Path(directory).glob(f'*{ext.upper()}'))
        
        print(f"🗂️ {len(image_files)}개 이미지 발견")
        
        results = []
        for image_path in image_files:
            result = self.process_image(str(image_path), skip_inpaint)
            if result:
                results.append(result)
        
        return results


def main():
    parser = argparse.ArgumentParser(description='퀸알바 워터마크 제거 도구')
    parser.add_argument('input', help='처리할 이미지 파일 또는 디렉토리')
    parser.add_argument('-o', '--output', default='cleaned_images', help='출력 디렉토리')
    parser.add_argument('--skip-inpaint', action='store_true', help='인페인팅 건너뛰기 (밝기 조정만)')
    
    args = parser.parse_args()
    
    remover = WatermarkRemover(output_dir=args.output)
    
    if os.path.isfile(args.input):
        remover.process_image(args.input, args.skip_inpaint)
    elif os.path.isdir(args.input):
        remover.process_directory(args.input, args.skip_inpaint)
    else:
        print(f"❌ 파일 또는 디렉토리를 찾을 수 없습니다: {args.input}")
        sys.exit(1)
    
    print(f"\n✅ 완료! 결과물: {args.output}/")


if __name__ == "__main__":
    main()
